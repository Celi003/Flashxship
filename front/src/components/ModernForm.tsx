import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    Alert,
    CircularProgress,
    InputAdornment,
    FormControlLabel,
    Checkbox,
    useTheme
} from '@mui/material';
import {
    Email as EmailIcon,
    Lock as LockIcon,
    Person as PersonIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'textarea';
    required?: boolean;
    multiline?: boolean;
    rows?: number;
    icon?: React.ReactNode;
}

interface ModernFormProps {
    title: string;
    subtitle?: string;
    fields: FormField[];
    submitLabel: string;
    loading?: boolean;
    error?: string;
    success?: string;
    showTerms?: boolean;
    onSubmit: (data: Record<string, string>) => void;
}

const ModernForm: React.FC<ModernFormProps> = ({
    title,
    subtitle,
    fields,
    submitLabel,
    loading = false,
    error,
    success,
    showTerms = false,
    onSubmit
}) => {
    const theme = useTheme();
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
    const [acceptTerms, setAcceptTerms] = useState(false);

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = (fieldName: string) => {
        setShowPassword(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (showTerms && !acceptTerms) {
            return;
        }
        onSubmit(formData);
    };

    const getFieldIcon = (field: FormField) => {
        if (field.icon) return field.icon;

        switch (field.type) {
            case 'email':
                return <EmailIcon />;
            case 'password':
                return <LockIcon />;
            default:
                if (field.name.toLowerCase().includes('name')) {
                    return <PersonIcon />;
                }
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    maxWidth: 500,
                    mx: 'auto',
                    p: 4,
                    borderRadius: '24px',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
            >
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            fontSize: { xs: '1.8rem', sm: '2rem' },
                            background: 'linear-gradient(135deg, #000000 0%, #424242 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}
                    >
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontSize: '1rem', lineHeight: 1.5 }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                {/* Alerts */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                            {error}
                        </Alert>
                    </motion.div>
                )}

                {success && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
                            {success}
                        </Alert>
                    </motion.div>
                )}

                {/* Form Fields */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {fields.map((field, index) => (
                        <motion.div
                            key={field.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <TextField
                                fullWidth
                                name={field.name}
                                label={field.label}
                                type={field.type === 'password' && showPassword[field.name] ? 'text' : field.type}
                                required={field.required}
                                multiline={field.multiline}
                                rows={field.rows}
                                value={formData[field.name] || ''}
                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                InputProps={{
                                    startAdornment: getFieldIcon(field) && (
                                        <InputAdornment position="start">
                                            {getFieldIcon(field)}
                                        </InputAdornment>
                                    ),
                                    endAdornment: field.type === 'password' && (
                                        <InputAdornment position="end">
                                            <Button
                                                onClick={() => togglePasswordVisibility(field.name)}
                                                sx={{ minWidth: 'auto', p: 1 }}
                                            >
                                                {showPassword[field.name] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </Button>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                        },
                                        '&.Mui-focused': {
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontWeight: 500
                                    }
                                }}
                            />
                        </motion.div>
                    ))}
                </Box>

                {/* Terms and Conditions */}
                {showTerms && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: fields.length * 0.1 }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    sx={{
                                        '&.Mui-checked': {
                                            color: 'primary.main'
                                        }
                                    }}
                                />
                            }
                            label={
                                <Typography variant="body2" color="text.secondary">
                                    J'accepte les{' '}
                                    <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                                        conditions d'utilisation
                                    </Box>{' '}
                                    et la{' '}
                                    <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                                        politique de confidentialité
                                    </Box>
                                </Typography>
                            }
                            sx={{ mt: 2, alignItems: 'flex-start' }}
                        />
                    </motion.div>
                )}

                {/* Submit Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: (fields.length + 1) * 0.1 }}
                >
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={loading || (showTerms && !acceptTerms)}
                        sx={{
                            mt: 4,
                            py: 1.5,
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '1rem',
                            background: 'linear-gradient(135deg, #000000 0%, #424242 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #424242 0%, #000000 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
                            },
                            '&:disabled': {
                                background: theme.palette.grey[300]
                            }
                        }}
                    >
                        {loading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <CircularProgress size={20} color="inherit" />
                                Chargement...
                            </Box>
                        ) : (
                            submitLabel
                        )}
                    </Button>
                </motion.div>
            </Box>
        </motion.div>
    );
};

export default ModernForm;
