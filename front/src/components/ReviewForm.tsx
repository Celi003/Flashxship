import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Box,
  Typography,
  Alert,
  useTheme
} from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';
import { reviewService } from '../services/api';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ open, onClose, onSuccess }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Submitting review:', formData);

    try {
      const result = await reviewService.create(formData);
      console.log('Review created successfully:', result);
      toast.success('Votre avis a été soumis avec succès !');
      setFormData({ name: '', email: '', company: '', rating: 5, comment: '' });
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Error creating review:', error);
      setError(error.response?.data?.message || 'Erreur lors de la soumission de l\'avis');
      toast.error('Erreur lors de la soumission de l\'avis');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Laissez votre avis
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Partagez votre expérience avec FlashxShip
        </Typography>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Note *
            </Typography>
            <Rating
              value={formData.rating}
              onChange={(_, value) => handleChange('rating', value || 5)}
              size="large"
              icon={<StarIcon sx={{ color: theme.palette.primary.main }} />}
              sx={{ 
                mb: 3,
                '& .MuiRating-root': {
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none'
                  }
                }
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {formData.rating} étoile{formData.rating > 1 ? 's' : ''}
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Nom complet *"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '&:focus-within': {
                  outline: 'none',
                  boxShadow: 'none'
                }
              }
            }}
          />

          <TextField
            fullWidth
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '&:focus-within': {
                  outline: 'none',
                  boxShadow: 'none'
                }
              }
            }}
          />

          <TextField
            fullWidth
            label="Entreprise (optionnel)"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '&:focus-within': {
                  outline: 'none',
                  boxShadow: 'none'
                }
              }
            }}
          />

          <TextField
            fullWidth
            label="Votre avis *"
            multiline
            rows={4}
            value={formData.comment}
            onChange={(e) => handleChange('comment', e.target.value)}
            required
            placeholder="Partagez votre expérience avec nos produits et services..."
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:focus-within': {
                  outline: 'none',
                  boxShadow: 'none'
                }
              }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formData.name || !formData.email || !formData.comment}
            sx={{ minWidth: 120 }}
          >
            {loading ? 'Envoi...' : 'Envoyer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ReviewForm;
