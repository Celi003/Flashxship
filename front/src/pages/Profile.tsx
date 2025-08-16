import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Tabs,
  Tab,
  useTheme,
  TextField,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/api';
import toast from 'react-hot-toast';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile: React.FC = () => {
  const theme = useTheme();
  const { user, logout, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });

  // Mutation pour mettre à jour le profil
  const updateProfileMutation = useMutation({
    mutationFn: (data: { username: string; email: string }) => userService.updateProfile(data),
    onSuccess: (updatedUser) => {
      // Mettre à jour le contexte d'authentification
      updateUser(updatedUser);
      // Invalider les requêtes utilisateur
      queryClient.invalidateQueries({ queryKey: ['user'] });
      // Mettre à jour l'état local immédiatement
      setEditData({
        username: updatedUser.username || '',
        email: updatedUser.email || ''
      });
      toast.success('Profil mis à jour avec succès');
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Erreur lors de la mise à jour du profil');
    }
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Sauvegarder les changements
      updateProfileMutation.mutate(editData);
    } else {
      // Entrer en mode édition avec les données actuelles
      setEditData({
        username: user?.username || '',
        email: user?.email || ''
      });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      username: user?.username || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          Veuillez vous connecter pour accéder à votre profil
        </Typography>
      </Container>
    );
  }

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
            Mon Profil
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Gérez vos informations personnelles
          </Typography>
        </motion.div>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card elevation={3}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 3,
                    bgcolor: 'primary.main',
                    fontSize: '3rem'
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
                
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                  {user.username}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Membre depuis {new Date().getFullYear()}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {user.email}
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={logout}
                  fullWidth
                >
                  Se déconnecter
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Content Tabs */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card elevation={3}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab 
                    icon={<PersonIcon />} 
                    label="Informations" 
                    iconPosition="start"
                  />
                  <Tab 
                    icon={<SettingsIcon />} 
                    label="Paramètres" 
                    iconPosition="start"
                  />
                </Tabs>
              </Box>

              {/* Personal Information Tab */}
              <TabPanel value={tabValue} index={0}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Informations personnelles
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Nom d'utilisateur
                      </Typography>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          value={editData.username}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {user.username}
                        </Typography>
                      )}
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Email
                      </Typography>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          value={editData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          variant="outlined"
                          size="small"
                          type="email"
                        />
                      ) : (
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {user.email}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>

                  {isEditing && (
                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleEditToggle}
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancelEdit}
                        disabled={updateProfileMutation.isPending}
                      >
                        Annuler
                      </Button>
                    </Box>
                  )}

                  {!isEditing && (
                    <Box sx={{ mt: 3 }}>
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={handleEditToggle}
                      >
                        Modifier le profil
                      </Button>
                    </Box>
                  )}
                </Box>
              </TabPanel>

              {/* Settings Tab */}
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Paramètres du compte
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Les paramètres avancés seront disponibles prochainement.
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={logout}
                  >
                    Se déconnecter
                  </Button>
                </Box>
              </TabPanel>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 