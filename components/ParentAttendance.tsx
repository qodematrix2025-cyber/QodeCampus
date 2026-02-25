
import React, { useState } from 'react';
import { AttendanceRecord, Student } from '../types';
import { CalendarCheck, Activity, CheckCircle, X } from './Icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ParentAttendanceProps {
  student: Student;
  records: AttendanceRecord[];
}

const ParentAttendance: React.FC<ParentAttendanceProps> = ({ student, records }) => {
  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth());

  const studentRecords = records.filter(r => r.studentId === student.id);
  
  const totalDays = studentRecords.length || 1;
  const presentCount = studentRecords.filter(r => r.status === 'Present').length;
  const absentCount = studentRecords.filter(r => r.status === 'Absent').length;
  const lateCount = studentRecords.filter(r => r.status === 'Late').length;

  const pieData = [
    { name: 'Present', value: presentCount, color: '#10b981' }, 
    { name: 'Absent', value: absentCount, color: '#ef4444' },   
    { name: 'Late', value: lateCount, color: '#f59e0b' },       
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const filteredRecords = studentRecords.filter(r => {
    const d = new Date(r.date);
    return d.getMonth() === filterMonth;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const heatMapData = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split('T')[0];
    const record = studentRecords.find(r => r.date === dateStr);
    return { date: dateStr, status: record?.status || 'No School' };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <CalendarCheck className="w-6 h-6 text-indigo-600" />
             Attendance Record
           </h2>
           <p className="text-slate-500 text-sm">Detailed academic presence for <span className="font-semibold text-slate-700">{student.firstName}</span></p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold border border-indigo-100">
          Overall: {student.attendancePct}%
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 relative overflow-hidden">
             <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 z-10">
               <CheckCircle className="w-6 h-6" />
             </div>
             <div className="z-10">
               <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Days Present</p>
               <p className="text-3xl font-bold text-slate-800">{presentCount}</p>
             </div>
             <div className="absolute right-0 bottom-0 opacity-10">
               <CheckCircle className="w-24 h-24 text-emerald-600 transform translate-x-4 translate-y-4" />
             </div>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 relative overflow-hidden">
             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 z-10">
               <X className="w-6 h-6" />
             </div>
             <div className="z-10">
               <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Days Absent</p>
               <p className="text-3xl font-bold text-slate-800">{absentCount}</p>
             </div>
             <div className="absolute right-0 bottom-0 opacity-10">
               <X className="w-24 h-24 text-red-600 transform translate-x-4 translate-y-4" />
             </div>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 relative overflow-hidden">
             <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 z-10">
               <Activity className="w-6 h-6" />
             </div>
             <div className="z-10">
               <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Days Late</p>
               <p className="text-3xl font-bold text-slate-800">{lateCount}</p>
             </div>
             <div className="absolute right-0 bottom-0 opacity-10">
               <Activity className="w-24 h-24 text-amber-600 transform translate-x-4 translate-y-4" />
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[350px]">
                <h3 className="font-bold text-slate-800 mb-4 shrink-0">Distribution</h3>
                <div className="flex-1 w-full relative">
                   <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                     <PieChart>
                       <Pie
                         data={pieData}
                         cx="50%"
                         cy="50%"
                         innerRadius={60}
                         outerRadius={80}
                         paddingAngle={5}
                         dataKey="value"
                         stroke="none"
                       >
                         {pieData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                       </Pie>
                       <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                     </PieChart>
                   </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 text-xs font-medium mt-4 shrink-0">
                   {pieData.map(d => (
                     <div key={d.name} className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                        <span className="text-slate-600">{d.name}</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">Last 30 Days Activity</h3>
                <div className="flex flex-wrap gap-1.5">
                   {heatMapData.map((day, i) => (
                      <div 
                        key={i}
                        title={`${day.date}: ${day.status}`}
                        className={`w-3 h-3 rounded-sm ${
                           day.status === 'Present' ? 'bg-emerald-500' :
                           day.status === 'Absent' ? 'bg-red-500' :
                           day.status === 'Late' ? 'bg-amber-500' :
                           'bg-slate-100'
                        }`}
                      ></div>
                   ))}
                </div>
                <div className="mt-2 text-[10px] text-slate-400 flex justify-between">
                   <span>30 Days ago</span>
                   <span>Today</span>
                </div>
             </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Monthly Log</h3>
                <select 
                   value={filterMonth} 
                   onChange={(e) => setFilterMonth(Number(e.target.value))}
                   className="text-sm border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                >
                   {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[500px] custom-scrollbar">
                {filteredRecords.length > 0 ? filteredRecords.map((record, idx) => (
                   <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-white hover:shadow-md hover:border-indigo-100 border border-transparent transition-all group">
                      <div className="flex items-center gap-4">
                         <div className="bg-white p-2 rounded-lg shadow-sm text-slate-400 group-hover:text-indigo-600 transition-colors">
                            <CalendarCheck className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="font-bold text-slate-700">{new Date(record.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                            <p className="text-xs text-slate-400">Regular Session</p>
                         </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            record.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                            record.status === 'Absent' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                      }`}>
                          {record.status}
                      </span>
                   </div>
                )) : (
                  <div className="text-center py-12 text-slate-400">
                     <p>No records found for {monthNames[filterMonth]}.</p>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ParentAttendance;
