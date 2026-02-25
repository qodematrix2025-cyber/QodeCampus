
import React from 'react';
import { Student } from '../types';
// Added 'Activity' to the Icons import list to fix "Cannot find name 'Activity'" error
import { GraduationCap, Download, CheckCircle, Activity } from './Icons';

export const CertificateVault = ({ student }: { student: Student }) => {
  const mockCerts = [
    { id: 'C1', title: 'Excellence in Mathematics', issuer: 'Academic Board', date: 'May 2024', type: 'Merit' },
    { id: 'C2', title: 'Clean Campus Initiative', issuer: 'Eco Society', date: 'April 2024', type: 'Participation' },
    { id: 'C3', title: 'Annual Debate Finalist', issuer: 'Literary Club', date: 'March 2024', type: 'Merit' },
  ];

  return (
    <div className="space-y-8 animate-reveal">
      <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
         <div className="relative z-10 flex justify-between items-center gap-10">
            <div>
               <p className="text-brand-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Credential Registry</p>
               <h2 className="text-4xl font-black mb-4 tracking-tighter">Merit Vault</h2>
               <p className="text-slate-400 font-medium max-w-xl opacity-80 leading-relaxed">
                 Digital repository for all institutional credentials issued to <span className="text-indigo-400 font-black">{student.firstName} {student.lastName}</span>. All certificates are cryptographically verified via Matrix OS.
               </p>
            </div>
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 text-center min-w-[200px]">
               <p className="text-3xl font-black">{mockCerts.length}</p>
               <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mt-1">Stored Assets</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCerts.map(cert => (
          <div key={cert.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                <GraduationCap className="w-8 h-8" />
              </div>
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-xl font-black text-slate-800 leading-tight mb-2">{cert.title}</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-10">{cert.issuer} • {cert.date}</p>
            
            <div className="mt-auto flex gap-3">
               <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
                 <Download className="w-4 h-4" /> Download PDF
               </button>
               <button className="px-5 py-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all">
                  <Activity className="w-4 h-4" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
