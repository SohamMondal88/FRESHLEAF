
import React, { useState } from 'react';
import { BarChart3, Users, ShoppingBag, DollarSign, Package, Bell, Edit, Trash2, RefreshCw, Plus, Tag, Bike, Truck, MessageCircle, X } from 'lucide-react';
import { PRODUCTS, RIDERS, COUPONS } from '../constants';
import { useOrder } from '../services/OrderContext';
import { useAuth } from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Order } from '../types';

export const Admin: React.FC = () => {
  const { user } = useAuth();
  const { orders, updateOrderStatus, assignRider } = useOrder();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'users' | 'riders' | 'coupons'>('dashboard');
  
  // Modal State for assigning rider
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showRiderModal, setShowRiderModal] = useState(false);

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

  const handleStatusChange = (orderId: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Order['status'];
    updateOrderStatus(orderId, newStatus);
  };

  const handleAssignRiderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowRiderModal(true);
  };

  const confirmRiderAssignment = (riderId: string) => {
    if (selectedOrder) {
      assignRider(selectedOrder.id, riderId);
      updateOrderStatus(selectedOrder.id, 'Out for Delivery');
      setShowRiderModal(false);
      setSelectedOrder(null);
    }
  };

  const sendWhatsAppUpdate = (order: Order) => {
    if (order.customerPhone) {
      const message = `Hello ${order.customerName}, your FreshLeaf order ${order.id} is currently ${order.status}. Rider: ${order.riderName || 'Assigned'}. Track here: https://freshleaf.in/track/${order.id}`;
      const url = `https://wa.me/91${order.customerPhone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    } else {
      alert('Customer phone number not available');
    }
  };

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button 
      onClick={() => setActiveTab(id)} 
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition mb-1 ${activeTab === id ? 'bg-white/20 text-white' : 'text-leaf-100 hover:bg-white/10'}`}
    >
      <Icon size={20}/> {label}
    </button>
  );

  const ProductsTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-900 text-lg">Product Inventory</h3>
        <button className="bg-leaf-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-leaf-700 flex items-center gap-2"><Plus size={16}/> Add Product</button>
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
                  <div><p className="font-bold text-gray-900">{p.name.en}</p><p className="text-xs text-gray-500">{p.id}</p></div>
                </td>
                <td className="px-6 py-4 text-gray-600">{p.category}</td>
                <td className="px-6 py-4 font-medium">₹{p.price}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${p.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.inStock ? 'In Stock' : 'Out of Stock'}</span></td>
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
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Rider</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-mono text-gray-500">{o.id}</td>
                <td className="px-6 py-4"><p className="font-bold text-gray-900">{o.customerName || 'Guest'}</p><p className="text-xs text-gray-500">{o.date}</p></td>
                <td className="px-6 py-4">
                  <select 
                    value={o.status} 
                    onChange={(e) => handleStatusChange(o.id, e)}
                    className={`px-2 py-1 rounded text-xs font-bold outline-none border-none cursor-pointer
                    ${o.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                      o.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                      o.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Packed">Packed</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  {o.riderName ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-gray-700">
                      <Bike size={12}/> {o.riderName}
                    </span>
                  ) : (
                    <button onClick={() => handleAssignRiderClick(o)} className="text-xs text-blue-600 hover:underline">Assign Rider</button>
                  )}
                </td>
                <td className="px-6 py-4 font-bold">₹{o.total}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button onClick={() => sendWhatsAppUpdate(o)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100" title="Send WhatsApp Update">
                    <MessageCircle size={16} />
                  </button>
                  <button className="p-2 border rounded-lg hover:bg-gray-50" title="View Details"><Truck size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const RidersTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-900 text-lg">Delivery Riders</h3>
        <button className="bg-leaf-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-leaf-700 flex items-center gap-2"><Plus size={16}/> Add Rider</button>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase">
          <tr>
            <th className="px-6 py-4">Rider</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Rating</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {RIDERS.map(r => (
            <tr key={r.id} className="hover:bg-gray-50/50">
              <td className="px-6 py-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">{r.name[0]}</div>
                <div><p className="font-bold text-gray-900">{r.name}</p><p className="text-xs text-gray-500">{r.vehicle} • {r.phone}</p></div>
              </td>
              <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${r.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{r.status}</span></td>
              <td className="px-6 py-4 font-bold">⭐ {r.rating}</td>
              <td className="px-6 py-4 text-right"><button className="text-blue-600 font-bold text-xs">View Profile</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const CouponsTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-900 text-lg">Discount Coupons</h3>
        <button className="bg-leaf-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-leaf-700 flex items-center gap-2"><Plus size={16}/> Create Coupon</button>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase">
          <tr>
            <th className="px-6 py-4">Code</th>
            <th className="px-6 py-4">Discount</th>
            <th className="px-6 py-4">Description</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {COUPONS.map(c => (
            <tr key={c.id} className="hover:bg-gray-50/50">
              <td className="px-6 py-4 font-mono font-bold text-leaf-700">{c.code}</td>
              <td className="px-6 py-4 font-bold">{c.type === 'flat' ? `₹${c.value} OFF` : `${c.value}% OFF`}</td>
              <td className="px-6 py-4 text-gray-600">{c.description}</td>
              <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.isActive ? 'Active' : 'Expired'}</span></td>
              <td className="px-6 py-4 text-right"><button className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="fixed left-0 top-0 h-full w-64 bg-leaf-900 text-white flex flex-col p-6 z-20">
        <h1 className="text-2xl font-bold mb-10 flex items-center gap-2">Fresh<span className="text-leaf-400">Admin</span></h1>
        <nav className="space-y-1 flex-grow">
           <TabButton id="dashboard" label="Dashboard" icon={BarChart3} />
           <TabButton id="orders" label="Orders" icon={ShoppingBag} />
           <TabButton id="products" label="Products" icon={Package} />
           <TabButton id="users" label="Users" icon={Users} />
           <TabButton id="riders" label="Delivery Fleet" icon={Bike} />
           <TabButton id="coupons" label="Coupons" icon={Tag} />
        </nav>
        <div className="mt-auto pt-6 border-t border-leaf-700">
          <div className="flex items-center gap-3">
             <img src={user.avatar} alt="Admin" className="w-10 h-10 rounded-full border-2 border-leaf-400" />
             <div><p className="text-sm font-bold">{user.name}</p><p className="text-xs text-leaf-300">Super Admin</p></div>
          </div>
        </div>
      </div>

      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-10">
           <div>
             <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h1>
             <p className="text-gray-500">Manage your store efficiently.</p>
           </div>
           <div className="flex items-center gap-4">
              <button className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"><Bell size={20}/></button>
              <button onClick={() => navigate('/')} className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-sm">View Site</button>
           </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: `₹${totalRevenue}`, change: '+12.5%', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Total Orders', value: totalOrders, change: '+8.2%', icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Pending Orders', value: pendingOrders, change: 'Action Needed', icon: Bell, color: 'text-orange-600', bg: 'bg-orange-50' },
                { label: 'Active Riders', value: '12', change: 'Online', icon: Bike, color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}><stat.icon size={24} /></div>
                    <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">{stat.change}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
            <OrdersTable />
          </div>
        )}

        {activeTab === 'products' && <div className="animate-in fade-in"><ProductsTable /></div>}
        {activeTab === 'orders' && <div className="animate-in fade-in"><OrdersTable /></div>}
        {activeTab === 'riders' && <div className="animate-in fade-in"><RidersTable /></div>}
        {activeTab === 'coupons' && <div className="animate-in fade-in"><CouponsTable /></div>}
        {activeTab === 'users' && <div className="animate-in fade-in bg-white p-10 rounded-xl shadow-sm text-center text-gray-500">User Management Module Placeholder</div>}

      </div>

      {/* Rider Assignment Modal */}
      {showRiderModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Assign Rider for Order #{selectedOrder?.id}</h3>
              <button onClick={() => setShowRiderModal(false)}><X size={20} className="text-gray-500"/></button>
            </div>
            <div className="space-y-2 mb-6">
              {RIDERS.map(rider => (
                <button 
                  key={rider.id}
                  onClick={() => confirmRiderAssignment(rider.id)}
                  disabled={rider.status !== 'Available'}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${rider.status === 'Available' ? 'hover:bg-blue-50 hover:border-blue-300' : 'opacity-50 cursor-not-allowed bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">{rider.name[0]}</div>
                    <div className="text-left">
                      <p className="font-bold text-sm">{rider.name}</p>
                      <p className="text-xs text-gray-500">{rider.vehicle}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${rider.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{rider.status}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowRiderModal(false)} className="w-full py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};
