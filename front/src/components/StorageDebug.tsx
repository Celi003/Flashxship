import React from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  Divider
} from '@mui/material';
import { clearAllStorage, clearAppData, checkStorageData } from '../utils/clearStorage';

const StorageDebug: React.FC = () => {
  const [storageData, setStorageData] = React.useState<any>(null);

  const handleCheckStorage = () => {
    const data = checkStorageData();
    setStorageData(data);
  };

  const handleClearAppData = () => {
    clearAppData();
    handleCheckStorage();
  };

  const handleClearAllStorage = () => {
    clearAllStorage();
    setStorageData(null);
    // Recharger la page pour s'assurer que tout est bien nettoyé
    window.location.reload();
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🔧 Debug - Gestion du Stockage
        </Typography>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Si vous avez réinitialisé la base de données mais que vous voyez encore des données 
            (utilisateur connecté, panier, etc.), utilisez ces boutons pour nettoyer le stockage local.
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined" 
            onClick={handleCheckStorage}
            size="small"
          >
            Vérifier le stockage
          </Button>
          
          <Button 
            variant="outlined" 
            color="warning"
            onClick={handleClearAppData}
            size="small"
          >
            Nettoyer données app
          </Button>
          
          <Button 
            variant="contained" 
            color="error"
            onClick={handleClearAllStorage}
            size="small"
          >
            Nettoyer TOUT
          </Button>
        </Box>

        {storageData && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Données actuelles :
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  localStorage ({Object.keys(storageData.localStorageData).length} éléments)
                </Typography>
                <pre style={{ 
                  fontSize: '12px', 
                  backgroundColor: '#f5f5f5', 
                  padding: '8px', 
                  borderRadius: '4px',
                  maxHeight: '200px',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(storageData.localStorageData, null, 2)}
                </pre>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  sessionStorage ({Object.keys(storageData.sessionStorageData).length} éléments)
                </Typography>
                <pre style={{ 
                  fontSize: '12px', 
                  backgroundColor: '#f5f5f5', 
                  padding: '8px', 
                  borderRadius: '4px',
                  maxHeight: '200px',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(storageData.sessionStorageData, null, 2)}
                </pre>
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StorageDebug; 