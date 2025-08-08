import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Alert
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Home as HomeIcon,
  ShoppingBag as OrdersIcon
} from '@mui/icons-material';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Success: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isStripeReturn, setIsStripeReturn] = useState(false);
  
  // Vérifier si c'est un retour de Stripe
  const sessionId = searchParams.get('session_id');
  
  useEffect(() => {
    if (sessionId) {
      setIsStripeReturn(true);
      toast.success('Paiement réussi ! Votre commande a été confirmée.');
    }
  }, [sessionId]);

  // Données de la commande (si pas de retour Stripe)
  const orderData = location.state;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
            
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
              {isStripeReturn ? 'Paiement réussi !' : 'Commande créée !'}
            </Typography>
            
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              {isStripeReturn 
                ? 'Votre paiement a été traité avec succès et votre commande est confirmée.'
                : 'Votre commande a été créée avec succès. Vous pouvez maintenant la payer depuis votre page "Mes commandes".'
              }
            </Typography>

            {isStripeReturn && sessionId && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Session de paiement: {sessionId}
              </Alert>
            )}

            {!isStripeReturn && orderData && (
              <Box sx={{ mb: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Détails de la commande
                </Typography>
                <Typography variant="body1">
                  Numéro de commande: #{orderData.orderId}
                </Typography>
                <Typography variant="body1">
                  Montant total: {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(orderData.totalAmount)}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/orders"
                variant="contained"
                size="large"
                startIcon={<OrdersIcon />}
              >
                Voir mes commandes
              </Button>
              <Button
                component={Link}
                to="/"
                variant="outlined"
                size="large"
                startIcon={<HomeIcon />}
              >
                Retour à l'accueil
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Success; 