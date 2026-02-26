import React, { useState } from 'react';
import { registerUser } from '../db.js';

const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const result = await registerUser(user, pass, email);
    if (result.success) {
      setSuccess('Cuenta creada. Ya puedes iniciar sesión.');
      setPass('');
      if (onRegisterSuccess) onRegisterSuccess();
    } else {
      setError(result.message || 'Error al registrar la cuenta.');
    }
  };

  return (
    <div className="register-page min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] size-[500px] bg-primary/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] size-[400px] bg-primary/10 blur-[100px] rounded-full"></div>

      <div className="w-full max-w-md bg-surface border border-white/5 rounded-[2.5rem] p-10 relative z-10 shadow-2xl">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="size-16 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-background font-black text-4xl italic">
              account_balance_wallet
            </span>
          </div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter">
            EQUITY<span className="text-primary">AI</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Enterprise Intelligence System
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-[10px] font-black uppercase tracking-widest text-center animate-bounce">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary text-[10px] font-black uppercase tracking-widest text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@correo.com"
              className="w-full bg-background border border-white/10 rounded-xl py-4 px-5 text-white focus:border-primary/50 transition-all outline-none font-bold placeholder:text-slate-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Terminal ID (Username)
            </label>
            <input
              type="text"
              required
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="USUARIO_X"
              className="w-full bg-background border border-white/10 rounded-xl py-4 px-5 text-white focus:border-primary/50 transition-all outline-none font-bold placeholder:text-slate-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Access Passcode
            </label>
            <input
              type="password"
              required
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-background border border-white/10 rounded-xl py-4 px-5 text-white focus:border-primary/50 transition-all outline-none font-bold placeholder:text-slate-700"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-background py-5 rounded-xl font-black text-lg italic tracking-tight shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all mt-4"
          >
            CREAR TERMINAL
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={onSwitchToLogin}
            className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-primary transition-colors underline decoration-primary/20 underline-offset-4"
          >
            ¿Ya tienes terminal? Iniciar Sesión
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2">
          <span className="size-1.5 bg-primary rounded-full animate-pulse"></span>
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
            SSL Encrypted Connection
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

