
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  amount: number;
  onSuccess: () => void;
  onFailure: () => void;
  onClose: () => void;
}

export const RazorpayMock: React.FC<Props> = ({ amount, onSuccess, onFailure, onClose }) => {
  const [step, setStep] = useState<'loading' | 'payment' | 'processing' | 'success' | 'failed'>('loading');

  useEffect(() => {
    // Simulate loading iframe
    const timer = setTimeout(() => setStep('payment'), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      // 90% success rate simulation
      if (Math.random() > 0.1) {
        setStep('success');
        setTimeout(onSuccess, 2000);
      } else {
        setStep('failed');
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-[#2b84ea] px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-white p-1 rounded">
               <div className="w-6 h-6 bg-[#2b84ea] rounded-sm"></div>
             </div>
             <div>
               <h3 className="text-white font-bold text-lg leading-tight">Razorpay</h3>
               <p className="text-blue-200 text-xs">Trusted Business</p>
             </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X size={20}/></button>
        </div>

        {/* Content */}
        <div className="p-8 min-h-[300px] flex flex-col">
          {step === 'loading' && (
            <div className="flex-grow flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {step === 'payment' && (
            <>
              <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
                <div>
                  <p className="text-gray-500 text-sm">Amount to Pay</p>
                  <h2 className="text-3xl font-bold text-gray-900">₹{amount}</h2>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <ShieldCheck size={14}/> Secured by Razorpay
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <p className="text-sm font-bold text-gray-700 mb-2">Preferred Payment Methods</p>
                <button onClick={handlePay} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
                  <span className="font-bold text-gray-800">UPI / QR</span>
                  <span className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-blue-500 group-hover:bg-blue-500"></span>
                </button>
                <button onClick={handlePay} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
                  <span className="font-bold text-gray-800">Card (Visa/Master)</span>
                  <span className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-blue-500 group-hover:bg-blue-500"></span>
                </button>
                <button onClick={handlePay} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
                  <span className="font-bold text-gray-800">Netbanking</span>
                  <span className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-blue-500 group-hover:bg-blue-500"></span>
                </button>
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="flex-grow flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <h3 className="font-bold text-xl text-gray-900">Processing Payment</h3>
              <p className="text-gray-500">Please do not close this window...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex-grow flex flex-col items-center justify-center text-center animate-in zoom-in">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="font-bold text-xl text-gray-900">Payment Successful</h3>
              <p className="text-gray-500">Redirecting to confirmation...</p>
            </div>
          )}

          {step === 'failed' && (
            <div className="flex-grow flex flex-col items-center justify-center text-center animate-in zoom-in">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="font-bold text-xl text-gray-900">Payment Failed</h3>
              <p className="text-gray-500 mb-6">Something went wrong. Please try again.</p>
              <button onClick={() => setStep('payment')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Retry</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
