
import React, { useState, useEffect } from 'react';
import { Bus } from '../types';
import { BusIcon } from './Icons';

export const Transport = ({ buses }: { buses: Bus[] }) => {
  const [selected, setSelected] = useState<Bus | null>(buses[0] || null);
  const [speed, setSpeed] = useState(42);

  // Sync selected bus when buses list changes (e.g., when switching schools)
  useEffect(() => {
    if (buses.length > 0) {
      setSelected(buses[0]);
    } else {
      setSelected(null);
    }
  }, [buses]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(Math.floor(Math.random() * (50 - 35 + 1)) + 35);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!selected) {
    return (
      <div className="bg-white rounded-[3rem] py-24 text-center border border-slate-100 shadow-sm animate-in">
        <BusIcon className="w-24 h-24 mx-auto mb-6 text-slate-200" />
        <h3 className="text-2xl font-black text-slate-800">No Fleet Data</h3>
        <p className="text-slate-400 font-medium max-w-sm mx-auto mt-2">There are currently no active transport routes logged for this institution.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900 h-96 rounded-[3rem] shadow-2xl relative overflow-hidden flex items-center justify-center border border-slate-800">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-[0_0_50px_rgba(79,70,229,0.4)] animate-pulse">
              <BusIcon className="w-12 h-12" />
            </div>
            <div className="mt-6 bg-white/10 backdrop-blur px-6 py-2 rounded-full border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em]">
              Live GPS Tracking • {selected.routeNumber}
            </div>
          </div>

          <div className="absolute bottom-8 left-8 right-8 flex justify-between">
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[1.5rem] border border-white/10 text-white min-w-[140px]">
              <p className="text-[10px] font-black uppercase text-indigo-300 mb-1">Current</p>
              <p className="font-bold text-lg">{selected.currentStop}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[1.5rem] border border-white/10 text-white text-right min-w-[140px]">
              <p className="text-[10px] font-black uppercase text-indigo-300 mb-1">Next Stop</p>
              <p className="font-bold text-lg">{selected.nextStop}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: 'Speedometer', value: `${speed} KM/H` },
             { label: 'Scholars', value: selected.studentsOnBoard },
             { label: 'Time To Stop', value: '12 MINS' },
             { label: 'Route Status', value: selected.status }
           ].map((stat, i) => (
             <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{stat.label}</p>
               <p className="text-xl font-black text-slate-800">{stat.value}</p>
             </div>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-card border border-slate-100 overflow-hidden flex flex-col h-full min-h-[500px]">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
          <h3 className="font-black text-slate-800 text-xl tracking-tight">Campus Fleet</h3>
          <p className="text-slate-400 text-[10px] font-black uppercase mt-1 tracking-widest">Active Mobility Registry</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {buses.map(bus => (
            <div 
              key={bus.id} 
              onClick={() => setSelected(bus)}
              className={`p-6 rounded-[1.5rem] border transition-all cursor-pointer group ${
                selected.id === bus.id 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100' 
                : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-indigo-200'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-black text-lg tracking-tight">{bus.routeNumber}</span>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                  selected.id === bus.id ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-600'
                }`}>{bus.status}</span>
              </div>
              <p className={`text-xs ${selected.id === bus.id ? 'text-indigo-100' : 'text-slate-500'} font-bold`}>{bus.routeName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transport;
