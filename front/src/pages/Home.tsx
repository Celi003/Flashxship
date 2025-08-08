import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Build as BuildIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Star as StarIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// import StorageDebug from '../components/StorageDebug';

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <CartIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Achat en ligne',
      description: 'Commandez vos équipements professionnels en quelques clics avec livraison rapide'
    },
    {
      icon: <BuildIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Location flexible',
      description: 'Louez des équipements spécialisés selon vos besoins avec des tarifs compétitifs'
    },
         {
       icon: <ShippingIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
       title: 'Livraison express',
       description: 'Livraison dans toute la France avec suivi en temps réel'
     },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Garantie qualité',
      description: 'Tous nos produits sont garantis et testés pour votre sécurité'
    }
  ];

     const testimonials = [
     {
       name: 'Jean Dupont',
       company: 'Entreprise Construction',
       rating: 5,
       comment: 'Service exceptionnel ! Les équipements sont de qualité et la livraison est rapide.'
     },
     {
       name: 'Marie Martin',
       company: 'Société BTP',
       rating: 5,
       comment: 'FlashxShip est devenu notre partenaire de confiance pour tous nos projets.'
     },
     {
       name: 'Pierre Durand',
       company: 'Groupe Projet',
       rating: 5,
       comment: 'Prix compétitifs et service client remarquable. Je recommande vivement !'
     }
   ];

  return (
    <Box>
             {/* Debug Component - À retirer en production */}
       {/* <Container maxWidth="xl" sx={{ py: 2 }}>
         <StorageDebug />
       </Container> */}
      
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography variant="h2" component="h1" sx={{ mb: 3, fontWeight: 700, color: 'white' }}>
                  FlashxShip
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, color: 'white', maxWidth: 600 }}>
                  Votre partenaire de confiance pour l'équipement professionnel
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    component={Link}
                    to="/products"
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: 'white',
                      color: 'primary.main',
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'grey.100'
                      }
                    }}
                  >
                    Acheter maintenant
                  </Button>
                  <Button
                    component={Link}
                    to="/equipment"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Voir la location
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 4,
                    p: 4,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    Pourquoi choisir FlashxShip ?
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {features.map((feature, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {feature.icon}
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {feature.description}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{ mb: 6, fontWeight: 700 }}
          >
            Nos services
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      transition: 'transform 0.3s ease-in-out',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 8 }}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography variant="h3" component="h2" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
              Ce que disent nos clients
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                      "FlashxShip nous a fourni des équipements de qualité pour notre chantier. 
                      Service impeccable et livraison dans les délais."
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Jean Dupont
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Directeur de chantier
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                      "Location d'équipements simple et efficace. Prix compétitifs et support client réactif."
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Marie Martin
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Chef de projet
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Card sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                      "Équipements modernes et bien entretenus. Je recommande FlashxShip sans hésitation."
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Pierre Durand
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Entrepreneur
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                color: 'white',
                textAlign: 'center',
                p: 6
              }}
            >
              <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 700 }}>
                Prêt à commencer votre projet ?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Rejoignez des milliers de professionnels qui font confiance à FlashxShip
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  to="/products"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowIcon />}
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'grey.100'
                    }
                  }}
                >
                  Explorer les produits
                </Button>
                <Button
                  component={Link}
                  to="/contact"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Nous contacter
                </Button>
              </Box>
            </Card>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 