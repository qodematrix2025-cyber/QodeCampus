
import React, { useState, useMemo } from 'react';
import { Student, AttendanceRecord, User } from '../types';
import { CheckCircle, X, Activity, Send, Users, BellIcon } from './Icons';

interface StudentAttendanceRegisterProps {
  schoolId: string;
  students: Student[];
  currentUser: User;
  onMarkAttendance: (records: AttendanceRecord[]) => void;
}

const StudentAttendanceRegister: React.FC<StudentAttendanceRegisterProps> = ({ schoolId, students, currentUser, onMarkAttendance }) => {
  const teacherClass = currentUser.assignedClass || '10-A';
  const classStudents = useMemo(() => students.filter(s => s.grade === teacherClass), [students, teacherClass]);
  
  const [dailyAttendance, setDailyAttendance] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [smsStatus, setSmsStatus] = useState<{ count: number, visible: boolean }>({ count: 0, visible: false });

  const handleSetAllPresent = () => {
    const newState: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    classStudents.forEach(s => newState[s.id] = 'Present');
    setDailyAttendance(newState);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const today = new Date().toISOString().split('T')[0];
    const absentees = Object.entries(dailyAttendance).filter(([_, status]) => status === 'Absent');
    
    const newRecords: AttendanceRecord[] = classStudents.map(s => ({
      schoolId,
      studentId: s.id,
      date: today,
      status: dailyAttendance[s.id] || 'Present', // Default to Present if not touched
      smsAlertStatus: dailyAttendance[s.id] === 'Absent' ? 'Sent' : undefined
    }));

    onMarkAttendance(newRecords);

    if (absentees.length > 0) {
      setSmsStatus({ count: absentees.length, visible: true });
      setTimeout(() => setSmsStatus(prev => ({ ...prev, visible: false })), 6000);
    }

    alert(`Attendance for Class ${teacherClass} has been synced to the server.`);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Class Register: {teacherClass}</h2>
          <p className="text-slate-500 text-sm font-medium">Daily attendance marking for the current session.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSetAllPresent}
            className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-100 transition-all"
          >
            Mark All Present
          </button>
        </div>
      </div>

      {smsStatus.visible && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-2xl animate-in slide-in-from-top-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center animate-pulse">
              <BellIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-indigo-300 tracking-widest leading-none mb-1">SMS Gateway Active</p>
              <p className="text-sm font-bold">Automated alerts sent to parents of {smsStatus.count} absentees.</p>
            </div>
          </div>
          <button onClick={() => setSmsStatus(p => ({ ...p, visible: false }))} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-card border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Roll / Scholar</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status Selection</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Last Remark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {classStudents.map(student => (
              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {student.firstName[0]}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 leading-none">{student.firstName} {student.lastName}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{student.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex gap-2">
                    {['Present', 'Absent', 'Late'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setDailyAttendance({ ...dailyAttendance, [student.id]: status as any })}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          (dailyAttendance[student.id] || 'Present') === status
                            ? status === 'Present' ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' :
                              status === 'Absent' ? 'bg-rose-600 text-white border-rose-600 shadow-lg' :
                              'bg-amber-500 text-white border-amber-500 shadow-lg'
                            : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <span className="text-[10px] font-bold text-slate-300 italic">No historical flags</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
           <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                 {classStudents.slice(0, 3).map(s => (
                   <div key={s.id} className="w-8 h-8 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400">{s.firstName[0]}</div>
                 ))}
                 <div className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-[10px] font-black text-white">+{classStudents.length - 3}</div>
              </div>
              <p className="text-xs font-bold text-slate-500">{Object.keys(dailyAttendance).length} of {classStudents.length} marked</p>
           </div>
           <button 
             onClick={handleSubmit}
             disabled={isSubmitting}
             className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-indigo-600 transition-all flex items-center gap-3 disabled:opacity-50"
           >
             {isSubmitting ? 'Syncing...' : <><Send className="w-4 h-4" /> Finalize Registry</>}
           </button>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceRegister;
