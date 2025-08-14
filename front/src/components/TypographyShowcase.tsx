import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Chip
} from '@mui/material';
import { motion } from 'framer-motion';

const TypographyShowcase: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Card
                    sx={{
                        p: 4,
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
                    }}
                >
                    <CardContent>
                        <Typography variant="h2" component="h1" sx={{ mb: 3, color: 'primary.main' }}>
                            Police Poppins en Action
                        </Typography>

                        <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
                            Titres et Headers
                        </Typography>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h1" sx={{ mb: 1 }}>H1 - Poppins Bold</Typography>
                            <Typography variant="h2" sx={{ mb: 1 }}>H2 - Poppins SemiBold</Typography>
                            <Typography variant="h3" sx={{ mb: 1 }}>H3 - Poppins SemiBold</Typography>
                            <Typography variant="h4" sx={{ mb: 1 }}>H4 - Poppins SemiBold</Typography>
                            <Typography variant="h5" sx={{ mb: 1 }}>H5 - Poppins SemiBold</Typography>
                            <Typography variant="h6" sx={{ mb: 1 }}>H6 - Poppins SemiBold</Typography>
                        </Box>

                        <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
                            Corps de Texte
                        </Typography>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Ceci est un paragraphe avec la police Poppins. Cette police moderne et lisible
                                améliore considérablement l'expérience utilisateur grâce à ses formes arrondies
                                et sa grande lisibilité sur tous les écrans.
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Texte secondaire avec Poppins - parfait pour les descriptions et les informations
                                complémentaires. La police maintient sa lisibilité même en petite taille.
                            </Typography>
                        </Box>

                        <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
                            Boutons et Éléments Interactifs
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                            <Button variant="contained" size="large">
                                Bouton Principal
                            </Button>
                            <Button variant="outlined" size="large">
                                Bouton Secondaire
                            </Button>
                            <Button variant="text" size="large">
                                Bouton Texte
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
                            <Chip label="Étiquette 1" color="primary" />
                            <Chip label="Étiquette 2" color="secondary" />
                            <Chip label="Étiquette 3" variant="outlined" />
                        </Box>

                        <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
                            Poids de Police Disponibles
                        </Typography>

                        <Box sx={{ mb: 4 }}>
                            <Typography sx={{ fontWeight: 100, mb: 1 }}>Poppins Thin (100)</Typography>
                            <Typography sx={{ fontWeight: 200, mb: 1 }}>Poppins ExtraLight (200)</Typography>
                            <Typography sx={{ fontWeight: 300, mb: 1 }}>Poppins Light (300)</Typography>
                            <Typography sx={{ fontWeight: 400, mb: 1 }}>Poppins Regular (400)</Typography>
                            <Typography sx={{ fontWeight: 500, mb: 1 }}>Poppins Medium (500)</Typography>
                            <Typography sx={{ fontWeight: 600, mb: 1 }}>Poppins SemiBold (600)</Typography>
                            <Typography sx={{ fontWeight: 700, mb: 1 }}>Poppins Bold (700)</Typography>
                            <Typography sx={{ fontWeight: 800, mb: 1 }}>Poppins ExtraBold (800)</Typography>
                            <Typography sx={{ fontWeight: 900, mb: 1 }}>Poppins Black (900)</Typography>
                        </Box>

                        <Box
                            sx={{
                                mt: 4,
                                p: 3,
                                backgroundColor: 'primary.main',
                                color: 'white',
                                borderRadius: '12px',
                                textAlign: 'center'
                            }}
                        >
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                🎉 Police Poppins Activée !
                            </Typography>
                            <Typography variant="body1">
                                Votre site utilise maintenant la magnifique police Poppins pour une meilleure expérience utilisateur.
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </motion.div>
        </Container>
    );
};

export default TypographyShowcase;
