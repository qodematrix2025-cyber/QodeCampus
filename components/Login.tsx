
import React, { useState } from 'react';
import { User } from '../types';
import { GraduationCap, Send, Bot, Users } from './Icons';
import { apiService } from '../services/apiService';

interface LoginProps {
  users: User[];
  onLogin: (u: User) => void;
}

export const Login = ({ users, onLogin }: LoginProps) => {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // First attempt to call real backend
      const user = await apiService.login({ identifier: id, password: pass });
      onLogin(user);
    } catch (err) {
      // Fallback for development if backend isn't ready
      const fallbackUser = users.find(u => (u.id === id || u.email === id) && u.password === pass);
      if (fallbackUser) {
        onLogin(fallbackUser);
      } else {
        alert('Invalid Credentials. If your backend is offline, use mock credentials (admin1/admin123).');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (u: User) => {
    setId(u.id);
    setPass(u.password || 'admin123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-brand-50 mesh-bg">
      <div className="w-full max-w-6xl bg-white rounded-[4rem] shadow-premium overflow-hidden flex flex-col lg:flex-row animate-reveal">
        <div className="flex-1 p-10 lg:p-20">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center text-white shadow-saffron-glow">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black tracking-tighter text-slate-900 leading-none">QodeCampus<br/><span className="text-[10px] uppercase tracking-[0.4em] text-brand-600">Institutional OS</span></h2>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-4">Welcome!</h1>
          <p className="text-slate-400 text-lg font-medium mb-12">Please enter your credentials to access the institution portal.</p>

          <form onSubmit={handleLogin} className="space-y-6 max-w-md">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">User ID / Email</label>
              <input required className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-8 focus:ring-brand-50 focus:bg-white outline-none font-bold text-slate-800 transition-all text-lg shadow-inner" placeholder="e.g. S1001" value={id} onChange={e => setId(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Secure Password</label>
              <input required type="password" className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-8 focus:ring-brand-50 focus:bg-white outline-none font-bold text-slate-800 transition-all text-lg shadow-inner" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
            </div>
            <button disabled={isLoading} className="w-full py-6 bg-brand-950 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-brand-600 transition-all active:scale-95 flex items-center justify-center gap-4 group mt-8">
              {isLoading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <>Enter Portal <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>
        </div>

        <div className="w-full lg:w-[400px] bg-slate-50 p-12 flex flex-col justify-center border-l border-slate-100">
          <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Quick Access (Test)</h3>
          <div className="space-y-4">
            {users.slice(0, 4).map(u => (
              <button key={u.id} onClick={() => quickLogin(u)} className="w-full p-6 bg-white rounded-[2rem] border border-slate-200 hover:border-brand-500 transition-all flex items-center gap-5 shadow-sm group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${u.role === 'Admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                   {u.role === 'Admin' ? <Bot className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-none mb-1.5">{u.name.split(' (')[0]}</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{u.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
