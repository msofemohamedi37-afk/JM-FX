
import React, { useState, useEffect } from 'react';
import { AnalysisForm } from './components/AnalysisForm';
import { AnalysisResult } from './components/AnalysisResult';
import { Login } from './components/Login';
import { ChatBot } from './components/ChatBot';
import { GroupManager } from './components/GroupManager';
import { HostingGuide } from './components/HostingGuide';
import { SubscriptionGate } from './components/SubscriptionGate';
import { AdminDashboard } from './components/AdminDashboard';
import { getForexAnalysis } from './services/geminiService';
import { apiService } from './services/apiService';
import { ForexAnalysis, TimeFrame, UserSubscription } from './types';

const App: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('fx_user_email'));
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'group' | 'hosting' | 'admin'>('analysis');
  const [isLoading, setIsLoading] = useState(false);
  const [isServerOnline, setIsServerOnline] = useState(false);
  const [analysis, setAnalysis] = useState<ForexAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsKey, setNeedsKey] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setNeedsKey(!hasKey);
      }
      const status = await apiService.checkServerStatus();
      setIsServerOnline(status);
      
      if (userEmail) {
        const sub = await apiService.getSubscription(userEmail);
        setSubscription(sub);
        if (sub.isAdmin) setActiveTab('admin');
      }
    };
    initApp();
  }, [userEmail]);

  const handleLogin = (email: string) => {
    setUserEmail(email);
    localStorage.setItem('fx_user_email', email);
  };

  const handleLogout = () => {
    setUserEmail(null);
    setSubscription(null);
    localStorage.removeItem('fx_user_email');
  };

  const handleActivated = async () => {
    if (userEmail) {
      const sub = await apiService.getSubscription(userEmail);
      setSubscription(sub);
    }
  };

  const handleOpenKeyDialog = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setNeedsKey(false);
      setError(null);
    }
  };

  const handleAnalyze = async (pair: string, timeframe: TimeFrame) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getForexAnalysis(pair, timeframe);
      setAnalysis(result);
      await apiService.saveAnalysis(result);
    } catch (err: any) {
      console.error(err);
      let msg = "Imeshindikana kufanya uchambuzi.";
      if (err.message?.includes("API Key")) {
        msg = "API Key haijapatikana au imezuiwa. Tafadhali bonyeza Settings (⚙️).";
        setNeedsKey(true);
      } else {
        msg = err.message || "Hitilafu imetokea.";
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userEmail) {
    return <Login onLogin={handleLogin} />;
  }

  const isPaid = subscription?.isPaid || false;
  const isAdmin = subscription?.isAdmin || false;

  return (
    <div className="min-h-screen pb-20 selection:bg-yellow-500/30 bg-[#020617]">
      <nav className="bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg border border-yellow-400/30">
              <i className="fas fa-bolt text-yellow-400 text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white">JM <span className="text-yellow-400">FX</span></h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-none">{userEmail.split('@')[0]}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${isServerOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex gap-2">
            {isAdmin ? (
              <>
                <button 
                  onClick={() => setActiveTab('admin')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'admin' ? 'bg-purple-600 text-white' : 'text-blue-300 hover:bg-blue-900/30'}`}
                >
                  <i className="fas fa-user-shield"></i> Admin Panel
                </button>
                <button 
                  onClick={() => setActiveTab('analysis')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'analysis' ? 'bg-yellow-500 text-black' : 'text-blue-300 hover:bg-blue-900/30'}`}
                >
                  <i className="fas fa-chart-line"></i> Go To App
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setActiveTab('analysis')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'analysis' ? 'bg-yellow-500 text-black' : 'text-blue-300 hover:bg-blue-900/30'}`}
                >
                  <i className="fas fa-chart-line"></i> Uchambuzi
                </button>
                <button 
                  onClick={() => setActiveTab('group')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'group' ? 'bg-yellow-500 text-black' : 'text-blue-300 hover:bg-blue-900/30'}`}
                >
                  <i className="fas fa-users"></i> VIP Group
                </button>
              </>
            )}
            
            <button 
              onClick={handleOpenKeyDialog}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${needsKey ? 'bg-red-500 text-white animate-pulse' : 'text-blue-300 hover:bg-blue-900/30 border border-blue-500/20'}`}
              title="API Settings"
            >
              <i className="fas fa-cog"></i> 
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
             {isPaid && !isAdmin && <span className="text-[10px] font-black text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 uppercase">Pro Active</span>}
             {isAdmin && <span className="text-[10px] font-black text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 uppercase">Super Admin</span>}
             <button 
              onClick={handleLogout}
              className="text-xs text-blue-500/50 hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {!isPaid && !isAdmin ? (
          <SubscriptionGate email={userEmail} onActivated={handleActivated} />
        ) : (
          <>
            {activeTab === 'admin' && isAdmin && <AdminDashboard />}
            
            {activeTab === 'analysis' && (
              <>
                {needsKey && (
                  <div className="max-w-4xl mx-auto mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <i className="fas fa-key animate-bounce"></i>
                      <span>Mfumo unahitaji <strong>Gemini API Key</strong> ili kufanya uchambuzi.</span>
                    </div>
                    <button 
                      onClick={handleOpenKeyDialog}
                      className="bg-yellow-500 text-black px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-yellow-400 transition-all"
                    >
                      WEKA KEY SASA
                    </button>
                  </div>
                )}
                
                <section className="text-center max-w-3xl mx-auto space-y-4">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                    Precision Trading with <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-yellow-400">Intelligent Analysis</span>
                  </h2>
                  <p className="text-blue-100/60 text-lg">JM FX Pro: Soko liko mikononi mwako.</p>
                </section>

                <section className="max-w-4xl mx-auto">
                  <AnalysisForm onAnalyze={handleAnalyze} isLoading={isLoading} />
                </section>

                {error && (
                  <div className="max-w-4xl mx-auto p-4 bg-red-950/30 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    <i className="fas fa-circle-exclamation mr-2"></i> {error}
                  </div>
                )}

                {isLoading && (
                  <div className="text-center py-20 space-y-6">
                    <div className="w-24 h-24 border-4 border-blue-900/30 border-t-yellow-400 rounded-full animate-spin mx-auto"></div>
                    <h3 className="text-xl font-bold text-yellow-400 uppercase tracking-widest">Inachambua Soko...</h3>
                  </div>
                )}

                {analysis && !isLoading && (
                  <section className="pb-20">
                    <AnalysisResult analysis={analysis} />
                  </section>
                )}
              </>
            )}

            {activeTab === 'group' && <GroupManager />}
          </>
        )}
      </main>

      <ChatBot />
    </div>
  );
};

export default App;
