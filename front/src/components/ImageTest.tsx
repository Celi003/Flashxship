import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Button } from '@mui/material';

interface ImageTestProps {
  imageUrl?: string;
  fallbackUrl: string;
  title: string;
}

const ImageTest: React.FC<ImageTestProps> = ({ imageUrl, fallbackUrl, title }) => {
  const [currentUrl, setCurrentUrl] = useState(imageUrl || fallbackUrl);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (imageUrl) {
      setCurrentUrl(imageUrl);
      setStatus('loading');
      
      const img = new Image();
      img.onload = () => {
        console.log(`✅ Image loaded successfully: ${imageUrl}`);
        setStatus('success');
      };
      img.onerror = () => {
        console.log(`❌ Image failed to load: ${imageUrl}`);
        setStatus('error');
        setCurrentUrl(fallbackUrl);
      };
      img.src = imageUrl;
    }
  }, [imageUrl, fallbackUrl]);

  return (
    <Card sx={{ maxWidth: 300, m: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={currentUrl}
        alt={title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Status: {status}
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          URL: {currentUrl}
        </Typography>
        <Button 
          size="small" 
          onClick={() => {
            console.log('Testing image URL:', currentUrl);
            window.open(currentUrl, '_blank');
          }}
          sx={{ mt: 1 }}
        >
          Test URL
        </Button>
      </CardContent>
    </Card>
  );
};

export default ImageTest;
