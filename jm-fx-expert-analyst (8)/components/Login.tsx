
import React, { useState, useEffect } from 'react';

interface LoginProps {
  onLogin: (email: string) => void;
}

const Candle = ({ delay, duration, height, isUp, left }: { delay: string, duration: string, height: string, isUp: boolean, left: string }) => (
  <div 
    className="absolute flex flex-col items-center animate-pulse"
    style={{ 
      left, 
      bottom: '-10%',
      animation: `float ${duration} linear infinite`,
      animationDelay: delay,
      opacity: 0.15
    }}
  >
    {/* Wick */}
    <div className={`w-[1px] h-24 ${isUp ? 'bg-green-500' : 'bg-red-500'}`}></div>
    {/* Body */}
    <div className={`w-3 rounded-sm shadow-lg ${isUp ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'}`} style={{ height }}></div>
    {/* Wick */}
    <div className={`w-[1px] h-16 ${isUp ? 'bg-green-500' : 'bg-red-500'}`}></div>
  </div>
);

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      onLogin(email);
    }
  };

  // Generate some random-ish candles for the background
  const backgroundCandles = [
    { left: '5%', height: '80px', isUp: true, duration: '15s', delay: '0s' },
    { left: '15%', height: '120px', isUp: false, duration: '18s', delay: '2s' },
    { left: '25%', height: '60px', isUp: true, duration: '12s', delay: '5s' },
    { left: '35%', height: '140px', isUp: false, duration: '20s', delay: '1s' },
    { left: '45%', height: '90px', isUp: true, duration: '16s', delay: '8s' },
    { left: '55%', height: '110px', isUp: false, duration: '14s', delay: '3s' },
    { left: '65%', height: '70px', isUp: true, duration: '19s', delay: '6s' },
    { left: '75%', height: '130px', isUp: false, duration: '17s', delay: '0s' },
    { left: '85%', height: '100px', isUp: true, duration: '21s', delay: '4s' },
    { left: '95%', height: '85px', isUp: false, duration: '13s', delay: '7s' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 relative overflow-hidden">
      {/* Custom Styles for Animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(110vh); }
          100% { transform: translateY(-110vh); }
        }
      `}</style>

      {/* Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {backgroundCandles.map((c, i) => (
          <Candle key={i} {...c} />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-yellow-500/5 rounded-full blur-[120px]"></div>

      {/* Login Card */}
      <div className="max-w-md w-full bg-blue-950/20 border border-blue-500/20 p-8 rounded-3xl shadow-2xl space-y-8 backdrop-blur-2xl z-10 relative">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/30 border border-yellow-400/20 animate-bounce transition-all">
            <i className="fas fa-bolt text-yellow-400 text-4xl"></i>
          </div>
          <div className="pt-4">
            <h1 className="text-4xl font-black tracking-tighter text-white">JM <span className="text-yellow-400">FX</span></h1>
            <div className="h-1 w-12 bg-yellow-400 mx-auto rounded-full mt-1"></div>
          </div>
          <p className="text-blue-300/60 text-sm font-medium pt-2">Ingia ili kuanza uchambuzi wa kitaalamu na JM FX</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-black text-blue-400 uppercase tracking-widest ml-1">Barua Pepe (Email)</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 group-focus-within:text-yellow-400 transition-colors">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                type="email"
                placeholder="mfano@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#020617]/50 border border-blue-500/30 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all placeholder:text-blue-900"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-2xl transition-all shadow-lg shadow-yellow-500/20 uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95"
          >
            INGIA SASA
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
        </form>

        <div className="flex items-center justify-center gap-4 text-blue-500/30">
          <div className="h-[1px] w-full bg-blue-500/10"></div>
          <span className="text-[10px] font-black whitespace-nowrap uppercase tracking-[0.3em]">JM FX SECURED</span>
          <div className="h-[1px] w-full bg-blue-500/10"></div>
        </div>
      </div>
    </div>
  );
};
