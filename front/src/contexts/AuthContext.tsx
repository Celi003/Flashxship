import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger les tokens au démarrage
  useEffect(() => {
    const loadTokens = () => {
      const storedAccessToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user');
      
      if (storedAccessToken && storedRefreshToken && storedUser) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setUser(JSON.parse(storedUser));
      }
    };

    loadTokens();
    setLoading(false);
  }, []);

  // Vérifier et rafraîchir le token automatiquement
  useEffect(() => {
    if (!accessToken || !refreshToken) return;

    const checkTokenExpiry = async () => {
      try {
        // Vérifier si le token est encore valide
        await authService.getUserInfo();
      } catch (error) {
        // Token expiré, essayer de le rafraîchir
        const success = await refreshAccessToken();
        if (!success) {
          // Rafraîchissement échoué, déconnecter l'utilisateur
          logout();
        }
      }
    };

    // Vérifier toutes les 30 minutes
    const interval = setInterval(checkTokenExpiry, 30 * 60 * 1000);
    checkTokenExpiry(); // Vérifier immédiatement

    return () => clearInterval(interval);
  }, [accessToken, refreshToken]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(username, password);
      
      setUser(response.user);
      setAccessToken(response.access_token);
      setRefreshToken(response.refresh_token);
      
      // Sauvegarder dans localStorage
      localStorage.setItem('accessToken', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }
  };

  const logout = () => {
    // Invalider le refresh token côté serveur
    if (refreshToken) {
      authService.logout(refreshToken).catch(console.error);
    }
    
    // Nettoyer le state
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    
    // Nettoyer localStorage (garder le panier)
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    if (!refreshToken) return false;

    try {
      const response = await authService.refreshToken(refreshToken);
      
      setAccessToken(response.access_token);
      localStorage.setItem('accessToken', response.access_token);
      
      return true;
    } catch (error) {
      console.error('Erreur de rafraîchissement du token:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    login,
    logout,
    refreshAccessToken,
    isAuthenticated: !!user && !!accessToken,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 