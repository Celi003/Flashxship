import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    ShoppingCart as ShoppingCartIcon,
    Build as BuildIcon,
    LocalShipping as ShippingIcon,
    Security as SecurityIcon,
    Support as SupportIcon,
    Assessment as AssessmentIcon,
    Handyman as HandymanIcon,
    CheckCircle as CheckIcon,
    Phone as PhoneIcon,
    Email as EmailIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
    const mainServices = [
        {
            icon: <ShoppingCartIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
            title: 'Vente de produits',
            description: 'Large gamme de produits de qualité disponibles à l\'achat',
            features: [
                'Produits variés et authentiques',
                'Livraison rapide',
                'Tarifs abordables',
                'Disponibilité immédiate'
            ],
            color: 'primary.main'
        },
        {
            icon: <BuildIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
            title: 'Location d\'équipements',
            description: 'Solution flexible pour vos besoins temporaires ou ponctuels',
            features: [
                'Location courte et longue durée',
                'Maintenance incluse',
                'Livraison et reprise',
                'Tarifs dégressifs'
            ],
            color: 'secondary.main'
        },
        {
            icon: <ShippingIcon sx={{ fontSize: 48, color: 'info.main' }} />,
            title: 'Livraison express',
            description: 'Livraison dans toute la France avec suivi en temps réel',
            features: [
                'Couverture nationale',
                'Suivi en temps réel',
                'Créneaux de livraison flexibles',
                'Assurance transport'
            ],
            color: 'info.main'
        }
    ];

    const additionalServices = [
        {
            icon: <AssessmentIcon />,
            title: 'Audit d\'équipements',
            description: 'Évaluation complète de votre parc d\'équipements'
        },
        {
            icon: <SupportIcon />,
            title: 'Support technique',
            description: 'Assistance technique 24h/7j pour vos urgences'
        },
        {
            icon: <HandymanIcon />,
            title: 'Installation sur site',
            description: 'Mise en service et configuration par nos techniciens'
        },
        {
            icon: <SecurityIcon />,
            title: 'Assurance équipements',
            description: 'Solutions d\'assurance adaptées à vos besoins'
        }
    ];

    const sectors = [
        'BTP et Construction',
        'Industrie manufacturière',
        'Énergie et Utilities',
        'Transport et Logistique',
        'Agroalimentaire',
        'Santé et Pharmaceutique',
        'Collectivités publiques',
        'PME et Artisans'
    ];

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                    color: 'white',
                    py: { xs: 8, md: 12 },
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Container maxWidth="xl">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
                            <Typography
                                variant="h2"
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    mb: 3,
                                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' }
                                }}
                            >
                                Nos Services
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 4,
                                    opacity: 0.9,
                                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                    lineHeight: 1.6
                                }}
                            >
                                Solutions complètes pour vos produits de qualités supérieure et vos équipements professionnels
                            </Typography>
                            <Button
                                component={Link}
                                to="/contact"
                                variant="contained"
                                size="large"
                                sx={{
                                    backgroundColor: 'white',
                                    color: 'primary.main',
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    '&:hover': {
                                        backgroundColor: 'grey.100',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                Demander un devis
                            </Button>
                        </Box>
                    </motion.div>
                </Container>
            </Box>

            {/* Services principaux */}
            <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
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
                        sx={{
                            mb: 2,
                            fontWeight: 700,
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                        }}
                    >
                        Services Principaux
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        color="text.secondary"
                        sx={{ mb: 8, maxWidth: '600px', mx: 'auto' }}
                    >
                        Vente en ligne de tous types de produits avec un large catalogue accessible 24/7 <br />
                        Location d’équipements professionnels robustes et fiables <br />
                        Solutions flexibles et adaptées à vos besoins
                    </Typography>
                </motion.div>

                <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                    {mainServices.map((service, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card
                                    sx={{
                                        height: '100%',
                                        p: { xs: 2, sm: 3 },
                                        borderRadius: '16px',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                        border: `2px solid ${service.color}`,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                                            <Box
                                                sx={{
                                                    p: { xs: 1.5, sm: 2 },
                                                    borderRadius: '12px',
                                                    backgroundColor: `${service.color}15`,
                                                    mr: 2
                                                }}
                                            >
                                                {service.icon}
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography
                                                    variant="h5"
                                                    component="h3"
                                                    sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                                                >
                                                    {service.title}
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    color="text.secondary"
                                                    sx={{ lineHeight: 1.6, fontSize: { xs: '0.95rem', sm: '1rem' } }}
                                                >
                                                    {service.description}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <List dense sx={{ pl: 0 }}>
                                            {service.features.map((feature, featureIndex) => (
                                                <ListItem key={featureIndex} sx={{ px: 0 }}>
                                                    <ListItemIcon sx={{ minWidth: '32px' }}>
                                                        <CheckIcon sx={{ color: service.color, fontSize: 20 }} />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={feature}
                                                        sx={{
                                                            '& .MuiListItemText-primary': {
                                                                fontSize: { xs: '0.9rem', sm: '0.95rem' },
                                                                fontWeight: 500
                                                            }
                                                        }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Services additionnels */}
            <Box sx={{ backgroundColor: 'grey.50', py: { xs: 8, md: 12 } }}>
                <Container maxWidth="xl">
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
                            sx={{
                                mb: 8,
                                fontWeight: 700,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                            }}
                        >
                            Services Complémentaires
                        </Typography>
                    </motion.div>

                    <Grid container spacing={{ xs: 3, sm: 4 }}>
                        {additionalServices.map((service, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card
                                        sx={{
                                            height: '100%',
                                            p: 3,
                                            textAlign: 'center',
                                            borderRadius: '16px',
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.12)'
                                            }
                                        }}
                                    >
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    mb: 2,
                                                    p: 2,
                                                    borderRadius: '50%',
                                                    backgroundColor: 'primary.main',
                                                    color: 'white',
                                                    width: 64,
                                                    height: 64,
                                                    mx: 'auto',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {React.cloneElement(service.icon, { sx: { fontSize: 28 } })}
                                            </Box>
                                            <Typography
                                                variant="h6"
                                                component="h3"
                                                sx={{ fontWeight: 600, mb: 1 }}
                                            >
                                                {service.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ lineHeight: 1.6 }}
                                            >
                                                {service.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Secteurs d'activité */}
            <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
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
                        sx={{
                            mb: 2,
                            fontWeight: 700,
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                        }}
                    >
                        Secteurs d'Activité
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        color="text.secondary"
                        sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}
                    >
                        Nous intervenons dans de nombreux secteurs professionnels
                    </Typography>

                    <Grid container spacing={2} justifyContent="center">
                        {sectors.map((sector, index) => (
                            <Grid item key={index}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Chip
                                        label={sector}
                                        variant="outlined"
                                        sx={{
                                            px: 2,
                                            py: 1,
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            borderRadius: '25px',
                                            borderColor: 'primary.main',
                                            color: 'primary.main',
                                            '&:hover': {
                                                backgroundColor: 'primary.main',
                                                color: 'white'
                                            }
                                        }}
                                    />
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>

            {/* CTA Section */}
            <Box
                sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    py: { xs: 8, md: 12 }
                }}
            >
                <Container maxWidth="md">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography
                                variant="h4"
                                component="h2"
                                color="inherit"
                                sx={{
                                    mb: 3,
                                    fontWeight: 700,
                                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
                                }}
                            >
                                Besoin d'une solution sur mesure ?
                            </Typography>
                            <Typography
                                variant="h6"
                                color="inherit"
                                sx={{
                                    mb: 4,
                                    opacity: 0.9,
                                    fontSize: { xs: '1rem', sm: '1.1rem' }
                                }}
                            >
                                Nos experts sont à votre disposition pour étudier vos besoins spécifiques
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: 2,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Button
                                    component={Link}
                                    to="/contact"
                                    variant="contained"
                                    size="large"
                                    startIcon={<EmailIcon />}
                                    sx={{
                                        backgroundColor: 'white',
                                        color: 'primary.main',
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        '&:hover': {
                                            backgroundColor: 'grey.100',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    Demander un devis
                                </Button>

                                <Button
                                    href="tel:+33123456789"
                                    variant="outlined"
                                    size="large"
                                    startIcon={<PhoneIcon />}
                                    sx={{
                                        borderColor: 'white',
                                        color: 'white',
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        '&:hover': {
                                            borderColor: 'white',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    +33 1 23 45 67 89
                                </Button>
                            </Box>
                        </Box>
                    </motion.div>
                </Container>
            </Box>
        </Box>
    );
};

export default Services;
