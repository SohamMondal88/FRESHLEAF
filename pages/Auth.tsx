
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { Leaf, Mail, Lock, User, ArrowRight, Smartphone, CheckCircle, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    let score = 0;
    if (password.length > 7) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setStrength(score);
  }, [password]);

  const getColor = () => {
    if (strength === 0) return 'bg-gray-200';
    if (strength < 2) return 'bg-red-500';
    if (strength < 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getLabel = () => {
     if (strength < 2) return 'Weak';
     if (strength < 3) return 'Medium';
     return 'Strong';
  };

  return (
    <div className="mt-2">
      <div className="flex gap-1 h-1.5 mb-1">
        <div className={`flex-1 rounded-full transition-colors ${strength >= 1 ? getColor() : 'bg-gray-200'}`}></div>
        <div className={`flex-1 rounded-full transition-colors ${strength >= 2 ? getColor() : 'bg-gray-200'}`}></div>
        <div className={`flex-1 rounded-full transition-colors ${strength >= 3 ? getColor() : 'bg-gray-200'}`}></div>
        <div className={`flex-1 rounded-full transition-colors ${strength >= 4 ? getColor() : 'bg-gray-200'}`}></div>
      </div>
      <p className="text-xs text-gray-500 text-right">{password.length > 0 && getLabel()}</p>
    </div>
  );
};

export const Login: React.FC = () => {
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [method, setMethod] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, sendOTP, loginWithOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // @ts-ignore
  const from = location.state?.from?.pathname || '/account';

  const handleSendOTP = async () => {
    if (phone.length < 10) return alert("Enter valid phone number");
    setLoading(true);
    await sendOTP(phone);
    setLoading(false);
    setShowOtpInput(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let success = false;
    if (method === 'password') {
       success = await login(email, password);
    } else {
       success = await loginWithOTP(phone, otp);
    }

    setLoading(false);
    if (success) {
        navigate(from, { replace: true });
    } else {
        alert("Invalid credentials or OTP");
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Password reset link sent to ${email}`);
      setView('login');
    }, 1500);
  };

  if (view === 'forgot') {
    return (
      <div className="min-h-screen bg-leaf-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 w-full max-w-md border border-white/50 relative overflow-hidden">
          <div className="text-center mb-8">
            <button onClick={() => setView('login')} className="absolute left-8 top-8 text-gray-400 hover:text-gray-900"><ArrowLeft size={24}/></button>
            <div className="bg-leaf-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-leaf-600">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Reset Password</h1>
            <p className="text-gray-500 mt-2">Enter your email to receive reset instructions</p>
          </div>
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-leaf-600 transition-colors" size={20} />
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:bg-white transition-all font-medium"
                    placeholder="you@example.com"
                />
                </div>
            </div>
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-leaf-600 hover:bg-leaf-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-leaf-200 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95"
            >
                {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-leaf-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 w-full max-w-md border border-white/50 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-leaf-100 rounded-full blur-2xl opacity-50"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-100 rounded-full blur-2xl opacity-50"></div>

        <div className="text-center mb-8 relative z-10">
          <Link to="/" className="inline-block bg-leaf-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-leaf-600 hover:scale-110 transition-transform">
            <Leaf size={32} />
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to access your fresh orders</p>
        </div>

        {/* Method Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-8 relative z-10">
            <button 
                onClick={() => setMethod('password')} 
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${method === 'password' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Password
            </button>
            <button 
                onClick={() => setMethod('otp')} 
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${method === 'otp' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                OTP Login
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {method === 'password' ? (
              <>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-leaf-600 transition-colors" size={20} />
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:bg-white transition-all font-medium"
                        placeholder="you@example.com"
                    />
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                    <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-leaf-600 transition-colors" size={20} />
                    <input 
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:bg-white transition-all font-medium"
                        placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                    </button>
                    </div>
                    <div className="text-right mt-2">
                        <button type="button" onClick={() => setView('forgot')} className="text-xs font-bold text-leaf-600 hover:underline">Forgot Password?</button>
                    </div>
                </div>
              </>
          ) : (
              <>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
                    <div className="relative group">
                    <span className="absolute left-4 top-3.5 text-gray-500 font-bold">+91</span>
                    <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={showOtpInput}
                        maxLength={10}
                        className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:bg-white transition-all font-medium"
                        placeholder="98765 43210"
                    />
                    </div>
                </div>

                {showOtpInput ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Enter OTP</label>
                        <input 
                            type="text" 
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full text-center tracking-widest text-2xl py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:bg-white transition-all font-bold"
                            placeholder="• • • •"
                            maxLength={4}
                        />
                        <p className="text-center text-xs text-gray-500 mt-2">Didn't receive code? <button type="button" onClick={handleSendOTP} className="text-leaf-600 font-bold">Resend</button></p>
                    </div>
                ) : (
                    <button 
                        type="button"
                        onClick={handleSendOTP}
                        disabled={loading}
                        className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                    >
                        {loading ? 'Sending...' : 'Get OTP'}
                    </button>
                )}
              </>
          )}

          {(method === 'password' || showOtpInput) && (
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-leaf-600 hover:bg-leaf-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-leaf-200 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95"
            >
                {loading ? 'Verifying...' : <>Sign In <ArrowRight size={20} /></>}
            </button>
          )}
        </form>

        <p className="text-center mt-8 text-gray-600">
          Don't have an account? <Link to="/signup" className="text-leaf-600 font-bold cursor-pointer hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
        alert("Please agree to the Terms & Conditions");
        return;
    }
    setLoading(true);
    await signup(name, email, phone, password);
    setLoading(false);
    navigate('/account');
  };

  return (
    <div className="min-h-screen bg-leaf-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 w-full max-w-md border border-white/50 relative overflow-hidden">
        <div className="text-center mb-8">
           <h1 className="text-3xl font-extrabold text-gray-900">Create Account</h1>
           <p className="text-gray-500 mt-2">Join FreshLeaf for exclusive deals</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-leaf-600" size={20} />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:bg-white transition-all font-medium"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-leaf-600" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:bg-white transition-all font-medium"
                placeholder="you@example.com"
              />
            </div>
          </div>

           <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
            <div className="relative group">
              <Smartphone className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-leaf-600" size={20} />
              <input 
                type="tel" 
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:bg-white transition-all font-medium"
                placeholder="98765 43210"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Create Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-leaf-600" size={20} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:bg-white transition-all font-medium"
                placeholder="Create a password"
              />
            </div>
            <PasswordStrengthMeter password={password} />
          </div>

          <div className="flex items-start gap-3 mt-4">
             <div className="relative flex items-center">
                <input 
                    type="checkbox" 
                    id="terms" 
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-leaf-600 focus:ring-leaf-500 cursor-pointer" 
                />
             </div>
             <label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer">
                I agree to the <Link to="/terms" className="text-leaf-600 font-bold hover:underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-leaf-600 font-bold hover:underline">Privacy Policy</Link>.
             </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-leaf-600 hover:bg-leaf-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-leaf-200 transition-all hover:-translate-y-1 active:scale-95"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600">
          Already have an account? <Link to="/login" className="text-leaf-600 font-bold cursor-pointer hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};
