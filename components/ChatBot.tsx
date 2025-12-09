
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";
import { PRODUCTS } from '../constants';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Hi! I am FreshLeaf AI. I can help you find products, check prices, or even suggest recipes with ingredients we sell! What are you cooking today?' }
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
        
        // Construct robust context from products
        const productContext = PRODUCTS.map(p => 
          `- ${p.name.en} (${p.name.hi}): Price: ₹${p.price}/${p.baseUnit}. Category: ${p.category}. Status: ${p.inStock ? 'Available' : 'Out of Stock'}. Rating: ${p.rating}. Description: ${p.description}.`
        ).join('\n');

        const systemInstruction = `
          You are FreshLeaf AI, an expert chef and shop assistant for an online organic grocery store.
          
          YOUR KNOWLEDGE BASE:
          ${productContext}

          YOUR CAPABILITIES:
          
          1. **Product Search & Details:**
             - If a user asks about a product, check your Knowledge Base.
             - If found, provide ALL details: Name, Hindi Name, Price per unit, Category, Rating, and Description.
             - If NOT found (e.g., "Strawberry"), explicitly say: "I'm sorry, but [Product] is not currently available in our shop." Then suggest a similar alternative if possible (e.g., "However, we have fresh Apples...").

          2. **Chef & Recipe Mode:**
             - If a user asks for a recipe or "how to make [Dish]", provide a structured response:
               - **Dish Name:** [Name]
               - **Ingredients:** List ingredients. Mark items available in our store with (Available at FreshLeaf ✅).
               - **Instructions:** A step-by-step cooking process.
             - Suggest which vegetables/fruits from our store work best for this dish.

          3. **General Support:**
             - Delivery: Free >₹499. Standard (24h). Express (Pro members).
             - Returns: No questions asked, 24h window.
             - Payments: COD, UPI, Credit Points redemption allowed.
             - Credit Points: You earn 5% points on every purchase. 1 Point = ₹1. Use them to pay!

          TONE:
          - Friendly, professional, and helpful.
          - Use emojis 🥦🍅🥕.
          - Keep responses concise but complete.
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
          isOpen ? 'bg-red-500 rotate-90' : 'bg-gradient-to-r from-leaf-600 to-leaf-500 hover:scale-110'
        } text-white`}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={28} className="animate-pulse" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-96 h-[550px] max-h-[75vh] bg-white rounded-3xl shadow-2xl flex flex-col border border-gray-100 animate-in fade-in slide-in-from-bottom-10 overflow-hidden font-sans ring-1 ring-black/5">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-leaf-700 to-leaf-600 p-4 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full border border-white/20 backdrop-blur-sm">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">FreshLeaf AI Chef</h3>
                <span className="flex items-center gap-1.5 text-[10px] text-leaf-100 font-medium">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse shadow-[0_0_5px_#86efac]"></span> Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition bg-white/10 rounded-full p-1">
              <Minimize2 size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-4 bg-gray-50 space-y-4 scrollbar-hide">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-leaf-600 text-white rounded-tr-sm'
                      : 'bg-white text-gray-800 border border-gray-200/50 rounded-tl-sm'
                  }`}
                >
                  {/* Basic markdown rendering for lists and bold text */}
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className={`mb-1 ${line.startsWith('**') ? 'font-bold mt-2' : ''} ${line.startsWith('-') ? 'pl-2' : ''}`}>
                      {line.replace(/\*\*/g, '')}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-leaf-600" />
                  <span className="text-xs text-gray-400 font-medium">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Recipe for Palak Paneer? Price of Apple?"
              className="flex-grow bg-gray-100 text-sm rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-leaf-500/50 focus:bg-white transition-all placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-leaf-600 text-white p-3 rounded-full hover:bg-leaf-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-leaf-200 hover:scale-105 active:scale-95"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
