import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  useTheme,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Input,
  FormHelperText,
  Snackbar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  DialogContentText,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Build as EquipmentIcon,
  ShoppingCart as ProductIcon,
  Category as CategoryIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  LocalShipping as ShipIcon,
  DeliveryDining as DeliverIcon,
  Reply as ReplyIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  productService,
  productCategoryService,
  equipmentService,
  equipmentCategoryService,
  orderService,
  contactService
} from '../services/api';
import { Product, ProductCategory, Equipment, EquipmentCategory, Order, ContactMessage } from '../types';
import toast from 'react-hot-toast';
import ImageUploadSection from '../components/ImageUploadSection';
import ImageManagementSection from '../components/ImageManagementSection';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Admin: React.FC = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [openProductCategoryDialog, setOpenProductCategoryDialog] = useState(false);
  const [openEquipmentCategoryDialog, setOpenEquipmentCategoryDialog] = useState(false);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openEquipmentDialog, setOpenEquipmentDialog] = useState(false);

  // Form states
  const [productCategoryForm, setProductCategoryForm] = useState({ name: '', description: '' });
  const [equipmentCategoryForm, setEquipmentCategoryForm] = useState({ name: '', description: '' });
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: [] as File[],
    existingImages: [] as Array<{ id: number; image: string; image_url?: string }>
  });
  const [equipmentForm, setEquipmentForm] = useState({
    name: '',
    description: '',
    rental_price_per_day: '',
    category: '',
    images: [] as File[],
    existingImages: [] as Array<{ id: number; image: string; image_url?: string }>
  });

  // États pour l'édition
  const [editingProductCategory, setEditingProductCategory] = useState<ProductCategory | null>(null);
  const [editingEquipmentCategory, setEditingEquipmentCategory] = useState<EquipmentCategory | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'product' | 'equipment' | 'category' | 'equipmentCategory'>('product');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: number; name: string } | null>(null);

  // États de chargement pour les actions des commandes
  const [loadingActions, setLoadingActions] = useState<{
    confirm: number | null;
    reject: number | null;
    ship: number | null;
    deliver: number | null;
  }>({
    confirm: null,
    reject: null,
    ship: null,
    deliver: null
  });

  // Détails commande
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  // Réponse aux messages de contact
  const [respondDialogOpen, setRespondDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [responseText, setResponseText] = useState('');

  // Fetch data
  const { data: productCategoriesResponse } = useQuery({
    queryKey: ['product-categories'],
    queryFn: productCategoryService.getAll
  });

  const { data: equipmentCategoriesResponse } = useQuery({
    queryKey: ['equipment-categories'],
    queryFn: equipmentCategoryService.getAll
  });

  const { data: productsResponse } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll
  });

  const { data: equipmentResponse } = useQuery({
    queryKey: ['equipment'],
    queryFn: equipmentService.getAll
  });

  // Fetch orders and contact messages
  const { data: ordersResponse } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getAll
  });

  const { data: contactMessagesResponse } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: contactService.getAll
  });

  // Extract arrays from responses
  const productCategories = productCategoriesResponse?.results || [];
  const equipmentCategories = equipmentCategoriesResponse?.results || [];
  const products = Array.isArray(productsResponse) ? productsResponse : (productsResponse as any)?.results || [];
  const equipment = Array.isArray(equipmentResponse) ? equipmentResponse : (equipmentResponse as any)?.results || [];
  const orders = Array.isArray(ordersResponse) ? ordersResponse : (ordersResponse as any)?.results || [];
  const contactMessages = Array.isArray(contactMessagesResponse) ? contactMessagesResponse : (contactMessagesResponse as any)?.results || [];

  // Mutation pour répondre à un message
  const respondMessageMutation = useMutation({
    mutationFn: ({ messageId, response }: { messageId: number; response: string }) => contactService.respond(messageId, response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      setRespondDialogOpen(false);
      setResponseText('');
      setSelectedMessage(null);
      toast.success('Réponse envoyée par email');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Erreur lors de l\'envoi de la réponse');
    }
  });

  const handleOpenRespond = (message: ContactMessage) => {
    setSelectedMessage(message);
    setResponseText(message.admin_response || '');
    setRespondDialogOpen(true);
  };

  const handleSendResponse = () => {
    if (!selectedMessage) return;
    respondMessageMutation.mutate({ messageId: selectedMessage.id, response: responseText });
  };

  // Mutations
  const createProductCategoryMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      return productCategoryService.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      setOpenProductCategoryDialog(false);
      setProductCategoryForm({ name: '', description: '' });
      toast.success('Catégorie de produit créée avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la création de la catégorie');
    }
  });

  const createEquipmentCategoryMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      return equipmentCategoryService.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment-categories'] });
      setOpenEquipmentCategoryDialog(false);
      setEquipmentCategoryForm({ name: '', description: '' });
      toast.success('Catégorie d\'équipement créée avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la création de la catégorie');
    }
  });

  const createProductMutation = useMutation({
    mutationFn: (data: any) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('stock', data.stock.toString());
      formData.append('category_id', data.category.toString());
      if (data.images && data.images.length > 0) {
        data.images.forEach((file: File) => {
          formData.append('image_files', file);
        });
      }
      return productService.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setOpenProductDialog(false);
      setProductForm({ name: '', description: '', price: '', stock: '', category: '', images: [], existingImages: [] });
      toast.success('Produit créé avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la création du produit');
    }
  });

  const createEquipmentMutation = useMutation({
    mutationFn: (data: any) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('rental_price_per_day', data.rental_price_per_day.toString());
      formData.append('category_id', data.category.toString());
      formData.append('available', 'true');
      if (data.images && data.images.length > 0) {
        data.images.forEach((file: File) => {
          formData.append('image_files', file);
        });
      }
      return equipmentService.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      setOpenEquipmentDialog(false);
      setEquipmentForm({ name: '', description: '', rental_price_per_day: '', category: '', images: [], existingImages: [] });
      toast.success('Équipement créé avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la création de l\'équipement');
    }
  });

  // Mutations pour la modification
  const updateProductCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => productCategoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      setEditingProductCategory(null);
      toast.success('Catégorie de produit modifiée avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la modification de la catégorie');
      console.error('Erreur modification catégorie produit:', error);
    }
  });

  const updateEquipmentCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => equipmentCategoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment-categories'] });
      setEditingEquipmentCategory(null);
      toast.success('Catégorie d\'équipement modifiée avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la modification de la catégorie');
      console.error('Erreur modification catégorie équipement:', error);
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingProduct(null);
      toast.success('Produit modifié avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la modification du produit');
      console.error('Erreur modification produit:', error);
    }
  });

  const updateEquipmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => equipmentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      setEditingEquipment(null);
      toast.success('Équipement modifié avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la modification de l\'équipement');
      console.error('Erreur modification équipement:', error);
    }
  });

  // Mutations pour la suppression
  const deleteProductCategoryMutation = useMutation({
    mutationFn: (id: number) => productCategoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      toast.success('Catégorie de produit supprimée avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression de la catégorie');
      console.error('Erreur suppression catégorie produit:', error);
    }
  });

  const deleteEquipmentCategoryMutation = useMutation({
    mutationFn: (id: number) => equipmentCategoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment-categories'] });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      toast.success('Catégorie d\'équipement supprimée avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression de la catégorie');
      console.error('Erreur suppression catégorie équipement:', error);
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      toast.success('Produit supprimé avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression du produit');
      console.error('Erreur suppression produit:', error);
    }
  });

  const deleteEquipmentMutation = useMutation({
    mutationFn: (id: number) => equipmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      toast.success('Équipement supprimé avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression de l\'équipement');
      console.error('Erreur suppression équipement:', error);
    }
  });

  // Fonctions pour gérer l'édition
  const handleEditProductCategory = (category: ProductCategory) => {
    setEditingProductCategory(category);
    setProductCategoryForm({ name: category.name, description: category.description });
  };

  const handleEditEquipmentCategory = (category: EquipmentCategory) => {
    setEditingEquipmentCategory(category);
    setEquipmentCategoryForm({ name: category.name, description: category.description });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category.id.toString(),
      images: [],
      existingImages: product.images.map(image => ({ id: image.id, image: image.image, image_url: image.image_url }))
    });
  };

  const handleEditEquipment = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setEquipmentForm({
      name: equipment.name,
      description: equipment.description,
      rental_price_per_day: equipment.rental_price_per_day.toString(),
      category: equipment.category.id.toString(),
      images: [],
      existingImages: equipment.images.map(image => ({ id: image.id, image: image.image, image_url: image.image_url }))
    });
  };

  // Fonctions pour gérer la suppression
  const handleDeleteClick = (type: string, id: number, name: string) => {
    setItemToDelete({ type, id, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;

    switch (itemToDelete.type) {
      case 'productCategory':
        deleteProductCategoryMutation.mutate(itemToDelete.id);
        break;
      case 'equipmentCategory':
        deleteEquipmentCategoryMutation.mutate(itemToDelete.id);
        break;
      case 'product':
        deleteProductMutation.mutate(itemToDelete.id);
        break;
      case 'equipment':
        deleteEquipmentMutation.mutate(itemToDelete.id);
        break;
    }
  };

  // Fonctions pour soumettre les modifications
  const handleUpdateProductCategory = () => {
    if (!editingProductCategory) return;

    const formData = new FormData();
    formData.append('name', productCategoryForm.name);
    formData.append('description', productCategoryForm.description);

    updateProductCategoryMutation.mutate({ id: editingProductCategory.id, data: formData });
  };

  const handleUpdateEquipmentCategory = () => {
    if (!editingEquipmentCategory) return;

    const formData = new FormData();
    formData.append('name', equipmentCategoryForm.name);
    formData.append('description', equipmentCategoryForm.description);

    updateEquipmentCategoryMutation.mutate({ id: editingEquipmentCategory.id, data: formData });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('description', productForm.description);
    formData.append('price', productForm.price);
    formData.append('stock', productForm.stock);
    formData.append('category_id', productForm.category);
    
    // Ajouter les nouvelles images
    if (productForm.images && productForm.images.length > 0) {
      productForm.images.forEach(file => formData.append('image_files', file));
    }
    
    // Ajouter les IDs des images existantes à conserver
    if (productForm.existingImages && productForm.existingImages.length > 0) {
      productForm.existingImages.forEach(img => {
        formData.append('existing_image_ids', img.id.toString());
      });
    }

    updateProductMutation.mutate({ id: editingProduct.id, data: formData });
  };

  const handleUpdateEquipment = () => {
    if (!editingEquipment) return;

    const formData = new FormData();
    formData.append('name', equipmentForm.name);
    formData.append('description', equipmentForm.description);
    formData.append('rental_price_per_day', equipmentForm.rental_price_per_day);
    formData.append('category_id', equipmentForm.category);
    
    // Ajouter les nouvelles images
    if (equipmentForm.images && equipmentForm.images.length > 0) {
      equipmentForm.images.forEach(file => formData.append('image_files', file));
    }
    
    // Ajouter les IDs des images existantes à conserver
    if (equipmentForm.existingImages && equipmentForm.existingImages.length > 0) {
      equipmentForm.existingImages.forEach(img => {
        formData.append('existing_image_ids', img.id.toString());
      });
    }

    updateEquipmentMutation.mutate({ id: editingEquipment.id, data: formData });
  };

  // Fonction pour réinitialiser les formulaires
  const resetForms = () => {
    setProductCategoryForm({ name: '', description: '' });
    setEquipmentCategoryForm({ name: '', description: '' });
    setProductForm({ name: '', description: '', price: '', stock: '', category: '', images: [], existingImages: [] });
    setEquipmentForm({ name: '', description: '', rental_price_per_day: '', category: '', images: [], existingImages: [] });
  };

  // Fonctions pour annuler l'édition
  const handleCancelEdit = () => {
    setEditingProductCategory(null);
    setEditingEquipmentCategory(null);
    setEditingProduct(null);
    setEditingEquipment(null);
    resetForms();
  };

  const handleToggleAvailability = async (equipmentId: number, currentAvailable: boolean) => {
    try {
      const newAvailable = !currentAvailable;

      // Récupérer l'équipement existant pour avoir tous les champs
      const equipmentToUpdate = equipment.find((e: any) => e.id === equipmentId);
      if (!equipmentToUpdate) {
        toast.error('Équipement non trouvé');
        return;
      }

      const formData = new FormData();
      formData.append('name', equipmentToUpdate.name);
      formData.append('description', equipmentToUpdate.description || '');
      formData.append('rental_price_per_day', equipmentToUpdate.rental_price_per_day.toString());
      formData.append('category_id', equipmentToUpdate.category.id.toString());
      formData.append('available', newAvailable.toString());

      await equipmentService.update(equipmentId, formData);

      // Invalider et recharger les données
      queryClient.invalidateQueries({ queryKey: ['equipment'] });

      toast.success(`Équipement marqué comme ${newAvailable ? 'disponible' : 'indisponible'}`);
    } catch (error) {
      console.error('Erreur lors du changement de disponibilité:', error);
      toast.error('Erreur lors du changement de disponibilité');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateProductCategory = () => {
    if (!productCategoryForm.name.trim()) {
      toast.error('Le nom de la catégorie est requis');
      return;
    }
    createProductCategoryMutation.mutate(productCategoryForm);
  };

  const handleCreateEquipmentCategory = () => {
    if (!equipmentCategoryForm.name.trim()) {
      toast.error('Le nom de la catégorie est requis');
      return;
    }
    createEquipmentCategoryMutation.mutate(equipmentCategoryForm);
  };

  const handleCreateProduct = () => {
    if (!productForm.name.trim() || !productForm.price || !productForm.category) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    const productData = {
      ...productForm,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock) || 0,
      category: parseInt(productForm.category)
    };
    createProductMutation.mutate(productData);
  };

  const handleCreateEquipment = () => {
    if (!equipmentForm.name.trim() || !equipmentForm.rental_price_per_day || !equipmentForm.category) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    const equipmentData = {
      ...equipmentForm,
      rental_price_per_day: parseFloat(equipmentForm.rental_price_per_day),
      category: parseInt(equipmentForm.category),
      available: true
    };
    createEquipmentMutation.mutate(equipmentData);
  };

  // Fonctions de gestion des actions d'admin
  const handleConfirmOrder = async (orderId: number) => {
    setLoadingActions(prev => ({ ...prev, confirm: orderId }));
    try {
      await orderService.confirm(orderId);
      toast.success('Commande confirmée avec succès');
      // Rafraîchir la liste des commandes
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (error) {
      console.error('Erreur lors de la confirmation:', error);
      toast.error('Erreur lors de la confirmation de la commande');
    } finally {
      setLoadingActions(prev => ({ ...prev, confirm: null }));
    }
  };

  const handleRejectOrder = async (orderId: number) => {
    setLoadingActions(prev => ({ ...prev, reject: orderId }));
    try {
      await orderService.reject(orderId);
      toast.success('Commande rejetée avec succès');
      // Rafraîchir la liste des commandes
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      toast.error('Erreur lors du rejet de la commande');
    } finally {
      setLoadingActions(prev => ({ ...prev, reject: null }));
    }
  };

  const handleShipOrder = async (orderId: number) => {
    setLoadingActions(prev => ({ ...prev, ship: orderId }));
    try {
      await orderService.ship(orderId);
      toast.success('Commande expédiée avec succès');
      // Rafraîchir la liste des commandes
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (error) {
      console.error('Erreur lors de l\'expédition:', error);
      toast.error('Erreur lors de l\'expédition de la commande');
    } finally {
      setLoadingActions(prev => ({ ...prev, ship: null }));
    }
  };

  const handleDeliverOrder = async (orderId: number) => {
    setLoadingActions(prev => ({ ...prev, deliver: orderId }));
    try {
      await orderService.deliver(orderId);
      toast.success('Commande livrée avec succès');
      // Rafraîchir la liste des commandes
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (error) {
      console.error('Erreur lors de la livraison:', error);
      toast.error('Erreur lors de la livraison de la commande');
    } finally {
      setLoadingActions(prev => ({ ...prev, deliver: null }));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleRemoveExistingProductImage = (imageId: number) => {
    setProductForm(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(img => img.id !== imageId)
    }));
  };

  const handleRemoveExistingEquipmentImage = (imageId: number) => {
    setEquipmentForm(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(img => img.id !== imageId)
    }));
  };

  const handleAddNewProductImages = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    const totalImages = productForm.existingImages.length + productForm.images.length + newFiles.length;
    
    if (totalImages > 5) {
      toast.error(`Vous ne pouvez pas avoir plus de 5 images au total. Vous avez actuellement ${productForm.existingImages.length + productForm.images.length} image(s)`);
      return;
    }
    
    setProductForm(prev => ({
      ...prev,
      images: [...prev.images, ...newFiles]
    }));
  };

  const handleAddNewEquipmentImages = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    const totalImages = equipmentForm.existingImages.length + equipmentForm.images.length + newFiles.length;
    
    if (totalImages > 5) {
      toast.error(`Vous ne pouvez pas avoir plus de 5 images au total. Vous avez actuellement ${equipmentForm.existingImages.length + equipmentForm.images.length} image(s)`);
      return;
    }
    
    setEquipmentForm(prev => ({
      ...prev,
      images: [...prev.images, ...newFiles]
    }));
  };

  const handleRemoveNewProductImage = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveNewEquipmentImage = (index: number) => {
    setEquipmentForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 700 }}>
            Administration
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Gérez vos produits, équipements et catégories
          </Typography>
        </motion.div>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
          <Tab label="Catégories Produits" />
          <Tab label="Catégories Équipements" />
          <Tab label="Produits" />
          <Tab label="Équipements" />
          <Tab label="Commandes" />
          <Tab label="Contacts" />
        </Tabs>
      </Box>

      {/* Product Categories Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenProductCategoryDialog(true)}
          >
            Ajouter une catégorie de produit
          </Button>
        </Box>

        <Grid container spacing={3}>
          {Array.isArray(productCategories) && productCategories.map((category: any) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          onClick={() => handleEditProductCategory(category)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick('productCategory', category.id, category.name)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Equipment Categories Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenEquipmentCategoryDialog(true)}
          >
            Ajouter une catégorie d'équipement
          </Button>
        </Box>

        <Grid container spacing={3}>
          {Array.isArray(equipmentCategories) && equipmentCategories.map((category: any) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          onClick={() => handleEditEquipmentCategory(category)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick('equipmentCategory', category.id, category.name)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Products Tab */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenProductDialog(true)}
          >
            Ajouter un produit
          </Button>
        </Box>



        <Grid container spacing={3}>
          {Array.isArray(products) && products.map((product: any) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardContent>
                  {/* Image du produit */}
                  {product.images && product.images.length > 0 ? (
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                      <img
                        src={product.images[0].image_url || `https://flashxship.onrender.com${product.images[0].image}`}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x150/cccccc/666666?text=Image+non+disponible';
                        }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                      <img
                        src="https://via.placeholder.com/300x150/cccccc/666666?text=Aucune+image"
                        alt="Aucune image"
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {product.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" color="primary">
                          {formatPrice(product.price)}
                        </Typography>
                        <Chip label={`Stock: ${product.stock}`} size="small" />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          onClick={() => handleEditProduct(product)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick('product', product.id, product.name)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Equipment Tab */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenEquipmentDialog(true)}
          >
            Ajouter un équipement
          </Button>
        </Box>

        <Grid container spacing={3}>
          {Array.isArray(equipment) && equipment.map((equip: any) => (
            <Grid item xs={12} sm={6} md={4} key={equip.id}>
              <Card>
                <CardContent>
                  {/* Image de l'équipement */}
                  {equip.images && equip.images.length > 0 ? (
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                      <img
                        src={equip.images[0].image_url || `https://flashxship.onrender.com${equip.images[0].image}`}
                        alt={equip.name}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x150/cccccc/666666?text=Image+non+disponible';
                        }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                      <img
                        src="https://via.placeholder.com/300x150/cccccc/666666?text=Aucune+image"
                        alt="Aucune image"
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {equip.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {equip.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" color="primary">
                          {formatPrice(equip.rental_price_per_day)}/jour
                        </Typography>
                        <Chip
                          label={equip.available ? 'Disponible' : 'Indisponible'}
                          color={equip.available ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          onClick={() => handleEditEquipment(equip)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Changer disponibilité">
                        <IconButton
                          size="small"
                          onClick={() => handleToggleAvailability(equip.id, equip.available)}
                          color={equip.available ? 'warning' : 'success'}
                        >
                          {equip.available ? <BlockIcon /> : <CheckCircleIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick('equipment', equip.id, equip.name)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Orders Tab */}
      <TabPanel value={tabValue} index={4}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Gestion des Commandes
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Commandes ({orders.length})
                </Typography>
                {orders.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                    Aucune commande trouvée
                  </Typography>
                ) : (
                  <List>
                    {orders.map((order: Order) => (
                      <React.Fragment key={order.id}>
                        <ListItem>
                          <ListItemText
                            primary={`Commande #${order.id}`}
                            secondary={`Client: ${order.user?.username || 'N/A'} - Total: ${formatPrice(order.total_amount)} - Statut: ${order.status} - Paiement: ${order.payment_status}`}
                          />
                          <ListItemSecondaryAction>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Voir détails">
                                <IconButton
                                  edge="end"
                                  aria-label="view"
                                  color="info"
                                  size="small"
                                  onClick={() => { setSelectedOrder(order); setOrderDetailsOpen(true); }}
                                >
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Confirmer">
                                <IconButton
                                  edge="end"
                                  aria-label="confirm"
                                  color="success"
                                  size="small"
                                  onClick={() => handleConfirmOrder(order.id)}
                                  disabled={loadingActions.confirm === order.id}
                                >
                                  {loadingActions.confirm === order.id ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Rejeter">
                                <IconButton
                                  edge="end"
                                  aria-label="reject"
                                  color="error"
                                  size="small"
                                  onClick={() => handleRejectOrder(order.id)}
                                  disabled={loadingActions.reject === order.id}
                                >
                                  {loadingActions.reject === order.id ? <CircularProgress size={20} /> : <CancelIcon />}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Expédier">
                                <IconButton
                                  edge="end"
                                  aria-label="ship"
                                  color="primary"
                                  size="small"
                                  onClick={() => handleShipOrder(order.id)}
                                  disabled={loadingActions.ship === order.id}
                                >
                                  {loadingActions.ship === order.id ? <CircularProgress size={20} /> : <ShipIcon />}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Livrer">
                                <IconButton
                                  edge="end"
                                  aria-label="deliver"
                                  color="secondary"
                                  size="small"
                                  onClick={() => handleDeliverOrder(order.id)}
                                  disabled={loadingActions.deliver === order.id}
                                >
                                  {loadingActions.deliver === order.id ? <CircularProgress size={20} /> : <DeliverIcon />}
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {order.id !== orders[orders.length - 1]?.id && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Détails de la commande */}
      <Dialog open={orderDetailsOpen} onClose={() => setOrderDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Détails de la commande</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Commande #{selectedOrder.id}
              </Typography>
              <Typography variant="body2">
                Client: {selectedOrder.user?.username || 'N/A'} ({selectedOrder.user?.email || '—'})
              </Typography>
              <Typography variant="body2">
                Créée le: {new Date(selectedOrder.created_at).toLocaleString('fr-FR')}
              </Typography>
              <Typography variant="body2">
                Statut: {selectedOrder.status} | Paiement: {selectedOrder.payment_status}
              </Typography>
              <Typography variant="body2">
                Total: {formatPrice(selectedOrder.total_amount)}
              </Typography>

              <Divider />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Articles</Typography>
              <List>
                {selectedOrder.items?.map((it) => (
                  <ListItem key={it.id} disableGutters>
                    <ListItemText
                      primary={it.product ? it.product.name : it.equipment ? it.equipment.name : 'Item'}
                      secondary={
                        it.product
                          ? `Produit x${it.quantity} — Prix unité: ${formatPrice(it.price)}`
                          : `Équipement x${it.quantity} × ${it.rental_days}j — Prix/jour: ${formatPrice(it.price)}`
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Divider />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Livraison</Typography>
              <Typography variant="body2">Nécessite livraison: {selectedOrder.requires_delivery ? 'Oui' : 'Non'}</Typography>
              {selectedOrder.requires_delivery && (
                <Box>
                  <Typography variant="body2">Destinataire: {selectedOrder.recipient_name || '—'}</Typography>
                  <Typography variant="body2">Email: {selectedOrder.recipient_email || '—'}</Typography>
                  <Typography variant="body2">Téléphone: {selectedOrder.recipient_phone || '—'}</Typography>
                  <Typography variant="body2">Adresse: {selectedOrder.delivery_address || '—'}</Typography>
                  <Typography variant="body2">Ville: {selectedOrder.delivery_city || '—'}</Typography>
                  <Typography variant="body2">Code postal: {selectedOrder.delivery_postal_code || '—'}</Typography>
                  <Typography variant="body2">Pays: {selectedOrder.delivery_country || '—'}</Typography>
                  <Typography variant="body2">Téléphone livraison: {selectedOrder.delivery_phone || '—'}</Typography>
                </Box>
              )}

              <Divider />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Paiement</Typography>
              <Typography variant="body2">Stripe session: {selectedOrder.stripe_session_id || '—'}</Typography>
              <Typography variant="body2">Payment Intent: {selectedOrder.stripe_payment_intent_id || '—'}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDetailsOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Contacts Tab */}
      <TabPanel value={tabValue} index={5}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Messages de Contact
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Messages ({contactMessages.length})
                </Typography>
                {contactMessages.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                    Aucun message trouvé
                  </Typography>
                ) : (
                  <List>
                    {contactMessages.map((message: ContactMessage) => (
                      <React.Fragment key={message.id}>
                        <ListItem>
                          <ListItemText
                            primary={message.subject}
                            secondary={`De: ${message.email} - Nom: ${message.name} - ${new Date(message.created_at).toLocaleDateString()}`}
                          />
                          <ListItemSecondaryAction>
                            <Tooltip title="Répondre">
                              <IconButton
                                edge="end"
                                aria-label="respond"
                                color="primary"
                                size="small"
                                onClick={() => handleOpenRespond(message)}
                              >
                                <ReplyIcon />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {message.id !== contactMessages[contactMessages.length - 1]?.id && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Respond to Contact Message Dialog */}
      <Dialog open={respondDialogOpen} onClose={() => setRespondDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Répondre au message</DialogTitle>
        <DialogContent>
          {selectedMessage && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                À: {selectedMessage.name} &lt;{selectedMessage.email}&gt;
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Sujet: {selectedMessage.subject}
              </Typography>
              <TextField
                fullWidth
                label="Votre réponse"
                multiline
                minRows={5}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRespondDialogOpen(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleSendResponse}
            disabled={respondMessageMutation.isPending || !responseText.trim()}
          >
            {respondMessageMutation.isPending ? 'Envoi…' : 'Envoyer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Product Category Dialog */}
      <Dialog open={openProductCategoryDialog} onClose={() => setOpenProductCategoryDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter une catégorie de produit</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nom de la catégorie"
              value={productCategoryForm.name}
              onChange={(e) => setProductCategoryForm({ ...productCategoryForm, name: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={productCategoryForm.description}
              onChange={(e) => setProductCategoryForm({ ...productCategoryForm, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductCategoryDialog(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleCreateProductCategory}
            disabled={createProductCategoryMutation.isPending}
          >
            {createProductCategoryMutation.isPending ? 'Création...' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Equipment Category Dialog */}
      <Dialog open={openEquipmentCategoryDialog} onClose={() => setOpenEquipmentCategoryDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter une catégorie d'équipement</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nom de la catégorie"
              value={equipmentCategoryForm.name}
              onChange={(e) => setEquipmentCategoryForm({ ...equipmentCategoryForm, name: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={equipmentCategoryForm.description}
              onChange={(e) => setEquipmentCategoryForm({ ...equipmentCategoryForm, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEquipmentCategoryDialog(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleCreateEquipmentCategory}
            disabled={createEquipmentCategoryMutation.isPending}
          >
            {createEquipmentCategoryMutation.isPending ? 'Création...' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Product Dialog */}
      <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter un produit</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nom du produit"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Prix"
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Stock"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                />
              </Grid>
            </Grid>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={productForm.category}
                label="Catégorie"
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                required
              >
                {Array.isArray(productCategories) && productCategories.map((category: any) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <ImageManagementSection
              title="Images du produit"
              existingImages={[]}
              newImages={productForm.images}
              onExistingImageRemove={() => {}}
              onNewImageAdd={handleAddNewProductImages}
              onNewImageRemove={handleRemoveNewProductImage}
              maxImages={5}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductDialog(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleCreateProduct}
            disabled={createProductMutation.isPending}
          >
            {createProductMutation.isPending ? 'Création...' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Equipment Dialog */}
      <Dialog open={openEquipmentDialog} onClose={() => setOpenEquipmentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter un équipement</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nom de l'équipement"
              value={equipmentForm.name}
              onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={equipmentForm.description}
              onChange={(e) => setEquipmentForm({ ...equipmentForm, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Prix de location par jour"
                  type="number"
                  value={equipmentForm.rental_price_per_day}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, rental_price_per_day: e.target.value })}
                  required
                />
              </Grid>
            </Grid>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={equipmentForm.category}
                label="Catégorie"
                onChange={(e) => setEquipmentForm({ ...equipmentForm, category: e.target.value })}
                required
              >
                {Array.isArray(equipmentCategories) && equipmentCategories.map((category: any) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <ImageManagementSection
              title="Images de l'équipement"
              existingImages={[]}
              newImages={equipmentForm.images}
              onExistingImageRemove={() => {}}
              onNewImageAdd={handleAddNewEquipmentImages}
              onNewImageRemove={handleRemoveNewEquipmentImage}
              maxImages={5}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEquipmentDialog(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleCreateEquipment}
            disabled={createEquipmentMutation.isPending}
          >
            {createEquipmentMutation.isPending ? 'Création...' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogues de modification */}

      {/* Modification Catégorie Produit */}
      <Dialog open={!!editingProductCategory} onClose={handleCancelEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier la catégorie de produit</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nom de la catégorie"
              value={productCategoryForm.name}
              onChange={(e) => setProductCategoryForm({ ...productCategoryForm, name: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={productCategoryForm.description}
              onChange={(e) => setProductCategoryForm({ ...productCategoryForm, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleUpdateProductCategory}
            disabled={updateProductCategoryMutation.isPending}
          >
            {updateProductCategoryMutation.isPending ? 'Modification...' : 'Modifier'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modification Catégorie Équipement */}
      <Dialog open={!!editingEquipmentCategory} onClose={handleCancelEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier la catégorie d'équipement</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nom de la catégorie"
              value={equipmentCategoryForm.name}
              onChange={(e) => setEquipmentCategoryForm({ ...equipmentCategoryForm, name: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={equipmentCategoryForm.description}
              onChange={(e) => setEquipmentCategoryForm({ ...equipmentCategoryForm, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleUpdateEquipmentCategory}
            disabled={updateEquipmentCategoryMutation.isPending}
          >
            {updateEquipmentCategoryMutation.isPending ? 'Modification...' : 'Modifier'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modification Produit */}
      <Dialog open={!!editingProduct} onClose={handleCancelEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier le produit</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nom du produit"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Prix"
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Stock"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  required
                />
              </Grid>
            </Grid>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={productForm.category}
                label="Catégorie"
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                required
              >
                {Array.isArray(productCategories) && productCategories.map((category: any) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <ImageManagementSection
              title="Gestion des images"
              existingImages={productForm.existingImages}
              newImages={productForm.images}
              onExistingImageRemove={handleRemoveExistingProductImage}
              onNewImageAdd={handleAddNewProductImages}
              onNewImageRemove={handleRemoveNewProductImage}
              maxImages={5}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleUpdateProduct}
            disabled={updateProductMutation.isPending}
          >
            {updateProductMutation.isPending ? 'Modification...' : 'Modifier'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modification Équipement */}
      <Dialog open={!!editingEquipment} onClose={handleCancelEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier l'équipement</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nom de l'équipement"
              value={equipmentForm.name}
              onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={equipmentForm.description}
              onChange={(e) => setEquipmentForm({ ...equipmentForm, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Prix de location par jour"
                  type="number"
                  value={equipmentForm.rental_price_per_day}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, rental_price_per_day: e.target.value })}
                  required
                />
              </Grid>
            </Grid>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={equipmentForm.category}
                label="Catégorie"
                onChange={(e) => setEquipmentForm({ ...equipmentForm, category: e.target.value })}
                required
              >
                {Array.isArray(equipmentCategories) && equipmentCategories.map((category: any) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <ImageManagementSection
              title="Gestion des images"
              existingImages={equipmentForm.existingImages}
              newImages={equipmentForm.images}
              onExistingImageRemove={handleRemoveExistingEquipmentImage}
              onNewImageAdd={handleAddNewEquipmentImages}
              onNewImageRemove={handleRemoveNewEquipmentImage}
              maxImages={5}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleUpdateEquipment}
            disabled={updateEquipmentMutation.isPending}
          >
            {updateEquipmentMutation.isPending ? 'Modification...' : 'Modifier'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer "{itemToDelete?.name}" ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={
              deleteProductCategoryMutation.isPending ||
              deleteEquipmentCategoryMutation.isPending ||
              deleteProductMutation.isPending ||
              deleteEquipmentMutation.isPending
            }
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>



      {/* Dialogue de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer "{itemToDelete?.name}" ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={
              deleteProductCategoryMutation.isPending ||
              deleteEquipmentCategoryMutation.isPending ||
              deleteProductMutation.isPending ||
              deleteEquipmentMutation.isPending
            }
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Admin; 