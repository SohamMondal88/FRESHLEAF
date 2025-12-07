import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Loader2 } from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";
import { PRODUCTS } from '../constants';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Hi! I am the FreshLeaf assistant. Ask me about our fresh vegetables, fruits, prices, or store policies!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Ref to hold the chat session instance
  const chatSessionRef = useRef<Chat | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Initialize GenAI Chat
  useEffect(() => {
    const initChat = async () => {
      try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.warn("API Key not found for Chatbot");
            return;
        }

        const ai = new GoogleGenAI({ apiKey });
        
        // Construct context from products and policies
        const productContext = PRODUCTS.map(p => 
          `- ${p.name.en} (${p.name.hi}): ₹${p.price} per ${p.baseUnit}. Category: ${p.category}. ${p.inStock ? 'In Stock' : 'Out of Stock'}. Desc: ${p.description}`
        ).join('\n');

        const policyContext = `
          Store Policies:
          - Shipping: Free shipping on orders above ₹499. Standard delivery takes 24-48 hours. Express delivery (30 mins) available for Pro members.
          - Returns: "No questions asked" refund policy. You can return items within 24 hours of delivery if you are not satisfied with the quality.
          - Payments: We accept Cash on Delivery (COD) and currently working on Online Payments.
          - Privacy: We use SSL encryption. We do not share your personal data with third parties.
          - Location: We deliver to all major Metro cities in India.
          - Support: Email us at support@freshleaf.in or call +91 98765 43210.
        `;

        const systemInstruction = `
          You are a helpful, friendly, and professional AI customer support agent for FreshLeaf, an online organic grocery store.
          Your goal is to assist customers with product inquiries, prices, and store policies.
          
          Here is our Product Catalog:
          ${productContext}

          Here are our Store Policies:
          ${policyContext}

          Rules:
          1. Currency is Indian Rupee (₹).
          2. If a user asks about a product not in the catalog, politely inform them we don't have it yet.
          3. Keep answers concise and helpful.
          4. You can speak in English, or Hinglish if the user prefers.
        `;

        chatSessionRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: systemInstruction,
          },
        });
      } catch (error) {
        console.error("Failed to initialize chat", error);
      }
    };

    initChat();
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      if (chatSessionRef.current) {
        const result = await chatSessionRef.current.sendMessage({ message: userMessage });
        setMessages(prev => [...prev, { role: 'model', text: result.text }]);
      } else {
        // Fallback if API key is missing or init failed
        setMessages(prev => [...prev, { role: 'model', text: "I'm currently offline. Please check back later." }]);
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-leaf-600 hover:bg-leaf-700 hover:scale-110'
        } text-white`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-96 h-[500px] max-h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100 animate-in fade-in slide-in-from-bottom-10 overflow-hidden font-sans">
          
          {/* Header */}
          <div className="bg-leaf-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">FreshLeaf Assistant</h3>
                <span className="flex items-center gap-1 text-[10px] text-leaf-100">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span> Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-leaf-600 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                  <Loader2 size={16} className="animate-spin text-leaf-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about fresh veggies..."
              className="flex-grow bg-gray-100 text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-leaf-500/50 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-leaf-600 text-white p-2.5 rounded-full hover:bg-leaf-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
