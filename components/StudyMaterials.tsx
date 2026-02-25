
import React, { useState } from 'react';
import { StudyMaterial, User, Student } from '../types';
import { Folder, Video, LinkIcon, FileText, Download, Plus, Search, X } from './Icons';

interface StudyMaterialsProps {
  schoolId: string;
  materials: StudyMaterial[];
  students: Student[];
  currentUser: User;
  onAddMaterial: (material: StudyMaterial) => void;
}

const StudyMaterials: React.FC<StudyMaterialsProps> = ({ schoolId, materials, students, currentUser, onAddMaterial }) => {
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newMaterial, setNewMaterial] = useState<Partial<StudyMaterial>>({
      type: 'PDF',
      targetClass: '10-A'
  });

  const isStaff = currentUser.role === 'Admin' || currentUser.role === 'Teacher';
  const isParent = currentUser.role === 'Parent';

  // Get unique classes
  const classes = Array.from(new Set(students.map(s => s.grade))).sort();

  // If parent, default to child's class
  React.useEffect(() => {
      if (isParent && currentUser.linkedStudentId) {
          const child = students.find(s => s.id === currentUser.linkedStudentId);
          if (child) setSelectedClass(child.grade);
      }
  }, [currentUser, isParent, students]);

  const filteredMaterials = materials.filter(m => {
      const matchesClass = selectedClass === 'All' || m.targetClass === selectedClass;
      const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || m.subject.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesClass && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (newMaterial.title && newMaterial.subject && (newMaterial.url || newMaterial.type)) {
          setIsUploading(true);
          
          // Simulate network delay for upload
          setTimeout(() => {
            onAddMaterial({
                id: `SM${Date.now()}`,
                schoolId: schoolId,
                title: newMaterial.title!,
                subject: newMaterial.subject!,
                targetClass: newMaterial.targetClass || '10-A',
                type: newMaterial.type || 'PDF',
                url: newMaterial.url || '#',
                uploadDate: new Date().toISOString().split('T')[0],
                uploadedBy: currentUser.name
            });
            setIsUploading(false);
            setShowAddModal(false);
            setNewMaterial({ type: 'PDF', targetClass: '10-A' });
          }, 1500);
      }
  };

  const simulateFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setNewMaterial({
                ...newMaterial,
                title: file.name,
                url: `blob:${file.name}`
            });
        }
    };
    input.click();
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <Folder className="w-8 h-8 text-indigo-600" /> Resource Hub
           </h2>
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Institutional Digital Library</p>
        </div>
        {isStaff && (
             <button 
                onClick={() => setShowAddModal(true)}
                className="bg-slate-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl flex items-center gap-2 transition-all shadow-xl font-black text-[10px] uppercase tracking-widest"
             >
                <Plus className="w-4 h-4" /> Upload New Asset
             </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-card flex flex-col xl:flex-row gap-4 sticky top-24 z-10">
         <div className="xl:w-48">
            <select 
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-slate-500 focus:ring-4 focus:ring-indigo-50 outline-none cursor-pointer"
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                disabled={isParent}
            >
                <option value="All">All Grades</option>
                {classes.map(c => <option key={c} value={c}>Grade {c}</option>)}
            </select>
         </div>
         <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
            <input 
                type="text" 
                placeholder="Search subject, topic or author..." 
                className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-bold text-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMaterials.map(item => (
              <div key={item.id} className="bg-white p-8 rounded-[2.5rem] shadow-card border border-slate-100 hover:border-indigo-200 hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner ${
                          item.type === 'Video' ? 'bg-rose-50 text-rose-500' :
                          item.type === 'PDF' ? 'bg-amber-50 text-amber-500' :
                          item.type === 'Link' ? 'bg-sky-50 text-sky-500' :
                          'bg-indigo-50 text-indigo-500'
                      }`}>
                          {item.type === 'Video' ? <Video className="w-8 h-8" /> :
                           item.type === 'PDF' ? <FileText className="w-8 h-8" /> :
                           item.type === 'Link' ? <LinkIcon className="w-8 h-8" /> :
                           <Folder className="w-8 h-8" />}
                      </div>
                      <span className="text-[9px] font-black uppercase bg-slate-100 text-slate-500 px-3 py-1 rounded-full border border-slate-100 tracking-widest">
                          {item.subject}
                      </span>
                  </div>
                  
                  <h3 className="font-black text-slate-800 text-xl mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
                      <span>Grade {item.targetClass}</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <span>{item.uploadDate}</span>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Author</p>
                        <p className="text-xs font-bold text-slate-700">{item.uploadedBy}</p>
                      </div>
                      <button 
                        onClick={() => alert(`Opening resource: ${item.title}`)}
                        className="px-6 py-3 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 border border-indigo-100"
                      >
                          {item.type === 'Video' ? 'Stream' : 'Fetch'} <Download className="w-4 h-4" />
                      </button>
                  </div>
              </div>
          ))}
      </div>

      {filteredMaterials.length === 0 && (
          <div className="p-20 text-center text-slate-300 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
             <Folder className="w-16 h-16 mx-auto mb-6 opacity-10" />
             <p className="font-black uppercase tracking-[0.4em] text-xs">No resources cataloged</p>
          </div>
      )}

      {/* --- UPLOAD MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
             <div className="p-10 pb-0 flex justify-between items-start shrink-0">
                <div>
                    <h3 className="text-3xl font-black text-slate-800 leading-tight">Asset<br/>Depository</h3>
                    <div className="w-12 h-1.5 bg-indigo-600 rounded-full mt-4"></div>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-rose-500 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
             </div>
             
             <div className="p-10 flex-1 overflow-y-auto custom-scrollbar">
                <form id="resource-form" onSubmit={handleAddSubmit} className="space-y-8">
                   <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Resource Name / Filename</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="e.g. Calculus Final Review"
                        className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-700 transition-all" 
                        value={newMaterial.title || ''} 
                        onChange={e => setNewMaterial({...newMaterial, title: e.target.value})} 
                      />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-6">
                      <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Core Subject</label>
                          <input 
                            required 
                            type="text" 
                            placeholder="e.g. Physics"
                            className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-700 transition-all" 
                            value={newMaterial.subject || ''} 
                            onChange={e => setNewMaterial({...newMaterial, subject: e.target.value})} 
                          />
                      </div>
                      <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Target Class</label>
                          <select 
                            className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-700 transition-all cursor-pointer" 
                            value={newMaterial.targetClass} 
                            onChange={e => setNewMaterial({...newMaterial, targetClass: e.target.value})}
                          >
                              {classes.map(c => <option key={c} value={c}>Grade {c}</option>)}
                          </select>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                       <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Asset Category</label>
                          <select 
                            className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-700 transition-all cursor-pointer" 
                            value={newMaterial.type} 
                            onChange={e => setNewMaterial({...newMaterial, type: e.target.value as any})}
                          >
                              <option value="PDF">PDF Artifact</option>
                              <option value="Video">Video Stream</option>
                              <option value="Link">Web Intelligence</option>
                              <option value="Doc">Working Doc</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Simulation</label>
                          <button 
                            type="button"
                            onClick={simulateFileSelect}
                            className="w-full py-5 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-dashed border-indigo-200 hover:bg-indigo-100 transition-all"
                          >
                            Browse Local Storage
                          </button>
                       </div>
                   </div>

                   <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Cloud Origin / Link</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="https://drive.google.com/..."
                        className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-700 transition-all" 
                        value={newMaterial.url || ''} 
                        onChange={e => setNewMaterial({...newMaterial, url: e.target.value})} 
                      />
                   </div>
                </form>
             </div>

             <div className="p-10 pt-0 shrink-0">
                <button 
                  type="submit" 
                  form="resource-form"
                  disabled={isUploading}
                  className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-slate-300 hover:bg-indigo-600 transition-all active:scale-[0.98] flex items-center justify-center gap-4"
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Broadcasting Artifact...
                    </>
                  ) : 'Commit to Global Hub'}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyMaterials;
