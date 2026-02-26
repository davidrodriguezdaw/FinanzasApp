import React from 'react';
import { Page } from '../types.js';
import { getCurrentUser } from '../db.js';

const Sidebar = ({ currentPage, onNavigate, onLogout }) => {
  const currentUser = getCurrentUser();
  const menuItems = [
    { id: Page.DASHBOARD, label: 'Dashboard', icon: 'grid_view' },
    { id: Page.PORTFOLIO, label: 'Portafolio', icon: 'pie_chart' },
    { id: Page.SPLITTER, label: 'Distribuidor', icon: 'account_tree' },
    { id: Page.NEWS, label: 'IA News', icon: 'news' },
  ];

  return (
    <aside className="sidebar w-64 border-r border-border bg-background flex flex-col h-full z-20">
      <div className="p-8 flex items-center gap-3">
        <div className="size-10 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-background font-bold text-2xl italic">
            account_balance
          </span>
        </div>
        <div>
          <h1 className="text-base font-black tracking-tighter leading-none text-white italic">
            EQUITY<span className="text-primary">AI</span>
          </h1>
          <p className="text-[9px] text-primary font-black uppercase tracking-widest">Enterprise</p>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group relative ${
              currentPage === item.id
                ? 'text-primary bg-primary/5'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
            }`}
          >
            {currentPage === item.id && (
              <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_8px_rgba(19,236,37,1)]"></div>
            )}
            <span
              className={`material-symbols-outlined ${
                currentPage === item.id ? 'fill-1' : ''
              } text-xl`}
            >
              {item.icon}
            </span>
            <span className="text-sm font-bold tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="flex items-center justify-between gap-3 px-3 py-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              alt="User"
              className="size-8 rounded-lg border border-white/10"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username || 'guest'}`}
            />
            <div className="overflow-hidden">
              <p className="text-[10px] font-black truncate text-white uppercase italic tracking-tighter">
                {currentUser?.username || 'OPERADOR'}
              </p>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">
                Verified Pro
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Cerrar Sesión"
            className="text-slate-600 hover:text-danger transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

