import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Rating,
  Button,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Review } from '../types';

interface ReviewsCarouselProps {
  reviews: Review[];
  onAddReview?: () => void;
}

const ReviewsCarousel: React.FC<ReviewsCarouselProps> = ({ reviews, onAddReview }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    console.log('Setting up auto-play for', reviews.length, 'reviews');
    
    if (reviews.length > 1) {
      console.log('Starting auto-play timer');
      autoPlayRef.current = setInterval(() => {
        console.log('Auto-play: moving to next review');
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
      }, 5000);
    } else {
      console.log('Not enough reviews for auto-play');
    }

    return () => {
      if (autoPlayRef.current) {
        console.log('Clearing auto-play timer');
        clearInterval(autoPlayRef.current);
      }
    };
  }, [reviews.length]);

  // Log current review for debugging
  useEffect(() => {
    console.log('Current review index:', currentIndex, 'Total reviews:', reviews.length);
  }, [currentIndex, reviews.length]);

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  if (reviews.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Aucun avis pour le moment
        </Typography>
        {onAddReview && (
          <Button variant="contained" onClick={onAddReview}>
            Soyez le premier à laisser un avis !
          </Button>
        )}
      </Box>
    );
  }

  const currentReview = reviews[currentIndex];

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Navigation buttons */}
      {reviews.length > 1 && (
        <>
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: 'absolute',
              left: { xs: 8, md: -20 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: { xs: 8, md: -20 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </>
      )}

      {/* Review card */}
      <Box sx={{ px: { xs: 2, md: 4 } }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Card
              sx={{
                maxWidth: 600,
                mx: 'auto',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 60,
                      height: 60,
                      fontSize: '1.5rem',
                      mr: 2
                    }}
                  >
                    {currentReview.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {currentReview.name}
                    </Typography>
                    {currentReview.company && (
                      <Typography variant="body2" color="text.secondary">
                        {currentReview.company}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Rating
                  value={currentReview.rating}
                  readOnly
                  size="large"
                  icon={<StarIcon sx={{ color: theme.palette.primary.main }} />}
                  sx={{ mb: 3 }}
                />

                <Typography
                  variant="body1"
                  sx={{
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                    fontSize: '1.1rem',
                    mb: 2
                  }}
                >
                  "{currentReview.comment}"
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {new Date(currentReview.created_at).toLocaleDateString('fr-FR')}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Dots indicator */}
      {reviews.length > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 1 }}>
          {reviews.map((_, index) => (
            <Box
              key={index}
              onClick={() => handleDotClick(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: index === currentIndex ? 'primary.main' : 'grey.300',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: index === currentIndex ? 'primary.dark' : 'grey.400',
                },
              }}
            />
          ))}
        </Box>
      )}

      {/* Add review button */}
      {onAddReview && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={onAddReview}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Laissez votre avis
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ReviewsCarousel;
