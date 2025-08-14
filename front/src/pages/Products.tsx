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
    .filter((product: Product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8]
                      }
                    }}
                  >
                                         <CardMedia
                       component="img"
                       height="200"
                       image={product.images?.[0]?.image_url || (product.images?.[0]?.image ? `http://localhost:8000${product.images[0].image}` : 'https://via.placeholder.com/300x200/cccccc/666666?text=Produit')}
                       alt={product.name}
                       sx={{ objectFit: 'cover' }}
                                              onLoad={() => {
                       // Image loaded successfully
                     }}
                       onError={(e) => {
                           (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                         }}
                     />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {product.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                          {formatPrice(product.price)}
                        </Typography>
                        <Chip 
                          label={`Stock: ${product.stock}`} 
                          color={product.stock > 0 ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                      {product.category && (
                        <Chip 
                          label={product.category.name} 
                          size="small" 
                          sx={{ mb: 2 }}
                        />
                      )}
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<CartIcon />}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        sx={{ mb: 1 }}
                      >
                        {product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewDetails(product)}
                      >
                        Voir détails
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
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
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Images
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                         {selectedProduct.images.map((image, index) => (
                       <Avatar
                         key={index}
                                                   src={image.image ? `http://localhost:8000${image.image}` : undefined}
                         sx={{ width: 100, height: 100 }}
                         variant="rounded"
                         onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.src = 'https://via.placeholder.com/300x200/cccccc/666666?text=Produit';
                         }}
                       />
                     ))}
                  </Box>
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