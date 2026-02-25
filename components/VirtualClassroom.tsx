
import React from 'react';
import { VirtualClass } from '../types';
import { Video, Calendar } from './Icons';

export const VirtualClassroom = ({ classes }: { classes: VirtualClass[] }) => {
  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Virtual Learning Axis</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Live & Recorded Sessions</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{classes.filter(c => c.isLive).length} Streaming Now</span>
        </div>
      </div>

      {classes.length === 0 ? (
        <div className="bg-white rounded-[3rem] py-24 text-center border border-slate-100 shadow-sm">
           <Video className="w-24 h-24 mx-auto mb-6 text-slate-200" />
           <h3 className="text-2xl font-black text-slate-800">Zero Active Nodes</h3>
           <p className="text-slate-400 font-medium max-w-sm mx-auto mt-2">There are currently no virtual classrooms scheduled in the matrix.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map(c => (
            <div key={c.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-card overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className={`p-10 ${c.isLive ? 'bg-rose-50/50' : 'bg-slate-50'} transition-colors duration-500`}>
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg transition-all duration-500 ${
                     c.isLive ? 'bg-rose-500 text-white animate-pulse' : 'bg-indigo-600 text-white'
                  }`}>
                    <Video className="w-10 h-10" />
                  </div>
                  {c.isLive && (
                    <span className="bg-rose-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-rose-200 uppercase tracking-[0.1em]">
                      LIVE NOW
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-1 tracking-tight">{c.subject}</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Matrix Node: {c.grade}</p>
              </div>
              
              <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Start Time</p>
                    <p className="text-xs font-black text-slate-700">{c.startTime}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-xs font-black text-slate-700">{c.duration} MINS</p>
                  </div>
                </div>
                
                <div className="pt-8 border-t border-slate-50 flex gap-4">
                  <button 
                     onClick={() => c.isLive && window.open(c.link, '_blank')}
                     disabled={!c.isLive}
                     className={`flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-[1.02] active:scale-95 ${
                       c.isLive ? 'bg-rose-600 text-white shadow-rose-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                     }`}
                  >
                     {c.isLive ? 'Launch Stream' : 'Session Terminated'}
                  </button>
                  {!c.isLive && (
                    <button className="px-6 py-5 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-indigo-100">
                      Archive
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
