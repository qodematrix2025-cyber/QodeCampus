
import React, { useState, useEffect } from 'react';
import { User, ViewState, Student, Teacher, FinanceRecord, School, DiaryEntry, Book, StudyMaterial, ExamSchedule, ReportCard, TimetableEntry } from './types';
import { 
  MOCK_STUDENTS, MOCK_TEACHERS, MOCK_FINANCE, MOCK_BUSES, MOCK_USERS, 
  MOCK_NOTIFICATIONS, MOCK_SCHOOLS, MOCK_INVOICES, MOCK_GALLERY 
} from './constants';
import { 
  DashboardIcon, StudentsIcon, TeacherIcon, FinanceIcon, LogoutIcon, 
  Activity, Calendar, BellIcon, ClipboardList, SettingsIcon, 
  Library as LibraryIcon, UserCheck, Folder, Image, LifeBuoy, DiaryIcon
} from './components/Icons';

import { Login } from './components/Login';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Finance from './components/Finance';
import Transport from './components/Transport';
import Diary from './components/Diary';
import Teachers from './components/Teachers';
import { Timetable } from './components/Timetable';
import { NotificationCenter } from './components/NotificationCenter';
import { EnterpriseDashboard } from './components/EnterpriseDashboard';
import { SchoolRegistry } from './components/SchoolRegistry';
import { BillingPortal } from './components/BillingPortal';
import Library from './components/Library';
import StudyMaterials from './components/StudyMaterials';
import Helpdesk from './components/Helpdesk';
import ParentAttendance from './components/ParentAttendance';
import AllStudentAttendance from './components/AllStudentAttendance';
import { AIChatbot } from './components/AIChatbot';
import { ExaminationHub } from './components/ExaminationHub';
import { DigitalID } from './components/DigitalID';
import { FeePayment } from './components/FeePayment';
import { Payroll } from './components/Payroll';
import Gallery from './components/Gallery';
import { apiService } from './services/apiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeSchoolId, setActiveSchoolId] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  // Unified ERP States
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [finance, setFinance] = useState<FinanceRecord[]>(MOCK_FINANCE);
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [resources, setResources] = useState<StudyMaterial[]>([]);
  const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>([]);
  const [reportCards, setReportCards] = useState<ReportCard[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [schools, setSchools] = useState<School[]>(MOCK_SCHOOLS);

  const currentSchoolId = user?.role === 'PlatformAdmin' ? activeSchoolId : user?.schoolId;
  const currentSchool = schools.find(s => s.id === currentSchoolId);
  const isRestricted = user?.role === 'Parent' || user?.role === 'Student';

  // Global Refresh Handler
  const syncRegistry = async () => {
    if (!user) return;
    try {
      // Fix: Removed 'tt' from destructuring as Promise.all only contains 8 promises
      const [s, t, f, d, b, r, ex, rc] = await Promise.all([
        apiService.getStudents(),
        apiService.getTeachers(),
        apiService.getFinance(),
        apiService.getDiary(),
        apiService.getBooks(),
        apiService.getResources(),
        apiService.getExamSchedules(),
        apiService.getReportCards(),
        // Add getTimetable if needed, else use local/mock
      ]);
      if (s.length) setStudents(s);
      if (t.length) setTeachers(t);
      if (f.length) setFinance(f);
      setDiary(d);
      setBooks(b);
      setResources(r);
      setExamSchedules(ex);
      setReportCards(rc);
    } catch (err) {
      console.warn("Telemetry offline. Using local Matrix state.");
    }
  };

  useEffect(() => { syncRegistry(); }, [user]);

  if (!user) return <Login users={MOCK_USERS} onLogin={(u) => { 
    setUser(u); 
    if(u.role === 'PlatformAdmin') setView('enterprise');
    if(u.schoolId) setActiveSchoolId(u.schoolId); 
  }} />;

  // --- Functional Activity Handlers ---
  const handleAddDiary = async (entry: DiaryEntry) => {
    await apiService.addDiaryEntry(entry);
    setDiary([...diary, entry]);
  };

  const handleRegisterStudent = async (student: Student, user: User) => {
    try {
      const created = await apiService.registerStudent(student, user);
      if (created) setStudents(prev => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('Register student error:', err);
      throw err;
    }
  };

  const handleOnboardTeacher = async (teacher: Teacher, user: User) => {
    try {
      const created = await apiService.onboardTeacher(teacher, user);
      if (created) setTeachers(prev => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('Onboard teacher error:', err);
      throw err;
    }
  };

  const handleIssueBook = async (bid: string, sid: string) => {
    await apiService.issueBook(bid, sid);
    syncRegistry();
  };

  const handleUpdateTimetable = async (entries: TimetableEntry[]) => {
    await apiService.updateTimetable(entries);
    setTimetable(entries);
  };

  const handleAddResource = async (res: StudyMaterial) => {
    await apiService.addResource(res);
    setResources([...resources, res]);
  };

  const NavItem = ({ id, label, icon: Icon, colorClass = "bg-brand-500" }: { id: ViewState, label: string, icon: any, colorClass?: string }) => {
    const isActive = view === id;
    return (
      <button
        onClick={() => { setView(id); setIsMobileMenuOpen(false); }}
        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
          isActive ? `bg-white shadow-lg border border-slate-100 ring-1 ring-slate-100` : 'text-slate-500 hover:bg-slate-50'
        }`}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive ? colorClass : 'bg-slate-100 shadow-inner'}`}>
          <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
        </div>
        {!sidebarCollapsed && <span className={`text-[11px] font-black uppercase tracking-wider block leading-none ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{label}</span>}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex bg-[#fbfcfd] font-sans selection:bg-brand-500/10 overflow-hidden relative">
      <NotificationCenter notifications={MOCK_NOTIFICATIONS} isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} onMarkAsRead={() => {}} onMarkAllRead={() => {}} />
      <AIChatbot user={user} school={currentSchool} />

      <aside className={`fixed inset-y-0 left-0 z-[70] bg-[#f8fafc] border-r border-slate-200/60 flex flex-col p-6 transition-all duration-500 ease-out transform 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 ${sidebarCollapsed ? 'lg:w-28' : 'lg:w-80'}`}>
        
        <div className="flex items-center gap-4 mb-12 px-2">
           <div className="w-14 h-14 bg-slate-950 rounded-3xl flex items-center justify-center text-white shadow-2xl font-black text-2xl group hover:rotate-6 transition-transform cursor-pointer">Q</div>
           {!sidebarCollapsed && (
             <div className="animate-in fade-in slide-in-from-left-2 duration-500">
                <h2 className="text-xl font-black text-slate-900 leading-none tracking-tighter">QodeCampus</h2>
                <span className="text-[10px] text-indigo-500 uppercase tracking-[0.3em] font-black mt-1.5 block">Institutional OS</span>
             </div>
           )}
        </div>
        
        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar pr-1 pb-10">
          <div className="space-y-2">
            <p className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{isRestricted ? 'Personal Hub' : 'Administration'}</p>
            <NavItem id="dashboard" label="Home Office" icon={DashboardIcon} colorClass="bg-indigo-500 shadow-indigo-100" />
            <NavItem id="students" label={isRestricted ? "Digital Identity" : "Student Master"} icon={StudentsIcon} colorClass="bg-amber-500 shadow-amber-100" />
            {!isRestricted && <NavItem id="teachers" label="Teacher Roster" icon={TeacherIcon} colorClass="bg-sky-500 shadow-sky-100" />}
            <NavItem id="finance" label={isRestricted ? "Pay School Fees" : "Accounts Hub"} icon={FinanceIcon} colorClass="bg-emerald-500 shadow-emerald-100" />
          </div>

          <div className="space-y-2 mt-10">
            <p className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Academic Axis</p>
            <NavItem id="attendance" label="Daily Register" icon={UserCheck} colorClass="bg-rose-500 shadow-rose-100" />
            <NavItem id="timetable" label="Time Registry" icon={Calendar} colorClass="bg-indigo-400 shadow-indigo-100" />
            <NavItem id="diary" label="School Diary" icon={DiaryIcon} colorClass="bg-orange-500 shadow-orange-100" />
            <NavItem id="resources" label="Resource Hub" icon={Folder} colorClass="bg-cyan-500 shadow-cyan-100" />
          </div>

          <div className="space-y-2 mt-10">
            <p className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Campus Life</p>
            <NavItem id="library" label="Digital Library" icon={LibraryIcon} colorClass="bg-violet-600 shadow-violet-100" />
            <NavItem id="gallery" label="Photo Archive" icon={Image} colorClass="bg-fuchsia-500 shadow-fuchsia-100" />
          </div>
        </nav>

        <div className="pt-6 border-t border-slate-200/60">
           <button onClick={() => setIsLogoutModalOpen(true)} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><LogoutIcon className="w-5 h-5" /></div>
              {!sidebarCollapsed && <span className="text-[11px] font-black uppercase tracking-wider">Sign Out</span>}
           </button>
        </div>
      </aside>

      <main className="flex-1 h-screen flex flex-col overflow-hidden">
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-10 flex justify-between items-center z-50">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:flex p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
               <Activity className={`w-5 h-5 transition-transform duration-500 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
            <div className="flex flex-col">
               <h1 className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase leading-none mb-2">{view}</h1>
               <span className="text-slate-900 text-2xl font-black tracking-tighter leading-none">{currentSchool?.name || 'Global Matrix Hub'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={() => setIsNotificationsOpen(true)} className="relative p-4 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all group">
              <BellIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
            </button>
            <div className="flex items-center gap-4 bg-slate-900 text-white pl-2 pr-6 py-2 rounded-3xl shadow-2xl">
               <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center font-black text-sm">{user.name[0]}</div>
               <div className="hidden sm:block">
                  <p className="text-xs font-black tracking-tight leading-none mb-1 uppercase">{user.name.split(' ')[0]}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
               </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar grad-main">
          <div className="max-w-7xl mx-auto pb-40">
            {view === 'dashboard' && <Dashboard students={students} finance={finance} buses={MOCK_BUSES} user={user} />}
            {view === 'students' && (isRestricted ? <DigitalID student={students.find(s => s.id === user.linkedStudentId) || students[0]} /> : <Students students={students} currentUser={user} onRegisterStudent={handleRegisterStudent} onDeleteStudent={() => {}} />)}
            {view === 'teachers' && <Teachers schoolId={currentSchoolId || ''} teachers={teachers} currentUser={user} onRegisterTeacher={handleOnboardTeacher} onDeleteTeacher={() => {}} />}
            {view === 'finance' && (isRestricted ? <FeePayment user={user} student={students.find(s => s.id === user.linkedStudentId) || students[0]} /> : <Finance finance={finance} students={students} onAddTransaction={apiService.addTransaction} />)}
            {view === 'attendance' && (isRestricted ? <ParentAttendance student={students.find(s => s.id === user.linkedStudentId) || students[0]} records={[]} /> : <AllStudentAttendance students={students} attendanceRecords={[]} currentUser={user} />)}
            {view === 'timetable' && <Timetable user={user} entries={timetable} teachers={teachers} onUpdateTimetable={handleUpdateTimetable} />}
            {view === 'diary' && <Diary schoolId={currentSchoolId || ''} entries={diary} students={students} currentUser={user} onAddEntry={handleAddDiary} />}
            {view === 'resources' && <StudyMaterials schoolId={currentSchoolId || ''} materials={resources} students={students} currentUser={user} onAddMaterial={handleAddResource} />}
            {view === 'library' && <Library schoolId={currentSchoolId || ''} books={books} students={students} currentUser={user} onAddBook={apiService.addBook} onIssueBook={handleIssueBook} onReturnBook={apiService.returnBook} />}
            {view === 'gallery' && <Gallery schoolId={currentSchoolId || ''} items={MOCK_GALLERY} currentUser={user} onAddItem={() => {}} />}
          </div>
        </div>
      </main>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md">
           <div className="bg-white rounded-[4rem] w-full max-w-sm shadow-ultra p-12 text-center border border-white/20">
              <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner border border-rose-100">
                 <LogoutIcon className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Logging Out?</h3>
              <p className="text-slate-400 font-medium mb-12 text-sm leading-relaxed">Your current institutional session will be securely terminated.</p>
              <div className="space-y-4">
                 <button onClick={() => { setUser(null); setIsLogoutModalOpen(false); }} className="w-full py-6 bg-rose-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px]">Terminate Session</button>
                 <button onClick={() => setIsLogoutModalOpen(false)} className="w-full py-6 bg-slate-50 text-slate-400 rounded-[2rem] font-black uppercase tracking-widest text-[11px]">Cancel</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
