
import React from 'react';
import { Briefcase, Share2, HelpCircle, Gift, ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Careers: React.FC = () => (
  <div className="min-h-screen bg-white py-16">
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Join the FreshLeaf Team</h1>
        <p className="text-xl text-gray-500">We are on a mission to revolutionize farm-to-table delivery in India.</p>
      </div>

      <div className="grid gap-6">
        {[
          { title: "Senior Frontend Engineer", type: "Full Time", loc: "Remote / Bangalore" },
          { title: "Supply Chain Manager", type: "Full Time", loc: "New Delhi" },
          { title: "Customer Success Lead", type: "Full Time", loc: "Kolkata" },
          { title: "Delivery Fleet Coordinator", type: "Contract", loc: "Mumbai" },
        ].map((job, i) => (
          <div key={i} className="border border-gray-200 rounded-2xl p-6 flex justify-between items-center hover:shadow-lg transition cursor-pointer group">
            <div>
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-leaf-600 transition">{job.title}</h3>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Briefcase size={14}/> {job.type}</span>
                <span>•</span>
                <span>{job.loc}</span>
              </div>
            </div>
            <button className="bg-gray-100 text-gray-900 px-6 py-2 rounded-lg font-bold group-hover:bg-leaf-600 group-hover:text-white transition">Apply</button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const Referral: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16">
    <div className="container mx-auto px-4 max-w-2xl text-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-purple-100">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Gift size={40} className="text-purple-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Invite Friends & Earn ₹100</h1>
        <p className="text-gray-600 mb-8">Share your unique code with friends. When they place their first order, you both get ₹100 in your FreshLeaf Wallet.</p>
        
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 mb-8 relative">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Your Referral Code</p>
          <div className="text-4xl font-mono font-bold text-gray-900 tracking-wider">FRESH2024</div>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-600 font-bold text-sm hover:underline">Copy</button>
        </div>

        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-200 transition">
          <Share2 size={20} /> Share via WhatsApp
        </button>
      </div>
    </div>
  </div>
);

export const HelpCenter: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-16">
    <div className="container mx-auto px-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">How can we help you?</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600"><Gift size={24}/></div>
          <h3 className="font-bold text-gray-900 mb-2">Orders</h3>
          <p className="text-sm text-gray-500 mb-4">Track, return, or cancel orders</p>
          <Link to="/orders" className="text-blue-600 text-sm font-bold hover:underline">View Orders</Link>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"><MessageCircle size={24}/></div>
          <h3 className="font-bold text-gray-900 mb-2">Payment</h3>
          <p className="text-sm text-gray-500 mb-4">Refunds, wallet, and offers</p>
          <Link to="/account" className="text-green-600 text-sm font-bold hover:underline">Go to Wallet</Link>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600"><HelpCircle size={24}/></div>
          <h3 className="font-bold text-gray-900 mb-2">Account</h3>
          <p className="text-sm text-gray-500 mb-4">Profile and address settings</p>
          <Link to="/settings" className="text-orange-600 text-sm font-bold hover:underline">Manage Account</Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Popular Topics</h3>
        <ul className="space-y-4">
          {[
            "Where is my order?",
            "How do I return an item?",
            "I received a damaged item, what do I do?",
            "How to use my wallet balance?",
            "Do you deliver on Sundays?"
          ].map((topic, i) => (
            <li key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition">
              <span className="font-medium text-gray-700">{topic}</span>
              <ArrowRight size={16} className="text-gray-400"/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export const CookiePolicy: React.FC = () => (
  <div className="min-h-screen bg-white py-16">
    <div className="container mx-auto px-4 max-w-3xl prose prose-leaf">
      <h1>Cookie Policy</h1>
      <p>Effective Date: October 24, 2023</p>
      <p>At FreshLeaf, we use cookies to improve your experience. This policy explains what cookies are and how we use them.</p>
      <h3>What are cookies?</h3>
      <p>Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and login state.</p>
      <h3>How we use cookies</h3>
      <ul>
        <li>**Essential Cookies:** Required for the website to function (e.g., shopping cart).</li>
        <li>**Analytics Cookies:** Help us understand how you use our site.</li>
        <li>**Marketing Cookies:** Used to deliver relevant ads.</li>
      </ul>
      <h3>Managing Cookies</h3>
      <p>You can control specific cookie preferences in your browser settings.</p>
    </div>
  </div>
);
