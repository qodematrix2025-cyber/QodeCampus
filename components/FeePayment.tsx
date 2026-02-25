
import React, { useState } from 'react';
import { User, Student } from '../types';
import { FinanceIcon, CheckCircle, X, Send } from './Icons';

export const FeePayment = ({ user, student }: { user: User, student: Student }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="p-20 text-center animate-in zoom-in-95">
         <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-50">
            <CheckCircle className="w-16 h-16" />
         </div>
         <h3 className="text-4xl font-extrabold text-slate-800 mb-4">Fees Paid Successfully!</h3>
         <p className="text-slate-400 text-lg font-medium mb-10">Receipt has been sent to your registered email address.</p>
         <button onClick={() => setIsSuccess(false)} className="px-12 py-5 bg-brand-600 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-brand-700 transition-all">Download Receipt</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in">
       <div className="bg-white p-12 rounded-[4rem] shadow-premium border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          
          <h2 className="text-4xl font-extrabold text-slate-900 mb-2">School Fee Payment</h2>
          <p className="text-slate-400 text-base font-bold uppercase tracking-widest mb-12">Parent Portal • {student.firstName}'s Dues</p>
          
          <div className="space-y-6">
             <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-lg transition-all">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                      <CheckCircle className="w-8 h-8" />
                   </div>
                   <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Quarterly Tuition Fee</p>
                      <p className="text-2xl font-black text-slate-800">₹45,000</p>
                   </div>
                </div>
                <div className="px-5 py-2 bg-rose-50 text-rose-600 text-xs font-black rounded-xl uppercase tracking-widest border border-rose-100">DUE BY 15 MAY</div>
             </div>
             
             <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-lg transition-all">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-sky-500 shadow-sm">
                      <FinanceIcon className="w-8 h-8" />
                   </div>
                   <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Transport & Canteen</p>
                      <p className="text-2xl font-black text-slate-800">₹12,500</p>
                   </div>
                </div>
                <div className="px-5 py-2 bg-rose-50 text-rose-600 text-xs font-black rounded-xl uppercase tracking-widest border border-rose-100">DUE BY 15 MAY</div>
             </div>

             <div className="pt-12 mt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Amount Payable</p>
                   <p className="text-6xl font-black text-slate-900 tracking-tighter">₹57,500</p>
                </div>
                <button 
                   onClick={handlePay}
                   disabled={isProcessing}
                   className="w-full md:w-auto px-16 py-7 bg-brand-600 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-ultra hover:bg-brand-700 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 btn-hover-glow"
                >
                   {isProcessing ? (
                     <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                   ) : 'Pay Fees Now'}
                </button>
             </div>
          </div>
          
          <div className="mt-12 flex justify-center gap-8 grayscale opacity-30">
             <div className="font-black text-sm uppercase">UPI</div>
             <div className="font-black text-sm uppercase">Visa</div>
             <div className="font-black text-sm uppercase">Rupay</div>
             <div className="font-black text-sm uppercase">Net Banking</div>
          </div>
       </div>
    </div>
  );
};
