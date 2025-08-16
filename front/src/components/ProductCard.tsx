import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
    Chip,
    IconButton,
    useTheme
} from '@mui/material';
import {
    ShoppingCart as CartIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ProductCardProps {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    images?: Array<{ id: number; image: string; image_url?: string }>;
    category: string;
    isAvailable: boolean;
    isFavorite?: boolean;
    onAddToCart?: (id: number) => void;
    onToggleFavorite?: (id: number) => void;
    onViewDetails?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    description,
    price,
    image,
    images,
    category,
    isAvailable,
    isFavorite = false,
    onAddToCart,
    onToggleFavorite,
    onViewDetails
}) => {
    const theme = useTheme();

    // Déterminer l'image à afficher
    const displayImage = images && images.length > 0 
        ? (images[0].image_url || (images[0].image ? `https://flashxship.onrender.com${images[0].image}` : '/placeholders/placeholder-product.jpg'))
        : (image || '/placeholders/placeholder-product.jpg');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -8 }}
        >
            <Card
                className="product-card"
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    minHeight: '500px', // Hauteur minimale fixe
                    '&:hover': {
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                        '& .product-image': {
                            transform: 'scale(1.05)'
                        },
                        '& .product-actions': {
                            opacity: 1,
                            transform: 'translateY(0)'
                        }
                    }
                }}
            >
                {/* Image Container */}
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                        component="img"
                        className="product-image"
                        sx={{
                            height: 240,
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                        }}
                        image={displayImage}
                        alt={name}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholders/placeholder-product.jpg';
                        }}
                    />

                    {/* Overlay Actions */}
                    <Box
                        className="product-actions"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            opacity: 0,
                            transform: 'translateY(10px)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <IconButton
                            onClick={() => onViewDetails?.(id)}
                            sx={{
                                backgroundColor: 'white',
                                color: 'primary.main',
                                '&:hover': { backgroundColor: 'grey.100' }
                            }}
                        >
                            <ViewIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => onToggleFavorite?.(id)}
                            sx={{
                                backgroundColor: 'white',
                                color: isFavorite ? 'secondary.main' : 'text.secondary',
                                '&:hover': { backgroundColor: 'grey.100' }
                            }}
                        >
                            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                    </Box>

                    {/* Category Badge */}
                    <Chip
                        label={category}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            backgroundColor: 'white',
                            fontWeight: 600,
                            fontSize: '0.75rem'
                        }}
                    />

                    {/* Availability Badge */}
                    <Chip
                        label={isAvailable ? 'Disponible' : 'Rupture'}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            backgroundColor: isAvailable ? 'success.main' : 'error.main',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.75rem'
                        }}
                    />
                </Box>

                {/* Content */}
                <CardContent className="card-content" sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                            fontWeight: 600,
                            mb: 1,
                            fontSize: '1.1rem',
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}
                    >
                        {name}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 2,
                            lineHeight: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}
                    >
                        {description}
                    </Typography>

                    {/* Price and Action */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: 'primary.main',
                                fontSize: '1.25rem'
                            }}
                        >
                            {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'EUR'
                            }).format(price)}
                        </Typography>

                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<CartIcon />}
                            disabled={!isAvailable}
                            onClick={() => onAddToCart?.(id)}
                            sx={{
                                borderRadius: '8px',
                                fontWeight: 600,
                                px: 2,
                                py: 1,
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
                                }
                            }}
                        >
                            Ajouter
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ProductCard;
