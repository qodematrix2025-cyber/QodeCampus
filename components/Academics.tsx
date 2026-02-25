
import React, { useState } from 'react';
import { ExamSchedule, ReportCard, Student, User, AttendanceRecord } from '../types';
import { Calendar, ClipboardList, Download, FileText, Plus, X, CheckCircle, Navigation, Send, Trash2, CalendarCheck, Users } from './Icons';

interface AcademicsProps {
  schoolId: string;
  students: Student[];
  currentUser: User;
  examSchedules: ExamSchedule[];
  reportCards: ReportCard[];
  attendanceRecords: AttendanceRecord[];
  onAddSchedule: (schedule: ExamSchedule) => void;
  onUpdateSchedule?: (schedule: ExamSchedule) => void;
  onDeleteSchedule?: (id: string) => void;
  onAddReportCard: (report: ReportCard) => void;
  onUpdateReportCard?: (report: ReportCard) => void;
  onDeleteReportCard?: (id: string) => void;
  onBulkAddReportCards?: (reports: ReportCard[]) => void;
}

const Academics: React.FC<AcademicsProps> = ({ schoolId, students, currentUser, examSchedules, reportCards, attendanceRecords, onAddSchedule, onUpdateSchedule, onDeleteSchedule, onAddReportCard, onUpdateReportCard, onDeleteReportCard, onBulkAddReportCards }) => {
  const [activeTab, setActiveTab] = useState<'DateSheets' | 'ReportCards'>('DateSheets');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [viewReport, setViewReport] = useState<ReportCard | null>(null);
  
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkConfig, setBulkConfig] = useState({
      classGrade: '10-A',
      examTitle: '',
      academicYear: '2025-2026'
  });

  const isParent = currentUser.role === 'Parent';

  const [newSchedule, setNewSchedule] = useState<Partial<ExamSchedule>>({
    classGrade: '10-A',
    subjects: [{ subject: '', date: '', time: '' }],
    status: 'Draft'
  });

  const [newReport, setNewReport] = useState<Partial<ReportCard>>({
    academicYear: '2025-2026',
    grades: [
      { subject: 'Mathematics', marksObtained: 0, maxMarks: 100, grade: '' },
      { subject: 'Science', marksObtained: 0, maxMarks: 100, grade: '' }
    ],
    status: 'Published'
  });

  const grades = Array.from(new Set(students.map(s => s.grade))).sort();

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReport.studentId && newReport.examTitle && newReport.grades) {
      const totalMarks = newReport.grades.reduce((acc, g) => acc + Number(g.marksObtained), 0);
      const maxMarks = newReport.grades.reduce((acc, g) => acc + Number(g.maxMarks), 0);
      const pct = parseFloat(((totalMarks / maxMarks) * 100).toFixed(2));

      onAddReportCard({
        id: `RC-${Date.now()}`,
        schoolId: schoolId,
        studentId: newReport.studentId,
        examTitle: newReport.examTitle,
        academicYear: newReport.academicYear || '2025-2026',
        issueDate: new Date().toISOString().split('T')[0],
        remarks: newReport.remarks || 'Satisfactory progress.',
        grades: newReport.grades,
        percentage: pct,
        status: 'Published'
      });
      setShowReportModal(false);
      setNewReport({
        academicYear: '2025-2026',
        grades: [{ subject: 'Mathematics', marksObtained: 0, maxMarks: 100, grade: '' }],
        status: 'Published'
      });
    }
  };

  const addSubjectRow = () => {
    setNewReport({
      ...newReport,
      grades: [...(newReport.grades || []), { subject: '', marksObtained: 0, maxMarks: 100, grade: '' }]
    });
  };

  return (
    <div className="space-y-6 animate-reveal">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Academic Hub</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Matrix Performance Index</p>
        </div>
      </div>

      <div className="flex gap-1 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit">
        <button onClick={() => setActiveTab('DateSheets')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'DateSheets' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-indigo-600'}`}>Schedules</button>
        <button onClick={() => setActiveTab('ReportCards')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ReportCards' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-indigo-600'}`}>Report Matrix</button>
      </div>

      {activeTab === 'DateSheets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {!isParent && (
             <button onClick={() => setShowScheduleModal(true)} className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center text-slate-300 hover:border-indigo-300 hover:text-indigo-500 transition-all group">
                <Plus className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
                <span className="font-black text-[10px] uppercase tracking-widest">New Date Sheet</span>
             </button>
           )}
           {examSchedules.map(s => (
             <div key={s.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-indigo-200 transition-all">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner"><Calendar className="w-6 h-6" /></div>
                   <span className="text-[8px] font-black uppercase px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg">{s.classGrade}</span>
                </div>
                <h3 className="font-black text-slate-800 text-lg leading-tight mb-2">{s.title}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Published: {s.publishDate}</p>
                <button className="w-full py-3 bg-slate-50 text-slate-500 rounded-xl font-black text-[9px] uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all">Download Matrix</button>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'ReportCards' && (
        <div className="space-y-6">
          {!isParent && (
            <div className="flex justify-end gap-3">
              <button className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Bulk Sync</button>
              <button onClick={() => setShowReportModal(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Issue Report Card</button>
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                   <tr>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Scholar</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Assessment</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Performance</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {reportCards.map(rc => (
                     <tr key={rc.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                           <p className="font-black text-slate-800">{students.find(s => s.id === rc.studentId)?.firstName || rc.studentId}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase">{rc.studentId}</p>
                        </td>
                        <td className="px-8 py-6">
                           <p className="font-bold text-slate-700">{rc.examTitle}</p>
                           <p className="text-[9px] text-indigo-500 font-black uppercase">{rc.academicYear}</p>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                              <span className="text-lg font-black text-slate-800">{rc.percentage}%</span>
                              <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{width: `${rc.percentage}%`}}></div></div>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button onClick={() => setViewReport(rc)} className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Navigation className="w-4 h-4" /></button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {/* ARTIFACT VIEWER MODAL */}
      {viewReport && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[150] flex items-center justify-center p-8 overflow-y-auto">
          <div className="bg-white rounded-[4rem] w-full max-w-2xl shadow-ultra animate-in zoom-in-95 flex flex-col max-h-[90vh] overflow-hidden border border-white/20">
             <div className="p-12 pb-0 flex justify-between items-start">
                <div>
                   <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Official Artifact</span>
                   <h3 className="text-4xl font-black text-slate-900 tracking-tighter mt-2">{viewReport.examTitle}</h3>
                </div>
                <button onClick={() => setViewReport(null)} className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all"><X className="w-8 h-8"/></button>
             </div>
             <div className="p-12 overflow-y-auto custom-scrollbar flex-1">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 mb-10">
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Scholar Identity</p>
                         <p className="text-xl font-black text-slate-800">{students.find(s => s.id === viewReport.studentId)?.firstName} {students.find(s => s.id === viewReport.studentId)?.lastName}</p>
                         <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">ID: {viewReport.studentId}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Aggregate Yield</p>
                         <p className="text-5xl font-black text-indigo-600 tracking-tighter">{viewReport.percentage}%</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Subject Breakdown</p>
                   {viewReport.grades.map((g, idx) => (
                      <div key={idx} className="flex justify-between items-center p-5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 transition-all group">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-black text-indigo-600 text-xs">{g.grade || 'A'}</div>
                            <span className="font-bold text-slate-700">{g.subject}</span>
                         </div>
                         <div className="text-right">
                            <span className="font-black text-slate-800">{g.marksObtained}</span>
                            <span className="text-slate-300 font-bold ml-1">/ {g.maxMarks}</span>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="mt-12 p-8 bg-indigo-600 rounded-[2.5rem] text-white">
                   <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2">Institutional Remarks</p>
                   <p className="text-lg font-medium italic">"{viewReport.remarks}"</p>
                </div>
             </div>
             <div className="p-12 pt-0">
                <button className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all">
                  <Download className="w-5 h-5" /> Download Digital Certificate
                </button>
             </div>
          </div>
        </div>
      )}

      {/* ISSUE REPORT CARD MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[120] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-ultra animate-in zoom-in-95 flex flex-col max-h-[90vh] overflow-hidden border border-white/20">
             <div className="p-10 pb-0 flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-black text-slate-800 leading-tight">Issue Performance Artifact</h3>
                  <div className="w-12 h-1.5 bg-indigo-600 rounded-full mt-4"></div>
                </div>
                <button onClick={() => setShowReportModal(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-rose-500 transition-all"><X className="w-6 h-6" /></button>
             </div>
             
             <div className="p-10 overflow-y-auto custom-scrollbar flex-1">
                <form id="report-form" onSubmit={handleReportSubmit} className="space-y-8">
                   <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Select Scholar</label>
                        <select required className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-50" value={newReport.studentId || ''} onChange={e => setNewReport({...newReport, studentId: e.target.value})}>
                           <option value="">-- Choose Student --</option>
                           {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.grade})</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Exam Cycle</label>
                        <input required type="text" placeholder="e.g. Mid-Term 2025" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-50" value={newReport.examTitle || ''} onChange={e => setNewReport({...newReport, examTitle: e.target.value})} />
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Subject Scorer</label>
                        <button type="button" onClick={addSubjectRow} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">+ Add Row</button>
                      </div>
                      {newReport.grades?.map((g, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-3 items-center animate-reveal">
                           <div className="col-span-6"><input placeholder="Subject" className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold" value={g.subject} onChange={e => {
                             const n = [...newReport.grades!]; n[idx].subject = e.target.value; setNewReport({...newReport, grades: n});
                           }} /></div>
                           <div className="col-span-3"><input type="number" placeholder="Marks" className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold" value={g.marksObtained} onChange={e => {
                             const n = [...newReport.grades!]; n[idx].marksObtained = Number(e.target.value); setNewReport({...newReport, grades: n});
                           }} /></div>
                           <div className="col-span-2"><input placeholder="Gr." className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold" value={g.grade} onChange={e => {
                             const n = [...newReport.grades!]; n[idx].grade = e.target.value; setNewReport({...newReport, grades: n});
                           }} /></div>
                           <div className="col-span-1 text-center"><button type="button" onClick={() => { const n = newReport.grades!.filter((_, i) => i !== idx); setNewReport({...newReport, grades: n}) }} className="text-rose-400 hover:text-rose-600"><X className="w-4 h-4" /></button></div>
                        </div>
                      ))}
                   </div>

                   <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Teacher Remarks</label>
                      <textarea className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-50 h-24 resize-none" value={newReport.remarks || ''} onChange={e => setNewReport({...newReport, remarks: e.target.value})}></textarea>
                   </div>
                </form>
             </div>
             
             <div className="p-10 pt-0">
                <button type="submit" form="report-form" className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-indigo-600 transition-all">Broadcast to Parent Vault</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Academics;
