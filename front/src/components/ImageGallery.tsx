import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ZoomIn as ZoomInIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryProps {
  images: Array<{ id: number; image: string; image_url?: string }>;
  title?: string;
  maxHeight?: number;
  maxWidth?: number;
  showNavigation?: boolean;
  showZoom?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  title,
  maxHeight = 150,
  maxWidth = 200,
  showNavigation = true,
  showZoom = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!images || images.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Aucune image disponible
        </Typography>
      </Box>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const currentImage = images[currentIndex];
  const displayImage = currentImage.image_url || 
    (currentImage.image ? `http://localhost:8000${currentImage.image}` : '/placeholders/placeholder-equipment.jpg');

  return (
    <Box sx={{ width: '100%' }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}

      {/* Main Image Display */}
      <Box sx={{ position: 'relative', mb: 2 }}>
        <Paper
          elevation={2}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 2,
            maxHeight: maxHeight,
            maxWidth: maxWidth,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey.100'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={displayImage}
                alt={`Image ${currentIndex + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  (e.target as HTMLImageElement).src = '/placeholders/placeholder-equipment.jpg';
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {showNavigation && images.length > 1 && (
            <>
              <IconButton
                onClick={previousImage}
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
                size="small"
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                onClick={nextImage}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
                size="small"
              >
                <ChevronRightIcon />
              </IconButton>
            </>
          )}

          {/* Zoom Button */}
          {showZoom && (
            <IconButton
              onClick={toggleZoom}
              sx={{
                position: 'absolute',
                right: showNavigation && images.length > 1 ? 56 : 8,
                top: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }
              }}
              size="small"
            >
              <ZoomInIcon />
            </IconButton>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.75rem'
              }}
            >
              {currentIndex + 1} / {images.length}
            </Box>
          )}
        </Paper>
      </Box>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {images.map((image, index) => {
            const thumbImage = image.image_url || 
              (image.image ? `http://localhost:8000${image.image}` : '/placeholders/placeholder-equipment.jpg');
            
            return (
              <Grid item key={image.id}>
                <Paper
                  elevation={1}
                  sx={{
                    cursor: 'pointer',
                    border: index === currentIndex ? 2 : 1,
                    borderColor: index === currentIndex ? 'primary.main' : 'grey.300',
                    overflow: 'hidden',
                    borderRadius: 1,
                    width: isMobile ? 60 : 80,
                    height: isMobile ? 60 : 80
                  }}
                  onClick={() => goToImage(index)}
                >
                  <img
                    src={thumbImage}
                    alt={`Thumbnail ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      (e.target as HTMLImageElement).src = '/placeholders/placeholder-equipment.jpg';
                    }}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Full Screen Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              zIndex: 1300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20
            }}
          >
            <Box
              sx={{
                position: 'relative',
                maxWidth: '90vw',
                maxHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={displayImage}
                alt={`Image ${currentIndex + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  (e.target as HTMLImageElement).src = '/placeholders/placeholder-equipment.jpg';
                }}
              />
              
              <IconButton
                onClick={toggleZoom}
                sx={{
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  color: 'white',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ImageGallery;
