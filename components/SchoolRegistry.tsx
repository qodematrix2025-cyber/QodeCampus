
import React, { useState } from 'react';
import { School, User, SubscriptionPlan, SubscriptionStatus } from '../types';
import { Plus, X, CheckCircle, Search, Activity, Trash2, Navigation, GraduationCap, Send, ChevronLeft } from './Icons';

interface SchoolRegistryProps {
  schools: School[];
  onAddSchool: (s: School, u: User) => void;
  onUpdateSchoolStatus: (id: string, status: SubscriptionStatus) => void;
  onNavigateToBilling: (schoolId: string) => void;
}

export const SchoolRegistry = ({ schools, onAddSchool, onUpdateSchoolStatus, onNavigateToBilling }: SchoolRegistryProps) => {
  const [showModal, setShowModal] = useState(false);
  const [provisionedCreds, setProvisionedCreds] = useState<{id: string, pass: string, name: string} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ name: '', location: '', email: '', plan: 'Standard' as SubscriptionPlan });

  const filteredSchools = schools.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const schoolId = `SCH-${Math.floor(Math.random() * 900) + 100}`;
    const adminId = `admin-${schoolId.toLowerCase()}`;
    const defaultPassword = Math.random().toString(36).slice(-8).toUpperCase();
    
    const newSchool: School = {
      id: schoolId,
      name: form.name,
      location: form.location,
      contactEmail: form.email,
      studentCount: 0,
      status: 'Active',
      plan: form.plan,
      joinedDate: new Date().toISOString().split('T')[0],
      region: 'APAC'
    };

    const defaultAdmin: User = {
      id: adminId,
      name: `Admin @ ${form.name}`,
      role: 'Admin',
      schoolId: schoolId,
      email: form.email,
      password: defaultPassword
    };

    onAddSchool(newSchool, defaultAdmin);
    setProvisionedCreds({ id: adminId, pass: defaultPassword, name: form.name });
    setForm({ name: '', location: '', email: '', plan: 'Standard' });
  };

  const handleDecommission = (id: string, name: string) => {
    if (confirm(`SYSTEM OVERRIDE: Permanently delete institutional node ${name}? This cannot be undone.`)) {
      alert(`Node ${id} decommissioning protocol initiated.`);
    }
  };

  return (
    <div className="space-y-8 animate-reveal">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
        <div>
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">Global Registry</h2>
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] ml-0.5">Matrix Network Controller</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="w-full sm:w-auto bg-slate-950 text-white px-10 py-5 rounded-[1.75rem] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand-600 transition-all shadow-ultra active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> Provision New Node
        </button>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-premium border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
           <div className="relative w-full max-w-lg group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-600 transition-colors w-5 h-5" />
              <input 
                type="text" 
                placeholder="Query institutional nodes by ID or Name..." 
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] focus:ring-8 focus:ring-brand-50 outline-none font-bold text-sm shadow-inner-soft transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex gap-2">
              <div className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                {filteredSchools.length} Nodes Active
              </div>
           </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
             <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] border-b border-slate-50">
               <tr>
                 <th className="px-10 py-8">Protocol ID</th>
                 <th className="px-10 py-8">Institution Identity</th>
                 <th className="px-10 py-8">Status State</th>
                 <th className="px-10 py-8 text-right">Matrix Control</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {filteredSchools.map(s => (
                 <tr key={s.id} className={`hover:bg-slate-50/80 transition-colors group ${s.status === 'Suspended' ? 'bg-rose-50/10' : ''}`}>
                    <td className="px-10 py-8 font-black text-brand-600 tracking-widest text-[12px]">{s.id}</td>
                    <td className="px-10 py-8">
                      <p className={`font-black text-lg tracking-tight mb-1.5 ${s.status === 'Suspended' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{s.name}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                          <Navigation className="w-3 h-3" /> {s.location}
                        </span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.plan} TIER</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border flex items-center gap-2 w-fit shadow-inner-soft ${
                          s.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                       }`}>
                         <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                         {s.status}
                       </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                            onClick={() => onUpdateSchoolStatus(s.id, s.status === 'Active' ? 'Suspended' : 'Active')}
                            title={s.status === 'Active' ? 'Suspend Access' : 'Restore Access'}
                            className={`p-3.5 rounded-[1rem] transition-all shadow-sm active-scale ${
                              s.status === 'Active' ? 'bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white' : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                            }`}
                         >
                           {s.status === 'Active' ? <X className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                         </button>
                         <button 
                            onClick={() => handleDecommission(s.id, s.name)}
                            className="p-3.5 bg-rose-50 text-rose-500 rounded-[1rem] hover:bg-rose-600 hover:text-white transition-all shadow-sm active-scale"
                         >
                           <Trash2 className="w-5 h-5" />
                         </button>
                         <button onClick={() => onNavigateToBilling(s.id)} className="p-3.5 bg-slate-900 text-white rounded-[1rem] hover:bg-brand-600 transition-all shadow-md active-scale">
                           <Activity className="w-5 h-5" />
                         </button>
                       </div>
                    </td>
                 </tr>
               ))}
             </tbody>
          </table>
          {filteredSchools.length === 0 && (
            <div className="py-24 text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                 <Search className="w-10 h-10" />
               </div>
               <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No Nodes matching search protocol</p>
            </div>
          )}
        </div>
      </div>

      {/* --- PREMIUM DEPLOYMENT MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xl z-[200] flex items-center justify-center p-6 overflow-y-auto">
           <div className="bg-white rounded-[4rem] w-full max-w-xl shadow-ultra animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh] border border-white/20 overflow-hidden relative">
              {!provisionedCreds ? (
                <>
                  <div className="p-12 pb-0 flex justify-between items-start">
                    <div>
                        <p className="text-brand-600 text-[11px] font-black uppercase tracking-[0.4em] mb-3">Matrix Provisioning</p>
                        <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">New Node<br/>Deployment</h3>
                    </div>
                    <button 
                      onClick={() => setShowModal(false)} 
                      className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all shadow-inner group"
                    >
                      <X className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                  </div>
                  <div className="p-12 pt-10 overflow-y-auto custom-scrollbar flex-1">
                    <form onSubmit={handleSubmit} className="space-y-10">
                      <div className="group">
                          <label className="block text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 ml-1 group-focus-within:text-brand-600 transition-colors">Institutional Name</label>
                          <div className="relative">
                            <input required className="w-full p-6 bg-slate-50 rounded-[1.75rem] border-none focus:ring-8 focus:ring-brand-50 focus:bg-white outline-none font-bold text-slate-800 transition-all shadow-inner-soft text-lg" placeholder="Skyline Global" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                            <GraduationCap className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200 w-6 h-6" />
                          </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group">
                            <label className="block text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 ml-1 group-focus-within:text-brand-600 transition-colors">Spatial Location</label>
                            <div className="relative">
                              <input required className="w-full p-6 bg-slate-50 rounded-[1.75rem] border-none focus:ring-8 focus:ring-brand-50 focus:bg-white outline-none font-bold text-slate-800 transition-all shadow-inner-soft" placeholder="London, UK" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                              <Navigation className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200 w-5 h-5" />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 ml-1 group-focus-within:text-brand-600 transition-colors">Revenue Strategy</label>
                            <select className="w-full p-6 bg-slate-50 rounded-[1.75rem] border-none focus:ring-8 focus:ring-brand-50 focus:bg-white outline-none font-bold text-slate-800 transition-all cursor-pointer shadow-inner-soft" value={form.plan} onChange={e => setForm({...form, plan: e.target.value as SubscriptionPlan})}>
                               <option value="Standard">Standard (Growth)</option>
                               <option value="Professional">Professional (Scale)</option>
                               <option value="Infinite">Infinite (Enterprise)</option>
                            </select>
                        </div>
                      </div>
                      <div className="group">
                          <label className="block text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 ml-1 group-focus-within:text-brand-600 transition-colors">Master Admin Email</label>
                          <div className="relative">
                            <input required type="email" className="w-full p-6 bg-slate-50 rounded-[1.75rem] border-none focus:ring-8 focus:ring-brand-50 focus:bg-white outline-none font-bold text-slate-800 transition-all shadow-inner-soft" placeholder="admin@node.edu" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                            <Send className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200 w-5 h-5" />
                          </div>
                      </div>
                      <button type="submit" className="w-full py-8 bg-[#0f172a] text-white rounded-[2.25rem] font-black uppercase tracking-[0.3em] text-[12px] shadow-ultra hover:bg-brand-600 transition-all flex items-center justify-center gap-4 mt-6 btn-vibrant active-scale">
                        <Activity className="w-6 h-6 animate-pulse" /> Initialize Deployment
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="p-16 text-center animate-in zoom-in-95 duration-500">
                   <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                      <CheckCircle className="w-12 h-12" />
                   </div>
                   <h3 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter leading-none">Node Operational</h3>
                   <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] mb-12">Registry synchronized for {provisionedCreds.name}</p>
                   
                   <div className="bg-slate-50 rounded-[3rem] p-10 space-y-10 border border-slate-100 mb-12 text-left shadow-inner-soft">
                      <div className="group">
                        <p className="text-[11px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em] ml-2">Node Liaison ID</p>
                        <code className="text-xl font-black text-brand-600 bg-white px-8 py-5 rounded-[1.5rem] shadow-premium border border-brand-50 block group-hover:scale-[1.02] transition-transform cursor-copy">{provisionedCreds.id}</code>
                      </div>
                      <div className="group">
                        <p className="text-[11px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em] ml-2">Secure Protocol Key</p>
                        <code className="text-xl font-black text-slate-700 bg-white px-8 py-5 rounded-[1.5rem] shadow-premium border border-slate-100 block group-hover:scale-[1.02] transition-transform cursor-copy">{provisionedCreds.pass}</code>
                      </div>
                   </div>
                   {/* Fix truthiness check on void return type by using a block statement instead of || */}
                   <button onClick={() => { setProvisionedCreds(null); setShowModal(false); }} className="w-full py-8 bg-indigo-600 text-white rounded-[2.25rem] font-black uppercase tracking-[0.3em] text-[12px] hover:bg-indigo-700 transition-all shadow-ultra shadow-indigo-100 flex items-center justify-center gap-3">
                     Synchronize Matrix Registry <Activity className="w-5 h-5" />
                   </button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};
