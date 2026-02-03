import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { CandleData } from '../types';

interface ForexChartProps {
  data: CandleData[];
  pair: string;
}

export const ForexChart: React.FC<ForexChartProps> = ({ data, pair }) => {
  const formattedData = data.map((d, i) => ({
    ...d,
    index: i,
    range: [d.open, d.close],
    isUp: d.close >= d.open,
  }));

  return (
    <div className="bg-[#020617] border border-blue-500/20 rounded-2xl p-4 shadow-xl h-[400px]">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="font-bold text-slate-300 flex items-center gap-2">
          <i className="fas fa-chart-area text-yellow-400"></i>
          Soko: <span className="text-white">{pair}</span>
        </h3>
        <span className="text-xs text-blue-400 italic font-mono uppercase tracking-tighter">Live Analysis Data</span>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#64748b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            domain={['auto', 'auto']} 
            orientation="right" 
            stroke="#64748b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(val) => typeof val === 'number' ? val.toFixed(4) : val}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#020617', border: '1px solid #eab30833', borderRadius: '12px' }}
            itemStyle={{ color: '#94a3b8', fontSize: '12px' }}
            labelStyle={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '4px' }}
            formatter={(value: any) => {
              if (Array.isArray(value)) {
                return value.map(v => typeof v === 'number' ? v.toFixed(5) : v).join(' → ');
              }
              return typeof value === 'number' ? value.toFixed(5) : value;
            }}
          />
          <Bar dataKey="range" isAnimationActive={false}>
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.isUp ? '#22c55e' : '#ef4444'} />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};