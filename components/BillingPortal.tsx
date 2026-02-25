
import React from 'react';
import { School, Invoice, SubscriptionPlan } from '../types';
import { FinanceIcon, Download, CheckCircle, Activity, Users } from './Icons';

interface BillingPortalProps {
  schools: School[];
  invoices: Invoice[];
  activeSchoolId?: string | null;
}

export const BillingPortal: React.FC<BillingPortalProps> = ({ schools, invoices, activeSchoolId }) => {
  const selectedSchool = activeSchoolId ? schools.find(s => s.id === activeSchoolId) : null;
  const filteredInvoices = activeSchoolId 
    ? invoices.filter(i => i.schoolId === activeSchoolId)
    : invoices;

  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.amount, 0);
  const outstanding = invoices.filter(i => i.status === 'Overdue').reduce((acc, i) => acc + i.amount, 0);

  const PlanBadge = ({ plan }: { plan: SubscriptionPlan }) => (
    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
      plan === 'Infinite' ? 'bg-indigo-600 text-white' :
      plan === 'Professional' ? 'bg-emerald-100 text-emerald-700' :
      'bg-slate-100 text-slate-500'
    }`}>
      {plan}
    </span>
  );

  return (
    <div className="space-y-8 animate-in">
      {/* Platform Level Overview (Only if no specific school selected) */}
      {!selectedSchool && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Managed Revenue</p>
             <h2 className="text-4xl font-black">₹{totalRevenue.toLocaleString()}</h2>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-card">
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Pending Collections</p>
             <h2 className="text-4xl font-black text-rose-500">₹{outstanding.toLocaleString()}</h2>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-card">
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Active Plans</p>
             <h2 className="text-4xl font-black text-slate-800">{schools.filter(s => s.status === 'Active').length}</h2>
          </div>
        </div>
      )}

      {selectedSchool ? (
        <div className="space-y-8">
           <div className="bg-white p-10 rounded-[3rem] shadow-card border border-indigo-100 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center text-3xl font-black">
                   {selectedSchool.name[0]}
                 </div>
                 <div>
                    <h2 className="text-3xl font-black text-slate-800">{selectedSchool.name}</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Client ID: {selectedSchool.id}</p>
                    <div className="flex gap-2 mt-4">
                       <PlanBadge plan={selectedSchool.plan || 'Standard'} />
                       <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600`}>
                          {selectedSchool.status}
                       </span>
                    </div>
                 </div>
              </div>
              <div className="text-center md:text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Next Renewal</p>
                 <p className="text-2xl font-black text-slate-800">{selectedSchool.nextBillingDate}</p>
                 <button className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">Modify Subscription</button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Standard', price: '₹9,999/mo', features: ['Up to 500 Scholars', 'Core ERP', 'Basic Support'], color: 'slate' },
                { name: 'Professional', price: '₹14,999/mo', features: ['Up to 2000 Scholars', 'AI Insights', 'Priority Support'], color: 'emerald' },
                { name: 'Infinite', price: '₹24,999/mo', features: ['Unlimited Scholars', 'Custom Branding', '24/7 Concierge'], color: 'indigo' },
              ].map(plan => (
                <div key={plan.name} className={`p-8 rounded-[2.5rem] border-2 transition-all ${
                   selectedSchool.plan === plan.name ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 bg-white hover:border-slate-200'
                }`}>
                   <h3 className="text-xl font-black text-slate-800">{plan.name}</h3>
                   <p className="text-3xl font-black text-slate-900 mt-2 mb-6">{plan.price}</p>
                   <ul className="space-y-3 mb-8">
                      {plan.features.map(f => (
                         <li key={f} className="text-xs font-bold text-slate-500 flex items-center gap-2">
                           <CheckCircle className="w-4 h-4 text-emerald-500" /> {f}
                         </li>
                      ))}
                   </ul>
                   <button className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                     selectedSchool.plan === plan.name ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                   }`}>
                     {selectedSchool.plan === plan.name ? 'Current Active Plan' : 'Select Strategy'}
                   </button>
                </div>
              ))}
           </div>
        </div>
      ) : null}

      <div className="bg-white rounded-[3rem] shadow-card border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-slate-800">Invoice History</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Managed Transaction Log</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-10 py-5">Invoice ID</th>
                {!selectedSchool && <th className="px-10 py-5">Institution</th>}
                <th className="px-10 py-5">Date</th>
                <th className="px-10 py-5">Plan</th>
                <th className="px-10 py-5">Status</th>
                <th className="px-10 py-5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-10 py-5 font-mono text-xs text-indigo-500 font-bold">{inv.id}</td>
                  {!selectedSchool && (
                    <td className="px-10 py-5 font-black text-slate-700">
                      {schools.find(s => s.id === inv.schoolId)?.name || 'Unknown'}
                    </td>
                  )}
                  <td className="px-10 py-5 text-slate-400 font-bold text-xs">{inv.date}</td>
                  <td className="px-10 py-5"><PlanBadge plan={inv.plan} /></td>
                  <td className="px-10 py-5">
                    <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>{inv.status}</span>
                  </td>
                  <td className="px-10 py-5 text-right font-black text-slate-800">₹{inv.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
