import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Pagination,
  Skeleton,
  Alert,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { productService, productCategoryService } from '../services/api';
import { Product, ProductCategory } from '../types';
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ImageGallery from '../components/ImageGallery';
import ProductCard from '../components/ProductCard';


const Products: React.FC = () => {
  const theme = useTheme();
  const { addToCart } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  // Fetch categories
  const { data: categoriesResponse, isLoading: categoriesLoading } = useQuery({
    queryKey: ['product-categories'],
    queryFn: productCategoryService.getAll
  });

  // Extract categories array from response with better error handling
  const categories = Array.isArray(categoriesResponse) ? categoriesResponse :
    (categoriesResponse as any)?.results ||
    (categoriesResponse && typeof categoriesResponse === 'object' ? Object.values(categoriesResponse) : []) ||
    [];

  // Fetch products
  const { data: productsResponse, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll
  });

  // Extract products array from response with better error handling
  const products = Array.isArray(productsResponse) ? productsResponse :
    (productsResponse as any)?.results ||
    (productsResponse && typeof productsResponse === 'object' ? Object.values(productsResponse) : []) ||
    [];



  // Filter and sort products
  const filteredProducts = products
    .filter((product: Product) => {
      // Filtrage par recherche textuelle
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtrage par catégorie - vérifier que la catégorie existe et correspond
      const matchesCategory = selectedCategory === '' || 
                             (product.category && product.category.id === selectedCategory);
      
      return matchesSearch && matchesCategory;
    })
    .sort((a: Product, b: Product) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    toast.success(`${product.name} ajouté au panier`);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setOpenDetailsDialog(true);
  };

  // Fonctions wrapper pour ProductCard (qui attend des fonctions prenant un id: number)
  const handleAddToCartById = (id: number) => {
    const product = products.find((p: Product) => p.id === id);
    if (product) {
      handleAddToCart(product);
    }
  };

  const handleViewDetailsById = (id: number) => {
    const product = products.find((p: Product) => p.id === id);
    if (product) {
      handleViewDetails(product);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">
          Erreur lors du chargement des produits. Veuillez réessayer.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 700 }}>
          Nos Produits
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Découvrez notre gamme complète d'équipements professionnels
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={selectedCategory}
                label="Catégorie"
                onChange={(e) => setSelectedCategory(e.target.value as number | '')}
                disabled={categoriesLoading}
              >
                <MenuItem value="">Toutes les catégories</MenuItem>
                {Array.isArray(categories) && categories.map((category: ProductCategory) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Trier par</InputLabel>
              <Select
                value={sortBy}
                label="Trier par"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Nom</MenuItem>
                <MenuItem value="price-asc">Prix croissant</MenuItem>
                <MenuItem value="price-desc">Prix décroissant</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="body2" color="text.secondary">
              {filteredProducts.length} produit(s) trouvé(s)
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Products Grid */}
      {isLoading ? (
        <Grid container spacing={3}>
          {[...Array(12)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedProducts.map((product: Product, index: number) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  image=""
                  images={product.images}
                  category={product.category?.name || 'Sans catégorie'}
                  isAvailable={product.stock > 0}
                  onAddToCart={handleAddToCartById}
                  onViewDetails={handleViewDetailsById}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* Product Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Détails du produit
        </DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Grid container spacing={3} sx={{ pt: 2 }}>
              <Grid item xs={12}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  {selectedProduct.name}
                </Typography>
                {selectedProduct.description && (
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedProduct.description}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Prix
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatPrice(selectedProduct.price)}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Stock
                </Typography>
                <Chip
                  label={selectedProduct.stock}
                  color={selectedProduct.stock > 0 ? 'success' : 'error'}
                  size="medium"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Catégorie
                </Typography>
                <Chip label={selectedProduct.category.name} size="medium" />
              </Grid>

              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <Grid item xs={12}>
                  <ImageGallery 
                    images={selectedProduct.images}
                    title="Images du produit"
                    maxHeight={150}
                    showNavigation={true}
                    showZoom={true}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Date de création
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(selectedProduct.created_at).toLocaleDateString('fr-FR')}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>Fermer</Button>
          {selectedProduct && (
            <Button
              variant="contained"
              onClick={() => {
                handleAddToCart(selectedProduct);
                setOpenDetailsDialog(false);
              }}
              disabled={selectedProduct.stock === 0}
            >
              Ajouter au panier
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Products; 