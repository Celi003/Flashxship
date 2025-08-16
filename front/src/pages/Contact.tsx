import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Paper,
  useTheme,
  Divider
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  Business as BusinessIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { contactService } from '../services/api';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Créer un objet FormData avec les données du formulaire
      const messageData = new FormData();
      messageData.append('name', formData.name);
      messageData.append('email', formData.email);
      messageData.append('subject', formData.subject);
      messageData.append('message', formData.message);
      
      await contactService.sendMessage(messageData);
      
      toast.success('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Email',
      content: 'contact@flashxship.com',
      description: 'Notre équipe vous répondra sous 24h'
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Téléphone',
      content: '+33 1 23 45 67 89',
      description: 'Lun-Ven: 8h-18h, Sam: 9h-15h'
    },
    {
      icon: <LocationIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Adresse',
      content: 'Paris, France',
      description: 'Siège social et showroom'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 700 }}>
            Contactez-nous
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Notre équipe est là pour vous accompagner dans toutes vos commandes de produits et vos projets d'équipement professionnel
          </Typography>
        </motion.div>
      </Box>

      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper elevation={3} sx={{ p: 4, height: 'fit-content' }}>
              <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
                Informations de contact
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                      <Box sx={{ mr: 2, mt: 0.5 }}>
                        {info.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {info.title}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                          {info.content}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {info.description}
                        </Typography>
                      </Box>
                    </Box>
                    {index < contactInfo.length - 1 && <Divider sx={{ my: 2 }} />}
                  </motion.div>
                ))}
              </Box>

              {/* Business Hours */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                  <TimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Horaires d'ouverture
                </Typography>
                <Box sx={{ pl: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Lundi - Vendredi:</strong> 8h00 - 18h00
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Samedi:</strong> 9h00 - 15h00
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Dimanche:</strong> Fermé
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card elevation={3}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
                  Envoyez-nous un message
                </Typography>
                
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nom complet *"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        disabled={isSubmitting}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email *"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        disabled={isSubmitting}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Sujet *"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        error={!!errors.subject}
                        helperText={errors.subject}
                        disabled={isSubmitting}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message *"
                        multiline
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        error={!!errors.message}
                        helperText={errors.message}
                        disabled={isSubmitting}
                        placeholder="Décrivez votre projet ou votre demande..."
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<SendIcon />}
                        disabled={isSubmitting}
                        sx={{
                          py: 1.5,
                          px: 4,
                          fontSize: '1.1rem',
                          fontWeight: 600
                        }}
                      >
                        {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Additional Information */}
      <Box sx={{ mt: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Pourquoi choisir FlashxShip ?
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <BusinessIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Expertise locale
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Plus de 10 ans d'expérience sur le marché
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <PhoneIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Support 24/7
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Assistance technique et commerciale disponible
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <LocationIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Livraison rapide
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Service de livraison dans toute la France
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Contact; 