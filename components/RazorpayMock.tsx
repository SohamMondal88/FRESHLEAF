
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, ShieldCheck, CreditCard, Smartphone, Building, Loader2, QrCode, Lock } from 'lucide-react';

interface Props {
  amount: number;
  onSuccess: () => void;
  onFailure: () => void;
  onClose: () => void;
}

export const RazorpayMock: React.FC<Props> = ({ amount, onSuccess, onFailure, onClose }) => {
  const [step, setStep] = useState<'method' | 'processing' | 'verifying' | 'success' | 'failed'>('method');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer

  // Timer logic for urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePay = () => {
    setStep('processing');
    
    // Simulate Bank Server Contact
    setTimeout(() => {
      setStep('verifying');
      
      // Simulate Payment Verification
      setTimeout(() => {
        // 90% success rate simulation
        if (Math.random() > 0.05) {
          setStep('success');
          setTimeout(onSuccess, 2500);
        } else {
          setStep('failed');
        }
      }, 2000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row h-[600px] md:h-[500px]">
        
        {/* Left Side: Order Details (Professional Side Panel) */}
        <div className="bg-gray-50 md:w-5/12 p-6 border-r border-gray-100 flex flex-col justify-between relative overflow-hidden">
           <div className="relative z-10">
             <div className="flex items-center gap-2 mb-6">
               <div className="bg-blue-600 p-1.5 rounded text-white">
                 <Lock size={16} />
               </div>
               <span className="font-bold text-gray-800 text-sm tracking-wide">Razorpay Trusted</span>
             </div>
             
             <div className="mb-6">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Payable</p>
                <h2 className="text-3xl font-extrabold text-gray-900">₹{amount.toLocaleString('en-IN')}</h2>
             </div>

             <div className="space-y-3">
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Order ID</span>
                 <span className="font-mono font-medium">OID-{Math.floor(Math.random()*1000000)}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Merchant</span>
                 <span className="font-medium">FreshLeaf Organics</span>
               </div>
             </div>
           </div>

           {/* Decor */}
           <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
           
           <div className="relative z-10 bg-white p-3 rounded-xl border border-gray-200 text-xs text-gray-500">
              <p className="flex items-center gap-2 mb-1 font-bold text-gray-700"><ShieldCheck size={14} className="text-green-500"/> Buyer Protection</p>
              Your transaction is secured with 256-bit SSL encryption.
           </div>
        </div>

        {/* Right Side: Payment Methods */}
        <div className="md:w-7/12 flex flex-col">
           {/* Header */}
           <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <span className="text-sm font-bold text-gray-500">Time Remaining: <span className="text-red-500">{formatTime(timeLeft)}</span></span>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition"><X size={20}/></button>
           </div>

           {/* Content Area */}
           <div className="p-6 flex-grow overflow-y-auto">
              
              {step === 'method' && (
                <>
                  <h3 className="font-bold text-gray-900 mb-4">Select Payment Method</h3>
                  
                  {/* Tabs */}
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    <button 
                      onClick={() => setPaymentMethod('upi')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition whitespace-nowrap ${paymentMethod === 'upi' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Smartphone size={16}/> UPI / QR
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition whitespace-nowrap ${paymentMethod === 'card' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      <CreditCard size={16}/> Card
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition whitespace-nowrap ${paymentMethod === 'netbanking' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Building size={16}/> Netbanking
                    </button>
                  </div>

                  {/* UPI VIEW */}
                  {paymentMethod === 'upi' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                       <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 mb-4">
                          <div className="bg-white p-2 rounded-lg shadow-sm mb-3">
                             {/* Fake QR Code Pattern */}
                             <QrCode size={120} className="text-gray-800" />
                          </div>
                          <p className="text-sm font-bold text-gray-700">Scan to Pay with any App</p>
                          <div className="flex gap-2 mt-2 opacity-60">
                             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" className="h-4 object-contain" alt="" />
                             <span className="text-xs text-gray-500">GPay • PhonePe • Paytm</span>
                          </div>
                       </div>
                       <button onClick={handlePay} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-blue-200">
                         Simulate Scan & Pay
                       </button>
                    </div>
                  )}

                  {/* CARD VIEW */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                       <div>
                         <label className="block text-xs font-bold text-gray-500 mb-1">Card Number</label>
                         <div className="relative">
                           <CreditCard className="absolute left-3 top-3 text-gray-400" size={18} />
                           <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono" />
                         </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Expiry</label>
                            <input type="text" placeholder="MM/YY" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">CVV</label>
                            <input type="password" placeholder="123" maxLength={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono" />
                          </div>
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-gray-500 mb-1">Card Holder Name</label>
                         <input type="text" placeholder="John Doe" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" />
                       </div>
                       <button onClick={handlePay} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-blue-200 mt-2">
                         Pay ₹{amount.toLocaleString('en-IN')}
                       </button>
                    </div>
                  )}

                  {/* NETBANKING VIEW */}
                  {paymentMethod === 'netbanking' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                       <p className="text-sm font-bold text-gray-700 mb-3">Popular Banks</p>
                       <div className="grid grid-cols-2 gap-3 mb-6">
                          {['HDFC', 'SBI', 'ICICI', 'Axis'].map(bank => (
                            <button key={bank} onClick={handlePay} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
                              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                              <span className="text-sm font-medium">{bank} Bank</span>
                            </button>
                          ))}
                       </div>
                       <button onClick={handlePay} className="w-full border border-gray-300 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition">
                         View All Banks
                       </button>
                    </div>
                  )}
                </>
              )}

              {/* PROCESSING STATES */}
              {(step === 'processing' || step === 'verifying') && (
                <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                       <ShieldCheck className="text-blue-600" size={24} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {step === 'processing' ? 'Processing Payment...' : 'Verifying with Bank...'}
                  </h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">
                    Please do not close this window or press back. This may take a few seconds.
                  </p>
                </div>
              )}

              {/* SUCCESS STATE */}
              {step === 'success' && (
                <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                   <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                     <CheckCircle size={48} className="text-green-600" />
                   </div>
                   <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                   <p className="text-gray-500 mb-8">Redirecting you to the confirmation page...</p>
                   <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                     <div className="h-full bg-green-500 animate-[pulse_1s_ease-in-out_infinite]" style={{width: '100%'}}></div>
                   </div>
                </div>
              )}

              {/* FAILED STATE */}
              {step === 'failed' && (
                <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                   <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                     <AlertTriangle size={48} className="text-red-600" />
                   </div>
                   <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h3>
                   <p className="text-gray-500 mb-8">The bank rejected the transaction. Please try a different method.</p>
                   <button onClick={() => setStep('method')} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition">
                     Try Again
                   </button>
                </div>
              )}

           </div>
           
           {/* Footer */}
           {step === 'method' && (
             <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center gap-4 grayscale opacity-60">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" className="h-6" alt="" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-6" alt="" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-6" alt="" />
             </div>
           )}
        </div>

      </div>
    </div>
  );
};
