import React, { useState } from 'react';
import { searchAssetInfo } from '../services/gemini.js';

const Dashboard = ({ portfolio, assets, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearch = async () => {
    if (!search.trim()) return;
    setSearching(true);
    const data = await searchAssetInfo(search.toUpperCase());
    setSearchResult(
      data || { price: 'N/A', change: 'Error', outlook: 'No se encontraron datos.' },
    );
    setSearching(false);
  };

  const triggerRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="dashboard-page p-8 space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-24">
      {/* Buscador de Inteligencia */}
      <section className="bg-surface/60 border border-white/5 rounded-3xl p-8 glass shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">analytics</span>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Analizador de Mercado IA
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#13ec25]"></span>
            <span className="text-[9px] font-bold text-slate-500 uppercase">
              Datos en Tiempo Real
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ej: NVDA, BTC, AAPL..."
              className="w-full bg-background/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-primary/50 transition-all outline-none font-bold uppercase"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searching}
            className="bg-primary text-background font-black text-xs uppercase tracking-widest px-8 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {searching ? 'Consultando...' : 'Consultar'}
          </button>
        </div>

        {searchResult && (
          <div className="mt-8 p-6 bg-white/[0.02] border border-white/10 rounded-2xl animate-in slide-in-from-top-4 duration-500 flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex items-center gap-6">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black italic text-2xl">
                {search.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-3xl italic tracking-tighter leading-none">
                  {search.toUpperCase()}
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase mt-2">
                  Precio Actualizado
                </span>
              </div>
            </div>
            <div className="lg:flex-1 flex flex-col">
              <span className="text-primary font-black text-4xl tracking-tighter italic leading-none">
                ${searchResult.price?.toLocaleString()}
              </span>
              <span
                className={`text-[10px] font-black mt-2 uppercase ${
                  searchResult.change?.includes('-') ? 'text-danger' : 'text-primary'
                }`}
              >
                Variación 24h: {searchResult.change}
              </span>
            </div>
            <div className="lg:max-w-md bg-background/80 p-4 rounded-xl border border-white/5">
              <p className="text-[9px] text-primary font-black uppercase tracking-widest mb-1">
                Estrategia IA
              </p>
              <p className="text-xs text-slate-300 italic font-medium leading-relaxed">
                "{searchResult.outlook}"
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Main Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface/40 border border-white/5 rounded-[3rem] p-12 glass relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">
                  Capitalización Total
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-8xl font-black text-white tracking-tighter leading-none">
                    ${portfolio.balance.toLocaleString()}
                  </span>
                  <span className="text-slate-600 text-3xl font-black italic">.00</span>
                </div>
              </div>
              <button
                onClick={triggerRefresh}
                className={`px-6 py-2 rounded-full border border-primary/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                  isRefreshing ? 'bg-primary text-background' : 'text-primary hover:bg-primary/10'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-sm ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}
                >
                  sync
                </span>
                {isRefreshing ? 'Actualizando...' : 'Sincronizar'}
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                <span>Objetivo de Inversión</span>
                <span className="text-white">64.2%</span>
              </div>
              <div className="h-4 w-full bg-white/5 rounded-full p-1">
                <div
                  className="h-full bg-gradient-to-r from-primary/40 to-primary rounded-full shadow-[0_0_15px_rgba(19,236,37,0.4)] transition-all duration-1000 ease-out"
                  style={{ width: portfolio.balance > 0 ? '64.2%' : '0%' }}
                ></div>
              </div>
            </div>
          </div>
          <span className="material-symbols-outlined absolute right-[-5%] top-1/2 -translate-y-1/2 text-[300px] text-white opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
            monitoring
          </span>
        </div>

        <div className="bg-surface/40 border border-white/5 rounded-[2.5rem] p-8 glass flex flex-col justify-between">
          <div>
            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-6">
              Estado de Membresía
            </h4>
            <p className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">
              Elite User
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-3">
              ID: #SDAASDAS_SECURE
            </p>
          </div>
          <div className="pt-8 border-t border-white/5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Activos Totales</span>
              <span className="text-sm font-black text-white">{portfolio.holdings.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Ratio de Profit</span>
              <span className="text-sm font-black text-primary">+12.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Portafolio Cards */}
      <section className="bg-surface/40 border border-white/5 rounded-[3rem] p-10 glass min-h-[300px]">
        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-12">
          Detalle de Holdings
        </h3>
        {portfolio.holdings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portfolio.holdings.map((h, i) => (
              <div
                key={i}
                className="p-8 rounded-[2rem] bg-background border border-white/5 flex flex-col justify-between group hover:border-primary/30 transition-all shadow-xl hover:shadow-primary/5"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black italic">
                    {h.symbol.charAt(0)}
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {h.symbol}
                  </span>
                </div>
                <div>
                  <p className="text-3xl font-black text-white italic tracking-tighter">
                    ${h.value.toLocaleString()}
                  </p>
                  <p className="text-[9px] text-primary font-bold uppercase mt-2 tracking-widest">
                    En posesión
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center opacity-30 flex flex-col items-center">
            <span className="material-symbols-outlined text-6xl mb-4">account_balance_wallet</span>
            <p className="text-xs font-black uppercase tracking-[0.4em]">Sin activos operativos</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;

