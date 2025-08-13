import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const AuthStatus: React.FC = () => {
  const { user } = useAuth();
  const [authStatus, setAuthStatus] = useState<string>('Vérification...');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);


  const checkAuth = async () => {
    try {
  
      
      const response = await fetch('http://localhost:8000/test-auth/', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      
      
      if (response.ok) {
        const data = await response.json();
        setAuthStatus(`Connecté: ${data.user.username}`);
        setIsAuthenticated(true);

      } else {
        const errorData = await response.text();
        setAuthStatus(`Non connecté (${response.status})`);
        setIsAuthenticated(false);

      }
    } catch (error) {
      console.error('❌ Erreur de vérification:', error);
      setAuthStatus('Erreur de connexion');
      setIsAuthenticated(false);
      
    }
  };

  const testLogin = async () => {
    try {
  
      
      const response = await fetch('http://localhost:8000/auth/login/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'celib',
          password: 'celib123'
        })
      });
      
      
      
      if (response.ok) {
        const data = await response.json();
        
        checkAuth(); // Re-vérifier l'authentification
      } else {
        const errorData = await response.text();
        
      }
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
    }
  };



  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        🔍 Diagnostic d'authentification
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Frontend:</strong> {user ? `Connecté (${user.username})` : 'Non connecté'}
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Backend:</strong> {authStatus}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={checkAuth}
        >
          🔄 Vérifier
        </Button>
        
        <Button 
          variant="outlined" 
          size="small" 
          onClick={testLogin}
        >
          🔐 Test Connexion
        </Button>
        

      </Box>
      
      {!isAuthenticated && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          ⚠️ Problème d'authentification détecté
        </Alert>
      )}
    </Paper>
  );
};

export default AuthStatus; 