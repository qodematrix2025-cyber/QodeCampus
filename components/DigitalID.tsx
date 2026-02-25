
import React from 'react';
import { Student } from '../types';

export const DigitalID = ({ student }: { student: Student }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-sm bg-white rounded-[3rem] shadow-ultra overflow-hidden relative group border border-orange-100">
         <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
         <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full -ml-24 -mb-24 blur-3xl"></div>
         
         <div className="p-8 bg-gradient-to-r from-brand-600 to-brand-500 text-white flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-black text-sm">Q</div>
               <span className="text-xs font-black uppercase tracking-widest">Student ID Card</span>
            </div>
            <span className="text-[10px] font-black text-orange-100 uppercase bg-white/10 px-3 py-1 rounded-full">2024 - 2025</span>
         </div>

         <div className="p-10 flex flex-col items-center relative z-10">
            <div className="w-36 h-36 bg-slate-50 rounded-[2.5rem] p-1.5 shadow-inner mb-6 ring-8 ring-orange-50 overflow-hidden group-hover:scale-105 transition-transform duration-500">
               <div className="w-full h-full bg-orange-100 flex items-center justify-center text-5xl font-black text-orange-400 uppercase">
                 {student.firstName[0]}{student.lastName[0]}
               </div>
            </div>
            
            <h3 className="text-3xl font-extrabold text-slate-800 text-center leading-tight">{student.firstName} {student.lastName}</h3>
            <p className="text-brand-600 text-sm font-black uppercase tracking-widest mt-2">Class: {student.grade}</p>
            
            <div className="mt-10 w-full grid grid-cols-2 gap-6 pt-8 border-t border-slate-100">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Scholar ID</p>
                  <p className="text-base font-extrabold text-slate-800">{student.id}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center justify-end gap-2 text-emerald-500 font-extrabold text-xs uppercase tracking-widest">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     Verified
                  </div>
               </div>
            </div>

            <div className="mt-10 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group-hover:bg-white transition-all shadow-inner">
               <div className="w-24 h-24 grid grid-cols-6 grid-rows-6 gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  {Array.from({ length: 36 }).map((_, i) => (
                     <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-slate-900' : 'bg-brand-100'}`}></div>
                  ))}
               </div>
            </div>
            <p className="text-[10px] text-slate-300 font-black uppercase mt-6 tracking-[0.3em]">Institutional Matrix OS</p>
         </div>
      </div>
    </div>
  );
};
