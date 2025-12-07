
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, Shield, Minus, Plus, MapPin, CheckCircle, ArrowLeft } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { useCart } from '../services/CartContext';
import { ProductCard } from '../components/ui/ProductCard';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find(p => p.id === id);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState(product?.gallery[0] || product?.image);

  // Recommendations: Filter products with same category but excluding current
  const recommendations = useMemo(() => {
    if (!product) return [];
    return PRODUCTS
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  if (!product) return <div className="p-20 text-center">Product not found</div>;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-leaf-600 mb-8 font-bold transition">
          <ArrowLeft size={20} /> Back to Shop
        </Link>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-12">
          <div className="flex flex-col md:flex-row">
            
            {/* Gallery Section */}
            <div className="md:w-1/2 p-6 md:p-10 bg-gray-50/50">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden aspect-square mb-6 relative">
                <img src={mainImage} alt={product.name.en} className="w-full h-full object-cover" />
                {product.isOrganic && (
                   <span className="absolute top-4 left-4 bg-leaf-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Organic</span>
                )}
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.gallery.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-leaf-500 scale-105 shadow-md' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details Section */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
              <div className="mb-2 flex items-center gap-2">
                 <span className="text-xs font-bold bg-leaf-100 text-leaf-700 px-2 py-1 rounded uppercase tracking-wide">{product.category}</span>
                 {product.inStock ? (
                   <span className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle size={12}/> In Stock</span>
                 ) : (
                   <span className="text-xs font-bold text-red-500">Out of Stock</span>
                 )}
              </div>
              
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight">{product.name.en}</h1>
              <p className="text-xl text-gray-500 mb-6 font-hindi">{product.name.hi} | {product.name.bn}</p>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-gray-400 text-sm font-medium">({product.reviews} verified reviews)</span>
              </div>

              <div className="flex items-end gap-4 mb-8 pb-8 border-b border-gray-100">
                <div className="text-5xl font-extrabold text-gray-900">
                  {formatPrice(product.price)}
                  <span className="text-lg text-gray-400 font-medium ml-1">/{product.baseUnit}</span>
                </div>
                {product.oldPrice && (
                  <div className="mb-2">
                     <span className="text-xl text-gray-400 line-through block">{formatPrice(product.oldPrice)}</span>
                     <span className="text-sm font-bold text-red-500">
                       {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                     </span>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description} Sourced directly from verified organic farms. 
                  Handpicked for quality and freshness. Delivered within 24 hours of harvest.
                </p>
              </div>

              {/* Actions */}
              <div className="mt-auto">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50 h-14">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-14 h-full flex items-center justify-center hover:bg-gray-200 rounded-l-xl transition"><Minus size={20}/></button>
                    <span className="px-4 font-bold text-xl min-w-[3rem] text-center">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="w-14 h-full flex items-center justify-center hover:bg-gray-200 rounded-r-xl transition"><Plus size={20}/></button>
                  </div>
                  <button 
                    onClick={() => addToCart(product, qty)}
                    className="flex-grow bg-leaf-600 hover:bg-leaf-700 text-white h-14 rounded-xl font-bold text-lg transition shadow-lg shadow-leaf-200 active:scale-95"
                  >
                    Add to Cart
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <Truck size={24} className="text-leaf-600 mx-auto mb-2"/>
                    <p className="text-xs font-bold text-gray-600">Fast Delivery</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <Shield size={24} className="text-leaf-600 mx-auto mb-2"/>
                    <p className="text-xs font-bold text-gray-600">Secure Payment</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <MapPin size={24} className="text-leaf-600 mx-auto mb-2"/>
                    <p className="text-xs font-bold text-gray-600">Local Farms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
            <div className="space-y-6">
                <div className="border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill="currentColor" />
                            ))}
                        </div>
                        <span className="font-bold text-gray-900">Great quality!</span>
                    </div>
                    <p className="text-gray-600 text-sm">Fresh and delivered on time. Will order again.</p>
                    <p className="text-xs text-gray-400 mt-2">Rahul S. • Verified Buyer</p>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-400">
                            {[...Array(4)].map((_, i) => (
                                <Star key={i} size={16} fill="currentColor" />
                            ))}
                            <Star size={16} className="text-gray-300" />
                        </div>
                        <span className="font-bold text-gray-900">Good packaging</span>
                    </div>
                    <p className="text-gray-600 text-sm">Liked the eco-friendly packaging.</p>
                    <p className="text-xs text-gray-400 mt-2">Priya M. • Verified Buyer</p>
                </div>
            </div>
            <button className="mt-6 text-leaf-600 font-bold hover:underline">Write a Review</button>
        </div>

        {/* Smart Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Bought Together</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
