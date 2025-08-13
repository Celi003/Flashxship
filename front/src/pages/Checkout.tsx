import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { createOrder } from '../config/stripe';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  // Informations de livraison
  requiresDelivery: boolean;
  deliveryCountry: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPostalCode: string;
  deliveryPhone: string;
  // Informations du destinataire
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  isRecipientDifferent: boolean;
}

const steps = ['Panier', 'Informations', 'Livraison', 'Confirmation', 'Terminé'];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: user?.username?.split(' ')[0] || '',
    lastName: user?.username?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    // Informations de livraison
    requiresDelivery: false,
    deliveryCountry: 'France',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryPostalCode: '',
    deliveryPhone: '',
    // Informations du destinataire
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    isRecipientDifferent: false,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleInputChange = (field: keyof CheckoutForm) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const validateForm = () => {
    const requiredFields: (keyof CheckoutForm)[] = [
      'firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'
    ];

    for (const field of requiredFields) {
      const value = formData[field];
      if (typeof value === 'string' && !value.trim()) {
        toast.error(`Le champ ${field} est requis`);
        return false;
      }
    }

    // Validation des informations de livraison si nécessaire
    if (formData.requiresDelivery) {
      const deliveryFields: (keyof CheckoutForm)[] = [
        'deliveryCountry', 'deliveryAddress', 'deliveryCity', 'deliveryPostalCode', 'deliveryPhone'
      ];

      for (const field of deliveryFields) {
        const value = formData[field];
        if (typeof value === 'string' && !value.trim()) {
          toast.error(`Le champ ${field} est requis pour la livraison`);
          return false;
        }
      }

      // Validation des informations du destinataire si différent
      if (formData.isRecipientDifferent) {
        const recipientFields: (keyof CheckoutForm)[] = [
          'recipientName', 'recipientEmail', 'recipientPhone'
        ];

        for (const field of recipientFields) {
          const value = formData[field];
          if (typeof value === 'string' && !value.trim()) {
            toast.error(`Le champ ${field} est requis pour le destinataire`);
            return false;
          }
        }
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Adresse email invalide');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (activeStep === 1 && !validateForm()) {
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour passer une commande');
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Votre panier est vide');
      navigate('/cart');
      return;
    }

    try {
      setLoading(true);

      // Préparer les données du panier pour l'API
      const cartItems = items.map(item => ({
        id: item.item.id,
        type: 'rental_price_per_day' in item.item ? 'equipment' : 'product',
        quantity: item.quantity,
        days: item.days || 1
      }));

      // Préparer les informations de livraison
      const deliveryInfo = {
        requires_delivery: formData.requiresDelivery,
        country: formData.deliveryCountry,
        address: formData.deliveryAddress,
        city: formData.deliveryCity,
        postal_code: formData.deliveryPostalCode,
        phone: formData.deliveryPhone,
        recipient_name: formData.isRecipientDifferent ? formData.recipientName : '',
        recipient_email: formData.isRecipientDifferent ? formData.recipientEmail : '',
        recipient_phone: formData.isRecipientDifferent ? formData.recipientPhone : ''
      };

      const orderData = await createOrder(cartItems, formData, deliveryInfo);

      // Commande créée avec succès
      toast.success(`Commande créée ! Numéro: #${orderData.order_id}`);

      // Vider le panier
      clearCart();

      // Rediriger vers la page de succès
      navigate('/success', {
        state: {
          orderId: orderData.order_id,
          totalAmount: orderData.total_amount
        }
      });

    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Pré-remplir les champs avec les informations de l'utilisateur
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.username?.split(' ')[0] || '',
        lastName: user.username?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  if (items.length === 0 && activeStep !== 3) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 4 }}>
          Votre panier est vide. <Button onClick={() => navigate('/products')}>Continuer les achats</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Finaliser votre commande
      </Typography>

      {/* Composant de diagnostic temporaire */}

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {activeStep === 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    Récapitulatif du panier
                  </Typography>
                  {items.map((item, index) => (
                    <Box key={`${item.item.id}-${index}`} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={8}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {item.item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.quantity} x {formatPrice('price' in item.item ? item.item.price : item.item.rental_price_per_day)}
                            {item.days && ` (${item.days} jours)`}
                          </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                            {formatPrice(item.total)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    Informations personnelles
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Prénom"
                        value={formData.firstName}
                        onChange={handleInputChange('firstName')}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nom"
                        value={formData.lastName}
                        onChange={handleInputChange('lastName')}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Téléphone"
                        value={formData.phone}
                        onChange={handleInputChange('phone')}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Adresse"
                        value={formData.address}
                        onChange={handleInputChange('address')}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Ville"
                        value={formData.city}
                        onChange={handleInputChange('city')}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Code postal"
                        value={formData.postalCode}
                        onChange={handleInputChange('postalCode')}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Pays"
                        value={formData.country}
                        onChange={handleInputChange('country')}
                        required
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    Options de livraison
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Souhaitez-vous être livré ?
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant={formData.requiresDelivery ? "contained" : "outlined"}
                        onClick={() => setFormData(prev => ({ ...prev, requiresDelivery: true }))}
                      >
                        Oui, je souhaite être livré
                      </Button>
                      <Button
                        variant={!formData.requiresDelivery ? "contained" : "outlined"}
                        onClick={() => setFormData(prev => ({ ...prev, requiresDelivery: false }))}
                      >
                        Non, je viens récupérer
                      </Button>
                    </Box>
                  </Box>

                  {formData.requiresDelivery && (
                    <>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Adresse de livraison
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Pays de livraison"
                            value={formData.deliveryCountry}
                            onChange={handleInputChange('deliveryCountry')}
                            required
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Adresse de livraison"
                            value={formData.deliveryAddress}
                            onChange={handleInputChange('deliveryAddress')}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Ville de livraison"
                            value={formData.deliveryCity}
                            onChange={handleInputChange('deliveryCity')}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Code postal de livraison"
                            value={formData.deliveryPostalCode}
                            onChange={handleInputChange('deliveryPostalCode')}
                            required
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Téléphone de livraison"
                            value={formData.deliveryPhone}
                            onChange={handleInputChange('deliveryPhone')}
                            required
                          />
                        </Grid>
                      </Grid>

                      <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          Le destinataire est-il différent de vous ?
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <Button
                            variant={formData.isRecipientDifferent ? "contained" : "outlined"}
                            onClick={() => setFormData(prev => ({ ...prev, isRecipientDifferent: true }))}
                          >
                            Oui, c'est pour quelqu'un d'autre
                          </Button>
                          <Button
                            variant={!formData.isRecipientDifferent ? "contained" : "outlined"}
                            onClick={() => setFormData(prev => ({ ...prev, isRecipientDifferent: false }))}
                          >
                            Non, c'est pour moi
                          </Button>
                        </Box>

                        {formData.isRecipientDifferent && (
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Nom du destinataire"
                                value={formData.recipientName}
                                onChange={handleInputChange('recipientName')}
                                required
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Email du destinataire"
                                type="email"
                                value={formData.recipientEmail}
                                onChange={handleInputChange('recipientEmail')}
                                required
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Téléphone du destinataire"
                                value={formData.recipientPhone}
                                onChange={handleInputChange('recipientPhone')}
                                required
                              />
                            </Grid>
                          </Grid>
                        )}
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    Confirmation de commande
                  </Typography>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Vérifiez vos informations avant de confirmer votre commande.
                  </Alert>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Informations personnelles
                    </Typography>
                    <Typography variant="body2">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.email}<br />
                      {formData.phone}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.postalCode}, {formData.country}
                    </Typography>
                  </Box>

                  {formData.requiresDelivery && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Informations de livraison
                      </Typography>
                      <Typography variant="body2">
                        {formData.deliveryAddress}<br />
                        {formData.deliveryCity}, {formData.deliveryPostalCode}, {formData.deliveryCountry}<br />
                        Tél: {formData.deliveryPhone}
                      </Typography>

                      {formData.isRecipientDifferent && (
                        <>
                          <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                            Destinataire
                          </Typography>
                          <Typography variant="body2">
                            {formData.recipientName}<br />
                            {formData.recipientEmail}<br />
                            Tél: {formData.recipientPhone}
                          </Typography>
                        </>
                      )}
                    </Box>
                  )}

                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CheckIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Prêt à confirmer votre commande
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Votre commande sera créée et vous pourrez la payer depuis votre page "Mes commandes".
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                  <Typography variant="h4" sx={{ mb: 2, fontWeight: 600, color: 'success.main' }}>
                    Commande confirmée !
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Merci pour votre commande
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Vous recevrez un email de confirmation avec les détails de votre commande.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/')}
                  >
                    Retour à l'accueil
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Résumé de la commande
                </Typography>

                {items.map((item, index) => (
                  <Box key={`${item.item.id}-${index}`} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">
                        {item.item.name} x {item.quantity}
                        {item.days && ` (${item.days}j)`}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatPrice(item.total)}
                      </Typography>
                    </Box>
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                    {formatPrice(total)}
                  </Typography>
                </Box>

                {activeStep < 3 && (
                  <Box sx={{ mt: 3 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={activeStep === 2 ? handleCheckout : handleNext}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : undefined}
                    >
                      {loading ? 'Chargement...' :
                        activeStep === 2 ? 'Confirmer la commande' : 'Continuer'}
                    </Button>

                    {activeStep > 0 && (
                      <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        onClick={handleBack}
                        sx={{ mt: 1 }}
                        startIcon={<ArrowBackIcon />}
                      >
                        Retour
                      </Button>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout; 