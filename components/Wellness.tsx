
import React, { useState } from 'react';
import { Student } from '../types';
import { Bot, Activity, BellIcon } from './Icons';

const MOODS = [
  { label: 'Happy', emoji: '😊', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { label: 'Neutral', emoji: '😐', color: 'bg-slate-50 text-slate-600 border-slate-100' },
  { label: 'Stressed', emoji: '😰', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { label: 'Sad', emoji: '😢', color: 'bg-rose-50 text-rose-600 border-rose-100' },
  { label: 'Excited', emoji: '🤩', color: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100' },
];

export const Wellness = ({ students }: { students: Student[] }) => {
  const [selectedMood, setSelectedMood] = useState('Happy');

  return (
    <div className="space-y-8 animate-in">
      {/* Mood Check-in Card */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-card border border-slate-100 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-slate-800 mb-2">How are you feeling today?</h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-8">Personalized Well-being Check-in</p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {MOODS.map(m => (
              <button 
                key={m.label}
                onClick={() => setSelectedMood(m.label)}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                  selectedMood === m.label ? `${m.color} border-current scale-105 shadow-xl` : 'bg-white border-slate-50 text-slate-300 hover:border-slate-200'
                }`}
              >
                <span className="text-4xl">{m.emoji}</span>
                <span className="text-xs font-black uppercase tracking-tighter">{m.label}</span>
              </button>
            ))}
          </div>
          <button className="mt-10 w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all">Submit Entry</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* At-Risk Alerts for Counselor */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-card border border-slate-100">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-800">Counselor Alerts</h3>
              <div className="bg-rose-100 text-rose-600 text-[10px] font-black px-2 py-1 rounded-lg">2 NEW ALERTS</div>
           </div>
           <div className="space-y-4">
              {students.filter(s => s.wellnessScore && s.wellnessScore < 7).map(s => (
                <div key={s.id} className="p-5 bg-rose-50 border border-rose-100 rounded-3xl flex justify-between items-center group cursor-pointer hover:bg-rose-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm font-black">{s.firstName[0]}</div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{s.firstName} {s.lastName}</p>
                      <p className="text-[10px] text-rose-400 font-black uppercase">Reported 'Stressed' 3 times this week</p>
                    </div>
                  </div>
                  <button className="p-3 bg-white text-rose-500 rounded-xl shadow-sm hover:bg-rose-500 hover:text-white transition-all"><BellIcon className="w-5 h-5"/></button>
                </div>
              ))}
           </div>
        </div>

        {/* Holistic Tips AI */}
        <div className="bg-gradient-to-br from-fuchsia-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
           <Bot className="absolute -bottom-6 -right-6 w-48 h-48 text-white/10" />
           <p className="text-fuchsia-200 text-[10px] font-black uppercase tracking-[0.2em] mb-4">AI Wellness Guide</p>
           <h3 className="text-2xl font-black mb-6">Mindfulness Minute</h3>
           <p className="text-lg font-medium leading-relaxed mb-8 italic opacity-90">
             "Today's data shows high energy levels across Grade 10. We recommend a 10-minute creative break during the afternoon session to maintain this momentum."
           </p>
           <div className="flex gap-4">
             <button className="px-6 py-3 bg-white/10 backdrop-blur rounded-xl text-[10px] font-black uppercase border border-white/20 hover:bg-white/20 transition-all">Start Exercise</button>
             <button className="px-6 py-3 bg-white text-fuchsia-600 rounded-xl text-[10px] font-black uppercase shadow-lg hover:scale-105 transition-all">Book Counselor</button>
           </div>
        </div>
      </div>
    </div>
  );
};
