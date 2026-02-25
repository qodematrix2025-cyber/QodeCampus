
import React, { useState, useMemo } from 'react';
import { Student, AttendanceRecord, User } from '../types';
import { CalendarCheck, Search, Users, CheckCircle, X, Activity, Download, FileText } from './Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AllStudentAttendanceProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  currentUser: User;
}

const AllStudentAttendance: React.FC<AllStudentAttendanceProps> = ({ students, attendanceRecords, currentUser }) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'Logs' | 'Analytics'>('Logs');

  const grades = useMemo(() => {
    return Array.from(new Set(students.map(s => s.grade))).sort((a: string, b: string) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      if (numA === numB) return a.localeCompare(b);
      return numA - numB;
    });
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesGrade = selectedGrade === 'All' || s.grade === selectedGrade;
      const matchesSearch = s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            s.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesGrade && matchesSearch;
    });
  }, [students, selectedGrade, searchTerm]);

  const currentRecords = useMemo(() => {
    const map: Record<string, string> = {};
    attendanceRecords.filter(r => r.date === selectedDate).forEach(r => {
      if (r.studentId) map[r.studentId] = r.status;
    });
    return map;
  }, [attendanceRecords, selectedDate]);

  const analyticsData = useMemo(() => {
    return grades.map(grade => {
      const gradeStudents = students.filter(s => s.grade === grade);
      const avg = Math.round(gradeStudents.reduce((acc, s) => acc + s.attendancePct, 0) / (gradeStudents.length || 1));
      return { name: grade, attendance: avg };
    });
  }, [grades, students]);

  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    
    filteredStudents.forEach(s => {
      const status = currentRecords[s.id] || 'Not Marked';
      if (status === 'Present') present++;
      else if (status === 'Absent') absent++;
      else if (status === 'Late') late++;
    });

    const total = filteredStudents.length || 1;
    return {
      present,
      absent,
      late,
      notMarked: filteredStudents.length - (present + absent + late),
      percentage: Math.round((present / total) * 100)
    };
  }, [filteredStudents, currentRecords]);

  const handleExport = () => {
    const headers = "ID,Name,Grade,Status,Date\n";
    const rows = filteredStudents.map(s => {
      const status = currentRecords[s.id] || 'Not Marked';
      return `${s.id},${s.firstName} ${s.lastName},${s.grade},${status},${selectedDate}`;
    }).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Attendance_${selectedGrade}_${selectedDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <CalendarCheck className="w-8 h-8 text-indigo-600" /> Administrative Logs
          </h2>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Cross-Campus Attendance Registry</p>
        </div>
        <div className="flex gap-3 bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
           <button 
             onClick={() => setViewMode('Logs')}
             className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'Logs' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-indigo-600'}`}
           >
             Session Logs
           </button>
           <button 
             onClick={() => setViewMode('Analytics')}
             className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'Analytics' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-indigo-600'}`}
           >
             Audit Analytics
           </button>
        </div>
      </div>

      {viewMode === 'Analytics' ? (
        <div className="space-y-8 animate-in fade-in zoom-in-95">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-card border border-slate-100 flex flex-col h-[450px]">
                 <div className="flex justify-between items-center mb-10">
                    <div>
                       <h3 className="text-xl font-black text-slate-800">Class Performance Index</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Average Attendance by Grade</p>
                    </div>
                    <button className="p-3 bg-slate-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Download className="w-4 h-4" /></button>
                 </div>
                 <div className="flex-1 w-full relative">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                       <BarChart data={analyticsData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                          <YAxis hide domain={[0, 100]} />
                          <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 800 }} />
                          <Bar dataKey="attendance" radius={[10, 10, 0, 0]} barSize={40}>
                             {analyticsData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.attendance > 90 ? '#10b981' : entry.attendance > 80 ? '#6366f1' : '#f43f5e'} />
                             ))}
                          </Bar>
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-24 -mt-24"></div>
                 <h3 className="text-xl font-black mb-8 relative z-10">Audit Summary</h3>
                 <div className="space-y-8 relative z-10">
                    <div>
                       <p className="text-indigo-400 text-[9px] font-black uppercase tracking-widest mb-1">Global Institutional Avg</p>
                       <p className="text-5xl font-black">{Math.round(analyticsData.reduce((acc, d) => acc + d.attendance, 0) / (analyticsData.length || 1))}%</p>
                    </div>
                    <div className="pt-8 border-t border-white/10 space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active SMS Gateways</span>
                          <span className="text-xs font-black text-emerald-400">ENABLED</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reports Generated</span>
                          <span className="text-xs font-black">1,402</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Present Today', value: stats.present, icon: CheckCircle, color: 'emerald' },
              { label: 'Absent Count', value: stats.absent, icon: X, color: 'rose' },
              { label: 'Late Arrivals', value: stats.late, icon: Activity, color: 'amber' },
              { label: 'Daily Yield', value: `${stats.percentage}%`, icon: Users, color: 'indigo' }
            ].map(card => (
              <div key={card.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card flex items-center gap-5 group hover:shadow-xl transition-all">
                <div className={`w-12 h-12 bg-${card.color}-50 text-${card.color}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{card.label}</p>
                  <p className="text-2xl font-black text-slate-800 tracking-tight">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded-[2.5rem] border border-slate-200 shadow-card flex flex-col xl:flex-row gap-4">
            <div className="xl:w-48">
              <select 
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-slate-500 focus:ring-4 focus:ring-indigo-50 outline-none cursor-pointer"
                value={selectedGrade}
                onChange={e => setSelectedGrade(e.target.value)}
              >
                <option value="All">All Grades</option>
                {grades.map(g => <option key={g} value={g}>Grade {g}</option>)}
              </select>
            </div>
            <div className="xl:w-64">
              <input 
                type="date" 
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-slate-500 focus:ring-4 focus:ring-indigo-50 outline-none"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search scholars by ID or name..." 
                className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-bold text-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={handleExport} className="xl:w-40 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all">
               <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Scholar</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Class</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Log Status</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">SMS Alert</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Audit Stamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStudents.map(student => {
                    const status = currentRecords[student.id] || 'Not Marked';
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all uppercase">{student.firstName[0]}</div>
                              <div>
                                 <p className="font-black text-slate-800 leading-none">{student.firstName} {student.lastName}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{student.id}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-6 font-bold text-slate-600">{student.grade}</td>
                        <td className="px-10 py-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                            status === 'Present' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            status === 'Absent' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                            status === 'Late' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-slate-100 text-slate-300 border-slate-200'
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                           {status === 'Absent' && (
                             <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                                <CheckCircle className="w-3.5 h-3.5" /> Sent to Parent
                             </span>
                           )}
                           {status === 'Present' && <span className="text-slate-300 font-bold text-[9px] uppercase tracking-widest">N/A</span>}
                        </td>
                        <td className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {status !== 'Not Marked' ? selectedDate : '--:--:--'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredStudents.length === 0 && (
                <div className="p-20 text-center text-slate-400 flex flex-col items-center">
                  <FileText className="w-16 h-16 mb-4 opacity-10" />
                  <p className="font-black uppercase tracking-[0.3em] text-xs">No records found for query</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllStudentAttendance;
