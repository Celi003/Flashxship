import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  useTheme,
  Divider
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.grey[100],
        py: { xs: 3, md: 4 },
        mt: 'auto',
        position: 'relative'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Logo et description - Colonne principale */}
          <Grid item xs={12} md={5}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontFamily: '"Playfair Display", serif',
                  letterSpacing: '0.1em',
                  fontSize: { xs: '1.4rem', md: '1.6rem' }
                }}
              >
                FLASHXSHIP
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1.5,
                  color: theme.palette.grey[300],
                  mb: 2,
                  maxWidth: '280px'
                }}
              >
                Votre partenaire de confiance pour l'achat et la location d'équipements professionnels. 
                Qualité, fiabilité et service client au cœur de notre engagement.
              </Typography>
            </Box>

            {/* Réseaux sociaux - Repositionnés sous la description */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                sx={{
                  color: theme.palette.grey[400],
                  '&:hover': {
                    color: theme.palette.common.white,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: theme.palette.grey[400],
                  '&:hover': {
                    color: theme.palette.common.white,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: theme.palette.grey[400],
                  '&:hover': {
                    color: theme.palette.common.white,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: theme.palette.grey[400],
                  '&:hover': {
                    color: theme.palette.common.white,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Services - Colonne compacte */}
          <Grid item xs={6} md={2}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                fontWeight: 600,
                fontSize: { xs: '0.9rem', md: '1rem' }
              }}
            >
              Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Link
                href="/products"
                color="inherit"
                sx={{
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  '&:hover': { color: theme.palette.common.white }
                }}
              >
                Vente d'équipements
              </Link>
              <Link
                href="/equipment"
                color="inherit"
                sx={{
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  '&:hover': { color: theme.palette.common.white }
                }}
              >
                Location d'équipements
              </Link>
              <Link
                href="/contact"
                color="inherit"
                sx={{
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  '&:hover': { color: theme.palette.common.white }
                }}
              >
                Service client
              </Link>
              <Link
                href="/contact"
                color="inherit"
                sx={{
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  '&:hover': { color: theme.palette.common.white }
                }}
              >
                Maintenance
              </Link>
            </Box>
          </Grid>

          {/* Support - Colonne compacte */}
          <Grid item xs={6} md={2}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                fontWeight: 600,
                fontSize: { xs: '0.9rem', md: '1rem' }
              }}
            >
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Link
                href="/contact"
                color="inherit"
                sx={{
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  '&:hover': { color: theme.palette.common.white }
                }}
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                color="inherit"
                sx={{
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  '&:hover': { color: theme.palette.common.white }
                }}
              >
                Assistance technique
              </Link>
              <Link
                href="/contact"
                color="inherit"
                sx={{
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  '&:hover': { color: theme.palette.common.white }
                }}
              >
                Garantie
              </Link>
              <Link
                href="/contact"
                color="inherit"
                sx={{
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  '&:hover': { color: theme.palette.common.white }
                }}
              >
                Contact
              </Link>
            </Box>
          </Grid>

          {/* Contact - Colonne compacte */}
          <Grid item xs={12} md={3}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                fontWeight: 600,
                fontSize: { xs: '0.9rem', md: '1rem' }
              }}
            >
              Contact
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmailIcon sx={{ color: theme.palette.grey[400], fontSize: '1.1rem' }} />
                <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                  contact@flashxship.co
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PhoneIcon sx={{ color: theme.palette.grey[400], fontSize: '1.1rem' }} />
                <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                  +33 1 23 45 67 89
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <LocationIcon sx={{ color: theme.palette.grey[400], fontSize: '1.1rem', mt: 0.1 }} />
                <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.3 }}>
                  123 Rue de la Technologie<br />
                  75001 Paris, France
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright - Séparateur plus fin */}
        <Box sx={{
          borderTop: `1px solid ${theme.palette.grey[700]}`,
          mt: 3,
          pt: 2,
          textAlign: 'center'
        }}>
          <Typography variant="body2" color="grey.400" sx={{ fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} FLASHXSHIP. Tous droits réservés.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 