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
  useTheme
} from '@mui/material';
import {
  CalendarToday as RentalIcon,
  Build as EquipmentIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/api';
import { Order } from '../types';

const Rentals: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();

  // Fetch user orders
  const { data: ordersResponse, isLoading, error } = useQuery({
    queryKey: ['user-orders'],
    queryFn: orderService.getAll,
    enabled: !!user
  });

  // Extract orders array from response and filter for rentals only
  const allOrders = Array.isArray(ordersResponse) ? ordersResponse : 
                    (ordersResponse as any)?.results || ordersResponse || [];
  
  const rentals = allOrders.filter((order: Order) => 
    order.items.some(item => item.equipment && item.rental_days > 0)
  );

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
          Veuillez vous connecter pour voir vos locations
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
            Mes Locations
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Suivez l'historique de vos locations d'équipements
          </Typography>
        </motion.div>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          Erreur lors du chargement des locations. Veuillez réessayer.
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
      ) : rentals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <RentalIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Aucune location
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Vous n'avez pas encore loué d'équipements. 
                Découvrez notre gamme d'équipements disponibles à la location !
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Grid container spacing={3}>
          {rentals.map((order: Order, index: number) => {
            // Filter only equipment items for this order
            const equipmentItems = order.items.filter(item => item.equipment && item.rental_days > 0);
            
            return equipmentItems.map((item, itemIndex) => (
              <Grid item xs={12} key={`${order.id}-${itemIndex}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card elevation={3}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                            <RentalIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              Location #{order.id}
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

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'grey.200', mr: 2 }}>
                          <EquipmentIcon />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {item.equipment?.name || 'Équipement'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.equipment?.description || 'Description non disponible'}
                          </Typography>
                        </Box>
                      </Box>

                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">
                            Durée de location
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {item.rental_days} jour(s)
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">
                            Tarif journalier
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {formatPrice(item.equipment?.rental_price_per_day || 0)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">
                            Quantité
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {item.quantity}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">
                            Total
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {formatPrice(item.price)}
                          </Typography>
                        </Grid>
                      </Grid>

                      {item.equipment?.category && (
                        <Box sx={{ mb: 2 }}>
                          <Chip 
                            label={item.equipment.category.name}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ));
          })}
        </Grid>
      )}
    </Container>
  );
};

export default Rentals; 