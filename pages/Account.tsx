
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, Settings, MapPin, CreditCard, Bell, Heart, LogOut, 
  Crown, ChevronRight, User, Camera, Plus, Trash2, Home, 
  TrendingUp, DollarSign, Calendar, FileText, Edit2, X, Check, HelpCircle, MessageSquare, Coins, Wallet, Share2, Copy, Send
} from 'lucide-react';
import { useAuth } from '../services/AuthContext';
import { useOrder } from '../services/OrderContext';
import { useCart } from '../services/CartContext';
import { useToast } from '../services/ToastContext';
import { COMPANY_INFO } from '../constants';

export const Account: React.FC = () => {
  const { user, logout, updateProfile, addSavedCard, removeSavedCard, notifications, markNotificationRead, creditPoints, walletBalance, createSupportTicket } = useAuth();
  const { orders } = useOrder();
  const { wishlist } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  
  // Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Address State
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Home', text: user?.address || '123 Green Market, Sector 4, New Delhi', isDefault: true },
  ]);
  const [newAddress, setNewAddress] = useState({ type: 'Home', text: '' });
  
  // New Card State
  const [newCard, setNewCard] = useState({ number: '', name: '', expiry: '' });

  if (!user) {
    navigate('/login');
    return null;
  }

  // --- ANALYTICS CALCULATIONS ---
  const myOrders = orders.filter(o => o.userId === user.id);
  const totalSpent = myOrders.reduce((acc, order) => acc + order.total, 0);
  const activeOrders = myOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  // Derive Transactions from Orders
  const transactions = myOrders.map(order => ({
    id: `TXN-${order.id.split('-')[1]}`,
    date: order.date,
    type: 'Debit',
    description: `Order #${order.id}`,
    amount: -order.total,
    status: 'Completed'
  }));

  // --- HANDLERS ---
  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateProfile({ avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.text) return;
    setAddresses([...addresses, { id: Date.now(), ...newAddress, isDefault: false }]);
    setNewAddress({ type: 'Home', text: '' });
    setIsEditingAddress(false);
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCard.number.length < 16) return;
    addSavedCard({
      id: Math.random().toString(36),
      last4: newCard.number.slice(-4),
      brand: 'Visa',
      expiry: newCard.expiry,
      holderName: newCard.name
    });
    setIsAddingCard(false);
    setNewCard({ number: '', name: '', expiry: '' });
  };

  const copyReferralCode = () => {
    if (user.referralCode) {
        navigator.clipboard.writeText(user.referralCode);
        addToast('Referral code copied!', 'success');
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    
    // 1. Create Ticket Locally
    const ticketId = createSupportTicket(ticketSubject, ticketMessage);
    
    // 2. Send to WhatsApp
    const waMessage = `*New Support Ticket*\n\n*Ticket ID:* ${ticketId}\n*User:* ${user.name} (${user.phone})\n*Subject:* ${ticketSubject}\n*Issue:* ${ticketMessage}`;
    const url = `https://wa.me/918513028892?text=${encodeURIComponent(waMessage)}`;
    window.open(url, '_blank');

    addToast('Redirecting to WhatsApp to send report...', 'success');

    // 3. Reset UI
    setTicketSubject('');
    setTicketMessage('');
    setIsCreatingTicket(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">My Account</h1>
            <p className="text-gray-500 mt-1">Manage your profile, orders, and preferences.</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-900">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <p className="text-xs text-leaf-600 font-medium">Welcome back, {user.name.split(' ')[0]}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-20 bg-leaf-600"></div>
               <div className="relative z-10">
                 <div className="relative inline-block">
                   <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white" />
                   <button onClick={handleAvatarClick} className="absolute bottom-0 right-0 bg-gray-900 text-white p-1.5 rounded-full hover:bg-leaf-600 transition shadow-sm"><Camera size={14} /></button>
                   <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                 </div>
                 <h2 className="text-xl font-bold text-gray-900 mt-3">{user.name}</h2>
                 <p className="text-xs text-gray-500 mb-4">{user.email}</p>
                 {user.isPro ? (
                    <div className="bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-xl p-2 text-xs font-bold flex items-center justify-center gap-2"><Crown size={14} fill="currentColor" /> Pro Member</div>
                 ) : (
                    <Link to="/subscription" className="bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-xl p-2 text-xs font-bold flex items-center justify-center gap-2 transition"><Crown size={14} /> Upgrade to Pro</Link>
                 )}
               </div>
            </div>

            <nav className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Home },
                { id: 'orders', label: 'My Orders', icon: Package },
                { id: 'addresses', label: 'Addresses', icon: MapPin },
                { id: 'wallet', label: 'Wallet & Points', icon: CreditCard },
                { id: 'support', label: 'Support Tickets', icon: HelpCircle },
                { id: 'settings', label: 'Account Settings', icon: Settings },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    if(item.id === 'orders') navigate('/orders');
                    else if(item.id === 'settings') navigate('/settings');
                    else setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center justify-between p-4 text-sm font-bold transition-all border-b border-gray-50 last:border-0 ${
                    activeTab === item.id 
                      ? 'bg-leaf-50 text-leaf-700 border-l-4 border-l-leaf-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:pl-5'
                  }`}
                >
                  <div className="flex items-center gap-3"><item.icon size={18} /> {item.label}</div>
                  {activeTab === item.id && <ChevronRight size={16} />}
                </button>
              ))}
              <button onClick={logout} className="w-full flex items-center gap-3 p-4 text-sm font-bold text-red-500 hover:bg-red-50 transition-all border-t border-gray-100">
                <LogOut size={18} /> Sign Out
              </button>
            </nav>
          </div>

          <div className="lg:col-span-9">
             {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                      <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Orders</div>
                      <div className="text-2xl font-extrabold text-gray-900">{myOrders.length}</div>
                      <div className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1"><TrendingUp size={12}/> Lifetime</div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                      <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Spent</div>
                      <div className="text-2xl font-extrabold text-gray-900">₹{totalSpent.toLocaleString()}</div>
                      <div className="text-xs text-gray-400 font-bold mt-2">Lifetime</div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                      <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Credit Points</div>
                      <div className="text-2xl font-extrabold text-amber-500">{creditPoints}</div>
                      <div className="text-xs text-leaf-600 font-bold mt-2">Use at checkout</div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                      <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Active</div>
                      <div className="text-2xl font-extrabold text-gray-900">{activeOrders}</div>
                      <div className="text-xs text-orange-500 font-bold mt-2">In transit</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Bell className="text-leaf-600" size={20}/> Alerts
                      </h3>
                      <div className="space-y-4">
                        {notifications.slice(0, 3).map(n => (
                          <div key={n.id} className="flex gap-3 p-3 bg-leaf-50 rounded-xl border border-leaf-100">
                             <div className="w-2 h-2 mt-1.5 bg-leaf-500 rounded-full shrink-0"></div>
                             <div>
                               <p className="text-sm font-bold text-gray-800">{n.title}</p>
                               <p className="text-xs text-gray-500">{n.message}</p>
                             </div>
                          </div>
                        ))}
                        {notifications.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-400 text-sm">No new notifications</p>
                            </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-center">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                       <div className="relative z-10">
                           <h3 className="text-xl font-bold mb-2">Refer & Earn</h3>
                           <p className="text-purple-100 text-sm mb-6">Share your unique code. Earn 50 points per referral!</p>
                           <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/20 flex items-center justify-between">
                              <span className="font-mono font-bold tracking-wider">{user.referralCode || 'GENERATE'}</span>
                              <button onClick={copyReferralCode} className="p-2 hover:bg-white/20 rounded-lg transition"><Copy size={16}/></button>
                           </div>
                       </div>
                    </div>
                  </div>
                </div>
             )}

             {activeTab === 'addresses' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Saved Addresses</h3>
                    <button onClick={() => setIsEditingAddress(true)} className="bg-leaf-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-leaf-700 transition">
                      <Plus size={16} /> Add New
                    </button>
                  </div>

                  {isEditingAddress && (
                    <form onSubmit={handleAddAddress} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6">
                       <h4 className="font-bold text-gray-900 mb-4">Add New Address</h4>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                         <select 
                          value={newAddress.type} 
                          onChange={e => setNewAddress({...newAddress, type: e.target.value})}
                          className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-leaf-500"
                         >
                           <option>Home</option>
                           <option>Work</option>
                           <option>Other</option>
                         </select>
                         <input 
                          type="text" 
                          placeholder="Full Address (House, Street, City, Zip)" 
                          className="md:col-span-2 p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-leaf-500"
                          value={newAddress.text}
                          onChange={e => setNewAddress({...newAddress, text: e.target.value})}
                          required
                         />
                       </div>
                       <div className="flex justify-end gap-3">
                         <button type="button" onClick={() => setIsEditingAddress(false)} className="px-4 py-2 text-gray-500 font-bold hover:text-gray-700">Cancel</button>
                         <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800">Save Address</button>
                       </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(addr => (
                      <div key={addr.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-leaf-300 transition relative group">
                         <div className="flex items-start justify-between mb-2">
                           <div className="flex items-center gap-2">
                             <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded uppercase">{addr.type}</span>
                             {addr.isDefault && <span className="text-leaf-600 text-xs font-bold flex items-center gap-1"><Check size={12}/> Default</span>}
                           </div>
                           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="text-gray-400 hover:text-blue-500"><Edit2 size={16}/></button>
                             {!addr.isDefault && <button onClick={() => handleDeleteAddress(addr.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>}
                           </div>
                         </div>
                         <p className="text-gray-600 text-sm leading-relaxed">{addr.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
             )}

             {activeTab === 'wallet' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white flex flex-col justify-between shadow-xl min-h-[180px]">
                        <div>
                        <p className="text-gray-400 text-sm font-medium mb-1 flex items-center gap-2"><Wallet size={16}/> Wallet Balance</p>
                        <h2 className="text-4xl font-extrabold">₹{walletBalance.toLocaleString('en-IN')}</h2>
                        </div>
                        <div className="mt-4">
                        <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2 rounded-xl font-bold transition text-sm">Add Money</button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 text-white flex flex-col justify-between shadow-xl min-h-[180px]">
                        <div>
                        <p className="text-amber-100 text-sm font-medium mb-1 flex items-center gap-2"><Coins size={16}/> Credit Points</p>
                        <h2 className="text-4xl font-extrabold">{creditPoints} Pts</h2>
                        <p className="text-xs text-amber-100 mt-1">1 Point = ₹1. Earn 5% on every order.</p>
                        </div>
                        <div className="mt-4">
                        <button onClick={() => navigate('/shop')} className="bg-white text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-xl font-bold transition text-sm shadow-sm">Redeem Now</button>
                        </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Saved Cards */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                       <div className="flex justify-between items-center mb-6">
                         <h3 className="font-bold text-gray-900">Saved Cards</h3>
                         <button onClick={() => setIsAddingCard(true)} className="text-leaf-600 text-xs font-bold hover:underline">+ Add Card</button>
                       </div>
                       
                       {isAddingCard && (
                         <form onSubmit={handleAddCard} className="mb-6 bg-gray-50 p-4 rounded-xl">
                           <input 
                             className="w-full mb-2 p-2 rounded border" 
                             placeholder="Card Number" 
                             value={newCard.number} 
                             maxLength={16} 
                             onChange={e=>setNewCard({...newCard, number: e.target.value})} 
                           />
                           <div className="flex gap-2">
                             <input className="flex-1 p-2 rounded border" placeholder="Name" value={newCard.name} onChange={e=>setNewCard({...newCard, name: e.target.value})} />
                             <input className="w-24 p-2 rounded border" placeholder="MM/YY" value={newCard.expiry} onChange={e=>setNewCard({...newCard, expiry: e.target.value})} />
                           </div>
                           <div className="flex gap-2 mt-2">
                             <button type="submit" className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded">Save</button>
                             <button onClick={()=>setIsAddingCard(false)} type="button" className="text-gray-500 text-xs font-bold px-3 py-1.5">Cancel</button>
                           </div>
                         </form>
                       )}

                       <div className="space-y-3">
                         {(user.savedCards || []).map(card => (
                           <div key={card.id} className="flex justify-between items-center p-3 border rounded-xl hover:bg-gray-50 group">
                             <div className="flex items-center gap-3">
                               <CreditCard size={20} className="text-gray-400"/>
                               <div>
                                 <p className="text-sm font-bold text-gray-800">{card.brand} •••• {card.last4}</p>
                                 <p className="text-xs text-gray-500">Expires {card.expiry}</p>
                               </div>
                             </div>
                             <button onClick={() => removeSavedCard(card.id)} className="text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                           </div>
                         ))}
                         {(user.savedCards || []).length === 0 && <p className="text-sm text-gray-400">No saved cards.</p>}
                       </div>
                    </div>

                    {/* Transactions (Derived from Orders) */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Transaction History</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {transactions.length > 0 ? (
                            <table className="w-full text-left">
                            <tbody className="divide-y divide-gray-100">
                                {transactions.map((txn) => (
                                <tr key={txn.id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-gray-900">{txn.description}</p>
                                    <p className="text-xs text-gray-500">{txn.date}</p>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold text-sm ${txn.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                    {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount)}
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                <p>No transactions yet.</p>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
             )}

             {activeTab === 'support' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900">Support Tickets</h3>
                        <button 
                            onClick={() => setIsCreatingTicket(true)}
                            className="bg-leaf-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-leaf-700 transition"
                        >
                            <Plus size={16} /> New Ticket
                        </button>
                    </div>
                    
                    {isCreatingTicket && (
                        <form onSubmit={handleCreateTicket} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                            <h4 className="font-bold text-gray-900 mb-4">Create New Ticket</h4>
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                                <select 
                                    value={ticketSubject} 
                                    onChange={(e) => setTicketSubject(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-leaf-500"
                                    required
                                >
                                    <option value="">Select Issue Type</option>
                                    <option value="Order Issue">Order Issue</option>
                                    <option value="Payment Issue">Payment Issue</option>
                                    <option value="Product Quality">Product Quality</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                                <textarea 
                                    value={ticketMessage}
                                    onChange={(e) => setTicketMessage(e.target.value)}
                                    rows={4}
                                    placeholder="Describe your issue..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-leaf-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setIsCreatingTicket(false)} className="px-4 py-2 text-gray-500 font-bold hover:text-gray-700">Cancel</button>
                                <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800 flex items-center gap-2">
                                    <Send size={16}/> Submit & WhatsApp
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {(user.tickets && user.tickets.length > 0) ? (
                            <div className="divide-y divide-gray-100">
                                {user.tickets.map((ticket) => (
                                    <div key={ticket.id} className="p-6 hover:bg-gray-50 transition">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-gray-900">{ticket.subject}</h4>
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${ticket.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">Ticket ID: {ticket.id} • Created: {ticket.date}</p>
                                        <p className="text-xs text-gray-400 mt-1">Last Update: {ticket.lastUpdate}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-10 text-center text-gray-500">
                                <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                                <p>No tickets found.</p>
                                <p className="text-xs">Need help? Create a ticket and we'll respond within 24h.</p>
                            </div>
                        )}
                    </div>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
