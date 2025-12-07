
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Eye, Minus, Plus, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../services/CartContext';

interface Props {
  product: Product;
}

// Generate units based on product baseUnit
const getUnitOptions = (baseUnit: string) => {
  if (baseUnit === 'kg') {
    return [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.5 },
      { label: '1kg', multiplier: 1 },
      { label: '2kg', multiplier: 2 },
    ];
  } else if (baseUnit === 'pc' || baseUnit === 'bunch') {
    return [
      { label: `1 ${baseUnit}`, multiplier: 1 },
      { label: `2 ${baseUnit}s`, multiplier: 2 },
      { label: `4 ${baseUnit}s`, multiplier: 4 },
      { label: `6 ${baseUnit}s`, multiplier: 6 },
    ];
  }
  return [{ label: `1 ${baseUnit}`, multiplier: 1 }];
};

export const ProductCard: React.FC<Props> = ({ product }) => {
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();
  const [qty, setQty] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const unitOptions = getUnitOptions(product.baseUnit);
  
  // Default to 3rd option (1kg) if kg, else 1st option
  const defaultUnitIndex = product.baseUnit === 'kg' ? 2 : 0;
  const [selectedUnitIdx, setSelectedUnitIdx] = useState(defaultUnitIndex);

  const currentMultiplier = unitOptions[selectedUnitIdx].multiplier;
  const displayPrice = Math.ceil(product.price * currentMultiplier);
  const oldDisplayPrice = product.oldPrice ? Math.ceil(product.oldPrice * currentMultiplier) : null;

  const discount = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const unitLabel = unitOptions[selectedUnitIdx].label;
    addToCart(product, qty, unitLabel, displayPrice);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.gallery.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.gallery.length) % product.gallery.length);
  };

  return (
    <div 
      className="bg-white rounded-3xl shadow-soft hover:shadow-card-hover transition-all duration-500 transform hover:-translate-y-2 relative group overflow-hidden border border-gray-100 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Gallery Area */}
      <div className="relative block aspect-[4/3] overflow-hidden bg-gray-100 rounded-t-3xl">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.gallery[currentImageIndex]}
            alt={product.name.en}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        
        {/* Gallery Controls (Visible on Hover) */}
        {product.gallery.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className={`absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md text-gray-700 hover:bg-white transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={nextImage}
              className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md text-gray-700 hover:bg-white transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            >
              <ChevronRight size={16} />
            </button>
            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {product.gallery.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'}`} 
                />
              ))}
            </div>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.inStock && (
            <span className="bg-white/90 backdrop-blur-md text-green-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Stock
            </span>
          )}
          {product.isOrganic && (
            <span className="bg-leaf-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Organic
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Action */}
        <button 
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all duration-300 z-20 ${isInWishlist(product.id) ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:bg-red-50 hover:text-red-500'} ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
        >
          <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
        </button>
      </div>
      
      {/* Content Area */}
      <div className="p-5 flex-grow flex flex-col relative">
        <div className="mb-1 flex justify-between items-center">
          <span className="text-[10px] font-bold text-leaf-600 bg-leaf-50 px-2 py-0.5 rounded uppercase tracking-wide">{product.category}</span>
          <div className="flex items-center gap-1">
             <Star size={12} className="text-yellow-400" fill="currentColor" />
             <span className="text-xs font-bold text-gray-500">{product.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <Link to={`/product/${product.id}`} className="block mb-3">
          <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-leaf-700 transition-colors line-clamp-1">
            {product.name.en}
          </h3>
          <p className="text-xs text-gray-400 font-medium truncate font-hindi mt-1">
            {product.name.hi} / {product.name.bn}
          </p>
        </Link>
        
        {/* Advanced Unit Selector */}
        <div className="mb-4">
          <div className="relative bg-gray-50 border border-gray-100 rounded-xl p-1 flex items-center shadow-inner">
            {/* Animated Sliding Highlight */}
            <div 
              className="absolute top-1 bottom-1 bg-white shadow-sm rounded-lg border border-gray-100 transition-all duration-300 ease-out z-0"
              style={{ 
                left: `calc(${(selectedUnitIdx / unitOptions.length) * 100}% + 2px)`, 
                width: `calc(${100 / unitOptions.length}% - 4px)` 
              }} 
            />
            
            <div className="flex w-full relative z-10">
              {unitOptions.map((opt, idx) => (
                <button
                  key={opt.label}
                  onClick={(e) => { e.preventDefault(); setSelectedUnitIdx(idx); }}
                  className={`flex-1 text-[10px] sm:text-[11px] font-bold text-center py-1.5 transition-colors duration-200 ${
                    selectedUnitIdx === idx 
                      ? 'text-gray-900' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-2 border-t border-gray-50">
          <div className="flex items-end gap-2 mb-4">
            <div className="flex flex-col">
               <span className="text-[10px] text-gray-400 font-medium">Price</span>
               <span className="font-extrabold text-xl text-gray-900">₹{displayPrice}</span>
            </div>
            {oldDisplayPrice && (
              <span className="text-xs text-gray-400 line-through mb-1.5">₹{oldDisplayPrice}</span>
            )}
          </div>

          {/* Action Footer */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-gray-900 hover:bg-leaf-600 text-white h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-leaf-500/30 group-hover:scale-[1.02]"
          >
            <div className="bg-white/20 p-1 rounded-full"><Plus size={14} /></div>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
