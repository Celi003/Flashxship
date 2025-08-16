import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Link
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ModernForm from '../components/ModernForm';
import apiClient from '../services/api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const registerFields = [
    {
      name: 'username',
      label: 'Nom d\'utilisateur',
      type: 'text' as const,
      required: true
    },
    {
      name: 'email',
      label: 'Adresse email',
      type: 'email' as const,
      required: true
    },
    {
      name: 'password',
      label: 'Mot de passe',
      type: 'password' as const,
      required: true
    },
    {
      name: 'password2',
      label: 'Confirmer le mot de passe',
      type: 'password' as const,
      required: true
    }
  ];

  const handleSubmit = async (formData: Record<string, string>) => {
    // Validation côté client
    if (formData.password !== formData.password2) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Inscription
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.password2
      };

      await apiClient.post('/register/', registerData);

      // Connexion automatique après inscription
      await login(formData.username, formData.password);

      toast.success('Compte créé avec succès !');
      navigate('/', { replace: true });

    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);

      if (error.response?.data) {
        const errorData = error.response.data;

        // Gestion des erreurs spécifiques du backend
        if (errorData.username) {
          setError(`Nom d'utilisateur: ${errorData.username[0]}`);
        } else if (errorData.email) {
          setError(`Email: ${errorData.email[0]}`);
        } else if (errorData.password) {
          setError(`Mot de passe: ${errorData.password[0]}`);
        } else if (errorData.non_field_errors) {
          setError(errorData.non_field_errors[0]);
        } else {
          setError('Erreur lors de la création du compte');
        }
      } else {
        setError('Erreur lors de la création du compte');
      }

      toast.error('Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ModernForm
            title="Créer un compte"
            subtitle="Rejoignez la communauté FlashxShip"
            fields={registerFields}
            submitLabel="Créer mon compte"
            loading={loading}
            error={error}
            showTerms={true}
            onSubmit={handleSubmit}
          />

          {/* Additional Links */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="white">
              Déjà un compte ?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Se connecter
              </Link>
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Register;