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
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Receipt as OrdersIcon,
  LocalShipping as RentalsIcon,
  Logout as LogoutIcon,
  Store as ProductsIcon,
  Build as EquipmentIcon,
  ContactMail as ContactIcon,
  WorkOutline as ServicesIcon
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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuClose = () => {
    setMobileDrawerOpen(false);
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
    <AppBar
      position="sticky"
      elevation={0}
      className="glass-effect border-b border-gray-200"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        color: 'text.primary'
      }}
    >
      <Toolbar
        className="justify-between px-4 sm:px-6 lg:px-8"
        sx={{
          justifyContent: 'space-between',
          minHeight: { xs: '56px', sm: '64px', md: '70px' },
          px: { xs: 1, sm: 2, md: 3, lg: 4 },
          gap: { xs: 1, sm: 2 }
        }}
      >
        {/* Logo et navigation principale */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          flex: { xs: 1, md: 'none' },
          minWidth: 0
        }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 2, md: 3 },
              minWidth: 0
            }}>
              <Box
                component="img"
                src="/logo.png"
                alt="FLASHXSHIP Logo"
                sx={{
                  height: { xs: 32, md: 40 },
                  width: 'auto',
                  objectFit: 'contain',
                  transition: 'transform 0.2s ease'
                }}
                onError={(e: any) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <Typography
                variant="h4"
                className="font-playfair font-bold text-gradient tracking-wide"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  fontFamily: '"Playfair Display", serif',
                  letterSpacing: '0.1em',
                  fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem', lg: '2rem' },
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                FLASHXSHIP
              </Typography>
            </Box>
          </Link>

          {!isMobile && (
            <Box className="ml-8 flex gap-1">
              <Button
                component={Link}
                to="/products"
                className="hover-lift px-4 py-2 rounded-lg transition-all"
                sx={{
                  fontWeight: 500,
                  color: 'text.primary',
                  borderRadius: '8px',
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Produits
              </Button>
              <Button
                component={Link}
                to="/equipment"
                className="hover-lift px-4 py-2 rounded-lg transition-all"
                sx={{
                  fontWeight: 500,
                  color: 'text.primary',
                  borderRadius: '8px',
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Location
              </Button>
              <Button
                component={Link}
                to="/services"
                className="hover-lift px-4 py-2 rounded-lg transition-all"
                sx={{
                  fontWeight: 500,
                  color: 'text.primary',
                  borderRadius: '8px',
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Services
              </Button>
              <Button
                component={Link}
                to="/contact"
                className="hover-lift px-4 py-2 rounded-lg transition-all"
                sx={{
                  fontWeight: 500,
                  color: 'text.primary',
                  borderRadius: '8px',
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Contact
              </Button>
            </Box>
          )}
        </Box>

        {/* Actions utilisateur */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0.5, sm: 1, md: 2 },
          flexShrink: 0
        }}>
          {/* Panier */}
          <IconButton
            component={Link}
            to="/cart"
            sx={{
              position: 'relative',
              color: 'text.primary',
              p: { xs: 1, sm: 1.5 },
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Badge
              badgeContent={cartItemCount}
              color="secondary"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: { xs: '0.6rem', sm: '0.75rem' },
                  minWidth: { xs: '16px', sm: '18px' },
                  height: { xs: '16px', sm: '18px' }
                }
              }}
            >
              <CartIcon sx={{ fontSize: { xs: '20px', sm: '24px' } }} />
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
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 28, sm: 32 },
                      height: { xs: 28, sm: 32 },
                      bgcolor: theme.palette.primary.main,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      border: '2px solid rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              )}

              {/* Bouton menu mobile */}
              {isMobile && (
                <IconButton
                  onClick={handleMobileDrawerToggle}
                  sx={{
                    color: 'text.primary',
                    p: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.05)'
                    }
                  }}
                >
                  <MenuIcon sx={{ fontSize: '24px' }} />
                </IconButton>
              )}
            </>
          ) : (
            <>
              {!isMobile ? (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: theme.palette.grey[300],
                      color: theme.palette.text.primary,
                      fontSize: { sm: '0.75rem', md: '0.875rem' },
                      px: { sm: 1.5, md: 2 },
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
                      fontSize: { sm: '0.75rem', md: '0.875rem' },
                      px: { sm: 1.5, md: 2 },
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark
                      }
                    }}
                  >
                    Inscription
                  </Button>
                </Box>
              ) : (
                <IconButton
                  onClick={handleMobileDrawerToggle}
                  sx={{
                    color: 'text.primary',
                    p: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.05)'
                    }
                  }}
                >
                  <MenuIcon sx={{ fontSize: '24px' }} />
                </IconButton>
              )}
            </>
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

        {/* Menu mobile - Drawer */}
        <Drawer
          anchor="right"
          open={mobileDrawerOpen}
          onClose={handleMobileMenuClose}
          PaperProps={{
            sx: {
              width: { xs: '100%', sm: 300 },
              maxWidth: '100vw',
              backgroundColor: 'background.paper',
              borderRadius: { xs: 0, sm: '16px 0 0 16px' }
            }
          }}
        >
          <Box sx={{ width: '100%', height: '100%' }}>
            {/* En-tête du drawer */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'grey.50'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Menu
              </Typography>
              <IconButton
                onClick={handleMobileMenuClose}
                sx={{ color: 'text.secondary' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <List sx={{ py: 0 }}>
              {/* Section Navigation */}
              <ListSubheader sx={{ py: 1, fontWeight: 600 }}>
                Navigation
              </ListSubheader>

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/products"
                  onClick={handleMobileMenuClose}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon>
                    <ProductsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Produits" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/equipment"
                  onClick={handleMobileMenuClose}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon>
                    <EquipmentIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Location" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/contact"
                  onClick={handleMobileMenuClose}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon>
                    <ContactIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Contact" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/services"
                  onClick={handleMobileMenuClose}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon>
                    <ServicesIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Services" />
                </ListItemButton>
              </ListItem>

              {user ? (
                <>
                  {/* Section Compte */}
                  <Divider sx={{ my: 1 }} />
                  <ListSubheader sx={{ py: 1, fontWeight: 600 }}>
                    Mon Compte
                  </ListSubheader>

                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/profile"
                      onClick={handleMobileMenuClose}
                      sx={{ py: 1.5 }}
                    >
                      <ListItemIcon>
                        <PersonIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Mon Profil" />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/orders"
                      onClick={handleMobileMenuClose}
                      sx={{ py: 1.5 }}
                    >
                      <ListItemIcon>
                        <OrdersIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Mes Commandes" />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/rentals"
                      onClick={handleMobileMenuClose}
                      sx={{ py: 1.5 }}
                    >
                      <ListItemIcon>
                        <RentalsIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Mes Locations" />
                    </ListItemButton>
                  </ListItem>

                  {user?.is_staff && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <ListSubheader sx={{ py: 1, fontWeight: 600 }}>
                        Administration
                      </ListSubheader>
                      <ListItem disablePadding>
                        <ListItemButton
                          component={Link}
                          to="/admin"
                          onClick={handleMobileMenuClose}
                          sx={{ py: 1.5 }}
                        >
                          <ListItemIcon>
                            <AdminIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary="Administration" />
                        </ListItemButton>
                      </ListItem>
                    </>
                  )}

                  <Divider sx={{ my: 1 }} />
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => {
                        handleLogout();
                        handleMobileMenuClose();
                      }}
                      sx={{ py: 1.5 }}
                    >
                      <ListItemIcon>
                        <LogoutIcon color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Déconnexion"
                        sx={{ color: 'error.main' }}
                      />
                    </ListItemButton>
                  </ListItem>
                </>
              ) : (
                <>
                  <Divider sx={{ my: 1 }} />
                  <ListSubheader sx={{ py: 1, fontWeight: 600 }}>
                    Connexion
                  </ListSubheader>

                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/login"
                      onClick={handleMobileMenuClose}
                      sx={{ py: 1.5 }}
                    >
                      <ListItemText primary="Se connecter" />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/register"
                      onClick={handleMobileMenuClose}
                      sx={{
                        py: 1.5,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        mx: 2,
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: 'primary.dark'
                        }
                      }}
                    >
                      <ListItemText
                        primary="S'inscrire"
                        sx={{ textAlign: 'center' }}
                      />
                    </ListItemButton>
                  </ListItem>
                </>
              )}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 