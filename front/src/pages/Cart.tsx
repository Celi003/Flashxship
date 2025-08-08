import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Grid,
  Divider,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Product, Equipment } from '../types';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, removeFromCart, updateQuantity, updateDays } = useCart();
  const { user } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleDaysChange = (itemId: string, newDays: number) => {
    if (newDays < 1) return;
    updateDays(itemId, newDays);
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    toast.success('Article supprimé du panier');
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour passer une commande');
      navigate('/login');
      return;
    }
    
    if (items.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }
    
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Votre panier est vide
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Ajoutez des produits ou équipements à votre panier pour commencer vos achats.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
            sx={{ mr: 2 }}
          >
            Voir les produits
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/equipment')}
          >
            Voir les équipements
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mon Panier
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Typography variant="h6" noWrap>
                      {item.item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.type === 'equipment' ? 'Équipement' : 'Produit'}
                    </Typography>
                  </Grid>
                  
                                     <Grid item xs={12} sm={2}>
                     <Typography variant="body1" fontWeight="bold">
                       {formatPrice(item.type === 'equipment' ? (item.item as Equipment).rental_price_per_day : (item.item as Product).price)}
                     </Typography>
                     <Typography variant="caption" color="text.secondary">
                       {item.type === 'equipment' ? '/jour' : 'l\'unité'}
                     </Typography>
                   </Grid>
                  
                  <Grid item xs={12} sm={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          handleQuantityChange(item.id, value);
                        }}
                        size="small"
                        sx={{ width: 60, mx: 1 }}
                        inputProps={{ min: 1, style: { textAlign: 'center' } }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                  
                  {item.type === 'equipment' && (
                    <Grid item xs={12} sm={2}>
                      <TextField
                        label="Jours"
                        type="number"
                        value={item.days || 1}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          handleDaysChange(item.id, value);
                        }}
                        size="small"
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                  )}
                  
                  <Grid item xs={12} sm={2}>
                    <Typography variant="h6" fontWeight="bold">
                      {formatPrice(item.total)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={1}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Résumé de la commande
              </Typography>
              
              <Box sx={{ my: 2 }}>
                <Typography variant="body1">
                  Articles ({items.length})
                </Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                  {formatPrice(total)}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleCheckout}
                disabled={!user}
              >
                {user ? 'Passer la commande' : 'Se connecter pour commander'}
              </Button>
              
              {!user && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Vous devez être connecté pour passer une commande.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart; 