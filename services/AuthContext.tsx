
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SavedCard, UserNotification, SupportTicket } from '../types';
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
  createSupportTicket: (subject: string, message: string) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// KEYS
const DB_USERS_KEY = 'freshleaf_db_users_prod'; 
const DB_SESSION_KEY = 'freshleaf_session_user_prod';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [creditPoints, setCreditPoints] = useState(0);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const { addToast } = useToast();

  // --- PERSISTENCE LOGIC ---
  // Load user session on mount, syncing with the "Main DB" to ensure data integrity
  useEffect(() => {
    const checkSession = () => {
      const sessionData = localStorage.getItem(DB_SESSION_KEY);
      
      if (sessionData) {
        try {
          const parsedSession = JSON.parse(sessionData);
          const userId = parsedSession.id;

          // FETCH LATEST DATA FROM "DATABASE"
          // This ensures that if the user had updates in a different tab or previous session, 
          // we load the absolute latest state, not just what was in the session cookie.
          const allUsers = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]');
          const dbUser = allUsers.find((u: User) => u.id === userId);

          if (dbUser) {
            // Found in DB -> Source of Truth
            setUser(dbUser);
            setWalletBalance(dbUser.walletBalance || 0);
            setCreditPoints(dbUser.creditPoints || 0);
            setNotifications(dbUser.notifications || []);
            // Update session to match DB perfect state
            localStorage.setItem(DB_SESSION_KEY, JSON.stringify(dbUser));
          } else {
            // User exists in session but not DB (Corruption/Deletion) -> Logout
            console.warn("Session found but user missing in DB. Logging out.");
            logout();
          }
        } catch (e) {
          console.error("Session parse error", e);
          logout();
        }
      }
    };

    checkSession();
    
    // Optional: Listen for storage events to sync tabs
    window.addEventListener('storage', checkSession);
    return () => window.removeEventListener('storage', checkSession);
  }, []);

  // --- CORE FUNCTIONS ---

  const saveUserSession = (userData: User) => {
    // 1. Update State
    setUser(userData);
    setWalletBalance(userData.walletBalance || 0);
    setCreditPoints(userData.creditPoints || 0);
    setNotifications(userData.notifications || []);
    
    // 2. Update Session Storage (Persistence)
    localStorage.setItem(DB_SESSION_KEY, JSON.stringify(userData));
    
    // 3. Update "Main Database" (Long-term Storage)
    const users = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]');
    const index = users.findIndex((u: User) => u.id === userData.id);
    
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`%c[SMS Gateway] OTP for ${phone}: ${otp}`, 'color: yellow; font-size: 14px; font-weight: bold;');
    addToast(`OTP Sent to ${phone}: ${otp}`, 'info'); 
    return true;
  };

  const loginWithOTP = async (phone: string, otp: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (otp.length === 4) { 
        const users = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]');
        let existingUser = users.find((u: User) => u.phone === phone);
        
        // Register new user if not exists
        if (!existingUser) {
             const name = 'Guest User';
             existingUser = {
                id: 'usr_' + Math.random().toString(36).substr(2, 9),
                name: name,
                email: `${phone}@mobile.freshleaf`,
                phone: phone,
                isPro: false,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${phone}`,
                walletBalance: 0, 
                creditPoints: 0,
                referralCode: generateReferralCode(name),
                savedCards: [],
                notifications: [],
                tickets: []
             };
             // Ensure it's added to users array immediately for consistency
             users.push(existingUser);
             localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
             addToast('Account created successfully', 'success');
        }
        
        saveUserSession(existingUser);
        addToast('Logged in successfully', 'success');
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
            walletBalance: 0,
            creditPoints: 0,
            referralCode: 'ADMIN001',
            notifications: [],
            tickets: []
         };
         saveUserSession(adminUser);
         addToast('Admin access granted', 'warning');
         return true;
      }

      addToast('User not found. Please Sign Up.', 'error');
      return false;
    }
  };

  const signup = async (name: string, email: string, phone: string, password: string, referralCode?: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
            welcomePoints = 25; // Bonus for new user
            referredBy = referralCode;
            
            // Reward Referrer
            referrer.creditPoints = (referrer.creditPoints || 0) + 50;
            referrer.notifications = [
                ...(referrer.notifications || []), 
                {
                    id: Date.now().toString(),
                    title: 'Referral Reward!',
                    message: `You earned 50 points because ${name} used your code.`,
                    date: new Date().toDateString(),
                    read: false,
                    type: 'promo'
                }
            ];
            
            // Save referrer updates immediately to DB
            const refIndex = users.findIndex((u: User) => u.id === referrer.id);
            if (refIndex !== -1) users[refIndex] = referrer;
            // Note: We don't save users array to LS here, we do it in saveUserSession below which handles the new user push
        }
    }

    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      isPro: false,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      walletBalance: 0, 
      creditPoints: welcomePoints,
      referralCode: generateReferralCode(name),
      referredBy,
      savedCards: [],
      notifications: [
         { id: 'n1', title: 'Welcome!', message: 'Thanks for joining FreshLeaf.', date: new Date().toDateString(), read: false, type: 'system' }
      ],
      tickets: []
    };
    
    // This function will push newUser to DB and also save any referrer updates because we read/write the full array
    saveUserSession(newUser);
    
    addToast('Account created! Welcome to FreshLeaf.', 'success');
    return true;
  };

  const logout = () => {
    setUser(null);
    setWalletBalance(0);
    setCreditPoints(0);
    setNotifications([]);
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

  const createSupportTicket = (subject: string, message: string) => {
    if(!user) return '';
    const ticketId = 'TKT-' + Math.floor(1000 + Math.random() * 9000);
    const newTicket: SupportTicket = {
        id: ticketId,
        subject,
        status: 'Open',
        date: new Date().toLocaleDateString(),
        lastUpdate: 'Just now'
    };
    
    // Get latest user state to ensure we append to current tickets
    const currentTickets = user.tickets || [];
    const updatedTickets = [newTicket, ...currentTickets];
    
    updateProfile({ tickets: updatedTickets });
    
    console.log(`[Support System] New Ticket from ${user.email}: ${subject} - ${message}`);
    return ticketId;
  };

  return (
    <AuthContext.Provider value={{ 
        user, login, signup, logout, updateProfile, joinMembership, 
        isAuthenticated: !!user, sendOTP, loginWithOTP, 
        walletBalance, creditPoints, addToWallet,
        addSavedCard, removeSavedCard, notifications: user?.notifications || [], markNotificationRead,
        createSupportTicket
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
