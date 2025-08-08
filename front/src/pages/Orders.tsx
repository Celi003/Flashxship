import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Divider,
  Skeleton,
  Alert,
  useTheme,
  Button
} from '@mui/material';
import {
  ShoppingBag as OrderIcon,
  Store as StoreIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/api';
import { Order } from '../types';
import toast from 'react-hot-toast';

const Orders: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user orders
  const { data: ordersResponse, isLoading, error } = useQuery({
    queryKey: ['user-orders'],
    queryFn: orderService.getAll,
    enabled: !!user
  });

  // Mutation pour créer une session de paiement
  const createPaymentSessionMutation = useMutation({
    mutationFn: orderService.createPaymentSession,
    onSuccess: (data) => {
      // Rediriger vers Stripe Checkout
      window.location.href = data.url;
    },
    onError: (error) => {
      toast.error('Erreur lors de la création de la session de paiement');
      console.error('Payment session error:', error);
    }
  });

  const handlePayment = (orderId: number) => {
    createPaymentSessionMutation.mutate(orderId);
  };

  // Extract orders array from response
  const orders = Array.isArray(ordersResponse) ? ordersResponse : 
                 (ordersResponse as any)?.results || ordersResponse || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'CONFIRMED': return 'info';
      case 'SHIPPED': return 'primary';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'CONFIRMED': return 'Confirmée';
      case 'SHIPPED': return 'Expédiée';
      case 'DELIVERED': return 'Livrée';
      case 'CANCELLED': return 'Annulée';
      default: return status;
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          Veuillez vous connecter pour voir vos commandes
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 700 }}>
            Mes Commandes
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Suivez l'historique de vos achats et locations
          </Typography>
        </motion.div>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          Erreur lors du chargement des commandes. Veuillez réessayer.
        </Alert>
      )}

      {isLoading ? (
        <Grid container spacing={3}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="60%" height={32} />
                      <Skeleton variant="text" width="40%" height={20} />
                    </Box>
                  </Box>
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="80%" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <OrderIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Aucune commande
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Vous n'avez pas encore passé de commande. 
                Commencez par explorer nos produits et équipements !
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order: Order, index: number) => (
            <Grid item xs={12} key={order.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card elevation={3}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          <OrderIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Commande #{order.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(order.created_at)}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={getStatusLabel(order.status)}
                        color={getStatusColor(order.status) as any}
                        size="medium"
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <List dense>
                      {order.items.map((item, itemIndex) => (
                        <ListItem key={itemIndex} sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'grey.200' }}>
                              <StoreIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {item.product?.name || item.equipment?.name || 'Produit'}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                  {formatPrice(item.price)}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Quantité: {item.quantity}
                                  {item.rental_days > 1 && ` • ${item.rental_days} jours de location`}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Total
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {formatPrice(order.total_amount)}
                      </Typography>
                    </Box>

                    {/* Informations de livraison */}
                    {order.requires_delivery && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Livraison
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.delivery_address}, {order.delivery_city}, {order.delivery_postal_code}, {order.delivery_country}
                        </Typography>
                        {order.recipient_name && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Destinataire: {order.recipient_name}
                          </Typography>
                        )}
                      </Box>
                    )}

                    {/* Statut de paiement et bouton */}
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={order.payment_status === 'PAID' ? 'Payé' : 'En attente de paiement'}
                        color={order.payment_status === 'PAID' ? 'success' : 'warning'}
                        size="small"
                      />
                      
                      {order.payment_status === 'PENDING' && (
                        <Button
                          variant="contained"
                          startIcon={<PaymentIcon />}
                          onClick={() => handlePayment(order.id)}
                          disabled={createPaymentSessionMutation.isPending}
                          size="small"
                        >
                          {createPaymentSessionMutation.isPending ? 'Chargement...' : 'Payer'}
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Orders; 