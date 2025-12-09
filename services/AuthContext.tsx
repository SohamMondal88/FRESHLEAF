
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SavedCard, UserNotification } from '../types';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, phone: string, password: string, referralCode?: string) => Promise<boolean>;
  loginWithOTP: (phone: string, otp: string) => Promise<boolean>;
  sendOTP: (phone: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  joinMembership: () => void;
  isAuthenticated: boolean;
  walletBalance: number;
  creditPoints: number;
  addToWallet: (amount: number) => void;
  addSavedCard: (card: SavedCard) => void;
  removeSavedCard: (id: string) => void;
  notifications: UserNotification[];
  markNotificationRead: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// SIMULATED BACKEND STORAGE KEY
const DB_USERS_KEY = 'freshleaf_db_users';
const DB_SESSION_KEY = 'freshleaf_session_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [creditPoints, setCreditPoints] = useState(0);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const { addToast } = useToast();

  // Load user session on mount
  useEffect(() => {
    const session = localStorage.getItem(DB_SESSION_KEY);
    if (session) {
      const parsedUser = JSON.parse(session);
      setUser(parsedUser);
      setWalletBalance(parsedUser.walletBalance || 0);
      setCreditPoints(parsedUser.creditPoints || 0);
      setNotifications(parsedUser.notifications || []);
    }
  }, []);

  const saveUserSession = (userData: User) => {
    setUser(userData);
    setWalletBalance(userData.walletBalance || 0);
    setCreditPoints(userData.creditPoints || 0);
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

  const generateReferralCode = (name: string) => {
    const prefix = name.substring(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${random}`;
  };

  const sendOTP = async (phone: string) => {
    // Simulate API Call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`%c[SMS Gateway] OTP for ${phone}: ${otp}`, 'color: yellow; font-size: 14px; font-weight: bold;');
    addToast(`OTP Sent to ${phone}: ${otp}`, 'info'); // Showing in toast for demo
    return true;
  };

  const sendWelcomeNotifications = (name: string, email: string, phone: string) => {
    // Simulate Email Service
    setTimeout(() => {
        const emailContent = `Subject: Welcome to FreshLeaf! 🌿\n\nHi ${name},\n\nThank you for joining the FreshLeaf family. Your wallet has been activated.\n\nUse code WELCOME10 for 10% off your first order.\n\nHappy Shopping,\nTeam FreshLeaf`;
        console.log(`%c[Email Service] Sent to ${email}:`, 'color: green; font-weight: bold;', emailContent);
        addToast(`Welcome email sent to ${email}`, 'success');
    }, 1500);

    // Simulate SMS Service
    setTimeout(() => {
        const smsContent = `FreshLeaf: Hi ${name}! Your account is active. Order fresh veggies now.`;
        console.log(`%c[SMS Gateway] Sent to ${phone}:`, 'color: orange; font-weight: bold;', smsContent);
    }, 3000);
  };

  const loginWithOTP = async (phone: string, otp: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, verify OTP against backend
    if (otp.length === 4) { 
        const users = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]');
        let existingUser = users.find((u: User) => u.phone === phone);
        
        let isNewUser = false;
        if (!existingUser) {
             isNewUser = true;
             const name = 'Guest User';
             existingUser = {
                id: 'usr_' + Math.random().toString(36).substr(2, 9),
                name: name,
                email: `${phone}@mobile.user`,
                phone: phone,
                isPro: false,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${phone}`,
                walletBalance: 0, 
                creditPoints: 0,
                referralCode: generateReferralCode(name),
                savedCards: [],
                notifications: [
                  { id: 'n1', title: 'Welcome!', message: 'Thanks for joining FreshLeaf.', date: new Date().toDateString(), read: false, type: 'system' }
                ]
             };
        }
        
        saveUserSession(existingUser);
        
        if (isNewUser) {
            sendWelcomeNotifications('Guest', existingUser.email, phone);
        } else {
            addToast('Logged in successfully', 'success');
        }
        return true;
    }
    addToast('Invalid OTP', 'error');
    return false;
  };

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const users = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]');
    const existingUser = users.find((u: User) => u.email === email); 

    if (existingUser) {
      saveUserSession(existingUser);
      addToast('Logged in successfully', 'success');
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
            walletBalance: 99999,
            creditPoints: 9999,
            referralCode: 'ADMIN001',
            notifications: []
         };
         saveUserSession(adminUser);
         addToast('Admin access granted', 'warning');
         return true;
      }

      addToast('User not found. Check credentials.', 'error');
      return false;
    }
  };

  const signup = async (name: string, email: string, phone: string, password: string, referralCode?: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists
    const users = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]');
    if (users.find((u: User) => u.email === email)) {
        addToast('Email already registered', 'error');
        return false;
    }

    let welcomePoints = 0;
    let referredBy = '';

    // Process Referral
    if (referralCode) {
        const referrer = users.find((u: User) => u.referralCode === referralCode);
        if (referrer) {
            welcomePoints = 50; // Bonus for new user
            referredBy = referralCode;
            
            // Reward Referrer (Update DB directly)
            referrer.creditPoints = (referrer.creditPoints || 0) + 100;
            referrer.notifications.push({
                id: Date.now().toString(),
                title: 'Referral Reward!',
                message: `You earned 100 points because ${name} used your code.`,
                date: new Date().toDateString(),
                read: false,
                type: 'promo'
            });
            // Save referrer updates back to DB array
            const refIndex = users.findIndex((u: User) => u.id === referrer.id);
            if (refIndex !== -1) users[refIndex] = referrer;
            
            console.log(`Referral applied: ${referralCode}. Referrer awarded.`);
        }
    }

    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      isPro: false,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      walletBalance: 0, // Realistic start
      creditPoints: welcomePoints,
      referralCode: generateReferralCode(name),
      referredBy,
      savedCards: [],
      notifications: [
         { id: 'n1', title: 'Welcome!', message: 'Thanks for joining FreshLeaf.', date: new Date().toDateString(), read: false, type: 'system' }
      ]
    };
    
    // Update local session
    saveUserSession(newUser);
    
    // Trigger Welcome Messages
    sendWelcomeNotifications(name, email, phone);
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(DB_SESSION_KEY);
    addToast('Logged out successfully', 'info');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    saveUserSession(updatedUser);
  };

  const joinMembership = () => {
    if (!user) return;
    updateProfile({ isPro: true });
    addToast('Welcome to FreshLeaf Pro!', 'success');
  };

  const addToWallet = (amount: number) => {
    if(!user) return;
    const newBalance = (user.walletBalance || 0) + amount;
    setWalletBalance(newBalance);
    updateProfile({ walletBalance: newBalance });
    addToast(`₹${amount} added to wallet`, 'success');
  };

  const addSavedCard = (card: SavedCard) => {
    if(!user) return;
    const updatedCards = [...(user.savedCards || []), card];
    updateProfile({ savedCards: updatedCards });
    addToast('Card saved successfully', 'success');
  };

  const removeSavedCard = (id: string) => {
    if(!user) return;
    const updatedCards = user.savedCards?.filter(c => c.id !== id) || [];
    updateProfile({ savedCards: updatedCards });
    addToast('Card removed', 'info');
  };

  const markNotificationRead = (id: string) => {
    if(!user) return;
    const updatedNotifications = user.notifications?.map(n => n.id === id ? { ...n, read: true } : n) || [];
    setNotifications(updatedNotifications);
    updateProfile({ notifications: updatedNotifications });
  };

  return (
    <AuthContext.Provider value={{ 
        user, login, signup, logout, updateProfile, joinMembership, 
        isAuthenticated: !!user, sendOTP, loginWithOTP, 
        walletBalance, creditPoints, addToWallet,
        addSavedCard, removeSavedCard, notifications: user?.notifications || [], markNotificationRead
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
