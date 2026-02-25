
import React, { useState } from 'react';
import { Book, User, Student } from '../types';
import { Library as LibraryIcon, Search, Plus, BookOpen, CheckCircle, X, Users } from './Icons';

interface LibraryProps {
  schoolId: string;
  books: Book[];
  students: Student[];
  currentUser: User;
  onAddBook: (book: Book) => void;
  onIssueBook: (bookId: string, studentId: string) => void;
  onReturnBook: (bookId: string) => void;
}

const Library: React.FC<LibraryProps> = ({ schoolId, books, students, currentUser, onAddBook, onIssueBook, onReturnBook }) => {
  const [activeTab, setActiveTab] = useState<'Catalog' | 'Issued'>('Catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState<Book | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  // New Book State
  const [newBook, setNewBook] = useState<Partial<Book>>({
    status: 'Available',
    category: 'Fiction'
  });

  const isStaff = currentUser.role === 'Admin' || currentUser.role === 'Teacher';
  const isParent = currentUser.role === 'Parent';

  // Filter Logic
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'Issued') {
       if (isParent && currentUser.linkedStudentId) {
          return matchesSearch && book.issuedToStudentId === currentUser.linkedStudentId;
       }
       return matchesSearch && book.status === 'Issued';
    }
    
    return matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBook.title && newBook.author && newBook.isbn) {
        // Fix: Added missing schoolId property
        onAddBook({
            id: `LB${Date.now()}`,
            schoolId: schoolId,
            title: newBook.title,
            author: newBook.author,
            isbn: newBook.isbn,
            category: newBook.category || 'General',
            status: 'Available'
        });
        setShowAddModal(false);
        setNewBook({ status: 'Available', category: 'Fiction' });
    }
  };

  const handleIssueSubmit = () => {
      if (showIssueModal && selectedStudentId) {
          onIssueBook(showIssueModal.id, selectedStudentId);
          setShowIssueModal(null);
          setSelectedStudentId('');
      }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <LibraryIcon className="w-6 h-6 text-indigo-600" /> Library Management
           </h2>
           <p className="text-slate-500 text-sm">Manage book catalog, issues, and returns.</p>
        </div>
        
        {isStaff && (
          <button 
             onClick={() => setShowAddModal(true)}
             className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm text-sm font-medium"
          >
             <Plus className="w-4 h-4" /> Add Book
          </button>
        )}
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex gap-1">
           <button 
             onClick={() => setActiveTab('Catalog')}
             className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'Catalog' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
           >
             Book Catalog
           </button>
           <button 
             onClick={() => setActiveTab('Issued')}
             className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'Issued' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
           >
             {isParent ? 'My Child\'s Books' : 'Issued Books'}
           </button>
        </div>
        <div className="relative w-full sm:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
           <input 
             type="text" 
             placeholder="Search title, author..." 
             className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {filteredBooks.map(book => {
            const issuedStudent = book.issuedToStudentId ? students.find(s => s.id === book.issuedToStudentId) : null;
            
            return (
               <div key={book.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                  <div className={`h-32 w-full flex items-center justify-center relative ${
                      book.category === 'Science' ? 'bg-blue-100 text-blue-500' :
                      book.category === 'Mathematics' ? 'bg-emerald-100 text-emerald-500' :
                      book.category === 'History' ? 'bg-amber-100 text-amber-500' :
                      book.category === 'Fiction' ? 'bg-purple-100 text-purple-500' :
                      'bg-slate-100 text-slate-500'
                  }`}>
                      <BookOpen className="w-12 h-12" />
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide text-slate-600 shadow-sm">
                          {book.category}
                      </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-slate-800 line-clamp-1" title={book.title}>{book.title}</h3>
                      <p className="text-sm text-slate-500 mb-4">{book.author}</p>
                      
                      <div className="mt-auto space-y-3">
                          <div className="flex justify-between items-center text-xs">
                             <span className="text-slate-400">ISBN: {book.isbn}</span>
                             <span className={`px-2 py-0.5 rounded font-bold ${
                                 book.status === 'Available' ? 'bg-green-100 text-green-700' : 
                                 book.status === 'Issued' ? 'bg-orange-100 text-orange-700' :
                                 'bg-red-100 text-red-700'
                             }`}>{book.status}</span>
                          </div>

                          {book.status === 'Issued' && issuedStudent && (
                              <div className="bg-slate-50 p-2 rounded border border-slate-100 text-xs">
                                  <span className="block text-slate-400 uppercase font-bold text-[10px]">Issued To</span>
                                  <span className="font-semibold text-slate-700">{issuedStudent.firstName} {issuedStudent.lastName}</span>
                                  {book.dueDate && <span className="block text-red-500 mt-1">Due: {book.dueDate}</span>}
                              </div>
                          )}

                          {isStaff && (
                              <div className="pt-3 border-t border-slate-100">
                                  {book.status === 'Available' ? (
                                      <button 
                                        onClick={() => setShowIssueModal(book)}
                                        className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                      >
                                          Issue Book
                                      </button>
                                  ) : book.status === 'Issued' ? (
                                      <button 
                                        onClick={() => onReturnBook(book.id)}
                                        className="w-full py-2 bg-white border border-indigo-200 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors"
                                      >
                                          Return Book
                                      </button>
                                  ) : (
                                      <span className="block text-center text-xs text-red-400 italic">Reported Lost</span>
                                  )}
                              </div>
                          )}
                      </div>
                  </div>
               </div>
            );
         })}
      </div>
      
      {filteredBooks.length === 0 && (
          <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
             <LibraryIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
             <p>No books found matching your criteria.</p>
          </div>
      )}

      {/* --- ADD BOOK MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
             <div className="p-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-t-2xl flex justify-between items-center shadow-md">
                <h3 className="text-lg font-bold flex items-center gap-2"><Plus className="w-5 h-5"/> Add New Book</h3>
                <button onClick={() => setShowAddModal(false)} className="bg-white/10 p-1.5 rounded-full hover:bg-white/20"><X className="w-5 h-5"/></button>
             </div>
             <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Book Title</label>
                    <input required type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={newBook.title || ''} onChange={e => setNewBook({...newBook, title: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Author</label>
                    <input required type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={newBook.author || ''} onChange={e => setNewBook({...newBook, author: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">ISBN</label>
                        <input required type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={newBook.isbn || ''} onChange={e => setNewBook({...newBook, isbn: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                        <select className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white" value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})}>
                            <option value="Fiction">Fiction</option>
                            <option value="Science">Science</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="History">History</option>
                            <option value="Biography">Biography</option>
                            <option value="General">General</option>
                        </select>
                     </div>
                 </div>
                 <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-lg shadow-lg shadow-indigo-200 mt-2">Add to Catalog</button>
             </form>
          </div>
        </div>
      )}

      {/* --- ISSUE BOOK MODAL --- */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
              <div className="p-6 bg-slate-50 border-b border-slate-100 rounded-t-2xl flex justify-between items-center">
                  <div>
                      <h3 className="font-bold text-slate-800">Issue Book</h3>
                      <p className="text-xs text-slate-500">{showIssueModal.title}</p>
                  </div>
                  <button onClick={() => setShowIssueModal(null)}><X className="w-5 h-5 text-slate-400"/></button>
              </div>
              <div className="p-6 space-y-4">
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Select Student</label>
                      <select 
                        className="w-full p-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={selectedStudentId}
                        onChange={e => setSelectedStudentId(e.target.value)}
                      >
                          <option value="">-- Choose Student --</option>
                          {students.map(s => (
                              <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.grade})</option>
                          ))}
                      </select>
                  </div>
                  <button 
                    disabled={!selectedStudentId}
                    onClick={handleIssueSubmit}
                    className="w-full py-3 bg-indigo-600 disabled:bg-slate-300 text-white font-bold rounded-lg shadow-lg shadow-indigo-200 transition-colors"
                  >
                      Confirm Issue
                  </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Library;
