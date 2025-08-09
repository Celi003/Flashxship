export interface ProductCategory {
  id: number;
  name: string;
  description: string;
}

export interface EquipmentCategory {
  id: number;
  name: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  images: Image[];
  stock: number;
  created_at: string;
}

export interface Equipment {
  id: number;
  name: string;
  description: string;
  rental_price_per_day: number;
  category: EquipmentCategory;
  images: Image[];
  available: boolean;
  created_at: string;
}

export interface Image {
  id: number;
  image: string;
  image_url?: string;
  uploaded_at: string;
}

export interface OrderItem {
  id: number;
  product?: Product;
  equipment?: Equipment;
  quantity: number;
  rental_days: number;
  price: number;
}

export interface Order {
  id: number;
  user: User;
  created_at: string;
  updated_at: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  payment_status: 'PENDING' | 'PAID' | 'FAILED';
  total_amount: number;
  items: OrderItem[];
  requires_delivery: boolean;
  delivery_country: string;
  delivery_address: string;
  delivery_city: string;
  delivery_postal_code: string;
  delivery_phone: string;
  recipient_name: string;
  recipient_email: string;
  recipient_phone: string;
  stripe_session_id: string;
  stripe_payment_intent_id: string;
}

export interface ContactMessage {
  id: number;
  user?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  responded: boolean;
  admin_response?: string;
  responded_at?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
  loading: boolean;
}

export interface CartItem {
  item: Product | Equipment;
  quantity: number;
  days?: number;
  total: number;
}

export interface CartContextType {
  items: CartItem[];
  total: number;
  addToCart: (item: Product | Equipment, quantity: number, days?: number) => void;
  removeFromCart: (itemId: number, itemType: 'product' | 'equipment') => void;
  updateQuantity: (itemId: number, itemType: 'product' | 'equipment', quantity: number) => void;
  updateDays: (itemId: number, days: number) => void;
  clearCart: () => void;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
} 