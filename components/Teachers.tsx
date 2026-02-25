
import React, { useState } from 'react';
import { Teacher, User } from '../types';
import { Phone, Users, Plus, X, GraduationCap, Trash2, CheckCircle } from './Icons';

interface TeachersProps {
  schoolId: string;
  teachers: Teacher[];
  currentUser: User;
  onRegisterTeacher: (t: Teacher, u: User) => void;
  onDeleteTeacher: (id: string) => void;
}

const Teachers: React.FC<TeachersProps> = ({ schoolId, teachers, currentUser, onRegisterTeacher, onDeleteTeacher }) => {
  const [showModal, setShowModal] = useState(false);
  const [provisionedCreds, setProvisionedCreds] = useState<{id: string, pass: string, name: string} | null>(null);
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    experienceYears: 0,
    classesAssigned: 0,
    classTeacherOf: ''
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeacher.name && newTeacher.subject && newTeacher.email) {
      const id = `T${Math.floor(Math.random() * 9000) + 1000}`;
      const password = Math.random().toString(36).slice(-8).toUpperCase();
      
      const teacherObj: Teacher = {
        id,
        schoolId,
        name: newTeacher.name,
        subject: newTeacher.subject,
        email: newTeacher.email,
        phone: newTeacher.phone || 'N/A',
        experienceYears: Number(newTeacher.experienceYears),
        classesAssigned: Number(newTeacher.classesAssigned),
        classTeacherOf: newTeacher.classTeacherOf || undefined
      };

      const userObj: User = {
        id,
        name: newTeacher.name,
        role: 'Teacher',
        email: newTeacher.email,
        password,
        schoolId,
        assignedClass: newTeacher.classTeacherOf || '10-A'
      };

      onRegisterTeacher(teacherObj, userObj);
      setProvisionedCreds({ id, pass: password, name: newTeacher.name });
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setProvisionedCreds(null);
    setNewTeacher({ experienceYears: 0, classesAssigned: 0, classTeacherOf: '' });
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Staff Faculty</h2>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Manage institutional teaching assets</p>
        </div>
        {currentUser.role === 'Admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xl shadow-indigo-100"
          >
            <Plus className="w-4 h-4" /> Onboard Faculty
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-[2.5rem] p-8 shadow-card border border-slate-100 hover:border-indigo-200 hover:shadow-2xl transition-all relative group">
            {currentUser.role === 'Admin' && (
              <button onClick={() => confirm('Suspend staff member?') && onDeleteTeacher(teacher.id)} className="absolute top-6 right-6 text-slate-200 hover:text-rose-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
            )}
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] mb-6 flex items-center justify-center text-3xl font-black text-slate-300 shadow-inner uppercase">
              {teacher.name[0]}
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{teacher.name}</h3>
            <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6">{teacher.subject}</p>
            <div className="pt-6 border-t border-slate-50 flex justify-between">
               <div><p className="text-[9px] font-black text-slate-400 uppercase">Exp.</p><p className="text-sm font-bold text-slate-700">{teacher.experienceYears} Years</p></div>
               <div><p className="text-[9px] font-black text-slate-400 uppercase">Load</p><p className="text-sm font-bold text-slate-700">{teacher.classesAssigned} Divs</p></div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            {!provisionedCreds ? (
              <>
                <div className="p-10 pb-0 flex justify-between items-start shrink-0">
                  <div>
                    <h3 className="text-3xl font-black text-slate-800 leading-tight">Faculty<br/>Onboarding</h3>
                    <div className="w-12 h-1.5 bg-indigo-600 rounded-full mt-4"></div>
                  </div>
                  <button onClick={handleClose} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-rose-500 transition-all"><X className="w-6 h-6" /></button>
                </div>
                <div className="p-10 flex-1 overflow-y-auto custom-scrollbar">
                  <form id="teacher-form" onSubmit={handleAdd} className="space-y-8">
                    <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Full Name</label><input required className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 outline-none font-bold" value={newTeacher.name || ''} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} /></div>
                    <div className="grid grid-cols-2 gap-6">
                      <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Subject Expertise</label><input required className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 outline-none font-bold" value={newTeacher.subject || ''} onChange={e => setNewTeacher({...newTeacher, subject: e.target.value})} /></div>
                      <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Contact Number</label><input required className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 outline-none font-bold" value={newTeacher.phone || ''} onChange={e => setNewTeacher({...newTeacher, phone: e.target.value})} /></div>
                    </div>
                    <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Faculty Email</label><input required type="email" className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 outline-none font-bold" value={newTeacher.email || ''} onChange={e => setNewTeacher({...newTeacher, email: e.target.value})} /></div>
                  </form>
                </div>
                <div className="p-10 pt-0 shrink-0">
                  <button type="submit" form="teacher-form" className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-indigo-600 transition-all">Provision Faculty Instance</button>
                </div>
              </>
            ) : (
              <div className="p-12 text-center animate-in zoom-in-95">
                 <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <CheckCircle className="w-12 h-12" />
                 </div>
                 <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Staff Account Active</h3>
                 <p className="text-slate-400 text-sm font-medium mb-10">Login credentials for <span className="text-indigo-600 font-black">{provisionedCreds.name}</span> are ready.</p>
                 <div className="bg-slate-50 rounded-3xl p-8 space-y-6 border border-slate-100 mb-10 text-left">
                    <div><p className="text-[9px] font-black uppercase text-slate-400 mb-2">Staff Access ID</p><code className="text-lg font-black text-indigo-600 bg-white px-4 py-2 rounded-xl shadow-sm border border-indigo-50 w-full block">{provisionedCreds.id}</code></div>
                    <div><p className="text-[9px] font-black uppercase text-slate-400 mb-2">Temporary Password</p><code className="text-lg font-black text-slate-700 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 w-full block">{provisionedCreds.pass}</code></div>
                 </div>
                 <button onClick={handleClose} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">Close & Refresh Registry</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
