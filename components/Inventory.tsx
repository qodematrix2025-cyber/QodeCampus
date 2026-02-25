
import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { SearchIcon, SettingsIcon, PlusIcon, Activity, CheckCircle, Trash2, Download, X } from './Icons';
import { MOCK_INVENTORY } from '../constants';

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({ category: 'Electronics', quantity: 1, status: 'In Stock' });

  const categories = ['All', 'Electronics', 'Furniture', 'Science', 'Sports'];

  const filtered = items.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || i.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.name && newItem.category && newItem.quantity) {
      const added: InventoryItem = {
        id: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
        schoolId: 'LOCAL-001',
        name: newItem.name,
        category: newItem.category,
        quantity: Number(newItem.quantity),
        status: newItem.status as any || 'In Stock',
        lastChecked: new Date().toISOString().split('T')[0]
      };
      setItems(prev => [added, ...prev]);
      setShowAddModal(false);
      setNewItem({ category: 'Electronics', quantity: 1, status: 'In Stock' });
    }
  };

  return (
    <div className="space-y-10 animate-reveal pb-20">
      {/* Asset Matrix Hero */}
      <div className="bg-slate-900 p-10 lg:p-14 rounded-[4rem] text-white relative overflow-hidden shadow-ultra border border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none"></div>
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-[0.5em] mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow-emerald animate-pulse"></span>
              Operational Axis
            </div>
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none mb-6">Asset Registry</h2>
            <p className="text-slate-400 text-lg font-medium max-w-xl opacity-80 leading-relaxed">
              Monitoring institutional capital and high-value hardware nodes across the campus ecosystem.
            </p>
            <div className="mt-10 flex gap-4">
               <button onClick={() => setShowAddModal(true)} className="px-10 py-5 bg-indigo-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-3">
                 <PlusIcon className="w-4 h-4" /> Provision New Asset
               </button>
               <button className="px-10 py-5 bg-white/5 backdrop-blur text-white rounded-3xl font-black text-[10px] uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3">
                 <Download className="w-4 h-4" /> Export Ledger
               </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             {[
               { l: 'Net Asset Value', v: `₹${(items.length * 1.2).toFixed(1)}L`, i: Activity, c: 'indigo' },
               { l: 'Maintenance Load', v: '12 Nodes', i: SettingsIcon, c: 'amber' },
               { l: 'Critical Stock', v: `${items.filter(i => i.status === 'Low Stock').length} Items`, i: Trash2, c: 'rose' },
               { l: 'Registry Health', v: '99.4%', i: CheckCircle, c: 'emerald' }
             ].map(stat => (
               <div key={stat.l} className="p-8 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 group hover:bg-white/10 transition-all border-indigo-500/20">
                  <p className={`text-[9px] font-black uppercase tracking-widest mb-3 opacity-60 text-${stat.c}-400`}>{stat.l}</p>
                  <p className="text-4xl font-black tracking-tighter">{stat.v}</p>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Control Axis */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
        <div className="flex gap-2 bg-white p-2 rounded-full border border-slate-100 shadow-sm overflow-x-auto w-full xl:w-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-slate-900 text-white shadow-xl' 
                  : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative group w-full xl:w-96">
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors w-5 h-5" />
          <input 
            type="text" 
            placeholder="Query Registry..." 
            className="w-full pl-14 pr-6 py-4 rounded-[2rem] bg-white border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-bold text-sm shadow-inner-soft"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-[3.5rem] p-8 lg:p-10 shadow-premium border border-slate-50 flex flex-col group hover-scale active-scale card-glow-indigo overflow-hidden">
            <div className="flex justify-between items-start mb-10">
              <div className="w-16 h-16 bg-slate-50 rounded-[1.75rem] flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner">
                <SettingsIcon className="w-8 h-8" />
              </div>
              <div className="text-right">
                <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  item.status === 'Low Stock' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                  'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {item.status}
                </span>
                <p className="text-[9px] font-black text-slate-400 uppercase mt-3 tracking-widest">ID: {item.id}</p>
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2 group-hover:text-indigo-600 transition-colors">{item.name}</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">{item.category}</p>
            
            <div className="space-y-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
               <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Node Count</span>
                  <span className="text-lg font-black text-slate-800">{item.quantity} units</span>
               </div>
               <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full ${item.quantity > 50 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{width: `${Math.min(100, item.quantity)}%`}}></div>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Last Audit</span>
                  <span className="text-xs font-bold text-slate-600">{item.lastChecked}</span>
               </div>
            </div>

            <div className="mt-auto pt-8 flex gap-3">
               <button className="flex-1 py-5 bg-slate-900 text-white rounded-[1.75rem] font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active-scale">
                 Dispatch Node
               </button>
               <button className="px-6 py-5 bg-slate-50 text-slate-400 rounded-[1.75rem] hover:bg-slate-100 transition-all border border-slate-100">
                  <Activity className="w-5 h-5" />
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* PROVISION ASSET MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[130] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[3.5rem] w-full max-w-xl shadow-ultra animate-in zoom-in-95 flex flex-col max-h-[90vh] border border-white/20 overflow-hidden">
             <div className="p-12 pb-0 flex justify-between items-start">
                <div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Provision Node</h3>
                  <div className="w-12 h-1 bg-indigo-600 rounded-full mt-4"></div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm"><X className="w-8 h-8"/></button>
             </div>
             
             <div className="p-12 overflow-y-auto custom-scrollbar flex-1">
                <form id="asset-form" onSubmit={handleAddSubmit} className="space-y-10">
                   <div>
                      <label className="block text-[11px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em] ml-1">Asset Identity</label>
                      <input required autoFocus className="w-full p-6 bg-slate-50 rounded-[2rem] border-none font-bold text-lg outline-none focus:ring-8 focus:ring-indigo-50 transition-all" placeholder="e.g. Dell Precision 3000" value={newItem.name || ''} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em] ml-1">Category Axis</label>
                        <select className="w-full p-6 bg-slate-50 rounded-[2rem] border-none font-bold outline-none focus:ring-8 focus:ring-indigo-50 transition-all cursor-pointer" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                           {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em] ml-1">Init Quantity</label>
                        <input type="number" required className="w-full p-6 bg-slate-50 rounded-[2rem] border-none font-bold outline-none focus:ring-8 focus:ring-indigo-50 transition-all" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: Number(e.target.value)})} />
                      </div>
                   </div>
                </form>
             </div>
             <div className="p-12 pt-0">
                <button type="submit" form="asset-form" className="w-full py-7 bg-slate-950 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-[11px] shadow-ultra hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-4">
                  <CheckCircle className="w-6 h-6" /> Commit to Asset Registry
                </button>
             </div>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="py-40 text-center opacity-30 flex flex-col items-center">
           <div className="w-24 h-24 bg-white rounded-[3rem] shadow-premium flex items-center justify-center mb-8">
              <SettingsIcon className="w-12 h-12 text-slate-200" />
           </div>
           <p className="font-black uppercase tracking-[0.5em] text-xs">Registry Vacuum Detected</p>
        </div>
      )}
    </div>
  );
};

export default Inventory;
