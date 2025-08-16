import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {
  Product, Equipment, ProductCategory, EquipmentCategory,
  Order, ContactMessage, User, CartItem
} from '../types';

// Configuration de base
const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Pas de cookies avec JWT
});

// Intercepteur pour ajouter le token d'accès
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    // Headers est toujours défini sur InternalAxiosRequestConfig
    (config.headers as any).Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs 401 et rafraîchir le token
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config || {};

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/refresh/`, {
            refresh_token: refreshToken
          });

          const newAccessToken = response.data.access_token;
          localStorage.setItem('accessToken', newAccessToken);

          // Retry la requête originale avec le nouveau token
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh token expiré, déconnecter l'utilisateur
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.reload();
        }
      }
    }

    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  login: (username: string, password: string) =>
    api.post('/login/', { username, password }).then((res: AxiosResponse<any>) => res.data),

  register: (username: string, email: string, password: string, password2: string) =>
    api.post('/register/', { username, email, password, password2 }).then((res: AxiosResponse<any>) => res.data),

  logout: (refreshToken: string) =>
    api.post('/logout/', { refresh_token: refreshToken }).then((res: AxiosResponse<any>) => res.data),

  refreshToken: (refreshToken: string) =>
    api.post('/refresh/', { refresh_token: refreshToken }).then((res: AxiosResponse<any>) => res.data),

  getUserInfo: () =>
    api.get('/user/').then((res: AxiosResponse<any>) => res.data),
};

// Services de produits
export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products/');
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}/`);
    return response.data;
  },

  getByCategory: async (categoryId: number): Promise<Product[]> => {
    const response = await api.get(`/products/?category=${categoryId}`);
    return response.data;
  },

  create: async (product: Partial<Product> | FormData): Promise<Product> => {
    const config = product instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } : {};
    const response = await api.post('/products/', product, config);
    return response.data;
  },

  update: async (id: number, product: Partial<Product> | FormData): Promise<Product> => {
    const config = product instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } : {};
    const response = await api.put(`/products/${id}/`, product, config);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}/`);
  }
};

// Services d'équipements
export const equipmentService = {
  getAll: async (): Promise<Equipment[]> => {
    const response = await api.get('/equipment/');
    return response.data;
  },

  getById: async (id: number): Promise<Equipment> => {
    const response = await api.get(`/equipment/${id}/`);
    return response.data;
  },

  getByCategory: async (categoryId: number): Promise<Equipment[]> => {
    const response = await api.get(`/equipment/?category=${categoryId}`);
    return response.data;
  },

  create: async (equipment: Partial<Equipment> | FormData): Promise<Equipment> => {
    const config = equipment instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } : {};
    const response = await api.post('/equipment/', equipment, config);
    return response.data;
  },

  update: async (id: number, equipment: Partial<Equipment> | FormData): Promise<Equipment> => {
    const config = equipment instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } : {};
    const response = await api.put(`/equipment/${id}/`, equipment, config);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/equipment/${id}/`);
  }
};

// Services de catégories


// Services pour les catégories de produits
export const productCategoryService = {
  getAll: async () => {
    const response = await api.get('/product-categories/');
    return response.data;
  },
  create: (data: FormData) => api.post('/product-categories/', data),
  update: (id: number, data: FormData) => api.put(`/product-categories/${id}/`, data),
  delete: (id: number) => api.delete(`/product-categories/${id}/`),
};

// Services pour les catégories d'équipements
export const equipmentCategoryService = {
  getAll: async () => {
    const response = await api.get('/equipment-categories/');
    return response.data;
  },
  create: (data: FormData) => api.post('/equipment-categories/', data),
  update: (id: number, data: FormData) => api.put(`/equipment-categories/${id}/`, data),
  delete: (id: number) => api.delete(`/equipment-categories/${id}/`),
};

// Services de panier
export const cartService = {
  getCart: async (): Promise<{ items: CartItem[], total: number }> => {
    const response = await api.get('/cart/');
    return response.data;
  },

  addToCart: async (itemId: number, itemType: 'product' | 'equipment', quantity: number = 1, days: number = 1): Promise<void> => {
    await api.post('/cart/', { item_id: itemId, item_type: itemType, quantity, days });
  },

  removeFromCart: async (itemId: number): Promise<void> => {
    // Implémentation à faire côté backend
    await api.delete(`/cart/${itemId}/`);
  }
};

// Services de commandes
export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const response = await api.get('/orders/');
    return response.data;
  },

  getById: async (id: number): Promise<Order> => {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  },

  createPaymentSession: async (orderId: number) => {
    const response = await api.post('/create_payment_session/', { order_id: orderId });
    return response.data;
  },

  // Méthodes d'administration
  confirm: async (orderId: number): Promise<void> => {
    await api.post(`/api/admin/orders/${orderId}/confirm/`);
  },

  reject: async (orderId: number): Promise<void> => {
    await api.post(`/api/admin/orders/${orderId}/reject/`);
  },

  ship: async (orderId: number): Promise<void> => {
    await api.post(`/api/admin/orders/${orderId}/ship/`);
  },

  deliver: async (orderId: number): Promise<void> => {
    await api.post(`/api/admin/orders/${orderId}/deliver/`);
  }
};

// Services de contact
export const contactService = {
  sendMessage: async (data: FormData): Promise<void> => {
    await api.post('/contact/', data);
  },
  
  getAll: async (): Promise<ContactMessage[]> => {
    const response = await api.get('/contact/');
    return response.data;
  },
  
  respond: async (messageId: number, response: string): Promise<void> => {
    await api.post(`/api/admin/messages/${messageId}/respond/`, { response: response });
  }
};

// Service utilisateur
export const userService = {
  updateProfile: async (data: { username: string; email: string }): Promise<any> => {
    const response = await api.put('/auth/profile/', data);
    return response.data;
  }
};

// Review service
export const reviewService = {
  getAll: () => api.get('/reviews/all/').then((res: AxiosResponse<any>) => res.data), // Temporairement tous les avis
  getApproved: () => api.get('/reviews/').then((res: AxiosResponse<any>) => res.data), // Seulement les approuvés
  create: (data: any) => api.post('/reviews/create/', data).then((res: AxiosResponse<any>) => res.data),
  approve: (id: number) => api.put(`/reviews/${id}/`).then((res: AxiosResponse<any>) => res.data),
  delete: (id: number) => api.delete(`/reviews/${id}/`).then((res: AxiosResponse<any>) => res.data),
};

export default api; 