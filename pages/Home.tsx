import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, Clock, MapPin, Star, PlayCircle, Leaf } from 'lucide-react';
import { PRODUCTS, TESTIMONIALS } from '../constants';
import { ProductCard } from '../components/ui/ProductCard';

export const Home: React.FC = () => {
  const featuredProducts = PRODUCTS.slice(0, 4);

  return (
    <div className="w-full bg-white">
      {/* Advanced Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-[#f0fdf4] overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-leaf-100 to-transparent skew-x-12 opacity-60"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent-yellow/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-leaf-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold text-gray-600 tracking-wide uppercase">100% Organic & Fresh</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              Fresh Vegetables <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-leaf-600 to-leaf-400">Delivered Daily</span>
            </h1>
            
            <p className="text-gray-600 text-lg md:text-xl max-w-lg leading-relaxed">
              Order fresh fruits and vegetables sourced directly from Indian farmers. 
              <span className="font-semibold text-leaf-700"> ताज़ी सब्जियां, घर तक।</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/shop" className="bg-leaf-600 hover:bg-leaf-700 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-leaf-500/30 hover:shadow-leaf-500/50 hover:-translate-y-1">
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link to="/how-it-works" className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:border-leaf-300">
                <PlayCircle size={20} /> How It Works
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-leaf-200/50">
              <div>
                <p className="text-3xl font-bold text-gray-900">50k+</p>
                <p className="text-sm text-gray-500">Happy Customers</p>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div>
                <p className="text-3xl font-bold text-gray-900">100%</p>
                <p className="text-sm text-gray-500">Organic Certified</p>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2 relative">
             <div className="relative z-10 bg-white/30 backdrop-blur-sm p-8 rounded-[3rem] border border-white/50 shadow-2xl">
               <img 
                 src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80" 
                 alt="Fresh Basket" 
                 className="rounded-[2.5rem] shadow-lg w-full object-cover transform md:rotate-3 hover:rotate-0 transition duration-700"
               />
               
               {/* Floating cards */}
               <div className="absolute -left-8 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                 <div className="bg-green-100 p-2 rounded-full text-green-600"><ShieldCheck size={20} /></div>
                 <div>
                   <p className="text-xs text-gray-500 font-bold">Safety</p>
                   <p className="text-sm font-bold text-gray-900">100% Safe</p>
                 </div>
               </div>
               
               <div className="absolute -right-4 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s' }}>
                 <div className="bg-orange-100 p-2 rounded-full text-orange-600"><Clock size={20} /></div>
                 <div>
                   <p className="text-xs text-gray-500 font-bold">Delivery</p>
                   <p className="text-sm font-bold text-gray-900">30 Mins</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features List Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders above ₹499", color: "bg-blue-50 text-blue-600" },
              { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure payment", color: "bg-green-50 text-green-600" },
              { icon: Clock, title: "24/7 Support", desc: "Dedicated support", color: "bg-purple-50 text-purple-600" },
              { icon: MapPin, title: "Track Order", desc: "Live order tracking", color: "bg-orange-50 text-orange-600" }
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 border border-gray-100 rounded-3xl hover:shadow-card-hover hover:border-leaf-100 transition-all duration-300">
                <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecommerce Product Section (Featured) */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-leaf-600 font-bold tracking-wider uppercase text-sm">Our Collections</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Best Selling Products</h2>
            </div>
            <Link to="/shop" className="group flex items-center gap-2 text-gray-600 font-bold hover:text-leaf-600 transition">
              View All <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-gray-500 text-lg">Don't just take our word for it. Here's what our community thinks about our fresh produce.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(t => (
              <div key={t.id} className="bg-gray-50 p-8 rounded-3xl relative hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute top-8 right-8 text-leaf-200 opacity-50">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                  </svg>
                </div>
                <div className="flex text-accent-yellow mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < t.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic relative z-10 leading-relaxed">"{t.comment}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-leaf-100 flex items-center justify-center font-bold text-leaf-600">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <span className="text-xs text-gray-500 font-medium">{t.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-leaf-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <Leaf className="mx-auto text-leaf-400 mb-6" size={48} />
          <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
          <p className="text-leaf-100 mb-10 text-lg">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
          <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-sm border border-white/20 inline-flex w-full max-w-lg">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-grow bg-transparent px-6 py-3 text-white placeholder-leaf-200 focus:outline-none"
            />
            <button className="bg-white text-leaf-900 px-8 py-3 rounded-xl font-bold hover:bg-leaf-50 transition shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};