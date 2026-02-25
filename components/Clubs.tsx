
import React from 'react';
import { Club } from '../types';
import { MOCK_CLUBS } from '../constants';
import { Plus, Users } from './Icons';

export const Clubs = () => {
  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Campus Societies</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Discover & Participate</p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-indigo-600 transition-all active:scale-95">
          <Plus className="w-4 h-4" /> Propose New Club
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_CLUBS.map(club => (
          <div key={club.id} className="bg-white rounded-[2.5rem] p-8 shadow-card border border-slate-100 flex flex-col group hover:shadow-2xl hover:border-indigo-200 transition-all duration-500">
             <div className="flex justify-between items-start mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${
                  club.category === 'Tech' ? 'bg-indigo-600 text-white' :
                  club.category === 'Arts' ? 'bg-rose-600 text-white' :
                  'bg-emerald-600 text-white'
                }`}>
                   <Users className="w-8 h-8" />
                </div>
                <span className="bg-slate-50 text-slate-400 text-[10px] font-black px-3 py-1 rounded-full border border-slate-100">
                  {club.members} MEMBERS
                </span>
             </div>
             
             <h3 className="text-2xl font-black text-slate-800 mb-2">{club.name}</h3>
             <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">{club.description}</p>
             
             <div className="mt-auto space-y-4 pt-6 border-t border-slate-50">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                   <span>Mentor: {club.mentor}</span>
                   <span className="text-indigo-600">Next: {club.nextMeeting}</span>
                </div>
                <button className="w-full py-4 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all">Join Society</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
