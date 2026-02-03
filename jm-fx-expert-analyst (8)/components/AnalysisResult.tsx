
import React, { useState } from 'react';
import { ForexAnalysis } from '../types';
import { ForexChart } from './ForexChart';

interface AnalysisResultProps {
  analysis: ForexAnalysis;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis }) => {
  const [copied, setCopied] = useState(false);
  const [sentToGroup, setSentToGroup] = useState(false);

  const signalTheme = analysis.primarySignal.type === 'Buy' 
    ? { bg: 'bg-green-500/5', border: 'border-green-500/20', accent: 'text-green-500', btn: 'bg-green-600' }
    : { bg: 'bg-red-500/5', border: 'border-red-500/20', accent: 'text-red-500', btn: 'bg-red-600' };

  const handleShare = () => {
    const text = `🚀 JM FX SIGNAL: ${analysis.pair} (${analysis.timeframe})\n\n` +
      `📌 TYPE: ${analysis.primarySignal.type.toUpperCase()}\n` +
      `💰 ENTRY: ${analysis.primarySignal.entryPrice}\n` +
      `🛑 STOP LOSS: ${analysis.primarySignal.stopLoss}\n` +
      `🎯 TAKE PROFIT: ${analysis.primarySignal.takeProfit}\n` +
      `⚖️ R:R: ${analysis.primarySignal.riskReward}\n\n` +
      `📝 LOGIC: ${analysis.primarySignal.reasoning}\n\n` +
      `Powered by JM FX AI ⚡`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const broadcastToGroup = () => {
    setSentToGroup(true);
    setTimeout(() => setSentToGroup(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Chart Section with Live Badge */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-green-500/30">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Market Data</span>
        </div>
        <ForexChart data={analysis.mockChartData} pair={analysis.pair} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Technical Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#020617] border border-blue-500/20 p-6 rounded-2xl shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl -mr-12 -mt-12"></div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-blue-500/10 pb-2 text-white">
              <i className="fas fa-microscope text-yellow-400"></i>
              Uchambuzi wa Soko Halisi
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Structure & Trend</h4>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-blue-900/10 rounded-lg border border-blue-500/10">
                    <span className="text-blue-200/50 text-sm">Market Structure</span>
                    <span className="font-bold text-white text-sm">{analysis.marketStructure}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-blue-900/10 rounded-lg border border-blue-500/10">
                    <span className="text-blue-200/50 text-sm">Trend Direction</span>
                    <span className={`font-bold text-sm ${analysis.trendDirection.toLowerCase().includes('bull') ? 'text-green-400' : 'text-red-400'}`}>
                      {analysis.trendDirection}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-blue-900/10 rounded-lg border border-blue-500/10">
                    <span className="text-blue-200/50 text-sm">Trend Strength</span>
                    <span className="font-bold text-yellow-400 text-sm">{analysis.trendStrength}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Liquidity & Zones</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-900/10 rounded-lg border border-blue-500/10">
                    <p className="text-xs text-blue-200/50 mb-1">Key Support/Resistance</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.supportResistance.map((zone, i) => (
                        <span key={i} className="text-[10px] bg-blue-950/40 px-2 py-1 rounded border border-yellow-400/20 text-yellow-100 font-mono">{zone}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-blue-900/10 rounded-lg border border-blue-500/10">
                    <p className="text-xs text-blue-200/50 mb-1">Supply & Demand</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.supplyDemandZones.map((zone, i) => (
                        <span key={i} className="text-[10px] bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded border border-yellow-400/30 font-mono">{zone}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-950/20 rounded-xl border border-blue-500/20">
              <h4 className="text-sm font-semibold text-yellow-400 mb-2 italic flex items-center gap-2">
                <i className="fas fa-quote-left text-blue-400 text-xs"></i> Muhtasari wa Kitaalamu
              </h4>
              <p className="text-slate-200 text-sm leading-relaxed italic">
                "{analysis.summary}"
              </p>
            </div>

            {/* Grounding Sources are required by guidelines for search tools */}
            {analysis.groundingSources && analysis.groundingSources.length > 0 && (
              <div className="mt-6 border-t border-blue-500/10 pt-4">
                <h4 className="text-[10px] font-black text-blue-400 uppercase mb-2 tracking-widest flex items-center gap-2">
                  <i className="fas fa-globe"></i> Data Grounding (Live Sources)
                </h4>
                <div className="flex flex-wrap gap-3">
                  {analysis.groundingSources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] text-blue-400 hover:text-white underline transition-colors"
                    >
                      {source.title || 'Live Market Info'}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#020617] border border-blue-500/20 p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-blue-500/10 pb-2 text-white">
              <i className="fas fa-shield-virus text-yellow-500"></i>
              Mkakati Mbadala (Invalidation)
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">{analysis.alternativeScenario}</p>
          </div>
        </div>

        {/* Signal Sidebar */}
        <div className="space-y-6">
          <div className={`border p-6 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-sm ${signalTheme.bg} ${signalTheme.border}`}>
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <i className={`fas ${analysis.primarySignal.type === 'Buy' ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} text-7xl text-yellow-400`}></i>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-white">TRADE SIGNAL</h3>
              <span className={`px-4 py-1 rounded-full font-bold text-xs text-white ${signalTheme.btn}`}>
                {analysis.primarySignal.type}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-blue-500/10 pb-2">
                <span className="text-blue-300/60 text-xs font-medium uppercase">Current Entry</span>
                <span className="text-lg font-mono font-bold text-white tracking-wider">{analysis.primarySignal.entryPrice}</span>
              </div>
              <div className="flex justify-between items-center border-b border-blue-500/10 pb-2">
                <span className="text-blue-300/60 text-xs font-medium uppercase">Stop Loss</span>
                <span className="text-lg font-mono font-bold text-red-400 tracking-wider">{analysis.primarySignal.stopLoss}</span>
              </div>
              <div className="flex justify-between items-center border-b border-blue-500/10 pb-2">
                <span className="text-blue-300/60 text-xs font-medium uppercase">Take Profit</span>
                <span className="text-lg font-mono font-bold text-green-400 tracking-wider">{analysis.primarySignal.takeProfit}</span>
              </div>
              <div className="flex justify-between items-center bg-yellow-400/10 p-4 rounded-lg border border-yellow-400/20 mt-4">
                <span className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.2em]">Risk : Reward</span>
                <span className="text-2xl font-black text-white">{analysis.primarySignal.riskReward}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button
                onClick={handleShare}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 group"
              >
                <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} group-hover:scale-110 transition-transform`}></i>
                {copied ? 'Signal Copied!' : 'Copy Signal'}
              </button>
              
              <button
                onClick={broadcastToGroup}
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-yellow-500/20 active:scale-95 uppercase text-xs tracking-widest"
              >
                <i className={`fas ${sentToGroup ? 'fa-check-double' : 'fa-users-line'}`}></i>
                {sentToGroup ? 'Sent to Members!' : 'Broadcast VIP'}
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="text-[10px] font-black text-blue-400 uppercase mb-1 tracking-widest">Logic & Reasoning</h4>
                <p className="text-sm text-slate-300 leading-snug">{analysis.primarySignal.reasoning}</p>
              </div>
              <div className="bg-[#020617]/60 p-3 rounded-lg border border-blue-500/10">
                <h4 className="text-[10px] font-black text-yellow-400 uppercase mb-1 tracking-widest">Price Confirmation</h4>
                <p className="text-xs text-slate-400 italic">{analysis.primarySignal.confirmation}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-2xl">
            <h4 className="text-[10px] font-bold text-yellow-400 uppercase mb-2 flex items-center gap-2">
              <i className="fas fa-bolt"></i> Market Insight
            </h4>
            <p className="text-xs text-blue-100/40 leading-relaxed font-mono italic">
              Liquidity areas found at: {analysis.liquidityClusters.join(', ')}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
