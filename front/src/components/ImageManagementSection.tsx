import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Chip,
  useTheme,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ImageManagementSectionProps {
  title: string;
  existingImages: Array<{ id: number; image: string; image_url?: string }>;
  newImages: File[];
  onExistingImageRemove: (imageId: number) => void;
  onNewImageAdd: (files: FileList | null) => void;
  onNewImageRemove: (index: number) => void;
  maxImages?: number;
}

const ImageManagementSection: React.FC<ImageManagementSectionProps> = ({
  title,
  existingImages,
  newImages,
  onExistingImageRemove,
  onNewImageAdd,
  onNewImageRemove,
  maxImages = 5
}) => {
  const theme = useTheme();
  const totalImages = existingImages.length + newImages.length;
  const canAddMore = totalImages < maxImages;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && canAddMore) {
      onNewImageAdd(files);
    }
    // Réinitialiser l'input pour permettre la sélection du même fichier
    event.target.value = '';
  };

  const getImageUrl = (image: { image: string; image_url?: string }) => {
    return image.image_url || (image.image ? `http://localhost:8000${image.image}` : '/placeholders/placeholder-product.jpg');
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {title}
      </Typography>
      
      {/* Images existantes */}
      {existingImages.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
            Images existantes ({existingImages.length})
          </Typography>
          <Grid container spacing={2}>
            {existingImages.map((image) => (
              <Grid item xs={6} sm={4} md={3} key={image.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={getImageUrl(image)}
                      alt="Image existante"
                      sx={{ objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholders/placeholder-product.jpg';
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 0.5
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => onExistingImageRemove(image.id)}
                        sx={{
                          backgroundColor: 'error.main',
                          color: 'white',
                          '&:hover': { backgroundColor: 'error.dark' }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Chip
                      label="Existant"
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        backgroundColor: 'success.main',
                        color: 'white'
                      }}
                    />
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Nouvelles images */}
      {newImages.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
            Nouvelles images ({newImages.length})
          </Typography>
          <Grid container spacing={2}>
            {newImages.map((file, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={URL.createObjectURL(file)}
                      alt={`Nouvelle image ${index + 1}`}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 0.5
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => onNewImageRemove(index)}
                        sx={{
                          backgroundColor: 'error.main',
                          color: 'white',
                          '&:hover': { backgroundColor: 'error.dark' }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Chip
                      label="Nouveau"
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        backgroundColor: 'info.main',
                        color: 'white'
                      }}
                    />
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Zone d'ajout d'images */}
      <Box sx={{ mt: 2 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id={`image-upload-${title.toLowerCase().replace(/\s+/g, '-')}`}
          type="file"
          multiple
          onChange={handleFileChange}
          disabled={!canAddMore}
        />
        <label htmlFor={`image-upload-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          <Button
            variant="outlined"
            component="span"
            startIcon={<AddIcon />}
            disabled={!canAddMore}
            sx={{ mb: 1 }}
          >
            Ajouter des images
          </Button>
        </label>
        
        <Typography variant="caption" color="text.secondary" display="block">
          {canAddMore 
            ? `Vous pouvez ajouter jusqu'à ${maxImages - totalImages} image(s) supplémentaire(s)`
            : `Maximum ${maxImages} images atteint`
          }
        </Typography>
        
        <Typography variant="caption" color="text.secondary" display="block">
          Format accepté: JPG, PNG, GIF (max 5MB par image)
        </Typography>
      </Box>

      {/* Résumé */}
      <Paper sx={{ p: 2, mt: 2, backgroundColor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Résumé:</strong> {totalImages} image(s) au total 
          {existingImages.length > 0 && ` (${existingImages.length} existante(s), ${newImages.length} nouvelle(s))`}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ImageManagementSection;
