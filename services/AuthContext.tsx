
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  loginWithOTP: (phone: string, otp: string) => Promise<boolean>;
  sendOTP: (phone: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  joinMembership: () => void;
  isAuthenticated: boolean;
  walletBalance: number;
  addToWallet: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// SIMULATED BACKEND STORAGE KEY
const DB_USERS_KEY = 'freshleaf_db_users';
const DB_SESSION_KEY = 'freshleaf_session_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);

  // Load user session on mount
  useEffect(() => {
    const session = localStorage.getItem(DB_SESSION_KEY);
    if (session) {
      const parsedUser = JSON.parse(session);
      setUser(parsedUser);
      // Mock Wallet Load
      setWalletBalance(parsedUser.walletBalance || 0);
    }
  }, []);

  const saveUserSession = (userData: User) => {
    setUser(userData);
    localStorage.setItem(DB_SESSION_KEY, JSON.stringify(userData));
    
    // Update "Database"
    const users = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]');
    const index = users.findIndex((u: User) => u.email === userData.email);
    if (index >= 0) {
      users[index] = { ...users[index], ...userData };
    } else {
      users.push(userData);
    }
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
  };

  const sendOTP = async (phone: string) => {
    // Simulate API Call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`OTP Sent to ${phone}: 1234`); // Simulation
    return true;
  };

  const loginWithOTP = async (phone: string, otp: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (otp === '1234') {
        const users = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]');
        let existingUser = users.find((u: User) => u.phone === phone);
        
        if (!existingUser) {
             // Create a partial user for now or require full signup
             // For demo flow, we'll create a new user
             existingUser = {
                id: 'usr_' + Math.random().toString(36).substr(2, 9),
                name: 'User',
                email: `${phone}@mobile.user`,
                phone: phone,
                isPro: false,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${phone}`,
                walletBalance: 0
             };
        }
        
        saveUserSession(existingUser);
        return true;
    }
    return false;
  };

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const users = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]');
    const existingUser = users.find((u: User) => u.email === email); // In real app, check password hash

    if (existingUser) {
      saveUserSession(existingUser);
      return true;
    } else {
      // Mock Admin
      if (email === 'admin@freshleaf.in' && password === 'admin123') {
         const adminUser: User = {
            id: 'admin_01',
            name: 'Super Admin',
            email: email,
            isPro: true,
            isAdmin: true,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
            walletBalance: 99999
         };
         saveUserSession(adminUser);
         return true;
      }

      // For demo convenience, allow login if not found (auto-signup style)
      // Let's create a mock user if not found for smoother demo experience
       const mockUser: User = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email: email,
        phone: '+91 8513028892',
        isPro: false,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        walletBalance: 500
      };
      saveUserSession(mockUser);
      return true;
    }
  };

  const signup = async (name: string, email: string, phone: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      isPro: false,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      walletBalance: 100 // Welcome bonus
    };
    saveUserSession(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(DB_SESSION_KEY);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    saveUserSession(updatedUser);
  };

  const joinMembership = () => {
    if (!user) return;
    updateProfile({ isPro: true });
  };

  const addToWallet = (amount: number) => {
    if(!user) return;
    const newBalance = (user.walletBalance || 0) + amount;
    setWalletBalance(newBalance);
    updateProfile({ walletBalance: newBalance });
  }

  return (
    <AuthContext.Provider value={{ 
        user, login, signup, logout, updateProfile, joinMembership, 
        isAuthenticated: !!user, sendOTP, loginWithOTP, walletBalance, addToWallet 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
