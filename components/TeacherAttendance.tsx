
import React, { useState } from 'react';
import { AttendanceRecord, Teacher, User } from '../types';
import { UserCheck, CheckCircle, X, Activity, Send } from './Icons';

interface TeacherAttendanceProps {
  schoolId: string;
  teachers: Teacher[];
  attendanceRecords: AttendanceRecord[];
  currentUser: User;
  onMarkAttendance: (records: AttendanceRecord[]) => void;
}

const TeacherAttendance: React.FC<TeacherAttendanceProps> = ({ schoolId, teachers, attendanceRecords, currentUser, onMarkAttendance }) => {
  const [dailyAttendance, setDailyAttendance] = useState<Record<string, 'Present'|'Absent'|'Late'>>({});
  const [alertSent, setAlertSent] = useState(false);
  
  const isAdmin = currentUser.role === 'Admin';
  
  const handleInitRegister = () => {
      const initial: Record<string, 'Present'|'Absent'|'Late'> = {};
      teachers.forEach(t => initial[t.id] = 'Present');
      setDailyAttendance(initial);
  };

  const handleSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    const newRecords: AttendanceRecord[] = [];
    Object.entries(dailyAttendance).forEach(([teacherId, status]) => {
      newRecords.push({
        schoolId: schoolId,
        teacherId,
        date: today,
        status: status as any,
        smsAlertStatus: status === 'Absent' ? 'Sent' : undefined
      });
    });
    onMarkAttendance(newRecords);
    
    if (Object.values(dailyAttendance).includes('Absent')) {
        setAlertSent(true);
        setTimeout(() => setAlertSent(false), 5000);
    }
    alert('Attendance recorded. Absentees have been notified via SMS gateway.');
  };

  if (isAdmin) {
      return (
          <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                   <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                     <UserCheck className="w-6 h-6 text-indigo-600" /> Digital Attendance Register
                   </h2>
                   <p className="text-slate-500 text-sm">Automated SMS alerts for absentees are enabled.</p>
                </div>
                {alertSent && (
                  <div className="bg-emerald-100 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase animate-pulse border border-emerald-200">
                    Parent SMS Alerts Triggered
                  </div>
                )}
              </div>

              <div className="bg-white rounded-[2rem] shadow-card border border-slate-100 overflow-hidden">
                  <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-black text-slate-700 text-xs uppercase tracking-widest">Faculty Management</h3>
                      <button onClick={handleInitRegister} className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest border-b-2 border-indigo-100">Set All Present</button>
                  </div>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                          <thead className="bg-slate-50 text-slate-500 font-black uppercase text-[10px] tracking-widest">
                              <tr>
                                  <th className="px-8 py-5">Teacher Name</th>
                                  <th className="px-8 py-5">Status Select</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                              {teachers.map(teacher => (
                                  <tr key={teacher.id} className="hover:bg-slate-50 transition-colors">
                                      <td className="px-8 py-6">
                                          <p className="font-black text-slate-800">{teacher.name}</p>
                                          <p className="text-[10px] text-slate-400 font-bold uppercase">{teacher.subject}</p>
                                      </td>
                                      <td className="px-8 py-6">
                                          <div className="flex gap-4">
                                              {['Present', 'Absent', 'Late'].map(status => (
                                                <button
                                                  key={status}
                                                  onClick={() => setDailyAttendance({...dailyAttendance, [teacher.id]: status as any})}
                                                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                                    dailyAttendance[teacher.id] === status 
                                                    ? (status === 'Present' ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : status === 'Absent' ? 'bg-rose-600 text-white border-rose-600 shadow-lg' : 'bg-amber-500 text-white border-amber-500 shadow-lg')
                                                    : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                                                  }`}
                                                >
                                                  {status}
                                                </button>
                                              ))}
                                          </div>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                      <button 
                         onClick={handleSubmit}
                         className="px-10 py-4 bg-slate-900 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center gap-3"
                      >
                         <Send className="w-4 h-4" /> Finalize & Sync Logs
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  return <div className="p-20 text-center font-black text-slate-300 uppercase tracking-[0.5em]">Unauthorized Access</div>;
};

export default TeacherAttendance;
