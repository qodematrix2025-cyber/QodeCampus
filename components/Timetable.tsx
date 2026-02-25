
import React, { useState } from 'react';
import { TimetableEntry, User, Teacher } from '../types';
import { Calendar, Plus, X, Trash2, CheckCircle, SettingsIcon } from './Icons';
import { MOCK_TIMETABLE } from '../constants';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
type DayType = typeof DAYS[number];

interface TimetableProps {
  user: User;
  entries: TimetableEntry[];
  teachers: Teacher[];
  onUpdateTimetable: (entries: TimetableEntry[]) => void;
}

export const Timetable: React.FC<TimetableProps> = ({ user, entries, teachers, onUpdateTimetable }) => {
  const isAdmin = user.role === 'Admin' || user.role === 'PlatformAdmin';
  const [selectedClass, setSelectedClass] = useState(user.assignedClass || '10-A');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<{ day: DayType, period: number } | null>(null);
  
  const [formData, setFormData] = useState<Partial<TimetableEntry>>({
    subject: '',
    teacherName: '',
    room: ''
  });

  const handleOpenEdit = (day: DayType, period: number) => {
    if (!isAdmin) return;
    const existing = entries.find(e => e.day === day && e.period === period);
    setEditingSlot({ day, period });
    setFormData(existing || { subject: '', teacherName: '', room: '' });
    setShowEditModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot || !formData.subject) return;

    const newEntries = entries.filter(e => !(e.day === editingSlot.day && e.period === editingSlot.period));
    
    newEntries.push({
      day: editingSlot.day,
      period: editingSlot.period,
      startTime: `Period ${editingSlot.period}`,
      endTime: '',
      subject: formData.subject!,
      teacherName: formData.teacherName || 'TBA',
      room: formData.room || 'N/A'
    });

    onUpdateTimetable(newEntries);
    setShowEditModal(false);
  };

  const handleDelete = () => {
    if (!editingSlot) return;
    const newEntries = entries.filter(e => !(e.day === editingSlot.day && e.period === editingSlot.period));
    onUpdateTimetable(newEntries);
    setShowEditModal(false);
  };

  const quickClear = (e: React.MouseEvent, day: DayType, period: number) => {
    e.stopPropagation();
    if (confirm('CRITICAL: Erase this session from the matrix?')) {
      onUpdateTimetable(entries.filter(ent => !(ent.day === day && ent.period === period)));
    }
  };

  const handleClearAll = () => {
    if (confirm(`SYSTEM OVERRIDE: Wipe entire schedule for Grade ${selectedClass}?`)) {
      onUpdateTimetable([]);
      setShowConfigModal(false);
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Restore institutional default registry mock?')) {
      onUpdateTimetable(MOCK_TIMETABLE);
      setShowConfigModal(false);
    }
  };

  // Colorful subject identification
  const getSubjectColor = (subject: string) => {
    const s = subject.toLowerCase();
    if (s.includes('math')) return 'from-indigo-500 to-blue-600 text-white';
    if (s.includes('physic') || s.includes('science')) return 'from-rose-500 to-pink-600 text-white';
    if (s.includes('hist') || s.includes('social')) return 'from-amber-400 to-orange-500 text-white';
    if (s.includes('eng')) return 'from-cyan-400 to-teal-500 text-white';
    return 'from-slate-100 to-slate-200 text-slate-800';
  };

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-4">
            <Calendar className="w-10 h-10 text-brand-500" /> Routine Matrix
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">
            {isAdmin ? 'Master Control Active' : `Current Class Axis: ${selectedClass}`}
          </p>
        </div>
        
        {isAdmin && (
          <div className="flex gap-4 p-2 bg-white rounded-[2rem] border border-slate-100 shadow-premium">
             <select 
               className="bg-slate-50 border-none px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-50 cursor-pointer transition-all"
               value={selectedClass}
               onChange={e => setSelectedClass(e.target.value)}
             >
                {['10-A', '10-B', '9-A', '9-B'].map(c => <option key={c} value={c}>Grade {c}</option>)}
             </select>
             <button 
               onClick={() => setShowConfigModal(true)}
               className="bg-slate-950 text-white px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-brand-600 transition-all shadow-ultra active-scale btn-vibrant"
             >
               <SettingsIcon className="w-4 h-4" /> Config Axis
             </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-[4rem] shadow-premium border border-slate-50 overflow-hidden card-glow-indigo">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-r border-slate-100 text-center">Session Arc</th>
                {DAYS.map(day => (
                  <th key={day} className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[1, 2, 3, 4, 5, 6].map(period => (
                <tr key={period} className="group/row">
                  <td className="px-10 py-12 bg-slate-50/40 border-r border-slate-100 text-center">
                    <p className="text-sm font-black text-slate-800">Node {period}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1.5 tracking-widest">45m Orbit</p>
                  </td>
                  {DAYS.map(day => {
                    const entry = entries.find(t => t.day === day && t.period === period);
                    const gradClass = entry ? getSubjectColor(entry.subject) : '';
                    
                    return (
                      <td 
                        key={day} 
                        onClick={() => handleOpenEdit(day, period)}
                        className={`px-4 py-4 relative transition-all duration-500 ${isAdmin ? 'cursor-pointer hover:bg-slate-50/50' : ''}`}
                      >
                        {entry ? (
                          <div className={`p-6 rounded-[2.5rem] group/card relative shadow-sm hover:shadow-ultra transition-all duration-500 overflow-hidden bg-gradient-to-br ${gradClass} ${
                            isAdmin ? 'hover:scale-[1.03]' : ''
                          }`}>
                            {isAdmin && (
                              <button 
                                onClick={(e) => quickClear(e, day, period)}
                                className="absolute top-2 right-2 w-8 h-8 bg-white/10 backdrop-blur-md text-white rounded-full border border-white/20 shadow-sm flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all hover:bg-rose-500 hover:border-rose-500 active-scale"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                            <div className="relative z-10">
                               <p className="text-xs font-black leading-tight mb-2 tracking-tight uppercase">{entry.subject}</p>
                               <p className="text-[8px] font-bold opacity-80 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                                 <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                                 Loc: {entry.room}
                               </p>
                               <div className="h-px bg-white/20 w-full mb-4"></div>
                               <p className="text-[9px] font-bold opacity-90 tracking-tight truncate">{entry.teacherName}</p>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover/card:scale-150 transition-transform"></div>
                          </div>
                        ) : (
                          <div className={`h-28 flex items-center justify-center border-2 border-dashed rounded-[2.5rem] transition-all duration-700 ${
                            isAdmin ? 'border-slate-100 group-hover:border-indigo-200 bg-slate-50/10 hover:bg-indigo-50/10' : 'border-slate-50/50'
                          }`}>
                             {isAdmin ? (
                               <div className="flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                  <Plus className="w-6 h-6 text-indigo-400" />
                                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Provision</span>
                               </div>
                             ) : (
                               <span className="text-[9px] font-black text-slate-100 uppercase tracking-[0.4em]">Vacuum</span>
                             )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ASSIGN SLOT MODAL --- */}
      {showEditModal && editingSlot && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-2xl z-[110] flex items-center justify-center p-8 overflow-y-auto">
          <div className="bg-white rounded-[4rem] w-full max-w-xl shadow-ultra animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh] border border-white/20 overflow-hidden">
             <div className="p-16 pb-0 flex justify-between items-start bg-slate-50/50">
                <div>
                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4">Assign Slot</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-indigo-500 text-[11px] font-black uppercase tracking-[0.3em]">{editingSlot.day}</span>
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                      <span className="text-indigo-500 text-[11px] font-black uppercase tracking-[0.3em]">Session {editingSlot.period}</span>
                    </div>
                </div>
                <button 
                  onClick={() => setShowEditModal(false)} 
                  className="w-16 h-16 bg-white border border-slate-100 rounded-[1.75rem] flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all shadow-premium group"
                >
                  <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
                </button>
             </div>
             
             <div className="p-16 flex-1 overflow-y-auto custom-scrollbar">
                <form id="timetable-form" onSubmit={handleSave} className="space-y-12">
                   <div className="group">
                      <label className="block text-[11px] font-black uppercase text-slate-400 mb-5 tracking-[0.3em] ml-2 group-focus-within:text-indigo-500 transition-colors">Subject Registry</label>
                      <input 
                        required 
                        autoFocus
                        type="text" 
                        placeholder="e.g. Theoretical Physics"
                        className="w-full p-6 bg-slate-50 rounded-[2rem] border-none focus:ring-8 focus:ring-brand-50 focus:bg-white outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300 shadow-inner-soft text-lg" 
                        value={formData.subject || ''} 
                        onChange={e => setFormData({...formData, subject: e.target.value})} 
                      />
                   </div>
                   
                   <div className="group">
                      <label className="block text-[11px] font-black uppercase text-slate-400 mb-5 tracking-[0.3em] ml-2 group-focus-within:text-indigo-500 transition-colors">Faculty Member</label>
                      <select 
                        required
                        className="w-full p-6 bg-slate-50 rounded-[2rem] border-none focus:ring-8 focus:ring-brand-50 focus:bg-white outline-none font-bold text-slate-700 transition-all cursor-pointer shadow-inner-soft text-lg"
                        value={formData.teacherName || ''}
                        onChange={e => setFormData({...formData, teacherName: e.target.value})}
                      >
                         <option value="">-- Choose Instructor --</option>
                         {teachers.map(t => <option key={t.id} value={t.name}>{t.name} ({t.subject})</option>)}
                      </select>
                   </div>

                   <div className="group">
                      <label className="block text-[11px] font-black uppercase text-slate-400 mb-5 tracking-[0.3em] ml-2 group-focus-within:text-indigo-500 transition-colors">Lab / Space Axis</label>
                      <input 
                        type="text" 
                        placeholder="e.g. A-402, Lab-1"
                        className="w-full p-6 bg-slate-50 rounded-[2rem] border-none focus:ring-8 focus:ring-brand-50 focus:bg-white outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300 shadow-inner-soft text-lg" 
                        value={formData.room || ''} 
                        onChange={e => setFormData({...formData, room: e.target.value})} 
                      />
                   </div>
                </form>
             </div>

             <div className="p-16 pt-0 flex gap-6 bg-slate-50/30">
                <button 
                  onClick={handleDelete}
                  type="button"
                  title="Cut Session"
                  className="w-24 py-8 bg-white border border-slate-100 text-rose-500 rounded-[2.5rem] font-black flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-premium active-scale group"
                >
                  <X className="w-8 h-8 group-hover:scale-125 transition-transform" />
                </button>
                <button 
                  type="submit" 
                  form="timetable-form"
                  className="flex-1 py-8 bg-slate-950 text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[11px] shadow-ultra hover:bg-brand-600 transition-all active-scale flex items-center justify-center gap-4 btn-vibrant"
                >
                  <CheckCircle className="w-6 h-6" /> Synchronize Matrix
                </button>
             </div>
          </div>
        </div>
      )}

      {/* --- GLOBAL CONFIG MODAL --- */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-[120] flex items-center justify-center p-8">
          <div className="bg-white rounded-[4rem] w-full max-w-lg shadow-ultra animate-in slide-in-from-top-12 border border-white/20 overflow-hidden">
             <div className="p-16 flex justify-between items-start bg-slate-50/50">
                <div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3">Global Matrix<br/>Override</h3>
                  <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Administrative Protocol Active</p>
                </div>
                <button 
                  onClick={() => setShowConfigModal(false)}
                  className="w-14 h-14 bg-white border border-slate-100 text-slate-300 rounded-[1.25rem] flex items-center justify-center hover:text-rose-500 transition-all shadow-sm"
                >
                  <X className="w-6 h-6" />
                </button>
             </div>
             <div className="p-16 pt-10 space-y-6">
                <div className="bg-indigo-50/50 rounded-[2.5rem] p-8 border border-indigo-100 shadow-inner-soft">
                   <p className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                     Target Node: Grade {selectedClass}
                   </p>
                   <p className="text-sm text-indigo-700/70 font-medium leading-relaxed">System-wide modifications to the current routine axis will overwrite existing registry data permanently.</p>
                </div>

                <button 
                   onClick={handleClearAll}
                   className="w-full py-7 bg-rose-50 text-rose-600 rounded-[2.25rem] font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-4 hover:bg-rose-600 hover:text-white transition-all shadow-glow-rose border border-rose-100"
                >
                   <Trash2 className="w-5 h-5" /> Erase Period Axis
                </button>

                <button 
                   onClick={handleResetToDefault}
                   className="w-full py-7 bg-emerald-50 text-emerald-600 rounded-[2.25rem] font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-4 hover:bg-emerald-600 hover:text-white transition-all shadow-glow-emerald border border-emerald-100"
                >
                   <SettingsIcon className="w-5 h-5" /> Reset Matrix Registry
                </button>

                <div className="pt-10 border-t border-slate-100">
                   <button 
                     onClick={() => setShowConfigModal(false)}
                     className="w-full py-7 bg-slate-950 text-white rounded-[2.25rem] font-black uppercase tracking-[0.4em] text-[10px] shadow-ultra active-scale btn-vibrant"
                   >
                     Exit System Config
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
