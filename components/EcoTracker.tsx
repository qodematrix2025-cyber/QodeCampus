
import React from 'react';

export const EcoTracker = () => {
  return (
    <div className="space-y-8 animate-in">
      <div className="bg-emerald-600 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] -mr-40 -mt-40"></div>
         <div className="relative z-10 max-w-xl">
            <h2 className="text-4xl font-black mb-4">Green Campus Hub</h2>
            <p className="text-emerald-100 font-medium leading-relaxed">
              EduSphere tracks the environmental impact of shifting to digital workflows. Every assignment submitted online contributes to a greener planet.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Paper Saved', value: '4.2 Tons', sub: 'Last Academic Year', color: 'indigo' },
           { label: 'Trees Preserved', value: '72 Trees', sub: 'Global Impact', color: 'emerald' },
           { label: 'CO2 Offset', value: '12.5 Kg', sub: 'Per Student Avg', color: 'sky' }
         ].map(stat => (
           <div key={stat.label} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-card flex flex-col justify-between">
              <p className={`text-${stat.color}-500 text-[10px] font-black uppercase tracking-widest mb-1`}>{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-800">{stat.value}</h3>
              <p className="text-slate-400 text-xs font-bold mt-6 pt-6 border-t border-slate-50">{stat.sub}</p>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[3rem] p-10 shadow-card border border-slate-100">
         <h3 className="text-xl font-black text-slate-800 mb-8">Recent Campus Initiatives</h3>
         <div className="space-y-6">
            <div className="flex gap-6 items-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-emerald-200 transition-all">
               <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 text-3xl">🌱</div>
               <div className="flex-1">
                  <h4 className="font-black text-slate-800">Vertical Garden Project</h4>
                  <p className="text-sm text-slate-500 font-medium">Installation in the Science block is 85% complete.</p>
               </div>
               <button className="px-6 py-3 bg-white text-emerald-600 rounded-xl text-xs font-black uppercase shadow-sm">Volunteer</button>
            </div>
            <div className="flex gap-6 items-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-indigo-200 transition-all">
               <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 text-3xl">🔌</div>
               <div className="flex-1">
                  <h4 className="font-black text-slate-800">Smart Lighting Audit</h4>
                  <p className="text-sm text-slate-500 font-medium">Reducing energy consumption by 20% in hostels.</p>
               </div>
               <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl text-xs font-black uppercase shadow-sm">View Report</button>
            </div>
         </div>
      </div>
    </div>
  );
};
