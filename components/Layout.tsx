
import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Search, Leaf, Phone, Crown, ChevronRight, Mail, MapPin, Facebook, Twitter, Instagram, MessageCircle, Youtube, ShieldCheck, LogOut, ShoppingBag, Mic } from 'lucide-react';
import { useCart } from '../services/CartContext';
import { useAuth } from '../services/AuthContext';
import { ChatBot } from './ChatBot';
import { BackToTop } from './BackToTop';
import { PRODUCTS } from '../constants';
import { Product } from '../types';

export const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
            setShowSuggestions(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Smart Search Logic
  useEffect(() => {
    if (searchTerm.length > 1) {
        const results = PRODUCTS.filter(p => 
            p.name.en.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 5);
        setSearchSuggestions(results);
        setShowSuggestions(true);
    } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
    }
  }, [searchTerm]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchTerm)}`);
      setIsMenuOpen(false);
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        navigate(`/shop?q=${encodeURIComponent(transcript)}`);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Voice search is not supported in this browser.");
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-gray-50/30">
      
      {/* Top Bar - Premium Dark Gradient */}
      <div className="bg-gradient-to-r from-gray-900 to-leaf-900 text-white py-2 px-4 text-[11px] md:text-xs font-medium tracking-wide relative z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 md:gap-6">
            <span className="flex items-center gap-1.5 text-leaf-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> 
              Express Delivery in Kolkata
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-white/80 hover:text-white transition-colors cursor-pointer">
              <Phone size={12} /> +91 85130 28892
            </span>
          </div>
          <div className="flex gap-4 items-center">
            {user?.isPro ? (
              <span className="flex items-center gap-1.5 text-yellow-400 font-bold bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
                <Crown size={12} fill="currentColor" /> Pro Member
              </span>
            ) : (
              <Link to="/subscription" className="hover:text-yellow-300 transition-colors text-white/90 flex items-center gap-1 group">
                Join Pro <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
            <div className="w-px h-3 bg-white/20 hidden sm:block"></div>
            <Link to="/orders" className="hover:text-white transition-colors text-white/90 hidden sm:block">Track Order</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar - Glassmorphism */}
      <nav 
        className={`sticky top-0 z-40 transition-all duration-300 w-full border-b ${
          isScrolled 
            ? 'bg-white/85 backdrop-blur-md border-gray-200/50 shadow-soft py-3' 
            : 'bg-white border-gray-100 py-4 lg:py-5'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center gap-4 lg:gap-8">
            
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="bg-gradient-to-br from-leaf-500 to-leaf-600 p-2 rounded-xl text-white shadow-lg shadow-leaf-200 group-hover:scale-105 transition-transform duration-300">
                <Leaf size={24} fill="currentColor" className="text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-extrabold text-gray-800 leading-none tracking-tight group-hover:text-leaf-600 transition-colors">
                  Fresh<span className="text-leaf-600">Leaf</span>
                </h1>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.25em] ml-0.5">Organic</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 bg-gray-50/50 p-1 rounded-full border border-gray-100/50">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    location.pathname === link.path 
                      ? 'bg-white text-leaf-700 shadow-sm' 
                      : 'text-gray-500 hover:text-leaf-600 hover:bg-white/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Search Bar - Smart Suggestions */}
            <div ref={searchRef} className="hidden md:flex relative group w-full max-w-[240px] xl:max-w-xs">
              <form onSubmit={handleSearch} className="w-full">
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => { if(searchTerm.length > 1) setShowSuggestions(true); }}
                  placeholder={isListening ? "Listening..." : "Search for vegetables..."}
                  className={`w-full pl-10 pr-10 py-2.5 bg-gray-100/80 border-transparent border-2 rounded-full focus:bg-white focus:border-leaf-500/30 focus:ring-4 focus:ring-leaf-500/10 transition-all outline-none text-sm placeholder-gray-400 ${isListening ? 'animate-pulse border-red-400' : ''}`}
                />
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-leaf-600 transition-colors" />
                <button 
                  type="button" 
                  onClick={handleVoiceSearch}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition ${isListening ? 'text-red-500' : 'text-gray-400'}`}
                >
                  <Mic size={16} />
                </button>
              </form>
              
              {/* Dropdown Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {searchSuggestions.map(p => (
                        <Link 
                            key={p.id} 
                            to={`/product/${p.id}`}
                            onClick={() => { setShowSuggestions(false); setSearchTerm(''); }}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-0"
                        >
                            <img src={p.image} alt="" className="w-8 h-8 rounded object-cover" />
                            <div>
                                <p className="text-sm font-bold text-gray-800">{p.name.en}</p>
                                <p className="text-xs text-gray-500">{p.category}</p>
                            </div>
                        </Link>
                    ))}
                    <div 
                        onClick={handleSearch} 
                        className="p-2 text-center text-xs font-bold text-leaf-600 bg-gray-50 cursor-pointer hover:bg-gray-100"
                    >
                        View all results
                    </div>
                </div>
              )}
            </div>

            {/* Actions Area */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Mobile Search Toggle */}
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <Search size={22} />
              </button>

              {/* User Account */}
              <div className="hidden md:block">
                 {user ? (
                  <Link to="/account" className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-100 hover:border-leaf-200 hover:bg-leaf-50/50 transition-all group">
                    <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-white" />
                    <span className="text-sm font-bold text-gray-700 group-hover:text-leaf-700 max-w-[80px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </Link>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-leaf-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <User size={20} /> <span className="hidden xl:inline">Login</span>
                  </Link>
                )}
              </div>

              {/* Cart Button */}
              <Link to="/cart" className="relative group">
                <div className="p-2.5 rounded-full bg-gray-100/80 text-gray-700 group-hover:bg-leaf-500 group-hover:text-white transition-all duration-300">
                  <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                </div>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-in zoom-in">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Menu Toggle */}
              <button
                className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Off-Canvas Menu Drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        ></div>
        
        {/* Drawer Panel */}
        <div className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            
            {/* Drawer Header */}
            <div className="p-5 bg-gradient-to-br from-leaf-600 to-leaf-800 text-white">
              <div className="flex justify-between items-start mb-6">
                 {user ? (
                   <div className="flex items-center gap-3">
                     <img src={user.avatar} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white/30 shadow-md" />
                     <div>
                       <h3 className="font-bold text-lg">{user.name}</h3>
                       <p className="text-white/70 text-xs">{user.email}</p>
                     </div>
                   </div>
                 ) : (
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                       <User size={24} />
                     </div>
                     <div>
                       <h3 className="font-bold text-lg">Welcome Guest</h3>
                       <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-white/90 text-xs hover:underline flex items-center gap-1">
                         Login / Register <ChevronRight size={10} />
                       </Link>
                     </div>
                   </div>
                 )}
                 <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative md:hidden">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..." 
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 text-white placeholder-white/60 text-sm transition-all"
                />
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60" />
              </form>
            </div>

            {/* Drawer Links */}
            <div className="flex-grow overflow-y-auto py-4 px-2">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors ${
                      location.pathname === link.path 
                        ? 'bg-leaf-50 text-leaf-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                    <ChevronRight size={16} className="text-gray-400" />
                  </Link>
                ))}
              </div>

              <div className="h-px bg-gray-100 my-4 mx-4"></div>

              <div className="space-y-1">
                {user ? (
                  <>
                    <Link to="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl">
                      <User size={20} className="text-gray-400" /> My Account
                    </Link>
                    <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl">
                      <ShoppingBag size={20} className="text-gray-400" /> My Orders
                    </Link>
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-left">
                      <LogOut size={20} /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-leaf-700 font-bold hover:bg-leaf-50 rounded-xl">
                    <User size={20} /> Login / Signup
                  </Link>
                )}
                <Link to="/subscription" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-yellow-600 font-bold hover:bg-yellow-50 rounded-xl">
                  <Crown size={20} /> Pro Membership
                </Link>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-gray-50 text-xs text-gray-500 text-center border-t border-gray-100">
              <p>&copy; 2023 FreshLeaf. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <ChatBot />
      <BackToTop />

      {/* Advanced Professional Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800 font-sans mt-20">
        <div className="container mx-auto px-4">
          
          {/* Newsletter Section */}
          <div className="bg-leaf-800 rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
             <div className="relative z-10 text-center md:text-left">
               <h3 className="text-2xl font-bold mb-2 text-white">Join our Farm Family</h3>
               <p className="text-leaf-100">Subscribe to get fresh deals, new arrivals, and farm updates!</p>
             </div>
             <div className="relative z-10 w-full md:w-auto flex flex-col sm:flex-row gap-2">
               <input type="email" placeholder="Enter your email" className="bg-white/10 border border-white/20 text-white placeholder-leaf-200 px-4 py-3 rounded-lg w-full md:w-80 focus:outline-none focus:border-leaf-400 transition" />
               <button className="bg-white text-leaf-900 px-6 py-3 rounded-lg font-bold hover:bg-leaf-50 transition">Subscribe</button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Col 1: About & Contact */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                 <Leaf className="text-leaf-500" />
                 <span className="text-2xl font-extrabold tracking-tight">FreshLeaf</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Kolkata's most trusted online grocery store. We deliver fresh, farm-sourced fruits and vegetables directly to your doorstep.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-gray-400 text-sm">
                  <MapPin size={18} className="mt-1 text-leaf-500 shrink-0" />
                  <span>123 Green Market, Sector 4, Kolkata 700001</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Phone size={18} className="text-leaf-500 shrink-0" />
                  <span>+91 85130 28892 (9 AM – 9 PM)</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Mail size={18} className="text-leaf-500 shrink-0" />
                  <span>subhajitabir@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <ShieldCheck size={18} className="text-leaf-500 shrink-0" />
                  <span>FSSAI Lic. No. 12345678901234</span>
                </div>
              </div>
            </div>

            {/* Col 2: Customer Support */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-2 inline-block">Customer Support</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                 <li><Link to="/contact" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> Contact Us</Link></li>
                 <li><Link to="/faq" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> FAQs</Link></li>
                 <li><Link to="/orders" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> Order Tracking</Link></li>
                 <li><Link to="/partner" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> Bulk / Wholesale</Link></li>
                 <li><Link to="/refund-policy" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> Return & Refund</Link></li>
                 <li><Link to="/shipping-policy" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> Shipping Info</Link></li>
                 <li><Link to="/refund-policy" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> Replacement Policy</Link></li>
                 <li><a href="#" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> Chat Support</a></li>
              </ul>
            </div>

            {/* Col 3: Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-2 inline-block">Quick Links</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                 <li><Link to="/" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> Home</Link></li>
                 <li><Link to="/shop?q=Vegetable" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> Fresh Vegetables</Link></li>
                 <li><Link to="/shop?q=Fruit" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> Fresh Fruits</Link></li>
                 <li><Link to="/shop" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> Offers & Discounts</Link></li>
                 <li><Link to="/account" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> My Account</Link></li>
                 <li><Link to="/cart" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> My Cart</Link></li>
                 <li><Link to="/blog" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> Blog / Recipes</Link></li>
                 <li><Link to="/shop" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> Gift Packs</Link></li>
                 <li><Link to="/partner" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> Farmer Partnership</Link></li>
              </ul>
            </div>

            {/* Col 4: Legal & Social */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-2 inline-block">Policy & Legal</h4>
              <ul className="space-y-3 text-sm text-gray-400 mb-8">
                 <li><Link to="/privacy" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> Privacy Policy</Link></li>
                 <li><Link to="/terms" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> Terms & Conditions</Link></li>
                 <li><Link to="/shipping-policy" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> Shipping Policy</Link></li>
                 <li><Link to="/refund-policy" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> Return Policy</Link></li>
                 <li><Link to="/cancellation-policy" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> Cancellation Policy</Link></li>
                 <li><Link to="/disclaimer" className="hover:text-leaf-400 transition flex items-center gap-2"><ChevronRight size={14}/> Disclaimer</Link></li>
              </ul>
              
              <h4 className="text-lg font-bold text-white mb-4">Follow Us</h4>
              <div className="flex gap-4">
                 {/* Social Icons */}
                 <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition"><Facebook size={18}/></a>
                 <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 hover:text-white transition"><Instagram size={18}/></a>
                 <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-green-500 hover:text-white transition"><MessageCircle size={18}/></a>
                 <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-red-600 hover:text-white transition"><Youtube size={18}/></a>
                 <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-black hover:text-white transition"><Twitter size={18}/></a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-gray-500 text-sm">© {new Date().getFullYear()} FreshLeaf. All Rights Reserved.</p>
              
              {/* Payment Methods */}
              <div className="flex flex-wrap justify-center gap-3">
                {['UPI', 'Visa', 'MasterCard', 'RuPay', 'NetBanking', 'Wallet', 'COD'].map((method, i) => (
                   <div key={i} className="bg-white px-3 py-1.5 rounded-md text-[10px] font-bold text-gray-800 shadow-sm border border-gray-200">
                     {method}
                   </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
