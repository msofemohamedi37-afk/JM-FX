import React, { useState } from 'react';
import { TimeFrame } from '../types';

interface AnalysisFormProps {
  onAnalyze: (pair: string, timeframe: TimeFrame) => void;
  isLoading: boolean;
}

const COMMON_PAIRS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'BTC/USD', 'XAU/USD'];
const TIMEFRAMES: TimeFrame[] = ['1M', '5M', '15M', '1H', '4H', '1D', '1W'];

export const AnalysisForm: React.FC<AnalysisFormProps> = ({ onAnalyze, isLoading }) => {
  const [pair, setPair] = useState('EUR/USD');
  const [timeframe, setTimeframe] = useState<TimeFrame>('4H');
  const [customPair, setCustomPair] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(customPair || pair, timeframe);
  };

  return (
    <div className="bg-blue-950/20 backdrop-blur-md border border-blue-500/20 p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
        <i className="fas fa-search-dollar text-yellow-400"></i>
        Vigezo vya Uchambuzi
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-blue-300 mb-2">Currency Pair</label>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={pair}
              onChange={(e) => {
                setPair(e.target.value);
                setCustomPair('');
              }}
              className="w-full bg-[#020617] border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
            >
              {COMMON_PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
              <option value="CUSTOM">Custom Pair...</option>
            </select>
            {pair === 'CUSTOM' && (
              <input
                type="text"
                placeholder="e.g. GBP/JPY"
                value={customPair}
                onChange={(e) => setCustomPair(e.target.value.toUpperCase())}
                className="w-full bg-[#020617] border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
                required
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-300 mb-2">Timeframe</label>
          <div className="flex flex-wrap gap-2">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  timeframe === tf
                    ? 'bg-yellow-500 border-yellow-400 text-black shadow-lg shadow-yellow-500/20'
                    : 'bg-[#020617] border-blue-500/20 text-blue-300 hover:border-yellow-400/50'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-600/20 uppercase tracking-widest"
        >
          {isLoading ? (
            <i className="fas fa-circle-notch fa-spin text-yellow-400"></i>
          ) : (
            <>
              Anza Uchambuzi
              <i className="fas fa-chart-line group-hover:translate-x-1 transition-transform text-yellow-400"></i>
            </>
          )}
        </button>
      </form>
    </div>
  );
};