
import React, { useState } from 'react';
import { User, SubscriptionPlan, ExamPaper } from '../types';
import { ClipboardList, Plus, CheckCircle, Activity, X, Bot } from './Icons';

const MOCK_EXAMS: ExamPaper[] = [
  { id: 'E1', title: 'Calculus Advanced Quiz', subject: 'Mathematics', durationMins: 45, totalMarks: 50, status: 'Live', date: 'Today' },
  { id: 'E2', title: 'Periodic Term Assessment', subject: 'Physics', durationMins: 90, totalMarks: 100, status: 'Upcoming', date: 'Tomorrow' },
  { id: 'E3', title: 'Grammar Performance Unit', subject: 'English', durationMins: 30, totalMarks: 25, status: 'Completed', date: '2 days ago' },
];

export const ExaminationHub = ({ currentUser, plan }: { currentUser: User, plan: SubscriptionPlan }) => {
  const [exams] = useState<ExamPaper[]>(MOCK_EXAMS);
  const [activeTest, setActiveTest] = useState<ExamPaper | null>(null);
  
  const isTeacher = currentUser.role === 'Admin' || currentUser.role === 'Teacher';
  const hasAIExams = plan === 'Professional' || plan === 'Infinite';

  if (activeTest) {
    return (
      <div className="fixed inset-0 bg-slate-950 z-[200] flex flex-col p-8 text-white">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-2xl font-black">{activeTest.title}</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{activeTest.subject} • Securing session...</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 text-xl font-black tracking-tighter">
              34:52
            </div>
            <button onClick={() => setActiveTest(null)} className="p-3 bg-rose-500/20 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 max-w-3xl mx-auto w-full space-y-12">
          <div className="space-y-6">
            <span className="text-indigo-400 font-black text-xs uppercase tracking-widest">Question 1 of 20</span>
            <h3 className="text-3xl font-bold leading-tight">If a function f is continuous on [a, b] and differentiable on (a, b), then there exists c in (a, b) such that f'(c) equals?</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {['(f(b) - f(a)) / (b - a)', 'f(b) - f(a)', '0', '1'].map((opt, i) => (
              <button key={i} className="p-6 bg-white/5 border border-white/10 rounded-3xl text-left hover:bg-indigo-600 transition-all font-bold text-lg">
                <span className="inline-block w-8 h-8 rounded-lg bg-white/10 text-center leading-8 mr-4">{String.fromCharCode(65+i)}</span>
                {opt}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-auto flex justify-between pt-8 border-t border-white/5">
           <button className="px-8 py-4 bg-white/5 rounded-2xl font-black text-xs uppercase tracking-widest">Previous Unit</button>
           <button className="px-12 py-4 bg-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20">Commit Answer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-reveal">
      <div className="flex flex-col lg:flex-row gap-6">
         <div className="flex-1 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">E-Assessment Hub</h2>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Digital Examination Protocol</p>
               </div>
               {isTeacher && (
                  <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-brand-600 transition-all shadow-md active:scale-95">
                    <Plus className="w-4 h-4" /> Provision Paper
                  </button>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {exams.map(exam => (
                  <div key={exam.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:border-indigo-100 transition-all group relative overflow-hidden">
                     <div className="flex justify-between items-start mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
                           exam.status === 'Live' ? 'bg-rose-50 text-rose-500' : 'bg-slate-200 text-slate-400'
                        }`}>
                           <Activity className="w-6 h-6" />
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase border ${
                           exam.status === 'Live' ? 'bg-rose-100 text-rose-600 border-rose-200 animate-pulse' :
                           exam.status === 'Upcoming' ? 'bg-amber-100 text-amber-600 border-amber-200' :
                           'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                           {exam.status}
                        </span>
                     </div>
                     <h3 className="font-black text-slate-800 text-lg leading-tight mb-2">{exam.title}</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{exam.subject} • {exam.durationMins} Mins</p>
                     
                     <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase">{exam.date}</p>
                        {exam.status === 'Live' && !isTeacher && (
                           <button onClick={() => setActiveTest(exam)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all">Launch Test</button>
                        )}
                        {exam.status === 'Completed' && (
                           <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Evaluated</span>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="lg:w-96 space-y-6">
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
               <Bot className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5" />
               <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">AI Insight Axis</p>
               <h3 className="text-xl font-black mb-6">Matrix Paper Engine</h3>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-8">
                 {hasAIExams ? "Advanced question generation enabled. Auto-grading is ready for next batch." : "Upgrade to Professional Tier to unlock AI-assisted question generation and auto-proctoring."}
               </p>
               <button disabled={!hasAIExams} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-30">Generate Mock Unit</button>
            </div>
         </div>
      </div>
    </div>
  );
};
