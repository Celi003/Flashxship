import React, { useState } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import { productCategoryService, productService, equipmentService } from '../services/api';

const TestAPI: React.FC = () => {
  const [results, setResults] = useState<{[key: string]: any}>({});
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});

  const testEndpoint = async (name: string, service: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    try {
      const data = await service();
      setResults(prev => ({ 
        ...prev, 
        [name]: { success: true, data, timestamp: new Date().toISOString() }
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setResults(prev => ({ 
        ...prev, 
        [name]: { success: false, error: errorMessage, timestamp: new Date().toISOString() }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const testAll = () => {
    testEndpoint('categories', productCategoryService.getAll);
    testEndpoint('products', productService.getAll);
    testEndpoint('equipment', equipmentService.getAll);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Test de l'API
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={testAll}
        sx={{ mb: 3 }}
      >
        Tester tous les endpoints
      </Button>

      {Object.entries(results).map(([name, result]) => (
        <Alert 
          key={name}
          severity={result.success ? 'success' : 'error'}
          sx={{ mb: 2 }}
        >
          <Typography variant="h6">{name}</Typography>
          <Typography variant="body2">
            {result.success ? (
              `Succès - Données reçues: ${Array.isArray(result.data) ? result.data.length : 'Object'} éléments`
            ) : (
              `Erreur: ${result.error}`
            )}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
            {result.timestamp}
          </Typography>
        </Alert>
      ))}

      {Object.values(loading).some(Boolean) && (
        <Alert severity="info">
          Test en cours...
        </Alert>
      )}
    </Box>
  );
};

export default TestAPI; 