
import { Student, Teacher, FinanceRecord, Gender, User, Bus, Book, StudyMaterial, AttendanceRecord, DiaryEntry, School, TimetableEntry, AppNotification, Invoice, InventoryItem, Club, SalarySlip, VirtualClass, GalleryItem } from './types';

export const MOCK_SCHOOLS: School[] = [
  {
    id: 'SCH-001',
    name: 'St. Xavier Global Academy',
    udiseCode: '27210500101',
    location: 'Mumbai, India',
    contactEmail: 'admin@stxavier.edu',
    studentCount: 1250,
    joinedDate: '2023-01-15',
    primaryColor: '#4f46e5',
    region: 'APAC',
    status: 'Active',
    plan: 'Professional',
    storageLimitGB: 500,
    storageUsedGB: 120,
    apiLimitMonth: 50000,
    apiUsedMonth: 12500,
  },
  {
    id: 'SCH-002',
    name: 'Horizon International School',
    location: 'Dubai, UAE',
    contactEmail: 'contact@horizon.edu',
    studentCount: 850,
    joinedDate: '2024-03-10',
    primaryColor: '#10b981',
    region: 'EMEA',
    status: 'Active',
    plan: 'Standard',
    storageLimitGB: 100,
    storageUsedGB: 45,
    apiLimitMonth: 10000,
    apiUsedMonth: 8200,
  }
];

export const MOCK_USERS: User[] = [
  { id: 'super', name: 'Matrix Platform Admin', role: 'PlatformAdmin', email: 'owner@qodematrix.com', password: 'admin123' },
  { id: 'admin1', name: 'Principal Xavier', role: 'Admin', schoolId: 'SCH-001', email: 'admin@stxavier.edu', password: 'admin123' },
  { id: 'teacher1', name: 'Sunita Rao', role: 'Teacher', schoolId: 'SCH-001', email: 'teacher@school.com', assignedClass: '10-A', password: 'admin123' },
  { id: 'parent1', name: 'Aarav\'s Parent', role: 'Parent', schoolId: 'SCH-001', email: 'parent@example.com', linkedStudentId: 'S1001', password: 'admin123' }
];

export const MOCK_STUDENTS: Student[] = [
  { id: 'S1001', schoolId: 'SCH-001', firstName: 'Aarav', lastName: 'Sharma', grade: '10-A', gender: Gender.Male, attendancePct: 92, feesStatus: 'Paid', gpa: 3.8, parentEmail: 'p1@ex.com', eduCoins: 1250, badges: ['Perfect Week', 'Math Wizard'], category: 'General', wellnessScore: 8, aadhaarNumber: 'XXXX-XXXX-1234', isRTE: false },
  { id: 'S1002', schoolId: 'SCH-001', firstName: 'Diya', lastName: 'Patel', grade: '10-A', gender: Gender.Female, attendancePct: 98, feesStatus: 'Pending', gpa: 4.0, parentEmail: 'p2@ex.com', eduCoins: 2400, badges: ['Honor Roll', 'Green Warrior'], category: 'OBC', wellnessScore: 9, aadhaarNumber: 'XXXX-XXXX-5678', isRTE: true }
];

export const MOCK_TEACHERS: Teacher[] = [
  { id: 'T1', schoolId: 'SCH-001', name: 'Sunita Rao', subject: 'Mathematics', email: 's@s.com', classesAssigned: 5, experienceYears: 10, phone: '9876543210' },
  { id: 'T2', schoolId: 'SCH-001', name: 'Rajesh Verma', subject: 'Hindi', email: 'r@v.com', classesAssigned: 4, experienceYears: 8, phone: '9876543211' }
];

export const MOCK_FINANCE: FinanceRecord[] = [
  { id: 'F1', schoolId: 'SCH-001', type: 'Income', category: 'Tuition Fee', amount: 50000, date: '2025-05-01', description: 'Term 1 Fee Payment' },
  { id: 'F2', schoolId: 'SCH-001', type: 'Expense', category: 'Canteen Supplies', amount: 5000, date: '2025-05-02', description: 'Fresh produce for mid-day meal' }
];

export const MOCK_BUSES: Bus[] = [
  { id: 'B1', schoolId: 'SCH-001', routeNumber: 'R12', routeName: 'Bandra - Andheri', status: 'On Route', currentStop: 'Juhu Circle', nextStop: 'Versova', studentsOnBoard: 25 }
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'I1', schoolId: 'SCH-001', name: 'Godrej Benches', category: 'Furniture', quantity: 120, status: 'In Stock', lastChecked: '2025-05-01' },
  { id: 'I2', schoolId: 'SCH-001', name: 'Smart Board Pro', category: 'Electronics', quantity: 15, status: 'Low Stock', lastChecked: '2025-05-01' },
];

export const MOCK_CLUBS: Club[] = [
  { id: 'C1', name: 'Robotics Society', description: 'Innovating with AI and hardware.', members: 45, mentor: 'Sunita Rao', nextMeeting: 'Fri 4PM', category: 'Tech' },
  { id: 'C2', name: 'Drama Mandali', description: 'Classical and modern Indian theatre.', members: 32, mentor: 'Rajesh Verma', nextMeeting: 'Wed 3PM', category: 'Arts' }
];

export const MOCK_SALARY_SLIPS: SalarySlip[] = [
  { id: 'SLP-001', teacherId: 'T1', month: 'May', year: 2025, basic: 45000, hra: 12000, allowance: 5000, deductions: 2500, netAmount: 59500, status: 'Paid' }
];

export const MOCK_VIRTUAL: VirtualClass[] = [
  { id: 'V1', subject: 'Organic Chemistry', grade: '10-A', startTime: '10:30 AM', duration: 45, isLive: true, link: '#' }
];

export const MOCK_GALLERY: GalleryItem[] = [
  { id: 'G1', schoolId: 'SCH-001', title: 'Republic Day Celebration', date: '2025-01-26', category: 'Cultural', imageUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=2076&auto=format&fit=crop', description: 'Annual flag hoisting and parade.' }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: '1', type: 'Insight', title: 'Board Exam Prep', message: 'Class 10-A study material has been broadcasted.', timestamp: '1 hour ago', isRead: false, priority: 'Normal' }
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-901', schoolId: 'SCH-001', date: '2025-05-01', plan: 'Professional', status: 'Paid', amount: 15000 }
];

export const MOCK_TIMETABLE: TimetableEntry[] = [];
export const MOCK_DIARY: DiaryEntry[] = [];
export const MOCK_BOOKS: Book[] = [];
export const MOCK_RESOURCES: StudyMaterial[] = [];
export const MOCK_ATTENDANCE: AttendanceRecord[] = [];
