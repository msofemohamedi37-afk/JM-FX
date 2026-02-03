
import React from 'react';

export const HostingGuide: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-blue-600 to-blue-900 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white mb-2">Hosting & Deployment</h2>
          <p className="text-blue-100/80 max-w-xl">Fuata hatua hizi ili kuufanya mfumo wako wa JM FX uonekane na kila mtu mtandaoni.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#020617] border border-blue-500/20 p-6 rounded-2xl space-y-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <i className="fas fa-rocket text-blue-600 text-xl"></i>
          </div>
          <h3 className="text-xl font-bold text-white">Hatua ya 1: Vercel Hosting</h3>
          <ol className="text-sm text-slate-400 space-y-3 list-decimal ml-4">
            <li>Tengeneza akaunti <span className="text-blue-400 font-bold">Vercel.com</span>.</li>
            <li>Unganisha kodi zako kupitia GitHub.</li>
            <li>Kwenye **Environment Variables**, weka <code className="bg-blue-900/30 text-yellow-400 px-2 rounded">API_KEY</code> yako.</li>
            <li>Bonyeza **Deploy**. Utapata link ya bure (mfano: jmfx.vercel.app).</li>
          </ol>
        </div>

        <div className="bg-[#020617] border border-blue-500/20 p-6 rounded-2xl space-y-4">
          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
            <i className="fas fa-database text-black text-xl"></i>
          </div>
          <h3 className="text-xl font-bold text-white">Hatua ya 2: Real Database</h3>
          <p className="text-sm text-slate-400">
            Ili data za wanachama 10,000+ zionekane na kila mtu, unapaswa kutumia **Firebase Firestore**.
          </p>
          <div className="bg-blue-900/10 p-3 rounded-xl border border-blue-500/10">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Database Config Preview</p>
            <code className="text-[10px] text-yellow-400/70 font-mono">
              const firebaseConfig = &#123;<br/>
              &nbsp;&nbsp;apiKey: "YOUR_KEY",<br/>
              &nbsp;&nbsp;projectId: "jm-fx-pro"<br/>
              &#125;;
            </code>
          </div>
          <button className="w-full py-2 bg-yellow-500 text-black font-bold rounded-lg text-xs hover:bg-yellow-400 transition-all">
            Fungua Firebase Console
          </button>
        </div>
      </div>

      <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <i className="fas fa-server text-yellow-400 text-sm"></i>
          Server Cloud Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#020617] rounded-xl border border-blue-500/10 text-center">
            <p className="text-[10px] text-blue-400 uppercase font-black mb-1">Uptime</p>
            <p className="text-lg font-bold text-white">99.9%</p>
          </div>
          <div className="p-4 bg-[#020617] rounded-xl border border-blue-500/10 text-center">
            <p className="text-[10px] text-blue-400 uppercase font-black mb-1">Region</p>
            <p className="text-lg font-bold text-white">Global</p>
          </div>
          <div className="p-4 bg-[#020617] rounded-xl border border-blue-500/10 text-center">
            <p className="text-[10px] text-blue-400 uppercase font-black mb-1">SSL</p>
            <p className="text-lg font-bold text-green-400">Secure</p>
          </div>
          <div className="p-4 bg-[#020617] rounded-xl border border-blue-500/10 text-center">
            <p className="text-[10px] text-blue-400 uppercase font-black mb-1">API Tier</p>
            <p className="text-lg font-bold text-yellow-400">Pro AI</p>
          </div>
        </div>
      </div>
    </div>
  );
};
