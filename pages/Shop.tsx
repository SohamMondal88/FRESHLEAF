
import React, { useRef, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Leaf, Zap, Sun, Award, Search, X, Filter, Flame, Snowflake } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { ProductCard } from '../components/ui/ProductCard';
import { Product } from '../types';

interface ProductSectionProps {
  title: string;
  products: Product[];
  icon?: React.ReactNode;
  subtitle?: string;
  bg?: string;
  layout?: 'grid' | 'carousel';
}

const ProductSection: React.FC<ProductSectionProps> = ({ title, products, icon, subtitle, bg = 'bg-transparent', layout = 'carousel' }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 600;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (products.length === 0) return null;

  return (
    <section className={`py-16 ${bg} border-b border-gray-100/50`}>
      <div className="container mx-auto px-4">
        {/* Fancy Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <span className="p-3 bg-white shadow-sm rounded-xl text-leaf-600 border border-gray-100">{icon || <Leaf />}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
            </div>
            {subtitle && (
              <p className="text-gray-500 font-medium ml-1 flex items-center gap-2 text-lg">
                <span className="w-12 h-1 bg-gradient-to-r from-leaf-400 to-leaf-200 rounded-full"></span>
                {subtitle}
              </p>
            )}
          </div>
          
          {layout === 'carousel' && (
            <div className="flex gap-3">
              <button 
                onClick={() => scroll('left')} 
                className="w-12 h-12 rounded-full bg-white border border-gray-200 hover:border-leaf-500 hover:text-leaf-600 flex items-center justify-center transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => scroll('right')} 
                className="w-12 h-12 rounded-full bg-white border border-gray-200 hover:border-leaf-500 hover:text-leaf-600 flex items-center justify-center transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
        
        {layout === 'carousel' ? (
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-12 snap-x scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 pt-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map(product => (
              <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    { name: 'Fruits', icon: '🍎', filter: 'Fruit' },
    { name: 'Vegetables', icon: '🥦', filter: 'Veg' },
    { name: 'Exotic', icon: '🥑', filter: 'Exotic' },
    { name: 'Leafy', icon: '🥬', filter: 'Leafy' },
    { name: 'Roots', icon: '🥕', filter: 'Root' },
    { name: 'Citrus', icon: '🍋', filter: 'Citrus' },
  ];

  const handleCategoryClick = (filter: string) => {
    navigate(`/shop?q=${filter}`);
    setActiveCategory(filter);
  };

  const filteredProducts = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return PRODUCTS.filter(p => 
      p.name.en.toLowerCase().includes(lowerQuery) ||
      p.name.hi.toLowerCase().includes(lowerQuery) ||
      p.name.bn.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  const clearSearch = () => {
    setSearchParams({});
    setActiveCategory('All');
  };

  // --- FILTERING LOGIC FOR SECTIONS ---
  const dailyEssentials = PRODUCTS.filter(p => 
    ['Potato', 'Onion', 'Tomato', 'Banana', 'Cucumber', 'Lemon', 'Coriander'].some(k => p.name.en.includes(k))
  );

  const exoticPremium = PRODUCTS.filter(p => 
    p.category.includes('Exotic') || p.category.includes('Imported') || p.name.en.includes('Avocado') || p.name.en.includes('Broccoli')
  );

  const seasonalPicks = PRODUCTS.filter(p => 
    p.category.includes('Mango') || p.category.includes('Melon') || p.name.en.includes('Lychee') || p.name.en.includes('Jackfruit')
  );

  const leafyGreens = PRODUCTS.filter(p => p.category.includes('Leafy'));
  const fruits = PRODUCTS.filter(p => p.category.includes('Fruit') && !p.category.includes('Exotic'));

  return (
    <div className="min-h-screen bg-gray-50/30">
      
      {/* Dynamic Hero Banner */}
      {!query && (
        <div className="relative bg-gray-900 overflow-hidden py-24">
          <div className="absolute inset-0">
             <img src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1920&q=80" alt="Fresh Produce" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
             <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <div className="inline-flex items-center gap-2 bg-leaf-500/20 backdrop-blur-md border border-leaf-400/30 px-4 py-1.5 rounded-full mb-6">
               <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
               <span className="text-xs font-bold text-leaf-300 uppercase tracking-widest">Fresh Harvest Today</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
              From Farm to <span className="text-transparent bg-clip-text bg-gradient-to-r from-leaf-400 to-lime-300">Your Table</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Explore the freshest collection of organic fruits, exotic vegetables, and daily essentials delivered within hours.
            </p>
            <div className="flex justify-center gap-4">
               <button onClick={() => document.getElementById('daily-essentials')?.scrollIntoView({ behavior: 'smooth'})} className="bg-leaf-600 hover:bg-leaf-500 text-white px-8 py-4 rounded-xl font-bold transition shadow-lg shadow-leaf-900/50 flex items-center gap-2">
                 Shop Daily Needs <ChevronRight size={18}/>
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter Bar */}
      <div className="sticky top-[72px] z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm py-4 overflow-x-auto">
        <div className="container mx-auto px-4 flex gap-3 min-w-max">
          <button 
             onClick={clearSearch}
             className={`px-6 py-2 rounded-full font-bold text-sm border transition-all ${!query ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900'}`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.filter)}
              className={`px-5 py-2 rounded-full font-bold text-sm border transition-all flex items-center gap-2 ${
                query.includes(cat.filter) 
                  ? 'bg-leaf-100 text-leaf-700 border-leaf-200 ring-2 ring-leaf-100' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-leaf-400 hover:text-leaf-600'
              }`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Mode */}
      {query && (
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
               Results for <span className="text-leaf-600">"{query}"</span>
             </h2>
             <button onClick={clearSearch} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-500 transition px-4 py-2 bg-gray-100 rounded-lg">
               <X size={16} /> Clear Filters
             </button>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                 <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-3xl border border-gray-100">
               <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Search size={40} className="text-gray-300" />
               </div>
               <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
               <p className="text-gray-500 mb-8">We couldn't find matches for "{query}". Try a broader category.</p>
               <button onClick={clearSearch} className="bg-leaf-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-leaf-700 shadow-lg shadow-leaf-200">
                 View All Products
               </button>
            </div>
          )}
        </div>
      )}

      {/* Default Curated Sections (Only if no search) */}
      {!query && (
        <>
          <div id="daily-essentials">
            <ProductSection 
              title="Daily Kitchen Essentials" 
              subtitle="Fresh stock for your everyday cooking"
              icon={<Flame className="text-orange-500" />}
              products={dailyEssentials} 
              bg="bg-white"
            />
          </div>

          <ProductSection 
            title="Premium & Exotic" 
            subtitle="Imported and rare finds for special meals"
            icon={<Award className="text-purple-500" />}
            products={exoticPremium} 
            bg="bg-gradient-to-b from-purple-50/50 to-white"
          />

          <ProductSection 
            title="Summer Delights" 
            subtitle="Beat the heat with seasonal favorites"
            icon={<Sun className="text-yellow-500" />}
            products={seasonalPicks} 
            bg="bg-yellow-50/30"
          />

           <ProductSection 
            title="Fresh Fruits Basket" 
            subtitle="Juicy, sweet, and packed with vitamins"
            icon={<Leaf className="text-red-500" />}
            products={fruits} 
            bg="bg-white"
            layout="grid"
          />

           <ProductSection 
            title="Green Leafy Veggies" 
            subtitle="Farm fresh greens for immunity"
            icon={<Leaf className="text-green-600" />}
            products={leafyGreens} 
            bg="bg-green-50/20"
          />
        </>
      )}
    </div>
  );
};
