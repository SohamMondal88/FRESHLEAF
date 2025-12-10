
import React, { useState } from 'react';
import { Sprout, Store, CheckCircle, Send, MapPin, Phone, User, Package, DollarSign, Truck } from 'lucide-react';
import { COMPANY_INFO } from '../constants';

export const Partner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'farmer' | 'retailer'>('farmer');
  
  // Form States
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    details: '', // Crops for farmer, Requirements for retailer
    quantity: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let message = '';
    if (activeTab === 'farmer') {
      message = `*Farmer Partnership Inquiry*\n\n*Name:* ${formData.name}\n*Location:* ${formData.location}\n*Crops to Sell:* ${formData.details}\n*Est. Quantity:* ${formData.quantity}\n*Phone:* ${formData.phone}\n\nI am interested in selling my produce to FreshLeaf.`;
    } else {
      message = `*Retailer/Wholesale Inquiry*\n\n*Business Name:* ${formData.name}\n*Address:* ${formData.location}\n*Looking for:* ${formData.details}\n*Monthly Volume:* ${formData.quantity}\n*Phone:* ${formData.phone}\n\nI am interested in buying merchandise/stock from FreshLeaf.`;
    }

    const url = `https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-br from-leaf-900 to-leaf-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Grow with FreshLeaf</h1>
          <p className="text-xl text-leaf-100 max-w-2xl mx-auto leading-relaxed mb-10">
            Whether you cultivate the land or serve the community, let's build a sustainable food ecosystem together.
          </p>
          
          {/* Tab Switcher */}
          <div className="inline-flex bg-white/10 p-1 rounded-2xl backdrop-blur-sm border border-white/20">
            <button 
              onClick={() => setActiveTab('farmer')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'farmer' ? 'bg-white text-leaf-900 shadow-lg' : 'text-white hover:bg-white/10'}`}
            >
              <Sprout size={20} /> I am a Farmer
            </button>
            <button 
              onClick={() => setActiveTab('retailer')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'retailer' ? 'bg-white text-leaf-900 shadow-lg' : 'text-white hover:bg-white/10'}`}
            >
              <Store size={20} /> I am a Retailer
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          
          {/* Left Side: Info & Benefits */}
          <div className="lg:w-1/2 space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {activeTab === 'farmer' ? 'Sell Directly to Us' : 'Stock Your Shelves'}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {activeTab === 'farmer' 
                  ? 'Join our network of 500+ certified farmers. We eliminate middlemen to ensure you get the best price for your hard work, with guaranteed payments within 24 hours.' 
                  : 'Get premium quality, organic graded vegetables and fruits for your grocery store, restaurant, or supermarket. Consistent supply chain and wholesale rates.'}
              </p>
            </div>

            <div className="grid gap-6">
              {activeTab === 'farmer' ? (
                <>
                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                    <div className="bg-green-100 p-3 rounded-full text-green-600"><DollarSign size={24}/></div>
                    <div>
                      <h4 className="font-bold text-gray-900">Fair Pricing</h4>
                      <p className="text-sm text-gray-600">20-30% higher rates than local mandi.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Truck size={24}/></div>
                    <div>
                      <h4 className="font-bold text-gray-900">Farm Pickup</h4>
                      <p className="text-sm text-gray-600">We handle logistics from your doorstep.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                    <div className="bg-orange-100 p-3 rounded-full text-orange-600"><CheckCircle size={24}/></div>
                    <div>
                      <h4 className="font-bold text-gray-900">Guaranteed Offtake</h4>
                      <p className="text-sm text-gray-600">Consistent demand all year round.</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <div className="bg-purple-100 p-3 rounded-full text-purple-600"><Package size={24}/></div>
                    <div>
                      <h4 className="font-bold text-gray-900">Wholesale Rates</h4>
                      <p className="text-sm text-gray-600">High margins for your retail business.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                    <div className="bg-yellow-100 p-3 rounded-full text-yellow-600"><CheckCircle size={24}/></div>
                    <div>
                      <h4 className="font-bold text-gray-900">Quality Graded</h4>
                      <p className="text-sm text-gray-600">A-Grade produce, sorted and packed.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-red-50 rounded-2xl border border-red-100">
                    <div className="bg-red-100 p-3 rounded-full text-red-600"><Truck size={24}/></div>
                    <div>
                      <h4 className="font-bold text-gray-900">Daily Delivery</h4>
                      <p className="text-sm text-gray-600">Early morning replenishment for your store.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:w-1/2">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                {activeTab === 'farmer' ? <Sprout className="text-leaf-600"/> : <Store className="text-leaf-600"/>}
                Partner Registration
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {activeTab === 'farmer' ? 'Farmer Name' : 'Business / Store Name'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 transition"
                      placeholder={activeTab === 'farmer' ? 'Ramesh Kumar' : 'Fresh Mart'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number (WhatsApp)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 transition"
                      placeholder="98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {activeTab === 'farmer' ? 'Farm Location / Village' : 'Store Address / City'}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 transition"
                      placeholder={activeTab === 'farmer' ? 'Village, District' : 'Market Area, City'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {activeTab === 'farmer' ? 'Crops Available' : 'Products Needed'}
                    </label>
                    <input 
                      type="text" 
                      name="details"
                      required
                      value={formData.details}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 transition"
                      placeholder={activeTab === 'farmer' ? 'Potato, Onion' : 'Exotic Fruits'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {activeTab === 'farmer' ? 'Est. Quantity (Kg)' : 'Monthly Vol (Kg)'}
                    </label>
                    <input 
                      type="text" 
                      name="quantity"
                      required
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 transition"
                      placeholder="e.g. 500 kg"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-leaf-600 hover:bg-leaf-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-leaf-200 transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
                >
                  <Send size={20} /> Submit via WhatsApp
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">
                  By submitting, you agree to connect with our procurement team on WhatsApp.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
