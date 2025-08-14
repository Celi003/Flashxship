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
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Skeleton,
  Avatar
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  CalendarToday as CalendarIcon,
  Build as EquipmentIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { equipmentService, equipmentCategoryService } from '../services/api';
import { Equipment as EquipmentType, EquipmentCategory } from '../types';
import toast from 'react-hot-toast';

const Equipment: React.FC = () => {
  const theme = useTheme();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | null>(null);
  const [rentalDays, setRentalDays] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [openRentalDialog, setOpenRentalDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  // Fetch data
  const { data: categoriesResponse } = useQuery({
    queryKey: ['equipment-categories'],
    queryFn: equipmentCategoryService.getAll
  });
  const { data: equipmentResponse, isLoading } = useQuery({
    queryKey: ['equipment'],
    queryFn: equipmentService.getAll
  });

  // Extract arrays from responses with better error handling
  const categories = Array.isArray(categoriesResponse) ? categoriesResponse : 
                    (categoriesResponse as any)?.results || 
                    (categoriesResponse && typeof categoriesResponse === 'object' ? Object.values(categoriesResponse) : []) || 
                    [];
  const equipment = Array.isArray(equipmentResponse) ? equipmentResponse : 
                    (equipmentResponse as any)?.results || 
                    (equipmentResponse && typeof equipmentResponse === 'object' ? Object.values(equipmentResponse) : []) || 
                    [];



  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleRentEquipment = (equipment: EquipmentType) => {
    setSelectedEquipment(equipment);
    setRentalDays(1);
    setStartDate('');
    setEndDate('');
    setOpenRentalDialog(true);
  };

  const handleViewDetails = (equipment: EquipmentType) => {
    setSelectedEquipment(equipment);
    setOpenDetailsDialog(true);
  };

  const handleConfirmRental = async () => {
    if (!selectedEquipment || !startDate || !endDate) {
      toast.error('Veuillez remplir toutes les informations');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff <= 0) {
      toast.error('La date de fin doit être après la date de début');
      return;
    }

    try {
      addToCart(selectedEquipment, 1, daysDiff);
      setOpenRentalDialog(false);
      setSelectedEquipment(null);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleAddToCart = (equipment: EquipmentType) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    addToCart(equipment, 1, daysDiff);
    toast.success(`${equipment.name} ajouté au panier`);
  };

  const filteredEquipment = equipment.filter((item: EquipmentType) => 
    selectedCategory === '' || item.category.id === selectedCategory
  );

  const sortedEquipment = [...filteredEquipment].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.rental_price_per_day - b.rental_price_per_day;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

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
            Location d'Équipements
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Découvrez notre gamme d'équipements disponibles à la location
          </Typography>
        </motion.div>
      </Box>



      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as number | '')}
                label="Catégorie"
              >
                <MenuItem value="">Toutes les catégories</MenuItem>
                {Array.isArray(categories) && categories.map((category: EquipmentCategory) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Trier par</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Trier par"
              >
                <MenuItem value="name">Nom</MenuItem>
                <MenuItem value="price">Prix</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Equipment Grid */}
      <Grid container spacing={3}>
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : sortedEquipment.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <EquipmentIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Aucun équipement trouvé
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Aucun équipement ne correspond à vos critères de recherche.
              </Typography>
            </Box>
          </Grid>
        ) : (
          sortedEquipment.map((equipment, index) => (
            <Grid item xs={12} sm={6} md={4} key={equipment.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  elevation={3}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                                     <CardMedia
                     component="img"
                     height="200"
                                           image={equipment.images && equipment.images.length > 0 
                        ? (equipment.images[0].image_url || (equipment.images[0].image ? `http://localhost:8000${equipment.images[0].image}` : 'https://via.placeholder.com/300x200/cccccc/666666?text=Equipement'))
                        : 'https://via.placeholder.com/300x200/cccccc/666666?text=Equipement'}
                     alt={equipment.name}
                     sx={{ objectFit: 'cover' }}
                     onLoad={(e) => {
                     }}
                     onError={(e) => {
                       (e.target as HTMLImageElement).src = '/placeholder-equipment.jpg';
                     }}
                   />
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                        {equipment.name}
                      </Typography>
                      <Chip 
                        label={equipment.available ? 'Disponible' : 'Indisponible'} 
                        color={equipment.available ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                    
                    {equipment.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {equipment.description.length > 100 
                          ? `${equipment.description.substring(0, 100)}...` 
                          : equipment.description}
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                        {formatPrice(equipment.rental_price_per_day)}/jour
                      </Typography>
                      <Chip label={equipment.category.name} size="small" variant="outlined" />
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<CalendarIcon />}
                      onClick={() => handleRentEquipment(equipment)}
                      disabled={!equipment.available}
                      sx={{ mb: 1 }}
                    >
                      {equipment.available ? 'Louer' : 'Indisponible'}
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<ViewIcon />}
                      onClick={() => handleViewDetails(equipment)}
                    >
                      Voir détails
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))
        )}
      </Grid>

      {/* Rental Dialog */}
      <Dialog open={openRentalDialog} onClose={() => setOpenRentalDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Louer {selectedEquipment?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Prix par jour : {selectedEquipment && formatPrice(selectedEquipment.rental_price_per_day)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date de début"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date de fin"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              {startDate && endDate && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Durée de location : {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} jour(s)
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRentalDialog(false)}>Annuler</Button>
          <Button 
            variant="contained" 
            onClick={handleConfirmRental}
            disabled={!startDate || !endDate}
          >
            Confirmer la location
          </Button>
        </DialogActions>
      </Dialog>

      {/* Equipment Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Détails de l'équipement
        </DialogTitle>
        <DialogContent>
          {selectedEquipment && (
            <Grid container spacing={3} sx={{ pt: 2 }}>
              <Grid item xs={12}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  {selectedEquipment.name}
                </Typography>
                {selectedEquipment.description && (
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedEquipment.description}
                  </Typography>
                )}
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Prix de location par jour
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatPrice(selectedEquipment.rental_price_per_day)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Disponibilité
                </Typography>
                <Chip 
                  label={selectedEquipment.available ? 'Disponible' : 'Indisponible'} 
                  color={selectedEquipment.available ? 'success' : 'error'}
                  size="medium"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Catégorie
                </Typography>
                <Chip label={selectedEquipment.category.name} size="medium" />
              </Grid>
              
              {selectedEquipment.images && selectedEquipment.images.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Images
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                         {selectedEquipment.images.map((image, index) => (
                       <Avatar
                         key={index}
                                                   src={image.image ? `http://localhost:8000${image.image}` : undefined}
                         sx={{ width: 100, height: 100 }}
                         variant="rounded"
                         onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.src = '/placeholder-equipment.jpg';
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
                  {new Date(selectedEquipment.created_at).toLocaleDateString('fr-FR')}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Equipment;

