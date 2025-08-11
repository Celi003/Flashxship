import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Receipt as OrdersIcon,
  LocalShipping as RentalsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleMenuClose();
  };

  const cartItemCount = items.length;

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo et navigation principale */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                     <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
               <img 
                 src="/logo.png" 
                 alt="FLASHXSHIP Logo" 
                 style={{ 
                   height: '40px', 
                   width: 'auto',
                   objectFit: 'contain'
                 }}
                 onError={(e) => {
                   // Fallback au texte si l'image ne charge pas
                   const target = e.target as HTMLImageElement;
                   target.style.display = 'none';
                 }}
               />
               <Typography 
                 variant="h4" 
                 sx={{ 
                   fontWeight: 700, 
                   color: theme.palette.text.primary,
                   fontFamily: '"Playfair Display", serif',
                   letterSpacing: '0.1em'
                 }}
               >
                 FLASHXSHIP
               </Typography>
             </Box>
           </Link>
          
          {!isMobile && (
            <Box sx={{ ml: 4, display: 'flex', gap: 2 }}>
              <Button 
                component={Link} 
                to="/products" 
                color="inherit"
                sx={{ 
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: theme.palette.grey[100]
                  }
                }}
              >
                Produits
              </Button>
              <Button 
                component={Link} 
                to="/equipment" 
                color="inherit"
                sx={{ 
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: theme.palette.grey[100]
                  }
                }}
              >
                Location
              </Button>
              <Button 
                component={Link} 
                to="/contact" 
                color="inherit"
                sx={{ 
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: theme.palette.grey[100]
                  }
                }}
              >
                Contact
              </Button>
            </Box>
          )}
        </Box>

        {/* Actions utilisateur */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Panier */}
          <IconButton 
            component={Link} 
            to="/cart" 
            color="inherit"
            sx={{ 
              position: 'relative',
              '&:hover': {
                backgroundColor: theme.palette.grey[100]
              }
            }}
          >
            <Badge badgeContent={cartItemCount} color="secondary">
              <CartIcon />
            </Badge>
          </IconButton>

          {user ? (
            <>
              {/* Menu utilisateur desktop */}
              {!isMobile && (
                <IconButton
                  onClick={handleProfileMenuOpen}
                  sx={{ 
                    ml: 1,
                    '&:hover': {
                      backgroundColor: theme.palette.grey[100]
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: theme.palette.primary.main,
                      fontSize: '0.875rem'
                    }}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              )}

              {/* Menu mobile */}
              {isMobile && (
                <IconButton
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
              )}
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                component={Link} 
                to="/login" 
                variant="outlined"
                size="small"
                sx={{ 
                  borderColor: theme.palette.grey[300],
                  color: theme.palette.text.primary,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.grey[50]
                  }
                }}
              >
                Connexion
              </Button>
              <Button 
                component={Link} 
                to="/register" 
                variant="contained"
                size="small"
                sx={{ 
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark
                  }
                }}
              >
                Inscription
              </Button>
            </Box>
          )}
        </Box>

        {/* Menu utilisateur desktop */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              boxShadow: theme.shadows[8],
              borderRadius: 2
            }
          }}
        >
          <MenuItem 
            component={Link} 
            to="/profile" 
            onClick={handleMenuClose}
            sx={{ py: 1.5 }}
          >
            <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
            Mon Profil
          </MenuItem>
          <MenuItem 
            component={Link} 
            to="/orders" 
            onClick={handleMenuClose}
            sx={{ py: 1.5 }}
          >
            <OrdersIcon sx={{ mr: 2, fontSize: 20 }} />
            Mes Commandes
          </MenuItem>
          <MenuItem 
            component={Link} 
            to="/rentals" 
            onClick={handleMenuClose}
            sx={{ py: 1.5 }}
          >
            <RentalsIcon sx={{ mr: 2, fontSize: 20 }} />
            Mes Locations
          </MenuItem>
          
          {user?.is_staff && (
            <>
              <Divider sx={{ my: 1 }} />
              <MenuItem 
                component={Link} 
                to="/admin" 
                onClick={handleMenuClose}
                sx={{ py: 1.5 }}
              >
                <AdminIcon sx={{ mr: 2, fontSize: 20 }} />
                Administration
              </MenuItem>
            </>
          )}
          
          <Divider sx={{ my: 1 }} />
          <MenuItem 
            onClick={handleLogout}
            sx={{ py: 1.5, color: theme.palette.error.main }}
          >
            <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
            Déconnexion
          </MenuItem>
        </Menu>

        {/* Menu mobile */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 250,
              boxShadow: theme.shadows[8],
              borderRadius: 2
            }
          }}
        >
          <MenuItem 
            component={Link} 
            to="/products" 
            onClick={handleMenuClose}
            sx={{ py: 1.5 }}
          >
            Produits
          </MenuItem>
          <MenuItem 
            component={Link} 
            to="/equipment" 
            onClick={handleMenuClose}
            sx={{ py: 1.5 }}
          >
            Location
          </MenuItem>
          <MenuItem 
            component={Link} 
            to="/contact" 
            onClick={handleMenuClose}
            sx={{ py: 1.5 }}
          >
            Contact
          </MenuItem>
          
          {user && (
            <>
              <Divider sx={{ my: 1 }} />
              <MenuItem 
                component={Link} 
                to="/profile" 
                onClick={handleMenuClose}
                sx={{ py: 1.5 }}
              >
                <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
                Mon Profil
              </MenuItem>
              <MenuItem 
                component={Link} 
                to="/orders" 
                onClick={handleMenuClose}
                sx={{ py: 1.5 }}
              >
                <OrdersIcon sx={{ mr: 2, fontSize: 20 }} />
                Mes Commandes
              </MenuItem>
              <MenuItem 
                component={Link} 
                to="/rentals" 
                onClick={handleMenuClose}
                sx={{ py: 1.5 }}
              >
                <RentalsIcon sx={{ mr: 2, fontSize: 20 }} />
                Mes Locations
              </MenuItem>
              
              {user?.is_staff && (
                <MenuItem 
                  component={Link} 
                  to="/admin" 
                  onClick={handleMenuClose}
                  sx={{ py: 1.5 }}
                >
                  <AdminIcon sx={{ mr: 2, fontSize: 20 }} />
                  Administration
                </MenuItem>
              )}
              
              <Divider sx={{ my: 1 }} />
              <MenuItem 
                onClick={handleLogout}
                sx={{ py: 1.5, color: theme.palette.error.main }}
              >
                <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                Déconnexion
              </MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 