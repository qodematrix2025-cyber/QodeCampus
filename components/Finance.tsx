
import React from 'react';
import { FinanceRecord, Student } from '../types';
import { PlusIcon, FileText } from './Icons';

interface FinanceProps {
  finance: FinanceRecord[];
  students: Student[];
  onAddTransaction: (f: FinanceRecord) => void;
}

export const Finance = ({ finance }: FinanceProps) => {
  const rev = finance.filter(f => f.type === 'Income').reduce((acc, f) => acc + f.amount, 0);
  const exp = finance.filter(f => f.type === 'Expense').reduce((acc, f) => acc + f.amount, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-lg">
            <p className="text-[8px] font-black uppercase text-indigo-400 tracking-widest mb-1">Institutional Balance</p>
            <h2 className="text-3xl font-black">₹{(rev - exp).toLocaleString()}</h2>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[8px] font-black uppercase text-emerald-500 tracking-widest mb-1">Total Inflow</p>
            <h2 className="text-xl font-black text-slate-800">₹{rev.toLocaleString()}</h2>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[8px] font-black uppercase text-rose-500 tracking-widest mb-1">Total Outflow</p>
            <h2 className="text-xl font-black text-slate-800">₹{exp.toLocaleString()}</h2>
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Transaction Artifacts</h3>
           <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">New Entry</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
               <tr>
                 <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400">Date</th>
                 <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400">Heading</th>
                 <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 text-right">Delta</th>
                 <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 text-center">Receipt</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {finance.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-400">{f.date}</td>
                  <td className="px-6 py-4">
                     <p className="text-xs font-black text-slate-800 uppercase leading-none mb-1">{f.category}</p>
                     <p className="text-[9px] text-slate-400 truncate max-w-[200px]">{f.description}</p>
                  </td>
                  <td className={`px-6 py-4 text-right text-sm font-black ${f.type === 'Income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {f.type === 'Income' ? '+' : '-'}₹{f.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600"><FileText className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Finance;
