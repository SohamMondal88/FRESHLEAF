
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, Settings, MapPin, CreditCard, Bell, Heart, LogOut, 
  Crown, ChevronRight, User, Camera, Plus, Trash2, Home, 
  TrendingUp, DollarSign, Calendar, FileText, Edit2, X, Check
} from 'lucide-react';
import { useAuth } from '../services/AuthContext';
import { useOrder } from '../services/OrderContext';
import { useCart } from '../services/CartContext';

// --- MOCK DATA FOR CHARTS & TRANSACTIONS ---
const TRANSACTIONS = [
  { id: 'TXN-8821', date: 'Oct 24, 2023', type: 'Debit', description: 'Order #ORD-8821', amount: -1250, status: 'Completed' },
  { id: 'TXN-8820', date: 'Oct 20, 2023', type: 'Credit', description: 'Refund for #ORD-8819', amount: +350, status: 'Completed' },
  { id: 'TXN-8815', date: 'Oct 15, 2023', type: 'Debit', description: 'Order #ORD-8815', amount: -850, status: 'Completed' },
  { id: 'TXN-8801', date: 'Oct 01, 2023', type: 'Credit', description: 'Wallet Top-up', amount: +2000, status: 'Completed' },
];

export const Account: React.FC = () => {
  const { user, logout, updateProfile, addSavedCard, removeSavedCard, notifications, markNotificationRead } = useAuth();
  const { orders } = useOrder();
  const { wishlist } = useCart();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Address State
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Home', text: user?.address || '123 Green Market, Sector 4, New Delhi', isDefault: true },
    { id: 2, type: 'Work', text: 'Business Hub, Floor 4, Cyber City, Gurgaon', isDefault: false }
  ]);
  const [newAddress, setNewAddress] = useState({ type: 'Home', text: '' });
  
  // New Card State
  const [newCard, setNewCard] = useState({ number: '', name: '', expiry: '' });

  if (!user) {
    navigate('/login');
    return null;
  }

  // --- ANALYTICS CALCULATIONS ---
  const totalSpent = orders.reduce((acc, order) => acc + order.total, 0);
  const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  const monthlyData = [
    { month: 'Jun', amount: 0 },
    { month: 'Jul', amount: 1500 },
    { month: 'Aug', amount: 3200 },
    { month: 'Sep', amount: 2100 },
    { month: 'Oct', amount: totalSpent > 0 ? totalSpent : 4500 },
    { month: 'Nov', amount: 1200 },
  ];
  const maxSpend = Math.max(...monthlyData.map(d => d.amount));

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

  // --- SUB-COMPONENTS ---
  
  const DashboardView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Orders</div>
          <div className="text-2xl font-extrabold text-gray-900">{orders.length}</div>
          <div className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1"><TrendingUp size={12}/> +2 this month</div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Spent</div>
          <div className="text-2xl font-extrabold text-gray-900">₹{totalSpent.toLocaleString()}</div>
          <div className="text-xs text-gray-400 font-bold mt-2">Lifetime</div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Wishlist</div>
          <div className="text-2xl font-extrabold text-gray-900">{wishlist.length}</div>
          <div className="text-xs text-leaf-600 font-bold mt-2">Items saved</div>
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
            <DollarSign className="text-leaf-600" size={20}/> Spending Overview
          </h3>
          <div className="flex items-end justify-between h-48 gap-2">
            {monthlyData.map((data, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                <div 
                  className="w-full bg-leaf-100 rounded-t-lg relative group-hover:bg-leaf-500 transition-all duration-300"
                  style={{ height: `${(data.amount / maxSpend) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    ₹{data.amount}
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-400">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               <Bell className="text-leaf-600" size={20}/> Alerts
             </h3>
             <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{notifications.filter(n=>!n.read).length} New</span>
          </div>
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
            {notifications.length === 0 && <p className="text-xs text-gray-400">No new notifications</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const AddressesView = () => (
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
  );

  const WalletView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white flex flex-col md:flex-row justify-between items-center shadow-xl">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">FreshLeaf Wallet Balance</p>
          <h2 className="text-4xl font-extrabold">₹1,250.00</h2>
        </div>
        <div className="mt-6 md:mt-0 flex gap-3">
          <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-bold transition">Add Money</button>
          <button className="bg-leaf-500 hover:bg-leaf-600 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-leaf-900/50">Redeem Points</button>
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

        {/* Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Transaction History</h3>
            <button className="text-leaf-600 text-sm font-bold hover:underline">Full Statement</button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-left">
              <tbody className="divide-y divide-gray-100">
                {TRANSACTIONS.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{txn.description}</p>
                      <p className="text-xs text-gray-500">{txn.date}</p>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold text-sm ${txn.type === 'Credit' ? 'text-green-600' : 'text-gray-900'}`}>
                      {txn.type === 'Credit' ? '+' : ''}₹{Math.abs(txn.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

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
                { id: 'wallet', label: 'Wallet & Payments', icon: CreditCard },
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
             {activeTab === 'dashboard' && <DashboardView />}
             {activeTab === 'addresses' && <AddressesView />}
             {activeTab === 'wallet' && <WalletView />}
          </div>
        </div>
      </div>
    </div>
  );
};
