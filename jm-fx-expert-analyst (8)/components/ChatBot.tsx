
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = message;
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // Ensure a fresh GoogleGenAI instance is used to pick up any updated API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      // Fixed contents format: should be an array of Content objects
      const contents = chatHistory.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })).concat([{ role: 'user', parts: [{ text: userMsg }] }]);

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents.slice(-10), // Limit history to last 10 messages
        config: { systemInstruction: "You are a helpful Forex assistant for JM FX. Keep answers brief and professional in Swahili/English mix." }
      });

      // Use response.text property (not a method)
      setChatHistory(prev => [...prev, { role: 'model', text: response.text || 'Samahani, siwezi kujibu sasa.' }]);
    } catch (err: any) {
      console.error("ChatBot Error:", err);
      let errorText = 'Error: Tatizo la mtandao.';
      
      // Implementation of mandatory error handling for key-related errors
      if (err.message?.includes("Requested entity was not found")) {
        errorText = "API Key error. Please re-select your API key in Settings.";
      }
      
      setChatHistory(prev => [...prev, { role: 'model', text: errorText }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-yellow-500 hover:bg-yellow-400 text-black rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 border-4 border-blue-900"
        >
          <i className="fas fa-comment-dots text-xl"></i>
        </button>
      ) : (
        <div className="w-80 h-96 bg-[#020617] border border-blue-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="bg-blue-900/50 p-4 flex justify-between items-center border-b border-blue-500/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-white">JM FX Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-blue-300 hover:text-white">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {chatHistory.length === 0 && (
              <p className="text-xs text-blue-300/50 italic text-center">Uliza kitu kuhusu soko la Forex...</p>
            )}
            {chatHistory.map((chat, i) => (
              <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs ${chat.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-blue-900/40 text-blue-100 rounded-tl-none border border-blue-500/10'}`}>
                  {chat.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-[10px] text-yellow-400 animate-pulse font-bold">Mtaalamu anajibu...</div>}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-blue-500/10 bg-blue-950/20">
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Andika hapa..."
                className="w-full bg-[#020617] border border-blue-500/30 rounded-full pl-4 pr-10 py-2 text-xs text-white focus:ring-1 focus:ring-yellow-400 outline-none"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-yellow-500 hover:text-yellow-400">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
