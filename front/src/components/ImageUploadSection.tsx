import React from 'react';
import { Box, Typography, Grid, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

interface ImageUploadSectionProps {
  existingImages: Array<{ id: number; image: string; image_url?: string }>;
  newImages: File[];
  onRemoveExisting: (imageId: number) => void;
  onRemoveNew: (index: number) => void;
  onAddImages: (files: File[]) => void;
  maxImages?: number;
  placeholder?: string;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  existingImages,
  newImages,
  onRemoveExisting,
  onRemoveNew,
  onAddImages,
  maxImages = 5,
  placeholder = '/placeholders/placeholder-product.jpg'
}) => {
  const totalImages = existingImages.length + newImages.length;
  const remainingSlots = maxImages - totalImages;

  return (
    <Box sx={{ mt: 2 }}>
      {/* Images existantes */}
      {existingImages.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Images existantes ({existingImages.length}/{maxImages})
          </Typography>
          <Grid container spacing={1}>
            {existingImages.map((image) => (
              <Grid item key={image.id}>
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={image.image_url || (image.image ? `https://flashxship.onrender.com${image.image}` : placeholder)}
                    alt="Image existante"
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 4
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = placeholder;
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => onRemoveExisting(image.id)}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: 'error.main',
                      color: 'white',
                      '&:hover': { backgroundColor: 'error.dark' }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Nouvelles images */}
      {newImages.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Nouvelles images ({newImages.length})
          </Typography>
          <Grid container spacing={1}>
            {newImages.map((file, index) => (
              <Grid item key={index}>
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Nouvelle image ${index + 1}`}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 4
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => onRemoveNew(index)}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: 'error.main',
                      color: 'white',
                      '&:hover': { backgroundColor: 'error.dark' }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Ajout de nouvelles images */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          const files = Array.from((e.target as HTMLInputElement).files || []);
          const validFiles = files.filter((file): file is File => file !== undefined);
          
          if (validFiles.length + totalImages > maxImages) {
            toast.error(`Vous ne pouvez pas avoir plus de ${maxImages} images au total (existantes + nouvelles)`);
            return;
          }
          
          onAddImages(validFiles);
          // Reset input
          (e.target as HTMLInputElement).value = '';
        }}
        style={{ marginBottom: '8px' }}
      />
      <Typography variant="caption" color="text.secondary">
        Format accepté: JPG, PNG, GIF (max 5MB) - Ajoutez jusqu'à {remainingSlots} image(s) supplémentaire(s)
      </Typography>
    </Box>
  );
};

export default ImageUploadSection;
