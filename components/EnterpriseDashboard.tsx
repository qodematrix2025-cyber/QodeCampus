

import React, { useState, useEffect, useMemo } from 'react';
import { School } from '../types';
import { Activity, Users, Library as LibIcon, Search, Bot, CheckCircle, SettingsIcon } from './Icons';
import { generateEnterpriseBrief } from '../services/geminiService';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';

export const EnterpriseDashboard = ({ schools, onSelectSchool }: { schools: School[], onSelectSchool: (id: string) => void }) => {
  const [aiBrief, setAiBrief] = useState("Aggregating platform intelligence...");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchBrief = async () => {
      setIsLoading(true);
      const totalStudents = schools.reduce((acc, s) => acc + s.studentCount, 0);
      const mrr = schools.length * 15000;
      const brief = await generateEnterpriseBrief(schools.length, totalStudents, mrr);
      setAiBrief(brief);
      setIsLoading(false);
    };
    fetchBrief();
  }, [schools]);

  const totalStudents = schools.reduce((acc, s) => acc + s.studentCount, 0);
  const mrr = schools.length * 15000;

  const resourceData = useMemo(() => {
    return schools.map(s => ({
      name: s.name.split(' ')[0],
      // Added safety checks for optional properties
      storage: Math.round(((s.storageUsedGB || 0) / (s.storageLimitGB || 1)) * 100),
      api: Math.round(((s.apiUsedMonth || 0) / (s.apiLimitMonth || 1)) * 100)
    }));
  }, [schools]);

  return (
    <div className="space-y-8 animate-reveal">
      <div className="bg-slate-950 p-8 rounded-4xl text-white relative overflow-hidden shadow-ultra border border-white/5 group">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
           <div className="flex-1">
             <div className="flex items-center gap-3 text-brand-400 text-[9px] font-black uppercase tracking-[0.4em] mb-6">
               <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span> QodeMatrix SaaS Engine
             </div>
             <h2 className="text-4xl font-black mb-6 tracking-tight">Platform Axis</h2>
             <div className={`relative p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl transition-all duration-1000 ${isLoading ? 'opacity-30' : 'opacity-100'}`}>
                <Bot className="absolute -top-3 -left-3 w-8 h-8 text-brand-500 bg-slate-900 p-1.5 rounded-lg shadow-lg" />
                <p className="text-base font-medium text-slate-300 leading-relaxed italic max-w-3xl">"{aiBrief}"</p>
             </div>
           </div>
           <div className="shrink-0 flex gap-4">
              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 text-center min-w-[180px] hover:bg-white/10 transition-colors">
                 <p className="text-[9px] font-black uppercase text-brand-300 mb-2 tracking-widest">Platform MRR</p>
                 <p className="text-3xl font-black tracking-tight">₹{(mrr/1000).toFixed(0)}k</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 text-center min-w-[180px] hover:bg-white/10 transition-colors">
                 <p className="text-[9px] font-black uppercase text-brand-300 mb-2 tracking-widest">Global Nodes</p>
                 <p className="text-3xl font-black tracking-tight">{schools.length}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 h-[350px] flex flex-col">
            <div className="flex justify-between items-center mb-8 shrink-0">
               <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Cloud Resource Load</h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Storage & API Pressure Metrics</p>
               </div>
               <div className="flex gap-2">
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div><span className="text-[8px] font-black text-slate-400 uppercase">Storage</span></div>
               </div>
            </div>
            <div className="flex-1 w-full relative">
               <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={resourceData}>
                     <XAxis dataKey="name" hide />
                     <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', fontSize: '10px' }} />
                     <Bar dataKey="storage" radius={[6, 6, 0, 0]} barSize={30}>
                        {resourceData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.storage > 80 ? '#f43f5e' : '#6366f1'} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
               <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                  <Activity className="w-6 h-6" />
               </div>
               <h4 className="text-lg font-black text-slate-900 leading-tight">API Reliability Index</h4>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 mb-6">99.98% System Uptime</p>
            </div>
            <div className="space-y-4">
               {schools.filter(s => ((s.apiUsedMonth || 0) / (s.apiLimitMonth || 1)) > 0.7).map(s => (
                  <div key={s.id} className="flex justify-between items-center p-3 bg-rose-50 border border-rose-100 rounded-xl">
                     <p className="text-[9px] font-black text-rose-600 uppercase truncate max-w-[120px]">{s.name}</p>
                     <p className="text-[9px] font-black text-rose-600">LIMIT REACHING</p>
                  </div>
               ))}
               <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-brand-600 transition-all">Maintenance Portal</button>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Institutional Registry</h3>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Managed Network Nodes</p>
            </div>
            <div className="relative group w-full md:w-80">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-600 transition-colors w-4 h-4" />
               <input 
                  type="text" 
                  placeholder="Query instances..." 
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-none focus:bg-white focus:ring-4 focus:ring-brand-50 outline-none font-bold text-xs shadow-inner-soft transition-all"
               />
            </div>
         </div>
         
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {schools.map(school => (
               <div key={school.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-brand-200 transition-all flex justify-between items-center group shadow-sm active:scale-[0.99]">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all font-black text-lg">
                        {school.name[0]}
                     </div>
                     <div>
                        <h4 className="font-black text-slate-900 text-sm tracking-tight leading-none mb-1.5">{school.name}</h4>
                        <div className="flex items-center gap-2">
                           <span className={`w-1.5 h-1.5 rounded-full ${school.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                           <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{school.location} • {school.plan}</p>
                        </div>
                     </div>
                  </div>
                  <button 
                    onClick={() => onSelectSchool(school.id)}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-brand-600 transition-all shadow-md"
                  >
                    Control Center
                  </button>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};
