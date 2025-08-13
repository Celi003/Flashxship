import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  useTheme
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
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 3, sm: 4 }}>
          {/* Logo et description */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontFamily: '"Playfair Display", serif',
                letterSpacing: '0.1em'
              }}
            >
              FLASHXSHIP
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6 }}>
              Votre partenaire de confiance pour l'achat et la location d'équipements professionnels.
              Qualité, fiabilité et service client au cœur de notre engagement.
            </Typography>

            {/* Réseaux sociaux */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                sx={{
                  color: theme.palette.grey[300],
                  '&:hover': { color: theme.palette.common.white }
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: theme.palette.grey[300],
                  '&:hover': { color: theme.palette.common.white }
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: theme.palette.grey[300],
                  '&:hover': { color: theme.palette.common.white }
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: theme.palette.grey[300],
                  '&:hover': { color: theme.palette.common.white }
                }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                href="/products"
                color="inherit"
                sx={{
                  textDecoration: 'none',
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
                  '&:hover': { color: theme.palette.common.white }
                }}
              >
                Maintenance
              </Link>
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                href="/contact"
                color="inherit"
                sx={{
                  textDecoration: 'none',
                  '&:hover': { color: theme.palette.common.white }
                }}
              >
                Contact
              </Link>
              <Link
                href="/contact"
                color="inherit"
                sx={{
                  textDecoration: 'none',
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
                  '&:hover': { color: theme.palette.common.white }
                }}
              >
                Garantie
              </Link>
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Contact
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EmailIcon sx={{ color: theme.palette.grey[400] }} />
                <Typography variant="body2">
                  contact@flashxship.co
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PhoneIcon sx={{ color: theme.palette.grey[400] }} />
                <Typography variant="body2">
                  +33 1 23 45 67 89
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationIcon sx={{ color: theme.palette.grey[400] }} />
                <Typography variant="body2">
                  123 Rue de la Technologie<br />
                  75001 Paris, France
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{
          borderTop: `1px solid ${theme.palette.grey[700]}`,
          mt: 4,
          pt: 3,
          textAlign: 'center'
        }}>
          <Typography variant="body2" color="grey.400">
            © {new Date().getFullYear()} FLASHXSHIP. Tous droits réservés.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 