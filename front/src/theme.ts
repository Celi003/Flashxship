import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Palette de couleurs FLASHXSHIP
const flashxshipColors = {
  // Gris clair (fond principal)
  lightGray: '#F5F5F5',
  // Gris (textes secondaires, bordures)
  gray: '#9E9E9E',
  // Blanc (fond, textes sur fond sombre)
  white: '#FFFFFF',
  // Noir (textes principaux, logo)
  black: '#000000',
  // Rouge (accents, boutons d'action)
  red: '#D32F2F',
  // Gris foncé (headers, navigation)
  darkGray: '#424242',
  // Gris très clair (hover states)
  veryLightGray: '#FAFAFA',
};

export const theme = createTheme({
  palette: {
    primary: {
      main: flashxshipColors.black,
      light: flashxshipColors.gray,
      dark: flashxshipColors.black,
      contrastText: flashxshipColors.white,
    },
    secondary: {
      main: flashxshipColors.red,
      light: '#FF6B6B',
      dark: '#B71C1C',
      contrastText: flashxshipColors.white,
    },
    background: {
      default: flashxshipColors.white,
      paper: flashxshipColors.lightGray,
    },
    text: {
      primary: flashxshipColors.black,
      secondary: flashxshipColors.gray,
    },
    grey: {
      50: flashxshipColors.veryLightGray,
      100: flashxshipColors.lightGray,
      200: flashxshipColors.gray,
      300: flashxshipColors.gray,
      400: flashxshipColors.gray,
      500: flashxshipColors.gray,
      600: flashxshipColors.darkGray,
      700: flashxshipColors.darkGray,
      800: flashxshipColors.black,
      900: flashxshipColors.black,
    },
    error: {
      main: flashxshipColors.red,
    },
    warning: {
      main: '#FF9800',
    },
    success: {
      main: '#4CAF50',
    },
    info: {
      main: flashxshipColors.gray,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: flashxshipColors.black,
    },
    h2: {
      fontWeight: 600,
      color: flashxshipColors.black,
    },
    h3: {
      fontWeight: 600,
      color: flashxshipColors.black,
    },
    h4: {
      fontWeight: 600,
      color: flashxshipColors.black,
    },
    h5: {
      fontWeight: 600,
      color: flashxshipColors.black,
    },
    h6: {
      fontWeight: 600,
      color: flashxshipColors.black,
    },
    body1: {
      color: flashxshipColors.black,
    },
    body2: {
      color: flashxshipColors.gray,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          backgroundColor: flashxshipColors.black,
          color: flashxshipColors.white,
          '&:hover': {
            backgroundColor: flashxshipColors.darkGray,
          },
        },
        outlined: {
          borderColor: flashxshipColors.black,
          color: flashxshipColors.black,
          '&:hover': {
            borderColor: flashxshipColors.black,
            backgroundColor: flashxshipColors.lightGray,
          },
        },
        containedSecondary: {
          backgroundColor: flashxshipColors.red,
          '&:hover': {
            backgroundColor: '#B71C1C',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: `1px solid ${flashxshipColors.lightGray}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: flashxshipColors.white,
          color: flashxshipColors.black,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: flashxshipColors.black,
          color: flashxshipColors.white,
        },
        colorSecondary: {
          backgroundColor: flashxshipColors.red,
          color: flashxshipColors.white,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: flashxshipColors.gray,
            },
            '&:hover fieldset': {
              borderColor: flashxshipColors.black,
            },
            '&.Mui-focused fieldset': {
              borderColor: flashxshipColors.black,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 4px 8px rgba(0,0,0,0.08)',
    '0 6px 12px rgba(0,0,0,0.1)',
    '0 8px 16px rgba(0,0,0,0.12)',
    '0 10px 20px rgba(0,0,0,0.14)',
    '0 12px 24px rgba(0,0,0,0.16)',
    '0 14px 28px rgba(0,0,0,0.18)',
    '0 16px 32px rgba(0,0,0,0.2)',
    '0 18px 36px rgba(0,0,0,0.22)',
    '0 20px 40px rgba(0,0,0,0.24)',
    '0 22px 44px rgba(0,0,0,0.26)',
    '0 24px 48px rgba(0,0,0,0.28)',
    '0 26px 52px rgba(0,0,0,0.3)',
    '0 28px 56px rgba(0,0,0,0.32)',
    '0 30px 60px rgba(0,0,0,0.34)',
    '0 32px 64px rgba(0,0,0,0.36)',
    '0 34px 68px rgba(0,0,0,0.38)',
    '0 36px 72px rgba(0,0,0,0.4)',
    '0 38px 76px rgba(0,0,0,0.42)',
    '0 40px 80px rgba(0,0,0,0.44)',
    '0 42px 84px rgba(0,0,0,0.46)',
    '0 44px 88px rgba(0,0,0,0.48)',
    '0 46px 92px rgba(0,0,0,0.5)',
    '0 48px 96px rgba(0,0,0,0.52)',
  ],
});
// Activer des tailles de polices responsives (réduit uniquement sur petits écrans, n'affecte pas le desktop)
const responsiveTheme = responsiveFontSizes(theme);

export default responsiveTheme;