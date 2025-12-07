import React from 'react';
import { BarChart3, Users, ShoppingBag, DollarSign, TrendingUp, Package, Bell, Search, Settings } from 'lucide-react';
import { PRODUCTS } from '../constants';

export const Dashboard: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Sidebar (Mock) */}
      <div className="fixed left-0 top-0 h-full w-64 bg-leaf-900 text-white hidden lg:flex flex-col p-6 z-20">
        <h1 className="text-2xl font-bold mb-10 flex items-center gap-2">Fresh<span className="text-leaf-400">Admin</span></h1>
        <nav className="space-y-2 flex-grow">
           <a href="#" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-white font-medium"><BarChart3 size={20}/> Dashboard</a>
           <a href="#" className="flex items-center gap-3 px-4 py-3 text-leaf-100 hover:bg-white/5 rounded-xl transition"><ShoppingBag size={20}/> Orders</a>
           <a href="#" className="flex items-center gap-3 px-4 py-3 text-leaf-100 hover:bg-white/5 rounded-xl transition"><Package size={20}/> Products</a>
           <a href="#" className="flex items-center gap-3 px-4 py-3 text-leaf-100 hover:bg-white/5 rounded-xl transition"><Users size={20}/> Customers</a>
        </nav>
        <div className="mt-auto pt-6 border-t border-leaf-700">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-leaf-400 flex items-center justify-center font-bold text-leaf-900">A</div>
             <div>
               <p className="text-sm font-bold">Admin User</p>
               <p className="text-xs text-leaf-300">Store Owner</p>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
           <div>
             <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
             <p className="text-gray-500">Welcome back, here's what's happening today.</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                 <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                 <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-leaf-500" />
              </div>
              <button className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"><Bell size={20}/></button>
              <button className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"><Settings size={20}/></button>
           </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Revenue', value: '₹1,24,000', change: '+12.5%', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'New Orders', value: '145', change: '+8.2%', icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Total Customers', value: '1,200', change: '+3.1%', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Avg Order Value', value: '₹850', change: '-2.4%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                 <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                   <stat.icon size={24} />
                 </div>
                 <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                   {stat.change}
                 </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inventory Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Top Selling Products</h2>
              <button className="text-leaf-600 text-sm font-bold hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="py-3 font-semibold">Product</th>
                    <th className="py-3 font-semibold">Stock Status</th>
                    <th className="py-3 font-semibold">Price</th>
                    <th className="py-3 font-semibold">Sales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {PRODUCTS.slice(0, 6).map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-4 flex items-center gap-4">
                        <img src={p.image} className="w-10 h-10 rounded-lg object-cover bg-gray-100" alt="" />
                        <div>
                           <p className="font-bold text-gray-800 text-sm">{p.name.en}</p>
                           <p className="text-xs text-gray-400">{p.category}</p>
                        </div>
                      </td>
                      <td className="py-4">
                         <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold">In Stock</span>
                      </td>
                      <td className="py-4 text-sm font-medium text-gray-600">₹{p.price}</td>
                      <td className="py-4 text-sm font-bold text-gray-900">{Math.floor(Math.random() * 500) + 100}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Recent Activity</h2>
            <div className="space-y-6 relative pl-2">
               {/* Vertical Line */}
               <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

              {[
                { text: "New order #ORD-9281 received", time: "2 mins ago", icon: ShoppingBag, color: "bg-blue-500" },
                { text: "Rahul S. registered account", time: "45 mins ago", icon: Users, color: "bg-orange-500" },
                { text: "Low stock alert: Mango Alphonso", time: "1 hour ago", icon: Bell, color: "bg-red-500" },
                { text: "Monthly sales report ready", time: "3 hours ago", icon: BarChart3, color: "bg-purple-500" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center text-white shrink-0 z-10 border-4 border-white shadow-sm`}>
                    <item.icon size={16} />
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-bold text-gray-800 leading-tight">{item.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
               <button className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition">View All Notifications</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};