import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const AuthStatus: React.FC = () => {
  const { user } = useAuth();
  const [authStatus, setAuthStatus] = useState<string>('Vérification...');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  const checkAuth = async () => {
    try {
      console.log('🔍 Vérification de l\'authentification...');
      
      const response = await fetch('http://localhost:8000/test-auth/', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('📡 Réponse du serveur:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        setAuthStatus(`Connecté: ${data.user.username}`);
        setIsAuthenticated(true);
        setDebugInfo({
          status: response.status,
          user: data.user,
          cookies: document.cookie
        });
      } else {
        const errorData = await response.text();
        setAuthStatus(`Non connecté (${response.status})`);
        setIsAuthenticated(false);
        setDebugInfo({
          status: response.status,
          error: errorData,
          cookies: document.cookie
        });
      }
    } catch (error) {
      console.error('❌ Erreur de vérification:', error);
      setAuthStatus('Erreur de connexion');
      setIsAuthenticated(false);
      setDebugInfo({
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        cookies: document.cookie
      });
    }
  };

  const testLogin = async () => {
    try {
      console.log('🔐 Test de connexion...');
      
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
      
      console.log('📡 Réponse de connexion:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Connexion réussie:', data);
        checkAuth(); // Re-vérifier l'authentification
      } else {
        const errorData = await response.text();
        console.log('❌ Échec de connexion:', errorData);
      }
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
    }
  };

  const testDebug = async () => {
    try {
      console.log('🔍 Test de débogage...');
      
      const response = await fetch('http://localhost:8000/test-auth-debug/', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('📡 Réponse de débogage:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Données de débogage:', data);
        setDebugInfo(data);
      } else {
        const errorData = await response.text();
        console.log('❌ Erreur de débogage:', errorData);
      }
    } catch (error) {
      console.error('❌ Erreur de débogage:', error);
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
        
        <Button 
          variant="outlined" 
          size="small" 
          onClick={testDebug}
        >
          🔍 Debug
        </Button>
      </Box>
      
      {!isAuthenticated && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          ⚠️ Problème d'authentification détecté
        </Alert>
      )}
      
      <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
          Informations de débogage:
        </Typography>
        <pre style={{ fontSize: '10px', margin: '4px 0', whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </Box>
    </Paper>
  );
};

export default AuthStatus; 