import React, { useState, useEffect } from 'react';
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
  ArrowForward as ArrowIcon,
  ShoppingCart as CartIcon,
  Build as BuildIcon,
  LocalShipping as ShippingIcon,
  Support as SupportIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../services/api';
import { Review } from '../types';
import ReviewsCarousel from '../components/ReviewsCarousel';
import ReviewForm from '../components/ReviewForm';

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [reviewFormOpen, setReviewFormOpen] = useState(false);

  // Fetch reviews
  const { data: reviews = [], refetch: refetchReviews } = useQuery({
    queryKey: ['reviews'],
    queryFn: reviewService.getAll
  });

  // Debug: Log des avis récupérés
  useEffect(() => {
    console.log('Reviews fetched:', reviews);
  }, [reviews]);

  const handleAddReview = () => {
    setReviewFormOpen(true);
  };

  const handleReviewSuccess = () => {
    refetchReviews();
  };

  const features = [
    {
      icon: <CartIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Achat en ligne',
      description: 'Commandez vos produits en quelques clics avec livraison rapide'
    },
    {
      icon: <BuildIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Location flexible',
      description: 'Louez des équipements spécialisés selon vos besoins avec des tarifs compétitifs'
    },
    {
      icon: <ShippingIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
      title: 'Livraison mondiale',
      description: 'Livraison du Bénin vers le monde entier avec suivi en temps réel'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Garantie qualité',
      description: 'Tous nos produits sont garantis et testés pour votre sécurité'
    }
  ];

  const stats = [
    { number: '5000+', label: 'Produits disponibles' },
    { number: reviews.length.toString(), label: 'Avis clients' },
    { number: '24h', label: 'Livraison mondiale' },
    { number: reviews.length > 0 ? Math.round((reviews.reduce((acc: number, review: Review) => acc + review.rating, 0) / reviews.length) * 20) + '%' : '99%', label: 'Taux de satisfaction' }
  ];

  return (
    <Box className="animate-fade-in">
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #000000 0%, #424242 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
        className="relative"
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    mb: 3,
                    fontWeight: 700,
                    color: 'white',
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' }
                  }}
                  className="text-gradient"
                >
                  FlashxShip
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    mb: 4,
                    color: 'white',
                    maxWidth: 600,
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                    opacity: 0.9
                  }}
                >
                  Votre partenaire de confiance pour l'équipement professionnel et des produits de qualité
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 6,
                    color: 'white',
                    maxWidth: 500,
                    opacity: 0.8,
                    fontSize: { xs: '1rem', md: '1.1rem' }
                  }}
                >
                  Découvrez notre gamme complète de produits à l'achat et d'équipements professionnels,
                  disponibles en location avec un service client d'exception.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    component={Link}
                    to="/products"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowIcon />}
                    sx={{
                      backgroundColor: 'white',
                      color: 'black',
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'grey.100',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                      }
                    }}
                    className="hover-lift"
                  >
                    Acheter maintenant
                  </Button>
                  <Button
                    component={Link}
                    to="/equipment"
                    variant="outlined"
                    size="large"
                    endIcon={<BuildIcon />}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                    className="hover-lift"
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
                  className="glass-effect"
                >
                  <Grid container spacing={3}>
                    {stats.map((stat, index) => (
                      <Grid item xs={6} key={index}>
                        <Box textAlign="center">
                          <Typography
                            variant="h3"
                            sx={{
                              fontWeight: 700,
                              color: 'white',
                              fontSize: { xs: '1.8rem', md: '2.5rem' }
                            }}
                          >
                            {stat.number}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'white',
                              opacity: 0.8,
                              fontSize: { xs: '0.8rem', md: '1rem' }
                            }}
                          >
                            {stat.label}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              mb: 3,
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Pourquoi choisir FlashxShip ?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.2rem' }
            }}
          >
            Nous offrons des solutions complètes pour tous vos besoins en équipement professionnel et des produits de qualité livrables partout dans le monde.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'grey.200',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      borderColor: 'primary.main'
                    }
                  }}
                  className="card-hover"
                >
                  <CardContent>
                    <Box sx={{ mb: 3 }}>
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        fontSize: { xs: '1.2rem', md: '1.4rem' }
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
          color: 'white',
          py: { xs: 6, md: 8 }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography
                variant="h3"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  fontSize: { xs: '1.8rem', md: '2.5rem' }
                }}
              >
                Prêt à équiper votre projet ?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  fontSize: { xs: '1rem', md: '1.2rem' }
                }}
              >
                Découvrez notre catalogue complet et trouvez l'équipement parfait pour vos besoins
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} textAlign={{ xs: 'center', md: 'right' }}>
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
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'grey.100',
                    transform: 'translateY(-2px)'
                  }
                }}
                className="hover-lift"
              >
                Voir nos produits
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Reviews Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              mb: 3,
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Ce que disent nos clients
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.2rem' }
            }}
          >
            La satisfaction de nos clients est notre priorité absolue
          </Typography>
        </Box>

        <ReviewsCarousel 
          reviews={reviews} 
          onAddReview={handleAddReview}
        />
      </Container>

      {/* Review Form Dialog */}
      <ReviewForm
        open={reviewFormOpen}
        onClose={() => setReviewFormOpen(false)}
        onSuccess={handleReviewSuccess}
      />
    </Box>
  );
};

export default Home;
