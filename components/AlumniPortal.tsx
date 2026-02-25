
import React from 'react';
import { Alumni } from '../types';
import { SearchIcon, LinkIcon, Users, Activity, GraduationCap, CheckCircle } from './Icons';

export const AlumniPortal = ({ alumni }: { alumni: Alumni[] }) => {
  // Mocking enriched data for better UI
  const displayAlumni = alumni.length > 0 ? alumni : [
    { id: 'A1', name: 'Dr. Sameer Hegde', batch: '2010', profession: 'Senior Neurosurgeon', company: 'Mayo Clinic' },
    { id: 'A2', name: 'Ananya Rao', batch: '2015', profession: 'Product Architect', company: 'Google DeepMind' },
    { id: 'A3', name: 'Vikram Sethi', batch: '2008', profession: 'Managing Director', company: 'Goldman Sachs' },
    { id: 'A4', name: 'Priya Sharma', batch: '2018', profession: 'Human Rights Attorney', company: 'UN Global' }
  ];

  return (
    <div className="space-y-10 animate-reveal pb-20">
      {/* Institutional Legacy Hero */}
      <div className="bg-slate-950 p-10 lg:p-16 rounded-[4rem] text-white relative overflow-hidden shadow-ultra border border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/5 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none"></div>
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 text-indigo-400 text-[10px] font-black uppercase tracking-[0.5em] mb-8">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-glow-indigo animate-pulse"></span>
              The Global Matrix
            </div>
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none mb-6">Legacy Ledger</h2>
            <p className="text-slate-400 text-lg font-medium max-w-xl opacity-80 leading-relaxed">
              Tracking the orbit of our graduates across the global professional spectrum. Connect, mentor, and expand the QodeCampus ecosystem.
            </p>
            <div className="mt-10 flex gap-4">
               <button className="px-10 py-5 bg-indigo-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95">Register Legacy Profile</button>
               <button className="px-10 py-5 bg-white/5 backdrop-blur text-white rounded-3xl font-black text-[10px] uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">Matrix Mentorship</button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             {[
               { l: 'Network Nodes', v: '8.4k+', i: Users, c: 'indigo' },
               { l: 'Capital Raised', v: '$420M', i: Activity, c: 'emerald' },
               { l: 'Global Reach', v: '42 Nations', i: GraduationCap, c: 'rose' },
               { l: 'Placement Index', v: '98%', i: CheckCircle, c: 'amber' }
             ].map(stat => (
               <div key={stat.l} className="p-8 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 group hover:bg-white/10 transition-all border-indigo-500/20">
                  <p className={`text-[9px] font-black uppercase tracking-widest mb-3 opacity-60 text-${stat.c}-400`}>{stat.l}</p>
                  <p className="text-4xl font-black tracking-tighter">{stat.v}</p>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Hall of Fame Spotlight */}
      <div className="bg-white p-10 rounded-[4rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-12">
         <div className="w-full md:w-1/3 aspect-square rounded-[3rem] bg-slate-50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-600 mix-blend-multiply opacity-10 group-hover:opacity-0 transition-opacity"></div>
            <div className="w-full h-full flex items-center justify-center text-8xl font-black text-slate-100 bg-slate-50">S</div>
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/20 text-white">
               <p className="text-[10px] font-black uppercase tracking-widest">Featured Founder</p>
               <p className="text-lg font-black">Sameer Hegde, 2010</p>
            </div>
         </div>
         <div className="flex-1">
            <span className="px-4 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">Hall of Fame</span>
            <h3 className="text-4xl font-black text-slate-800 mt-4 mb-6 leading-tight">Shaping the future of Neurosurgery at Mayo Clinic.</h3>
            <p className="text-slate-500 text-lg font-medium leading-relaxed italic opacity-80 mb-8">
              "The analytical rigour I experienced at QodeCampus laid the foundation for my surgical precision today. The matrix isn't just about grades; it's about global outlook."
            </p>
            <button className="flex items-center gap-2 text-indigo-600 font-black text-[11px] uppercase tracking-widest border-b-2 border-indigo-100 pb-1 hover:border-indigo-600 transition-all">Read Legacy Case Study</button>
         </div>
      </div>

      {/* Legacy Registry Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
           <div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Active Node Registry</h3>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Managed Graduate Database</p>
           </div>
           <div className="relative group w-80">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors w-4 h-4" />
              <input 
                type="text" 
                placeholder="Query by batch or domain..." 
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-bold text-xs shadow-inner-soft"
              />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayAlumni.map(a => (
            <div key={a.id} className="bg-white p-8 rounded-[3rem] shadow-premium border border-slate-100 hover:border-indigo-200 transition-all group flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-2xl font-black text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner uppercase">
                  {a.name[0]}
                </div>
                <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">Class of {a.batch}</span>
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight mb-1">{a.name}</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6">Matrix ID: LEG-{a.id}</p>
              
              <div className="mt-auto space-y-6 pt-6 border-t border-slate-50">
                 <div>
                    <p className="text-xs font-black text-slate-700 leading-tight">{a.profession}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{a.company}</p>
                 </div>
                 <button className="w-full py-4 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-500 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 group/btn">
                    <LinkIcon className="w-3 h-3 group-hover/btn:scale-125 transition-transform" /> Sync Profile
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
