import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Link
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ModernForm from '../components/ModernForm';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const loginFields = [
    {
      name: 'username',
      label: 'Nom d\'utilisateur',
      type: 'text' as const,
      required: true
    },
    {
      name: 'password',
      label: 'Mot de passe',
      type: 'password' as const,
      required: true
    }
  ];

  const handleSubmit = async (formData: Record<string, string>) => {
    setLoading(true);
    setError('');

    try {
      await login(formData.username, formData.password);
      toast.success('Connexion réussie !');

      // Check if user is admin/superuser and redirect accordingly
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.is_superuser || user.is_staff) {
          navigate('/admin', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Erreur lors de la connexion');
      toast.error('Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
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
            title="Connexion"
            subtitle="Connectez-vous à votre compte FlashxShip"
            fields={loginFields}
            submitLabel="Se connecter"
            loading={loading}
            error={error}
            onSubmit={handleSubmit}
          />

          {/* Additional Links */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Pas encore de compte ?{' '}
              <Link
                component={RouterLink}
                to="/register"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Créer un compte
              </Link>
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;