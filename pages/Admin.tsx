
import React, { useState } from 'react';
import { BarChart3, Users, ShoppingBag, DollarSign, TrendingUp, Package, Bell, Search, Settings, Edit, Trash2, CheckCircle, XCircle, Truck, RefreshCw } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { useOrder } from '../services/OrderContext';
import { useAuth } from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Admin: React.FC = () => {
  const { user } = useAuth();
  const { orders } = useOrder();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products'>('dashboard');

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-6">You do not have permission to view the admin panel.</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-gray-900 text-white rounded-lg">Go Home</button>
      </div>
    );
  }

  // Analytics Logic
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;

  const ProductsTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-900 text-lg">Product Inventory</h3>
        <button className="bg-leaf-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-leaf-700">
          + Add Product
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {PRODUCTS.map(p => (
              <tr key={p.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img src={p.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                  <div>
                    <p className="font-bold text-gray-900">{p.name.en}</p>
                    <p className="text-xs text-gray-500">{p.id}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{p.category}</td>
                <td className="px-6 py-4 font-medium">₹{p.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${p.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {p.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Edit size={16}/></button>
                  <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const OrdersTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-900 text-lg">Order Management</h3>
        <div className="flex gap-2">
           <button className="p-2 border rounded-lg hover:bg-gray-50"><RefreshCw size={16}/></button>
           <button className="p-2 border rounded-lg hover:bg-gray-50"><Settings size={16}/></button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-mono text-gray-500">{o.id}</td>
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{o.customerName || 'Guest'}</p>
                  <p className="text-xs text-gray-500">{o.date}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit
                    ${o.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                      o.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                      o.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {o.status === 'Delivered' && <CheckCircle size={12}/>}
                    {o.status === 'Processing' && <RefreshCw size={12} className="animate-spin-slow"/>}
                    {o.status === 'Out for Delivery' && <Truck size={12}/>}
                    {o.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold">₹{o.total}</td>
                <td className="px-6 py-4 text-right">
                  <select className="bg-gray-50 border border-gray-200 text-xs rounded p-1 outline-none focus:border-leaf-500">
                    <option>Update Status</option>
                    <option>Mark Packed</option>
                    <option>Ship Order</option>
                    <option>Deliver</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-leaf-900 text-white flex flex-col p-6 z-20">
        <h1 className="text-2xl font-bold mb-10 flex items-center gap-2">Fresh<span className="text-leaf-400">Admin</span></h1>
        <nav className="space-y-2 flex-grow">
           <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === 'dashboard' ? 'bg-white/20 text-white' : 'text-leaf-100 hover:bg-white/10'}`}>
             <BarChart3 size={20}/> Dashboard
           </button>
           <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === 'orders' ? 'bg-white/20 text-white' : 'text-leaf-100 hover:bg-white/10'}`}>
             <ShoppingBag size={20}/> Orders
           </button>
           <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === 'products' ? 'bg-white/20 text-white' : 'text-leaf-100 hover:bg-white/10'}`}>
             <Package size={20}/> Products
           </button>
           <button className="w-full flex items-center gap-3 px-4 py-3 text-leaf-100 hover:bg-white/10 rounded-xl transition"><Users size={20}/> Users</button>
        </nav>
        <div className="mt-auto pt-6 border-t border-leaf-700">
          <div className="flex items-center gap-3">
             <img src={user.avatar} alt="Admin" className="w-10 h-10 rounded-full border-2 border-leaf-400" />
             <div>
               <p className="text-sm font-bold">{user.name}</p>
               <p className="text-xs text-leaf-300">Super Admin</p>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
           <div>
             <h1 className="text-2xl font-bold text-gray-900">
               {activeTab === 'dashboard' && 'Dashboard Overview'}
               {activeTab === 'orders' && 'Order Management'}
               {activeTab === 'products' && 'Product Catalog'}
             </h1>
             <p className="text-gray-500">Welcome back, {user.name.split(' ')[0]}.</p>
           </div>
           <div className="flex items-center gap-4">
              <button className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"><Bell size={20}/></button>
              <button onClick={() => navigate('/')} className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-sm">View Site</button>
           </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: `₹${totalRevenue}`, change: '+12.5%', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Total Orders', value: totalOrders, change: '+8.2%', icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Pending', value: pendingOrders, change: 'Action Needed', icon: Bell, color: 'text-orange-600', bg: 'bg-orange-50' },
                { label: 'Avg Order', value: '₹850', change: '-2.4%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                      <stat.icon size={24} />
                    </div>
                    <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">{stat.change}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
            
            {/* Recent Orders Preview */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
               <div className="space-y-4">
                 {orders.slice(0, 5).map(o => (
                   <div key={o.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {o.customerName ? o.customerName[0] : 'G'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">New Order from {o.customerName || 'Guest'}</p>
                          <p className="text-xs text-gray-500">{o.id} • ₹{o.total}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-500">{o.date}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && <div className="animate-in fade-in"><ProductsTable /></div>}
        {activeTab === 'orders' && <div className="animate-in fade-in"><OrdersTable /></div>}

      </div>
    </div>
  );
};
