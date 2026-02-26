import React, { useState } from 'react';
import { updatePortfolioValues } from '../db.js';


const IncomeSplitter = ({ portfolio, onRefresh }) => {
  const [alloc, setAlloc] = useState(portfolio.allocations);
  const [amount, setAmount] = useState(1000);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSave = async () => {
    setIsProcessing(true);
    await updatePortfolioValues(amount, alloc);
    onRefresh();
    setIsProcessing(false);
    alert(`Inyección de $${amount.toLocaleString()} ejecutada correctamente.`);
  };

  const updateSub = (type, index, field, val) => {
    setAlloc((prev) => {
      const newSubs = [...prev[type].subs];
      newSubs[index] = { ...newSubs[index], [field]: val };
      return { ...prev, [type]: { ...prev[type], subs: newSubs } };
    });
  };

  const addSub = (type) => {
    setAlloc((prev) => ({
      ...prev,
      [type]: { ...prev[type], subs: [...prev[type].subs, { name: 'NEW', percentage: 0 }] },
    }));
  };

  const totalPercentage = alloc.savings + alloc.indexFunds.total + alloc.crypto.total;

  return (
    <div className="income-splitter-page p-8 max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter leading-none">
            Distribuidor <span className="text-primary italic font-black">IA</span>
          </h2>
          <p className="text-slate-500 text-sm font-bold mt-4 uppercase tracking-widest opacity-80">
            Automatización de Flujo de Capital Enterprise
          </p>
        </div>
        <div className="text-right bg-white/5 p-4 rounded-3xl border border-white/5 min-w-[200px]">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
            Liquidez Actual
          </p>
          <p className="text-3xl font-black text-primary italic leading-none">
            ${portfolio.balance.toLocaleString()}
          </p>
        </div>
      </header>

      <div className="bg-surface border border-white/5 rounded-[3rem] p-12 space-y-16 shadow-2xl glass relative overflow-hidden">
        <div className="absolute top-0 right-0 size-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">
              Monto a Inyectar (USD)
            </label>
            <div className="relative group">
              <span className="absolute left-8 top-1/2 -translate-y-1/2 text-5xl font-black text-primary italic opacity-40 group-focus-within:opacity-100 transition-opacity">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-background/50 border-2 border-white/10 rounded-[2.5rem] py-10 pl-16 pr-8 text-6xl font-black text-white focus:border-primary focus:bg-background transition-all outline-none tracking-tighter"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-8 bg-background/80 rounded-[2rem] border border-white/5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl font-black">terminal</span>
                </div>
                <div>
                  <p className="text-base font-black text-white uppercase italic">
                    Algoritmo Optimizado
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    Estado: Operativo
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                La inyección se repartirá automáticamente entre tus fondos y tokens configurados
                para mantener la consistencia de tu estrategia.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-16">
          {/* Main Savings Split */}
          <div className="space-y-6 group">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-[1.5rem] bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl font-black">savings</span>
                </div>
                <div>
                  <p className="text-xl font-black text-white italic leading-none">
                    Ahorro & Liquidez
                  </p>
                  <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-2">
                    Perfil Conservador
                  </p>
                </div>
              </div>
              <span className="text-5xl font-black text-blue-500 italic leading-none tracking-tighter">
                {alloc.savings}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={alloc.savings}
              onChange={(e) =>
                setAlloc((prev) => ({ ...prev, savings: Number(e.target.value) }))
              }
              className="w-full h-2 bg-white/5 rounded-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Index Funds Split + Subs */}
          <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-10 hover:border-primary/30 transition-all group">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl font-black">analytics</span>
                </div>
                <div>
                  <p className="text-xl font-black text-white italic leading-none">
                    Fondos Indexados
                  </p>
                  <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-2">
                    Perfil Moderado
                  </p>
                </div>
              </div>
              <span className="text-5xl font-black text-primary italic leading-none tracking-tighter">
                {alloc.indexFunds.total}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={alloc.indexFunds.total}
              onChange={(e) =>
                setAlloc((prev) => ({
                  ...prev,
                  indexFunds: { ...prev.indexFunds, total: Number(e.target.value) },
                }))
              }
              className="w-full h-2 bg-white/5 rounded-full accent-primary cursor-pointer"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 border-t border-white/5">
              {alloc.indexFunds.subs.map((sub, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-background/60 p-5 rounded-2xl border border-white/5"
                >
                  <input
                    className="bg-transparent border-none text-[11px] font-black text-slate-300 uppercase flex-1 outline-none"
                    value={sub.name}
                    onChange={(e) => updateSub('indexFunds', i, 'name', e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm w-20 text-primary font-black outline-none"
                      value={sub.percentage}
                      onChange={(e) =>
                        updateSub('indexFunds', i, 'percentage', Number(e.target.value))
                      }
                    />
                    <span className="text-[10px] font-black text-slate-600">%</span>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addSub('indexFunds')}
                className="flex items-center justify-center gap-2 border-2 border-dashed border-primary/20 rounded-2xl hover:bg-primary/5 transition-all p-5"
              >
                <span className="material-symbols-outlined text-primary">add_circle</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                  Añadir Activo
                </span>
              </button>
            </div>
          </div>

          {/* Crypto Split + Subs */}
          <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-10 hover:border-purple-500/30 transition-all group">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-[1.5rem] bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl font-black">
                    currency_bitcoin
                  </span>
                </div>
                <div>
                  <p className="text-xl font-black text-white italic leading-none">
                    Criptoactivos
                  </p>
                  <p className="text-[10px] text-purple-500 font-black uppercase tracking-widest mt-2">
                    Perfil Agresivo
                  </p>
                </div>
              </div>
              <span className="text-5xl font-black text-purple-500 italic leading-none tracking-tighter">
                {alloc.crypto.total}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={alloc.crypto.total}
              onChange={(e) =>
                setAlloc((prev) => ({
                  ...prev,
                  crypto: { ...prev.crypto, total: Number(e.target.value) },
                }))
              }
              className="w-full h-2 bg-white/5 rounded-full accent-purple-500 cursor-pointer"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 border-t border-white/5">
              {alloc.crypto.subs.map((sub, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-background/60 p-5 rounded-2xl border border-white/5"
                >
                  <input
                    className="bg-transparent border-none text-[11px] font-black text-slate-300 uppercase flex-1 outline-none"
                    value={sub.name}
                    onChange={(e) => updateSub('crypto', i, 'name', e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm w-20 text-purple-400 font-black outline-none"
                      value={sub.percentage}
                      onChange={(e) =>
                        updateSub('crypto', i, 'percentage', Number(e.target.value))
                      }
                    />
                    <span className="text-[10px] font-black text-slate-600">%</span>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addSub('crypto')}
                className="flex items-center justify-center gap-2 border-2 border-dashed border-purple-500/20 rounded-2xl hover:bg-purple-500/5 transition-all p-5"
              >
                <span className="material-symbols-outlined text-purple-500">add_circle</span>
                <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">
                  Añadir Token
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 flex flex-col items-center gap-8 border-t border-white/5 relative">
          <div
            className={`text-xs font-black uppercase tracking-[0.3em] px-10 py-4 rounded-full border-2 transition-all ${
              totalPercentage === 100
                ? 'bg-primary/10 text-primary border-primary/30 shadow-[0_0_30px_rgba(19,236,37,0.1)]'
                : 'bg-danger/10 text-danger border-danger/30 animate-pulse'
            }`}
          >
            Distribución Total: {totalPercentage}%
            {totalPercentage !== 100 && ' (Conflicto: Reajusta al 100%)'}
          </div>

          <button
            onClick={handleSave}
            disabled={totalPercentage !== 100 || amount <= 0 || isProcessing}
            className="w-full max-w-lg bg-primary hover:brightness-110 disabled:grayscale disabled:opacity-30 text-background py-8 rounded-[2.5rem] font-black text-2xl italic tracking-tighter shadow-2xl shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-4"
          >
            {isProcessing ? (
              <span className="material-symbols-outlined animate-spin font-black">sync</span>
            ) : null}
            {isProcessing ? 'EJECUTANDO TRANSACCIÓN...' : 'EJECUTAR REGLA DE INYECCIÓN'}
          </button>

          <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">
            Inyección Asegurada Mediante Protocolo INVESTWISE
          </p>
        </div>
      </div>
    </div>
  );
};

export default IncomeSplitter;

