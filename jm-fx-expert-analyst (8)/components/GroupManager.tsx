
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

export interface Member {
  id: string;
  email: string;
  joinedAt: string;
}

export const GroupManager: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [totalSimulated, setTotalSimulated] = useState(10540);
  const [isBulkAdding, setIsBulkAdding] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      setIsSyncing(true);
      const cloudMembers = await apiService.getMembers();
      const cloudTotal = parseInt(localStorage.getItem('jm_fx_total_count') || '10540');
      setMembers(cloudMembers);
      setTotalSimulated(cloudTotal);
      setIsSyncing(false);
    };
    fetchMembers();
  }, []);

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;
    
    setIsSyncing(true);
    const newMember: Member = {
      id: Math.random().toString(36).substr(2, 9),
      email: newMemberEmail,
      joinedAt: new Date().toLocaleDateString()
    };
    
    await apiService.saveMember(newMember);
    setMembers(prev => [newMember, ...prev]);
    setTotalSimulated(prev => prev + 1);
    setNewMemberEmail('');
    setIsSyncing(false);
  };

  const bulkAdd = async () => {
    setIsBulkAdding(true);
    const newCount = await apiService.bulkAddMembers(500);
    setTotalSimulated(newCount);
    setIsBulkAdding(false);
    alert("Wanachama 500 wameongezwa kwa mafanikio kwenye Seva!");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-blue-900/10 border border-blue-500/20 p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[100px] -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              VIP Signal Group
              {isSyncing && <i className="fas fa-cloud-arrow-up text-blue-400 text-sm animate-bounce"></i>}
            </h2>
            <p className="text-blue-300/60 max-w-md">Dhibiti wanachama wa group lako la signal. Data zote zimehifadhiwa kwenye Seva ya JM FX.</p>
          </div>
          <div className="bg-[#020617] p-6 rounded-2xl border border-yellow-400/20 shadow-2xl">
            <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-1">Jumla ya Wanachama Seva</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white tracking-tighter">{totalSimulated.toLocaleString()}</span>
              <span className="text-xs text-green-400 font-bold flex items-center gap-1">
                <i className="fas fa-caret-up"></i> Live Sync
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-blue-950/20 border border-blue-500/20 p-6 rounded-2xl shadow-xl relative">
             {isSyncing && <div className="absolute inset-0 bg-[#020617]/40 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
               <i className="fas fa-sync fa-spin text-yellow-400"></i>
             </div>}
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <i className="fas fa-user-plus text-yellow-400"></i>
              Ongeza kwa Seva
            </h3>
            <form onSubmit={addMember} className="space-y-4">
              <input
                type="email"
                placeholder="Email ya mwanachama..."
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="w-full bg-[#020617] border border-blue-500/30 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={isSyncing}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {isSyncing ? "Connecting..." : "Ongeza Sasa"}
              </button>
            </form>
          </div>

          <div className="bg-yellow-500/5 border border-yellow-500/20 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-yellow-500 mb-2">Cloud Bulk Add</h3>
            <p className="text-xs text-blue-300/60 mb-4">Ingiza wanachama wengi moja kwa moja kwenye seva (Watu 500+ kwa mkupuo).</p>
            <button
              onClick={bulkAdd}
              disabled={isBulkAdding}
              className="w-full py-3 bg-[#020617] border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500 hover:text-black font-black rounded-xl transition-all disabled:opacity-50"
            >
              {isBulkAdding ? <i className="fas fa-cloud-arrow-up fa-spin"></i> : "SYNC WANACHAMA 500"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[#020617] border border-blue-500/20 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-blue-500/10 flex justify-between items-center bg-blue-900/10">
              <h3 className="font-bold text-white flex items-center gap-2">
                <i className="fas fa-server text-xs text-blue-400"></i>
                Seva: VIP Member List
              </h3>
              <span className="text-[10px] bg-yellow-400 text-black px-3 py-1 rounded-full font-black uppercase">Synced</span>
            </div>
            <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
              {members.length === 0 && !isSyncing ? (
                <div className="p-12 text-center space-y-3">
                  <i className="fas fa-database text-blue-500/20 text-5xl"></i>
                  <p className="text-blue-300/40 text-sm italic">Hakuna data mpya kwenye seva.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-[#020617] text-[10px] uppercase font-black text-blue-400 tracking-widest border-b border-blue-500/10">
                    <tr>
                      <th className="px-6 py-4">Mwanachama</th>
                      <th className="px-6 py-4">Sync Date</th>
                      <th className="px-6 py-4">Cloud Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-500/5">
                    {members.map((m) => (
                      <tr key={m.id} className="hover:bg-blue-900/10 transition-colors group">
                        <td className="px-6 py-4 text-sm text-slate-200 font-mono">{m.email}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">{m.joinedAt}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-1 rounded border border-blue-500/20 font-bold uppercase">Stored</span>
                            <i className="fas fa-cloud text-[10px] text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
