
import React, { useState, useMemo } from 'react';
import { Student, User, Gender, StudentCategory } from '../types';
import { SearchIcon, PlusIcon, Users, CheckCircle, X, GraduationCap, Activity, Navigation } from './Icons';

interface StudentsProps {
  students: Student[];
  currentUser: User;
  onRegisterStudent: (s: Student, u: User) => void;
  onDeleteStudent: (id: string) => void;
}

export const Students: React.FC<StudentsProps> = ({ students, currentUser, onRegisterStudent, onDeleteStudent }) => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [provisionedCreds, setProvisionedCreds] = useState<{ id: string, pass: string, name: string } | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    grade: currentUser.assignedClass || '10-A',
    gender: Gender.Male,
    category: 'General' as StudentCategory,
    parentEmail: ''
  });

  const filtered = useMemo(() => students.filter(s => 
    (s.firstName + ' ' + s.lastName).toLowerCase().includes(search.toLowerCase()) || 
    s.id.toLowerCase().includes(search.toLowerCase())
  ), [students, search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentId = `S${Math.floor(Math.random() * 9000) + 1000}`;
    const password = Math.random().toString(36).slice(-8).toUpperCase();
    
    const newStudent: Student = {
      id: studentId,
      schoolId: currentUser.schoolId || 'SCH-001',
      firstName: form.firstName,
      lastName: form.lastName,
      grade: form.grade,
      gender: form.gender,
      attendancePct: 100,
      feesStatus: 'Pending',
      gpa: 0,
      parentEmail: form.parentEmail,
      category: form.category,
      eduCoins: 0,
      badges: []
    };

    const newUser: User = {
      id: studentId,
      name: `${form.firstName} ${form.lastName} (Parent)`,
      role: 'Parent',
      email: form.parentEmail,
      password: password,
      schoolId: currentUser.schoolId,
      linkedStudentId: studentId
    };

    onRegisterStudent(newStudent, newUser);
    setProvisionedCreds({ id: studentId, pass: password, name: `${form.firstName} ${form.lastName}` });
    setForm({ firstName: '', lastName: '', grade: currentUser.assignedClass || '10-A', gender: Gender.Male, category: 'General', parentEmail: '' });
  };

  const isAuthorized = currentUser.role === 'Admin' || currentUser.role === 'Teacher' || currentUser.role === 'PlatformAdmin';

  return (
    <div className="space-y-10 animate-reveal">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[3rem] border border-slate-100 shadow-sm">
        <div className="w-full lg:flex-1 relative group">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search scholars by ID, Name or Grade..." 
            className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-3xl text-sm font-bold focus:bg-white focus:ring-8 focus:ring-indigo-50/50 transition-all outline-none shadow-inner-soft"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {isAuthorized && (
          <button 
            onClick={() => setShowModal(true)}
            className="w-full lg:w-auto bg-slate-950 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-brand-600 transition-all shadow-ultra active:scale-95 btn-vibrant"
          >
            <PlusIcon className="w-5 h-5" /> Add New Scholar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        {filtered.map(s => (
          <div key={s.id} className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-premium hover:shadow-ultra hover:border-indigo-100 transition-all duration-500 group cursor-pointer relative overflow-hidden flex flex-col card-glow-indigo">
            <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 rounded-[1.75rem] bg-slate-50 flex items-center justify-center text-slate-300 font-black text-xl uppercase group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner">
                {s.firstName[0]}{s.lastName[0]}
              </div>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100 uppercase tracking-widest">Grade {s.grade}</span>
            </div>
            <h3 className="text-xl font-black text-slate-800 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">{s.firstName} {s.lastName}</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-10">Scholar ID: {s.id}</p>
            
            <div className="mt-auto pt-8 border-t border-slate-50 flex justify-between">
               <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">GPA Index</p>
                  <p className="text-lg font-black text-slate-800">{s.gpa || 'TBA'}</p>
               </div>
               <div className="space-y-1 text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Daily Yield</p>
                  <p className="text-lg font-black text-indigo-600">{s.attendancePct}%</p>
               </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100">
               <div className="h-full bg-indigo-500 transition-all duration-1000" style={{width: `${s.attendancePct}%`}}></div>
            </div>
          </div>
        ))}
      </div>
      
      {filtered.length === 0 && (
         <div className="py-40 text-center flex flex-col items-center opacity-30 animate-reveal">
            <div className="w-28 h-28 bg-white rounded-[4rem] shadow-premium flex items-center justify-center mb-8">
               <Users className="w-12 h-12 text-slate-200" />
            </div>
            <p className="font-black uppercase tracking-[0.5em] text-xs">Registry Vacuum Detected</p>
         </div>
      )}

      {/* --- ENROLL SCHOLAR MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xl z-[150] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[4rem] w-full max-w-xl shadow-ultra animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh] border border-white/20 overflow-hidden relative">
            {!provisionedCreds ? (
              <>
                <div className="p-12 pb-0 flex justify-between items-start">
                  <div>
                    <p className="text-indigo-600 text-[11px] font-black uppercase tracking-[0.4em] mb-3">Scholar Registration</p>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">Enroll Scholar</h3>
                  </div>
                  <button onClick={() => setShowModal(false)} className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm"><X className="w-8 h-8"/></button>
                </div>
                <div className="p-12 pt-10 overflow-y-auto custom-scrollbar flex-1">
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="block text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">First Identity</label>
                        <input required className="w-full p-6 bg-slate-50 rounded-[2rem] border-none focus:ring-8 focus:ring-indigo-50/50 focus:bg-white outline-none font-bold text-slate-800 transition-all text-lg shadow-inner-soft" placeholder="Aarav" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Family Identity</label>
                        <input required className="w-full p-6 bg-slate-50 rounded-[2rem] border-none focus:ring-8 focus:ring-indigo-50/50 focus:bg-white outline-none font-bold text-slate-800 transition-all text-lg shadow-inner-soft" placeholder="Sharma" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="block text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Grade Axis</label>
                        <select className="w-full p-6 bg-slate-50 rounded-[2rem] border-none focus:ring-8 focus:ring-indigo-50/50 focus:bg-white outline-none font-bold text-slate-800 transition-all cursor-pointer shadow-inner-soft" value={form.grade} onChange={e => setForm({...form, grade: e.target.value})}>
                          {['10-A', '10-B', '9-A', '9-B', '8-A'].map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="block text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Liaison Email</label>
                        <input required type="email" className="w-full p-6 bg-slate-50 rounded-[2rem] border-none focus:ring-8 focus:ring-indigo-50/50 focus:bg-white outline-none font-bold text-slate-800 transition-all shadow-inner-soft" placeholder="parent@domain.com" value={form.parentEmail} onChange={e => setForm({...form, parentEmail: e.target.value})} />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-8 bg-slate-950 text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[12px] shadow-ultra hover:bg-brand-600 transition-all flex items-center justify-center gap-4 mt-6 btn-vibrant active-scale">
                      <Activity className="w-6 h-6 animate-pulse" /> Confirm Enrollment
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="p-16 text-center animate-reveal">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner border border-emerald-100">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter leading-none">Node Operational</h3>
                <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] mb-12">Registry synchronized for {provisionedCreds.name}</p>
                
                <div className="bg-slate-50 rounded-[3rem] p-10 space-y-10 border border-slate-100 mb-12 text-left shadow-inner-soft">
                  <div className="group">
                    <p className="text-[11px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em] ml-2">Scholar Liaison ID</p>
                    <code className="text-xl font-black text-indigo-600 bg-white px-8 py-5 rounded-[1.5rem] shadow-premium border border-brand-50 block group-hover:scale-[1.02] transition-transform cursor-copy">{provisionedCreds.id}</code>
                  </div>
                  <div className="group">
                    <p className="text-[11px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em] ml-2">Secure Protocol Key</p>
                    <code className="text-xl font-black text-slate-700 bg-white px-8 py-5 rounded-[1.5rem] shadow-premium border border-slate-100 block group-hover:scale-[1.02] transition-transform cursor-copy">{provisionedCreds.pass}</code>
                  </div>
                </div>
                {/* Fix truthiness check on void return type by using a block statement instead of || */}
                <button onClick={() => { setProvisionedCreds(null); setShowModal(false); }} className="w-full py-8 bg-indigo-600 text-white rounded-[2.25rem] font-black uppercase tracking-[0.3em] text-[12px] hover:bg-indigo-700 transition-all shadow-ultra shadow-indigo-100 flex items-center justify-center gap-3">
                  Synchronize Institutional Registry <Activity className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
