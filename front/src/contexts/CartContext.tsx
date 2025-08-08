import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Equipment } from '../types';

interface CartItem {
  id: string;
  type: 'product' | 'equipment';
  item: Product | Equipment;
  quantity: number;
  days?: number; // Pour les équipements
  total: number;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  addToCart: (item: Product | Equipment, quantity: number, days?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateDays: (id: string, days: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Product | Equipment, quantity: number, days?: number) => {
    const itemType = 'rental_price_per_day' in item ? 'equipment' : 'product';
    const itemId = `${itemType}-${item.id}`;
    
    setItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === itemId);
      
      if (existingItem) {
        // Mettre à jour l'item existant
        return prevItems.map(cartItem => 
          cartItem.id === itemId 
            ? {
                ...cartItem,
                quantity: cartItem.quantity + quantity,
                days: days || cartItem.days,
                total: calculateTotal(item, cartItem.quantity + quantity, days || cartItem.days)
              }
            : cartItem
        );
      } else {
        // Ajouter un nouvel item
                  const newItem: CartItem = {
            id: itemId,
            type: itemType,
            item,
            quantity,
            days,
            total: calculateTotal(item, quantity, days)
          };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, quantity, total: calculateTotal(item.item, quantity, item.days) }
          : item
      )
    );
  };

  const updateDays = (id: string, days: number) => {
    if (days <= 0) {
      removeFromCart(id);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, days, total: calculateTotal(item.item, item.quantity, days) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateTotal = (item: Product | Equipment, quantity: number, days?: number): number => {
    if ('rental_price_per_day' in item) {
      // Équipement
      return (item.rental_price_per_day * (days || 1)) * quantity;
    } else {
      // Produit
      return item.price * quantity;
    }
  };

  const total = items.reduce((sum, item) => sum + item.total, 0);

  const value: CartContextType = {
    items,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateDays,
    clearCart,
    getItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 