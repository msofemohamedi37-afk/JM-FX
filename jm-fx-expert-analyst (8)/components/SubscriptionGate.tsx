
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

interface SubscriptionGateProps {
  email: string;
  onActivated: () => void;
}

export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({ email, onActivated }) => {
  const [isPending, setIsPending] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({ number: '07XX XXX XXX', name: 'JM EXPERT ANALYST' });

  useEffect(() => {
    const checkStatus = async () => {
      const [sub, info] = await Promise.all([
        apiService.getSubscription(email),
        apiService.getPaymentInfo()
      ]);
      setPaymentInfo(info);
      if (sub.isPending) setIsPending(true);
      if (sub.isPaid) onActivated();
    };
    checkStatus();
    
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, [email, onActivated]);

  const handleRequestActivation = async () => {
    setIsRequesting(true);
    await apiService.requestActivation(email);
    setIsPending(true);
    setIsRequesting(false);
  };

  if (isPending) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center space-y-8 animate-pulse">
        <div className="w-24 h-24 bg-yellow-500/20 rounded-full mx-auto flex items-center justify-center border-4 border-yellow-500">
          <i className="fas fa-clock text-yellow-500 text-4xl animate-spin-slow"></i>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-white">Inahakiki Malipo yako...</h2>
          <p className="text-blue-300/60">
            Hujambo <span className="text-yellow-400 font-bold">{email}</span>, ombi lako limetumwa kwa Admin. 
            Tafadhali subiri kidogo wakati tunathibitisha muamala wako wa 5,000/=.
          </p>
          <div className="bg-blue-900/10 p-6 rounded-3xl border border-blue-500/20">
            <p className="text-xs text-blue-400 mb-2">Bado hujaunganishwa?</p>
            <a 
              href={`https://wa.me/${paymentInfo.number.replace(/\s+/g, '')}?text=Habari%20Admin,%20nimefanya%20malipo%20ya%20JM%20FX%20kwa%20email%20yangu%20${email}`} 
              className="inline-flex items-center gap-2 text-green-400 font-bold hover:underline"
              target="_blank"
            >
              <i className="fab fa-whatsapp"></i> Chat na Admin WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="bg-gradient-to-br from-red-600/20 to-blue-900/40 border border-blue-500/20 p-10 rounded-[3rem] text-center space-y-6 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-yellow-500/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="w-20 h-20 bg-yellow-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-yellow-500/20 border-4 border-[#020617]">
            <i className="fas fa-lock text-black text-3xl"></i>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Pata Full Access (VIP)</h2>
          <p className="text-blue-200/60 max-w-lg mx-auto">
            Hujambo <span className="text-yellow-400 font-bold">{email}</span>. Ili kupata Signals na Uchambuzi wa kitaalamu, unapaswa kulipia huduma kwa mwezi mmoja.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 text-left">
          <div className="bg-[#020617]/60 p-8 rounded-3xl border border-blue-500/10 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fas fa-money-bill-transfer text-green-400"></i>
              Lipia Hapa
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-900/20 rounded-2xl border border-blue-500/10">
                <p className="text-[10px] text-blue-400 font-black uppercase mb-1">M-PESA / TIGO PESA</p>
                <p className="text-white font-mono font-bold text-2xl tracking-wider">{paymentInfo.number}</p>
                <p className="text-xs text-slate-500 mt-1 uppercase">Jina: {paymentInfo.name}</p>
              </div>
              <div className="p-4 bg-blue-900/20 rounded-2xl border border-blue-500/10">
                <p className="text-[10px] text-blue-400 font-black uppercase mb-1">KIASI CHA MALIPO</p>
                <p className="text-yellow-400 font-black text-2xl">TSH 5,000</p>
                <p className="text-[10px] text-slate-500">Muda: Siku 30 (Mwezi Mmoja)</p>
              </div>
            </div>
          </div>

          <div className="bg-[#020617]/60 p-8 rounded-3xl border border-yellow-500/10 flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Hatua ya Mwisho</h3>
              <p className="text-sm text-slate-400">Baada ya kutuma pesa, bonyeza kitufe hapa chini ili kumjulisha Admin akuwashe (Activate).</p>
            </div>
            
            <button
              onClick={handleRequestActivation}
              disabled={isRequesting}
              className="w-full py-5 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-2xl transition-all shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-3 text-lg active:scale-95"
            >
              {isRequesting ? <i className="fas fa-circle-notch fa-spin"></i> : (
                <>
                  NIMESHALIPIA - NIWASHE
                  <i className="fas fa-paper-plane"></i>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-blue-300/30 uppercase font-black tracking-widest">Mfumo utafungwa baada ya siku 30</p>
          </div>
        </div>
      </div>
    </div>
  );
};
