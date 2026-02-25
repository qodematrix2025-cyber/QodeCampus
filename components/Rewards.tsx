
import React from 'react';
import { Student } from '../types';
import { Bot, Plus, Search } from './Icons';

const AchievementIcon = ({ name }: { name: string }) => {
  if (name === 'Perfect Week') return <span className="text-2xl">🔥</span>;
  if (name === 'Math Wizard') return <span className="text-2xl">🔢</span>;
  if (name === 'Honor Roll') return <span className="text-2xl">🏅</span>;
  if (name === 'Green Warrior') return <span className="text-2xl">🌿</span>;
  return <span className="text-2xl">⭐️</span>;
};

export const Rewards = ({ student }: { student: Student }) => {
  return (
    <div className="space-y-8 animate-in">
      <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <p className="text-amber-100 text-xs font-black uppercase tracking-[0.3em] mb-4">Achievement Balance</p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-7xl font-black">{student.eduCoins.toLocaleString()}</h2>
              <span className="text-xl font-bold opacity-80">EduCoins</span>
            </div>
            <p className="mt-4 text-amber-50 font-medium italic">"You are in the top 5% of active learners this month!"</p>
          </div>
          <div className="bg-white/20 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-xl mb-4">
                <AchievementIcon name="Perfect Week" />
             </div>
             <p className="text-xs font-black uppercase tracking-widest">Next Reward</p>
             <p className="text-sm font-bold mt-1">Super Scholar • 3000 XP</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-card border border-slate-100">
           <h3 className="text-xl font-black text-slate-800 mb-6">Badge Gallery</h3>
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {student.badges.map(b => (
                <div key={b} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center gap-3 group hover:bg-amber-50 hover:border-amber-200 transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <AchievementIcon name={b} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-center text-slate-500 group-hover:text-amber-700">{b}</span>
                </div>
              ))}
              <div className="p-6 border-2 border-dashed border-slate-100 rounded-3xl flex items-center justify-center text-slate-300">
                 <Plus className="w-6 h-6" />
              </div>
           </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
           <Bot className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5" />
           <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">AI Smart Store</p>
           <h3 className="text-2xl font-black mb-6">Redeem Coins</h3>
           <div className="space-y-4">
              {[
                { item: 'Library Fine Waiver', cost: 500, emoji: '📚' },
                { item: 'Extra Canteen Credit', cost: 1200, emoji: '🍔' },
                { item: 'Early PTM Slot', cost: 300, emoji: '⏰' }
              ].map(reward => (
                <div key={reward.item} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{reward.emoji}</span>
                    <span className="text-sm font-bold">{reward.item}</span>
                  </div>
                  <div className="px-4 py-1.5 bg-indigo-600 rounded-full text-[10px] font-black">
                    {reward.cost} COINS
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
