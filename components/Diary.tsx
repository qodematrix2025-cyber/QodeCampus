
import React, { useState } from 'react';
import { DiaryEntry, User, Student } from '../types';
import { BookOpen, Calendar, Plus, Search, Users, X } from './Icons';

interface DiaryProps {
  schoolId: string;
  entries: DiaryEntry[];
  students: Student[];
  currentUser: User;
  onAddEntry: (entry: DiaryEntry) => void;
}

const Diary: React.FC<DiaryProps> = ({ schoolId, entries, students, currentUser, onAddEntry }) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Homework' | 'Notice' | 'Event' | 'Remark'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique grades for the dropdown and sort numerically
  const grades = Array.from(new Set(students.map(s => s.grade)));
  grades.sort((a: string, b: string) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      if (numA === numB) return a.localeCompare(b);
      return numA - numB;
  });

  // New Entry State
  const [newEntry, setNewEntry] = useState<Partial<DiaryEntry>>({
    type: 'Homework',
    date: new Date().toISOString().split('T')[0],
    targetType: 'Class',
    targetValue: grades[0] || '10-A'
  });

  // Filter Logic based on User Role
  const filteredEntries = entries.filter(entry => {
    // 1. Text Search Filter
    const matchesSearch = 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Tab Filter
    const matchesTab = activeTab === 'All' || entry.type === activeTab;

    // 3. Role-Based Access Control
    let matchesRole = true;
    if (currentUser.role === 'Parent' && currentUser.linkedStudentId) {
      // Find the student linked to this parent
      const child = students.find(s => s.id === currentUser.linkedStudentId);
      if (child) {
        // Parent sees: Class-wide entries for child's grade OR Specific entries for child ID
        const isForChildClass = entry.targetType === 'Class' && entry.targetValue === child.grade;
        const isForChildDirectly = entry.targetType === 'Student' && entry.targetValue === child.id;
        matchesRole = isForChildClass || isForChildDirectly;
      } else {
        matchesRole = false;
      }
    }
    // Teachers/Admins see everything (or we could restrict Teachers to their assigned classes, but let's keep it open for demo)
    
    return matchesSearch && matchesTab && matchesRole;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEntry.title && newEntry.description && newEntry.targetValue) {
      // Fix: Added missing schoolId property
      onAddEntry({
        id: `D${Date.now()}`,
        schoolId: schoolId,
        title: newEntry.title,
        description: newEntry.description,
        type: newEntry.type as any,
        date: newEntry.date || '',
        subject: newEntry.subject,
        dueDate: newEntry.dueDate,
        postedBy: currentUser.name,
        targetType: newEntry.targetType as any,
        targetValue: newEntry.targetValue
      });
      setShowAddModal(false);
      // Reset form
      setNewEntry({ 
        type: 'Homework', 
        date: new Date().toISOString().split('T')[0],
        targetType: 'Class',
        targetValue: grades[0]
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {currentUser.role === 'Parent' ? 'My Child\'s Diary' : 'School Diary & Notices'}
          </h2>
          <p className="text-slate-500 text-sm">
            {currentUser.role === 'Parent' ? 'View homework and remarks for your child' : 'Manage homework, notices, and events'}
          </p>
        </div>
        
        {/* Only Staff can add entries */}
        {currentUser.role !== 'Parent' && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            New Entry
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
         {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {['All', 'Homework', 'Notice', 'Event', 'Remark'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Search */}
        <div className="relative w-full sm:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
           <input 
             type="text" 
             placeholder="Search entries..." 
             className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntries.map((entry) => {
          // Resolve target name for display (e.g. "S001" -> "Alice Johnson")
          let targetDisplay = entry.targetValue;
          if (entry.targetType === 'Student') {
            const s = students.find(st => st.id === entry.targetValue);
            if (s) targetDisplay = `${s.firstName} ${s.lastName}`;
          }

          return (
            <div key={entry.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
              {/* Type Stripe */}
              <div className={`absolute top-0 left-0 w-1 h-full ${
                 entry.type === 'Homework' ? 'bg-blue-500' :
                 entry.type === 'Notice' ? 'bg-orange-500' :
                 entry.type === 'Remark' ? 'bg-green-500' :
                 'bg-purple-500'
              }`}></div>

              <div className="flex justify-between items-start mb-3 pl-2">
                <span className={`px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${
                  entry.type === 'Homework' ? 'bg-blue-100 text-blue-700' :
                  entry.type === 'Notice' ? 'bg-orange-100 text-orange-700' :
                  entry.type === 'Remark' ? 'bg-green-100 text-green-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {entry.type}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {entry.date}
                </span>
              </div>
              
              <div className="pl-2 flex-1">
                <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-indigo-600 transition-colors">{entry.title}</h3>
                
                {/* Target Badge */}
                {currentUser.role !== 'Parent' && (
                  <div className="mb-2">
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                      To: {entry.targetType === 'Class' ? `Class ${targetDisplay}` : targetDisplay}
                    </span>
                  </div>
                )}

                <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {entry.description}
                </p>
              </div>
              
              <div className="pl-2 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1 mt-auto">
                {entry.subject && (
                  <p className="flex justify-between">
                    <span>Subject:</span> <span className="font-medium text-slate-700">{entry.subject}</span>
                  </p>
                )}
                {entry.dueDate && (
                  <p className="flex justify-between text-red-500">
                    <span>Due Date:</span> <span className="font-medium">{entry.dueDate}</span>
                  </p>
                )}
                <p className="flex justify-between mt-2 pt-1">
                  <span>Posted By:</span> <span className="italic">{entry.postedBy}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredEntries.length === 0 && (
         <div className="text-center py-12 text-slate-400">
           <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
           <p>No entries found.</p>
         </div>
      )}

      {/* Add Entry Modal (Staff Only) */}
      {showAddModal && currentUser.role !== 'Parent' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="p-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-t-2xl flex justify-between items-center shadow-md">
               <div className="flex items-center gap-3">
                 <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <BookOpen className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold">New Entry</h3>
                    <p className="text-indigo-100 text-xs opacity-90">Post homework, notice, or event.</p>
                 </div>
               </div>
              <button onClick={() => setShowAddModal(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              <form id="diary-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Entry Type</label>
                    <select 
                      className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={newEntry.type}
                      onChange={(e) => setNewEntry({...newEntry, type: e.target.value as any})}
                    >
                      <option value="Homework">Homework</option>
                      <option value="Notice">Notice</option>
                      <option value="Event">Event</option>
                      <option value="Remark">Remark (Private)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Target Audience</label>
                    <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setNewEntry({...newEntry, targetType: 'Class', targetValue: grades[0]})}
                        className={`flex-1 text-xs py-2 rounded-md font-bold transition-all ${newEntry.targetType === 'Class' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Class
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewEntry({...newEntry, targetType: 'Student', targetValue: students[0]?.id})}
                        className={`flex-1 text-xs py-2 rounded-md font-bold transition-all ${newEntry.targetType === 'Student' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Student
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dynamic Target Selector */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {newEntry.targetType === 'Class' ? 'Select Class' : 'Select Student'}
                  </label>
                  {newEntry.targetType === 'Class' ? (
                    <select 
                      className="w-full p-3 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={newEntry.targetValue}
                      onChange={(e) => setNewEntry({...newEntry, targetValue: e.target.value})}
                    >
                      {grades.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  ) : (
                    <select 
                      className="w-full p-3 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={newEntry.targetValue}
                      onChange={(e) => setNewEntry({...newEntry, targetValue: e.target.value})}
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.grade})</option>
                      ))}
                    </select>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full p-3 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                    value={newEntry.title || ''}
                    onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                    placeholder="Enter a descriptive title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                  <textarea 
                    required 
                    className="w-full p-3 border border-slate-200 bg-slate-50 rounded-lg h-24 resize-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                    value={newEntry.description || ''}
                    onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                    placeholder="Detailed information..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {newEntry.type === 'Homework' && (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                      <input 
                        type="text" 
                        className="w-full p-3 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={newEntry.subject || ''}
                        onChange={(e) => setNewEntry({...newEntry, subject: e.target.value})}
                      />
                    </div>
                  )}
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">
                       {newEntry.type === 'Homework' ? 'Due Date' : 'Date'}
                     </label>
                     <input 
                        type="date" 
                        className="w-full p-3 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-600"
                        value={newEntry.dueDate || newEntry.date || ''}
                        onChange={(e) => newEntry.type === 'Homework' ? setNewEntry({...newEntry, dueDate: e.target.value}) : setNewEntry({...newEntry, date: e.target.value})}
                     />
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
               <button 
                 onClick={() => setShowAddModal(false)}
                 className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-white transition-colors"
               >
                 Cancel
               </button>
               <button 
                 type="submit" 
                 form="diary-form"
                 className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors"
               >
                 Post Entry
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Diary;
