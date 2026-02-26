import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NewsFeed from './pages/NewsFeed.jsx';
import IncomeSplitter from './pages/IncomeSplitter.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { Page } from './types.js';
import { fetchNews, fetchAssets } from './services/marketData.js';
import { logoutUser, getCurrentUser } from './db.js';

const App = () => {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [page, setPage] = useState(Page.DASHBOARD);
  const [news, setNews] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authPage, setAuthPage] = useState('login');

  const refreshData = async () => {
    try {
      const [newsData, assetData] = await Promise.all([fetchNews(), fetchAssets()]);
      setNews(newsData);
      setAssets(assetData);
      setCurrentUser(getCurrentUser());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleAuth = () => {
    setCurrentUser(getCurrentUser());
  };

  const handleLogout = () => {
    if (confirm('¿Cerrar terminal segura de EquityAI?')) {
      logoutUser();
      setCurrentUser(null);
      setPage(Page.DASHBOARD);
    }
  };

  if (!currentUser) {
    return authPage === 'login' ? (
      <Login
        onAuthSuccess={handleAuth}
        onSwitchToRegister={() => setAuthPage('register')}
      />
    ) : (
      <Register
        onRegisterSuccess={() => setAuthPage('login')}
        onSwitchToLogin={() => setAuthPage('login')}
      />
    );
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-6 animate-pulse">
            <span className="material-symbols-outlined text-primary text-6xl">security</span>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">
              Desencriptando Nodo...
            </p>
          </div>
        </div>
      );
    }

    const portfolio = currentUser.portfolio;

    switch (page) {
      case Page.DASHBOARD:
        return <Dashboard portfolio={portfolio} assets={assets} onRefresh={refreshData} />;
      case Page.NEWS:
        return <NewsFeed news={news} />;
      case Page.SPLITTER:
        return (
          <IncomeSplitter
            portfolio={portfolio}
            onRefresh={() => setCurrentUser(getCurrentUser())}
          />
        );
      case Page.PORTFOLIO:
        return (
          <div className="p-12 max-w-5xl mx-auto space-y-8">
            <h2 className="text-6xl font-black italic tracking-tighter">
              Bóveda de <span className="text-primary italic">Activos</span>
            </h2>
            <div className="space-y-4">
              {portfolio.holdings.map((h, i) => (
                <div
                  key={i}
                  className="p-10 bg-surface border border-white/5 rounded-[2.5rem] flex items-center justify-between shadow-2xl"
                >
                  <div className="flex items-center gap-8">
                    <div className="size-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-black">
                      {h.symbol.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-white italic tracking-tighter uppercase">
                        {h.symbol}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        Activo Verificado
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <span className="text-4xl font-black text-white italic tracking-tighter leading-none">
                      ${h.value.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-lg border border-primary/20">
                      <span className="size-1.5 bg-primary rounded-full shadow-[0_0_8px_#13ec25]"></span>
                      <span className="text-[9px] font-black text-primary uppercase">Secure Locked</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-root flex h-screen bg-background text-white overflow-hidden selection:bg-primary selection:text-background">
      <Sidebar currentPage={page} onNavigate={setPage} onLogout={handleLogout} />
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-24 px-12 flex items-center justify-between border-b border-white/[0.03] glass z-20 sticky top-0">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] bg-primary/10 px-3 py-1 rounded-lg w-fit mb-2">
              Safe Session Activa
            </span>
            <p className="text-xl font-black text-white italic tracking-tighter uppercase">
              {currentUser.username}_ENTERPRISE
            </p>
          </div>
          <button
            onClick={() => setPage(Page.SPLITTER)}
            className="bg-primary text-background font-black text-xs uppercase tracking-widest px-8 py-3.5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all"
          >
            Inyectar Capital
          </button>
        </header>
        <div className="flex-1 overflow-y-auto scrollbar-hide">{renderContent()}</div>
        <footer className="h-16 border-t border-white/[0.05] bg-surface flex items-center overflow-hidden z-20">
          <div className="h-full px-12 flex items-center gap-6 bg-surface z-30 border-r border-white/5 shrink-0">
            <div className="flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-xl">
              <span className="size-2 bg-primary rounded-full animate-pulse shadow-[0_0_12px_#13ec25]"></span>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest italic leading-none">
                Market IA Live
              </span>
            </div>
          </div>
          <div className="flex-1 relative overflow-hidden">
            <div className="flex gap-20 items-center animate-marquee whitespace-nowrap">
              {assets
                .concat(assets)
                .concat(assets)
                .map((asset, i) => (
                  <div key={`${asset.id}-${i}`} className="flex flex-col shrink-0 px-4">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      {asset.symbol}/USD
                    </span>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-base font-black text-white italic tracking-tighter">
                        ${asset.price.toLocaleString()}
                      </span>
                      <span
                        className={`text-[10px] font-black italic ${
                          asset.change24h >= 0 ? 'text-primary' : 'text-danger'
                        }`}
                      >
                        {asset.change24h > 0 ? '▲' : '▼'} {Math.abs(asset.change24h)}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </footer>
      </main>
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }
        .animate-marquee { animation: marquee 120s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default App;

