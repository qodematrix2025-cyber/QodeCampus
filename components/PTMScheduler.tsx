
import React, { useState } from 'react';
import { User, Teacher, PTMSlot } from '../types';
import { MessageSquare, Calendar, CheckCircle, X, Plus } from './Icons';

export const PTMScheduler = ({ currentUser, teachers }: { currentUser: User, teachers: Teacher[] }) => {
  const isParent = currentUser.role === 'Parent';
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);

  return (
    <div className="space-y-8 animate-reveal">
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">Parent-Teacher Liaison</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Conference Slot Registry</p>
        </div>
        <div className="flex gap-4">
           <button className="bg-slate-50 text-slate-400 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-100">Past Minutes</button>
           <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all">Request Slot</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Faculty Axis</h3>
           {teachers.map(t => (
             <button 
               key={t.id} 
               onClick={() => setSelectedTeacherId(t.id)}
               className={`w-full p-5 rounded-3xl border text-left transition-all group ${
                 selectedTeacherId === t.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-white border-slate-100 hover:border-indigo-100'
               }`}
             >
               <h4 className="font-black text-lg leading-tight">{t.name}</h4>
               <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedTeacherId === t.id ? 'text-indigo-200' : 'text-slate-400'}`}>{t.subject}</p>
             </button>
           ))}
        </div>

        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm">
           {!selectedTeacherId ? (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
               <Calendar className="w-16 h-16 mb-4 text-slate-200" />
               <p className="font-black text-xs uppercase tracking-widest">Select Instructor to query slots</p>
             </div>
           ) : (
             <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-800">Availability: {teachers.find(t => t.id === selectedTeacherId)?.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {[
                     { id: '1', time: '10:00 AM - 10:15 AM', status: 'Available' },
                     { id: '2', time: '10:15 AM - 10:30 AM', status: 'Booked' },
                     { id: '3', time: '10:30 AM - 10:45 AM', status: 'Available' },
                     { id: '4', time: '10:45 AM - 11:00 AM', status: 'Available' },
                   ].map(slot => (
                     <div key={slot.id} className={`p-6 rounded-3xl border flex justify-between items-center ${
                        slot.status === 'Booked' ? 'bg-slate-50 border-slate-100 opacity-50' : 'bg-emerald-50 border-emerald-100'
                     }`}>
                        <div>
                           <p className="text-sm font-black text-slate-700">{slot.time}</p>
                           <p className={`text-[9px] font-black uppercase mt-1 ${slot.status === 'Booked' ? 'text-slate-400' : 'text-emerald-600'}`}>{slot.status}</p>
                        </div>
                        {slot.status === 'Available' && (
                          <button className="p-2 bg-white rounded-xl text-emerald-600 shadow-sm border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all">
                             <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
