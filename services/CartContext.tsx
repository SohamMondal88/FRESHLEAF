
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { COUPONS } from '../constants';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedUnit?: string, pricePerUnit?: number) => void;
  removeFromCart: (productId: string, selectedUnit: string) => void;
  updateQuantity: (productId: string, selectedUnit: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  discount: number;
  grandTotal: number;
  couponCode: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  // Wishlist props
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  // Load wishlist from local storage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('freshleaf_wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) { console.error("Error parsing wishlist", e); }
    }
  }, []);

  // Save wishlist on change
  useEffect(() => {
    localStorage.setItem('freshleaf_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Product, quantity = 1, selectedUnit = '1kg', pricePerUnit?: number) => {
    const finalPrice = pricePerUnit || product.price; 
    
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedUnit === selectedUnit);
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.selectedUnit === selectedUnit 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { ...product, quantity, selectedUnit, price: finalPrice }];
    });
  };

  const removeFromCart = (productId: string, selectedUnit: string) => {
    setCartItems(prev => prev.filter(item => !(item.id === productId && item.selectedUnit === selectedUnit)));
  };

  const updateQuantity = (productId: string, selectedUnit: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prev =>
      prev.map(item => (item.id === productId && item.selectedUnit === selectedUnit ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCouponCode(null);
    setDiscount(0);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Coupon Logic
  useEffect(() => {
    if (couponCode) {
      const coupon = COUPONS.find(c => c.code === couponCode);
      if (coupon) {
        if (cartTotal < coupon.minOrder) {
          setCouponCode(null);
          setDiscount(0);
        } else {
          let disc = 0;
          if (coupon.type === 'flat') disc = coupon.value;
          else if (coupon.type === 'percent') disc = Math.round((cartTotal * coupon.value) / 100);
          setDiscount(disc);
        }
      }
    } else {
      setDiscount(0);
    }
  }, [cartTotal, couponCode]);

  const applyCoupon = (code: string) => {
    const coupon = COUPONS.find(c => c.code === code.toUpperCase());
    if (!coupon) return { success: false, message: 'Invalid Coupon Code' };
    
    if (cartTotal < coupon.minOrder) {
      return { success: false, message: `Minimum order value of ₹${coupon.minOrder} required` };
    }

    setCouponCode(code.toUpperCase());
    return { success: true, message: 'Coupon Applied Successfully' };
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setDiscount(0);
  };

  const grandTotal = Math.max(0, cartTotal - discount);

  // Wishlist Logic
  const addToWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.some(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(p => p.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal,
      discount, grandTotal, couponCode, applyCoupon, removeCoupon,
      wishlist, addToWishlist, removeFromWishlist, isInWishlist
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
