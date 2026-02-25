
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Student, AttendanceRecord } from '../types';
import { FileText, CalendarCheck } from './Icons';

interface ReportsProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
}

const Reports: React.FC<ReportsProps> = ({ students, attendanceRecords }) => {
  const [activeTab, setActiveTab] = useState<'Monthly' | 'Annual'>('Monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // --- Calculations for Reports ---

  // 1. Monthly Attendance per Grade
  const getMonthlyAttendanceData = () => {
    const gradeStats: Record<string, { present: number, total: number }> = {};
    
    students.forEach(s => {
      if (!gradeStats[s.grade]) gradeStats[s.grade] = { present: 0, total: 0 };
      gradeStats[s.grade].total += 20; 
      gradeStats[s.grade].present += Math.round(20 * (s.attendancePct / 100));
    });

    return Object.keys(gradeStats).map(grade => ({
      name: grade,
      attendance: Math.round((gradeStats[grade].present / gradeStats[grade].total) * 100)
    }));
  };

  // 2. Annual Performance Trend (Mocked)
  const annualPerformanceData = [
    { month: 'Aug', avgGpa: 3.2, attendance: 95 },
    { month: 'Sep', avgGpa: 3.3, attendance: 92 },
    { month: 'Oct', avgGpa: 3.4, attendance: 90 },
    { month: 'Nov', avgGpa: 3.3, attendance: 88 },
    { month: 'Dec', avgGpa: 3.5, attendance: 85 },
  ];

  const monthlyData = getMonthlyAttendanceData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Academic Reports</h2>
           <p className="text-slate-500 text-sm">Comprehensive analytics for {activeTab.toLowerCase()} performance</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
          <button 
            onClick={() => setActiveTab('Monthly')} 
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'Monthly' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setActiveTab('Annual')} 
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'Annual' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Annual
          </button>
        </div>
      </div>

      {activeTab === 'Monthly' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800">Attendance by Grade</h3>
               <select 
                 value={selectedMonth} 
                 onChange={(e) => setSelectedMonth(Number(e.target.value))}
                 className="text-sm border border-slate-300 rounded p-1"
               >
                 {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
               </select>
            </div>
            <div className="flex-1 w-full relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 600}} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="attendance" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <h3 className="font-bold text-slate-800 mb-4">Students with Low Attendance</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
              {students.filter(s => s.attendancePct < 85).map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-red-100 bg-red-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center text-red-700 text-xs font-bold">
                      {s.firstName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{s.firstName} {s.lastName}</p>
                      <p className="text-xs text-slate-500">Grade {s.grade}</p>
                    </div>
                  </div>
                  <span className="text-red-600 font-bold text-sm">{s.attendancePct}%</span>
                </div>
              ))}
              {students.filter(s => s.attendancePct < 85).length === 0 && (
                <p className="text-center text-slate-400 text-sm py-4">All students have good attendance.</p>
              )}
            </div>
            <button className="mt-4 w-full py-2 border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" /> Download Detailed Report
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Annual' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[450px]">
             <h3 className="font-bold text-slate-800 mb-6">School Performance Overview (Year-to-Date)</h3>
             <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <LineChart data={annualPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" domain={[0, 4]} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" domain={[80, 100]} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                    <Legend iconType="circle" />
                    <Line yAxisId="left" type="monotone" dataKey="avgGpa" stroke="#6366f1" name="Average GPA" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line yAxisId="right" type="monotone" dataKey="attendance" stroke="#10b981" name="Avg Attendance" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg">
                <h4 className="text-indigo-200 text-sm font-medium uppercase mb-2">Total Students</h4>
                <p className="text-4xl font-bold">{students.length}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-indigo-300">
                   <CalendarCheck className="w-4 h-4" />
                   <span>Academic Year 2023-24</span>
                </div>
             </div>
             <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                <h4 className="text-slate-500 text-sm font-medium uppercase mb-2">School Average GPA</h4>
                <p className="text-4xl font-bold text-slate-800">
                  {(students.reduce((acc, s) => acc + s.gpa, 0) / students.length).toFixed(2)}
                </p>
                <p className="mt-4 text-green-500 text-sm font-medium">+0.2 from last year</p>
             </div>
             <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                <h4 className="text-slate-500 text-sm font-medium uppercase mb-2">Overall Attendance</h4>
                <p className="text-4xl font-bold text-slate-800">
                  {Math.round(students.reduce((acc, s) => acc + s.attendancePct, 0) / students.length)}%
                </p>
                <p className="mt-4 text-slate-400 text-sm">Target: 95%</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
