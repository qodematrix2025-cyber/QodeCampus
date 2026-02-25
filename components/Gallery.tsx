
import React, { useState } from 'react';
import { GalleryItem, User } from '../types';
import { Image, Search, Plus, X } from './Icons';

interface GalleryProps {
  schoolId: string;
  items: GalleryItem[];
  currentUser: User;
  onAddItem: (item: GalleryItem) => void;
}

const Gallery: React.FC<GalleryProps> = ({ schoolId, items, currentUser, onAddItem }) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Sports' | 'Cultural' | 'Academic' | 'Campus'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<GalleryItem>>({ category: 'Campus' });
  const [viewItem, setViewItem] = useState<GalleryItem | null>(null);

  const isStaff = currentUser.role === 'Admin' || currentUser.role === 'Teacher';

  const filteredItems = items.filter(item => activeCategory === 'All' || item.category === activeCategory);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.title && newItem.imageUrl) {
      // Fix: Added missing schoolId property
      onAddItem({
        id: `G${Date.now()}`,
        schoolId: schoolId,
        title: newItem.title,
        date: new Date().toISOString().split('T')[0],
        category: newItem.category || 'Campus',
        imageUrl: newItem.imageUrl,
        description: newItem.description || ''
      });
      setShowAddModal(false);
      setNewItem({ category: 'Campus' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Image className="w-6 h-6 text-indigo-600" /> School Gallery & Events
          </h2>
          <p className="text-slate-500 text-sm">Highlights, memories, and celebrations of school life.</p>
        </div>
        {isStaff && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Photo
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Sports', 'Cultural', 'Academic', 'Campus'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as any)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
              activeCategory === cat 
                ? 'bg-slate-900 text-white border-slate-900' 
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Grid Simulation */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredItems.map(item => (
          <div 
            key={item.id} 
            className="break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 group cursor-pointer"
            onClick={() => setViewItem(item)}
          >
            <div className="relative overflow-hidden">
               <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white text-sm font-medium">View Details</p>
               </div>
               <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide text-slate-800">
                 {item.category}
               </span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-slate-800 text-lg mb-1">{item.title}</h3>
              <p className="text-xs text-slate-400 mb-2">{item.date}</p>
              <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
         <div className="text-center py-12 text-slate-400">
            <Image className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No photos found in this category.</p>
         </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
              <div className="p-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-t-2xl flex justify-between items-center">
                 <h3 className="text-lg font-bold">Add to Gallery</h3>
                 <button onClick={() => setShowAddModal(false)} className="bg-white/10 p-1.5 rounded-full hover:bg-white/20"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Event Title</label>
                    <input required type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={newItem.title || ''} onChange={e => setNewItem({...newItem, title: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Image URL</label>
                    <input required type="text" placeholder="https://..." className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={newItem.imageUrl || ''} onChange={e => setNewItem({...newItem, imageUrl: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                        <select className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value as any})}>
                            <option value="Campus">Campus Life</option>
                            <option value="Sports">Sports</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Academic">Academic</option>
                        </select>
                     </div>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                    <textarea className="w-full p-2 border border-slate-200 rounded-lg text-sm h-20 resize-none" value={newItem.description || ''} onChange={e => setNewItem({...newItem, description: e.target.value})}></textarea>
                 </div>
                 <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-lg shadow-lg shadow-indigo-200 mt-2">Upload Photo</button>
              </form>
           </div>
        </div>
      )}

      {/* View Item Modal */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setViewItem(null)}>
           <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
               <div className="flex-1 bg-black flex items-center justify-center">
                  <img src={viewItem.imageUrl} alt={viewItem.title} className="max-h-[60vh] md:max-h-[80vh] w-auto object-contain" />
               </div>
               <div className="w-full md:w-80 bg-white p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{viewItem.category}</span>
                        <h2 className="text-2xl font-bold text-slate-800 mt-1">{viewItem.title}</h2>
                        <p className="text-xs text-slate-400">{viewItem.date}</p>
                     </div>
                     <button onClick={() => setViewItem(null)} className="md:hidden"><X className="w-6 h-6"/></button>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed flex-1 overflow-y-auto">{viewItem.description}</p>
                  <button onClick={() => setViewItem(null)} className="mt-6 w-full py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors">Close</button>
               </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
