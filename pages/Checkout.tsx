
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../services/CartContext';
import { useAuth } from '../services/AuthContext';
import { useOrder } from '../services/OrderContext';
import { ShieldCheck, Banknote, Smartphone, Truck, MapPin, AlertTriangle, AlertOctagon, Loader2, CreditCard, Clock } from 'lucide-react';
import { COMPANY_INFO, DELIVERY_SLOTS } from '../constants';
import { RazorpayMock } from '../components/RazorpayMock';

export const Checkout: React.FC = () => {
  const { cartItems, cartTotal, discount, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrder();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [showRazorpay, setShowRazorpay] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    phone: user?.phone?.replace('+91 ', '') || '',
    address: user?.address || '',
    city: 'Kolkata', // Default
    zip: user?.pincode || '',
    paymentMethod: 'cod',
    deliverySlot: DELIVERY_SLOTS[0].id
  });

  // BLOCK: Min Order Check
  if (cartTotal < COMPANY_INFO.minOrderValue) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4 p-4 text-center">
              <div className="bg-red-100 p-6 rounded-full text-red-500 mb-2">
                  <AlertOctagon size={48} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Minimum Order Value is ₹{COMPANY_INFO.minOrderValue}</h2>
              <p className="text-gray-500 max-w-md">To ensure free and fast delivery, we require a minimum cart value. Please add more items.</p>
              <button onClick={() => navigate('/shop')} className="bg-leaf-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-leaf-700 transition">
                  Go Back to Shop
              </button>
          </div>
      );
  }

  if (cartItems.length === 0) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
            <button onClick={() => navigate('/shop')} className="bg-leaf-600 text-white px-6 py-2 rounded-lg">Go to Shop</button>
        </div>
    );
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  // Validate Pincode API
  const checkPincode = async (pincode: string) => {
    if (pincode.length !== 6) return;
    
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      
      if (data && data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        const district = postOffice.District;
        const state = postOffice.State;
        
        // Strict Validation for Kolkata/West Bengal 700xxx
        const isKolkataRegion = 
            pincode.startsWith("700") && 
            (district.includes("Kolkata") || state === "West Bengal" || district.includes("24 Parganas"));

        if (isKolkataRegion) {
           setFormData(prev => ({ ...prev, city: "Kolkata" })); // Normalize city to Kolkata
           setLocationError("");
        } else {
           setLocationError("We currently only deliver to Kolkata (Pincodes starting with 700).");
        }
      } else {
        setLocationError("Invalid Pincode.");
      }
    } catch (e) {
      console.error("Error fetching pincode details", e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'zip') {
        if (value.length === 6) {
            checkPincode(value);
        } else if (value.length > 0 && !value.startsWith('7')) {
             setLocationError("Pincode must start with 7 for Kolkata region.");
        } else {
             setLocationError("");
        }
    }
  };

  const detectLocation = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      
      try {
        // Reverse Geocoding via OpenStreetMap (Free)
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        
        if (data && data.address) {
            const addr = data.address;
            const detectedPincode = addr.postcode?.replace(/\s/g, '') || ""; // Remove spaces from postcode
            
            // Smart Address Construction
            const streetParts = [
                addr.road, 
                addr.house_number ? `House No. ${addr.house_number}` : '',
                addr.suburb, 
                addr.neighbourhood, 
                addr.residential
            ].filter(Boolean);
            
            const formattedAddr = streetParts.join(", ");

            setFormData(prev => ({
                ...prev,
                address: formattedAddr || prev.address,
                city: "Kolkata", // Normalize for our service area check
                zip: detectedPincode
            }));

            // Validate Service Area
            if (detectedPincode.startsWith("700")) {
                setLocationError("");
            } else {
                setLocationError(`Detected location (${detectedPincode}) seems to be outside our service area (Kolkata).`);
            }
        } else {
            setLocationError("Could not retrieve detailed address.");
        }
      } catch (error) {
        console.error("Location fetch error:", error);
        setLocationError("Error detecting address. Please enter manually.");
      } finally {
        setIsLocating(false);
      }
    }, (error) => {
        console.error("Geolocation error:", error);
        setIsLocating(false);
        let msg = "Unable to retrieve location.";
        if (error.code === 1) msg = "Location permission denied.";
        else if (error.code === 2) msg = "Location unavailable.";
        else if (error.code === 3) msg = "Location request timed out.";
        setLocationError(msg);
    }, { enableHighAccuracy: true, timeout: 10000 });
  };

  const finalizeOrder = async () => {
    setLoading(true);
    const fullAddress = `${formData.address}, ${formData.city} - ${formData.zip}`;
    const paymentLabel = formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment';
    const fullName = `${formData.firstName} ${formData.lastName}`;
    const slot = DELIVERY_SLOTS.find(s => s.id === formData.deliverySlot);
    
    // Create order 
    const orderId = await createOrder(cartItems, grandTotal + (slot?.price || 0), fullAddress, paymentLabel, formData.phone, fullName);
    
    clearCart();
    setLoading(false);
    navigate(`/order-confirmation?id=${orderId}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict Kolkata Validation
    if (!formData.zip.startsWith('700') || !!locationError) {
        setLocationError("Sorry, we strictly deliver only in Kolkata (Pincodes starting with 700).");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    if (formData.paymentMethod === 'online') {
      setShowRazorpay(true);
    } else {
      finalizeOrder();
    }
  };

  const selectedSlot = DELIVERY_SLOTS.find(s => s.id === formData.deliverySlot);

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      {showRazorpay && (
        <RazorpayMock 
          amount={grandTotal + (selectedSlot?.price || 0)}
          onSuccess={() => { setShowRazorpay(false); finalizeOrder(); }}
          onFailure={() => alert("Payment Failed. Try again.")}
          onClose={() => setShowRazorpay(false)}
        />
      )}

      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">Secure Checkout</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Form */}
          <div className="md:col-span-8 space-y-6">
            
            {/* Step 1: Contact & Shipping */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3 text-gray-900">
                    <span className="bg-leaf-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span>
                    Shipping Details
                </h2>
                <button 
                    type="button" 
                    onClick={detectLocation} 
                    disabled={isLocating}
                    className="text-leaf-600 text-sm font-bold flex items-center gap-1 hover:bg-leaf-50 px-3 py-1 rounded-lg transition disabled:opacity-50"
                >
                    {isLocating ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16}/>} 
                    {isLocating ? "Detecting..." : "Detect Location"}
                </button>
              </div>

              {locationError && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex gap-3 animate-in fade-in slide-in-from-top-2">
                      <AlertTriangle className="text-red-500 shrink-0" />
                      <p className="text-sm text-red-700 font-medium">{locationError}</p>
                  </div>
              )}
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-leaf-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-leaf-500 focus:outline-none" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 text-gray-500 font-bold">+91</span>
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="9876543210" pattern="[0-9]{10}" className="w-full bg-gray-50 border border-gray-300 rounded-r-lg px-4 py-3 focus:ring-2 focus:ring-leaf-500 focus:outline-none" />
                </div>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><Smartphone size={12}/> Invoice & tracking updates will be sent via WhatsApp.</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-leaf-500 focus:outline-none" placeholder="House number, building, street, area"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Pincode</label>
                  <input required name="zip" value={formData.zip} onChange={handleInputChange} type="text" maxLength={6} placeholder="700..." className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-leaf-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                  <input required name="city" value={formData.city} readOnly className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed font-bold" />
                  <p className="text-[10px] text-gray-400 mt-1">We operate only in Kolkata</p>
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Slot */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900">
                <span className="bg-leaf-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">2</span>
                Delivery Slot
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DELIVERY_SLOTS.map(slot => (
                  <label 
                    key={slot.id} 
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${formData.deliverySlot === slot.id ? 'border-leaf-600 bg-leaf-50 ring-1 ring-leaf-600' : 'border-gray-200 hover:border-leaf-300'} ${!slot.available ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
                  >
                    <input 
                      type="radio" 
                      name="deliverySlot" 
                      value={slot.id} 
                      checked={formData.deliverySlot === slot.id} 
                      onChange={handleInputChange} 
                      disabled={!slot.available}
                      className="hidden" 
                    />
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-gray-900 block">{slot.label}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12}/> {slot.time}</span>
                      </div>
                      <div className="text-right">
                        {slot.price > 0 ? (
                          <span className="text-sm font-bold text-gray-900">+₹{slot.price}</span>
                        ) : (
                          <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">FREE</span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 3: Payment */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900">
                <span className="bg-leaf-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">3</span>
                Payment Method
              </h2>
              
              <div className="space-y-4">
                <label className={`flex items-center p-5 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-leaf-500 bg-leaf-50 ring-1 ring-leaf-500' : 'border-gray-200 hover:border-leaf-300'}`}>
                  <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="h-5 w-5 text-leaf-600 accent-leaf-600" />
                  <div className="ml-4 flex items-center gap-4 flex-grow">
                    <div className="p-2 bg-white rounded-lg border border-gray-100"><Banknote className="text-leaf-700" size={24} /></div>
                    <div>
                      <span className="block font-bold text-gray-900">Cash on Delivery</span>
                      <span className="block text-sm text-gray-500">Pay cash or UPI upon delivery</span>
                    </div>
                  </div>
                </label>

                <label className={`flex items-center p-5 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'online' ? 'border-leaf-500 bg-leaf-50 ring-1 ring-leaf-500' : 'border-gray-200 hover:border-leaf-300'}`}>
                  <input type="radio" name="paymentMethod" value="online" checked={formData.paymentMethod === 'online'} onChange={handleInputChange} className="h-5 w-5 text-leaf-600 accent-leaf-600" />
                  <div className="ml-4 flex items-center gap-4 flex-grow">
                    <div className="p-2 bg-white rounded-lg border border-gray-100"><CreditCard className="text-blue-600" size={24} /></div>
                    <div>
                      <span className="block font-bold text-gray-900">Pay Online (Razorpay)</span>
                      <span className="block text-sm text-gray-500">UPI, Cards, Wallet, Netbanking</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="md:col-span-4">
             <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-6 custom-scrollbar">
                  {cartItems.map(item => (
                    <div key={`${item.id}-${item.selectedUnit}`} className="flex gap-4">
                       <div className="relative">
                         <img src={item.image} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                         <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{item.quantity}</span>
                       </div>
                       <div>
                         <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.name.en}</p>
                         <p className="text-xs text-gray-500">{item.selectedUnit}</p>
                         <p className="text-sm font-medium text-gray-600 mt-1">{formatPrice(item.price * item.quantity)}</p>
                       </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 text-sm">
                        <span>Discount</span>
                        <span className="font-bold">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  {selectedSlot?.price > 0 && (
                    <div className="flex justify-between text-gray-600 text-sm">
                        <span>Delivery Slot ({selectedSlot.label})</span>
                        <span>{formatPrice(selectedSlot.price)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Shipping (Bombax)</span>
                    <span className="text-green-600 font-bold">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-900 font-bold text-xl pt-2 mt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>{formatPrice(grandTotal + (selectedSlot?.price || 0))}</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !!locationError || isLocating}
                  className="w-full bg-leaf-600 hover:bg-leaf-700 text-white py-4 rounded-xl font-bold transition shadow-lg shadow-leaf-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : `Place Order`}
                </button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <ShieldCheck size={14} className="text-green-500" /> SSL Encrypted Transaction
                </div>
             </div>
          </div>

        </form>
      </div>
    </div>
  );
};
