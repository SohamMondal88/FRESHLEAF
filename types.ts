
export interface Product {
  id: string;
  name: {
    en: string;
    hi: string;
    bn: string;
  };
  price: number; // Base price per baseUnit
  oldPrice?: number;
  image: string; // Primary thumbnail
  gallery: string[]; // Array of 3 images
  category: string;
  description: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isOrganic?: boolean;
  isLocal?: boolean;
  baseUnit: string; // e.g., 'kg', 'pc', 'bunch'
}

export interface CartItem extends Product {
  quantity: number;
  selectedUnit: string; // e.g., '500g', '1kg'
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  comment: string;
  rating: number;
}

export interface SavedCard {
  id: string;
  last4: string;
  brand: string; // Visa, MasterCard
  expiry: string;
  holderName: string;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'order' | 'promo' | 'system';
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
  lastUpdate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  isPro?: boolean; // Membership status
  isAdmin?: boolean; // Admin role
  avatar?: string;
  walletBalance?: number;
  creditPoints?: number; // Loyalty Points
  referralCode?: string; // Unique code for the user
  referredBy?: string; // Code of the person who referred them
  savedCards?: SavedCard[];
  notifications?: UserNotification[];
  tickets?: SupportTicket[];
}

export interface DeliverySlot {
  id: string;
  label: string; // "Morning 8am - 11am"
  time: string;
  price: number; // 0 for free, or extra for express
  available: boolean;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  timestamp: number; // Added for cancellation timer
  total: number;
  status: 'Processing' | 'Packed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  items: CartItem[];
  trackingId?: string;
  paymentMethod: string;
  address: string;
  courier?: string; // e.g., 'Bombax'
  customerName?: string;
  customerPhone?: string;
  deliverySlot?: string;
  riderId?: string; // ID of the assigned rider
  riderName?: string;
  pointsRedeemed?: number; // Points used in this order
  pointsEarned?: number; // Points earned from this order
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  status: 'Available' | 'Busy' | 'Offline';
  currentOrderId?: string;
  rating: number;
  vehicle: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'flat' | 'percent';
  value: number;
  minOrder: number;
  description: string;
  isActive: boolean;
}

export interface TrackingStep {
  title: string;
  subtitle: string;
  timestamp: string;
  completed: boolean;
  icon: any;
}
