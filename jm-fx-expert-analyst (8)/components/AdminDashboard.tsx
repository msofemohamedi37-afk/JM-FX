
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { UserSubscription } from '../types';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserSubscription[]>([]);
  const [paymentInfo, setPaymentInfo] = useState({ number: '', name: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const [allSubs, info] = await Promise.all([
      apiService.getAllSubscriptions(),
      apiService.getPaymentInfo()
    ]);
    setUsers(allSubs);
    setPaymentInfo(info);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingInfo(true);
    await apiService.updatePaymentInfo(paymentInfo.number, paymentInfo.name);
    setIsSavingInfo(false);
    alert('Namba ya malipo imesasishwa kikamilifu!');
  };

  const handleApprove = async (email: string) => {
    setActionLoading(email);
    await apiService.adminApproveUser(email);
    await fetchData();
    setActionLoading(null);
  };

  const handleReject = async (email: string) => {
    if (!confirm(`Una uhakika unataka kufuta ombi la ${email}?`)) return;
    setActionLoading(email);
    await apiService.adminRejectUser(email);
    await fetchData();
    setActionLoading(null);
  };

  const pendingUsers = users.filter(u => u.isPending);
  const activeUsers = users.filter(u => u.isPaid);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white mb-2">Admin Control Center</h2>
          <p className="text-blue-100/60">Karibu JM. Kudhibiti malipo ya 5,000/= TZS na namba ya kupokelea pesa.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-[#020617] border border-yellow-500/20 p-6 rounded-2xl">
          <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-1">Maombi Mapya</p>
          <p className="text-3xl font-black text-white">{pendingUsers.length}</p>
        </div>
        <div className="bg-[#020617] border border-green-500/20 p-6 rounded-2xl">
          <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Watumiaji Active</p>
          <p className="text-3xl font-black text-white">{activeUsers.length}</p>
        </div>
        <div className="bg-[#020617] border border-blue-500/20 p-6 rounded-2xl lg:col-span-2">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Mapato (5k per user)</p>
          <p className="text-3xl font-black text-white">{(activeUsers.length * 5000).toLocaleString()} TZS</p>
        </div>
      </div>

      {/* Payment Settings Section */}
      <div className="bg-[#020617] border border-blue-500/20 rounded-3xl p-8 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-cog text-blue-400"></i>
          Mipangilio ya Namba ya Malipo
        </h3>
        <form onSubmit={handleUpdatePayment} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Namba ya Simu (M-Pesa/Tigo)</label>
            <input 
              type="text" 
              value={paymentInfo.number}
              onChange={e => setPaymentInfo({...paymentInfo, number: e.target.value})}
              placeholder="07XX XXX XXX"
              className="w-full bg-[#020617] border border-blue-500/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Jina la Akaunti</label>
            <input 
              type="text" 
              value={paymentInfo.name}
              onChange={e => setPaymentInfo({...paymentInfo, name: e.target.value})}
              placeholder="Jina kamili"
              className="w-full bg-[#020617] border border-blue-500/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isSavingInfo}
            className="py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-xl transition-all shadow-lg shadow-yellow-500/20 uppercase text-xs"
          >
            {isSavingInfo ? <i className="fas fa-spinner fa-spin"></i> : 'HIFADHI NAMBA'}
          </button>
        </form>
      </div>

      <div className="bg-[#020617] border border-blue-500/20 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-blue-500/10 bg-blue-900/5 flex justify-between items-center">
          <h3 className="font-black text-white uppercase tracking-tighter">Maombi Yanayosubiri (Pending)</h3>
          <button onClick={fetchData} className="text-xs text-blue-400 hover:text-white transition-colors">
            <i className={`fas fa-sync ${isLoading ? 'fa-spin' : ''}`}></i> Refresh
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {pendingUsers.length === 0 ? (
            <div className="p-12 text-center text-slate-500 italic">Hakuna maombi mapya kwa sasa.</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-blue-950/20 text-[10px] uppercase font-black text-blue-400">
                <tr>
                  <th className="px-6 py-4">Mtumiaji</th>
                  <th className="px-6 py-4">Mpango</th>
                  <th className="px-6 py-4">Hatua</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-500/5">
                {pendingUsers.map(u => (
                  <tr key={u.email} className="hover:bg-blue-900/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-white">{u.email}</td>
                    <td className="px-6 py-4 text-xs text-yellow-500 font-bold">{u.plan}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleApprove(u.email)}
                        disabled={!!actionLoading}
                        className="bg-green-600 hover:bg-green-500 text-white text-[10px] px-4 py-2 rounded-lg font-black transition-all"
                      >
                        {actionLoading === u.email ? <i className="fas fa-spinner fa-spin"></i> : 'APPROVE'}
                      </button>
                      <button
                        onClick={() => handleReject(u.email)}
                        disabled={!!actionLoading}
                        className="bg-red-900/40 hover:bg-red-600 text-red-400 hover:text-white text-[10px] px-4 py-2 rounded-lg font-black transition-all"
                      >
                        FUTA
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="bg-[#020617] border border-blue-500/20 rounded-3xl overflow-hidden shadow-xl opacity-60">
        <div className="p-6 border-b border-blue-500/10">
          <h3 className="font-black text-white uppercase tracking-tighter">Watumiaji Waliolipa (Active)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-blue-950/20 text-[10px] uppercase font-black text-blue-400">
              <tr>
                <th className="px-6 py-4">Mtumiaji</th>
                <th className="px-6 py-4">Mwisho wa Subscription</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-500/5">
              {activeUsers.map(u => (
                <tr key={u.email}>
                  <td className="px-6 py-4 text-sm text-slate-300">{u.email}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {u.expiryDate ? new Date(u.expiryDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20 font-black uppercase">ACTIVE</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
