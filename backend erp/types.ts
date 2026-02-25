
export enum Gender { Male = 'Male', Female = 'Female', Other = 'Other' }
export type UserRole = 'Admin' | 'Teacher' | 'Parent' | 'Student' | 'PlatformAdmin';
export type StudentCategory = 'General' | 'OBC' | 'SC' | 'ST';

export type SubscriptionPlan = 'Standard' | 'Professional' | 'Infinite';
export type SubscriptionStatus = 'Active' | 'Suspended' | 'Trial' | 'Expired';

export interface AppNotification {
  id: string;
  type: 'Insight' | 'Alert' | 'Protocol';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'High' | 'Normal';
}

export interface School {
  id: string;
  name: string;
  udiseCode?: string;
  location: string;
  contactEmail: string;
  studentCount: number;
  joinedDate: string;
  primaryColor?: string;
  region: 'APAC' | 'EMEA' | 'US-East' | 'US-West';
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  storageLimitGB?: number;
  storageUsedGB?: number;
  apiLimitMonth?: number;
  apiUsedMonth?: number;
  nextBillingDate?: string;
  activeModules?: string[];
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  schoolId?: string;
  password?: string;
  linkedStudentId?: string;
  assignedClass?: string;
}

export interface Student {
  id: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  grade: string;
  gender: Gender;
  attendancePct: number;
  feesStatus: 'Paid' | 'Pending' | 'Overdue';
  gpa: number;
  parentEmail: string;
  category?: StudentCategory;
  eduCoins: number;
  badges: string[];
  wellnessScore?: number;
  aadhaarNumber?: string;
  isRTE?: boolean;
}

export interface Teacher {
  id: string;
  schoolId: string;
  name: string;
  subject: string;
  email: string;
  classesAssigned: number;
  experienceYears: number;
  phone: string;
  classTeacherOf?: string;
}

export interface FinanceRecord {
  id: string;
  schoolId: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  paymentMode?: string;
}

export interface DiaryEntry {
  id: string;
  schoolId: string;
  type: 'Homework' | 'Notice' | 'Event' | 'Remark';
  title: string;
  description: string;
  date: string;
  postedBy: string;
  targetType: 'Class' | 'Student';
  targetValue: string;
  subject?: string;
  dueDate?: string;
}

export interface AttendanceRecord {
  schoolId: string;
  studentId?: string;
  teacherId?: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  smsAlertStatus?: 'Sent' | 'Failed';
}

export interface Bus {
  id: string;
  schoolId: string;
  routeNumber: string;
  routeName: string;
  status: string;
  currentStop: string;
  nextStop: string;
  studentsOnBoard: number;
}

export interface TimetableEntry {
  day: string;
  period: number;
  subject: string;
  teacherName: string;
  room: string;
  startTime: string;
  endTime: string;
}

export interface InventoryItem {
  id: string;
  schoolId: string;
  name: string;
  category: string;
  quantity: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastChecked: string;
}

export interface ExamPaper {
  id: string;
  title: string;
  subject: string;
  durationMins: number;
  totalMarks: number;
  status: 'Upcoming' | 'Live' | 'Completed';
  date: string;
}

export interface Book {
  id: string;
  schoolId: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: 'Available' | 'Issued' | 'Lost';
  issuedToStudentId?: string;
  dueDate?: string;
}

export interface StudyMaterial {
  id: string;
  schoolId: string;
  title: string;
  subject: string;
  targetClass: string;
  type: 'PDF' | 'Video' | 'Link' | 'Doc';
  url: string;
  uploadDate: string;
  uploadedBy: string;
}

export interface Invoice {
  id: string;
  schoolId: string;
  date: string;
  plan: SubscriptionPlan;
  status: 'Paid' | 'Overdue';
  amount: number;
}

export interface CalendarEvent {
  id: string;
  schoolId: string;
  title: string;
  date: string;
  type: 'Holiday' | 'Exam' | 'Academic' | 'Event';
  description?: string;
}

export interface ExamSchedule {
  id: string;
  schoolId: string;
  title: string;
  classGrade: string;
  publishDate: string;
  subjects: { subject: string; date: string; time: string }[];
  status: 'Draft' | 'Published';
}

export interface ReportCard {
  id: string;
  schoolId: string;
  studentId: string;
  examTitle: string;
  academicYear: string;
  issueDate: string;
  remarks: string;
  grades: { subject: string; marksObtained: number; maxMarks: number; grade: string }[];
  percentage: number;
  status: 'Draft' | 'Published';
}

export interface GalleryItem {
  id: string;
  schoolId: string;
  title: string;
  date: string;
  category: 'Sports' | 'Cultural' | 'Academic' | 'Campus';
  imageUrl: string;
  description: string;
}

export interface SupportTicket {
  id: string;
  schoolId: string;
  userId: string;
  subject: string;
  category: 'General' | 'Transport' | 'Fees' | 'Academics';
  status: 'Open' | 'In Progress' | 'Resolved';
  dateRaised: string;
  lastUpdate: string;
  messages: { sender: string; text: string; date: string }[];
}

export interface VirtualClass {
  id: string;
  subject: string;
  grade: string;
  startTime: string;
  duration: number;
  isLive: boolean;
  link: string;
}

export interface Alumni {
  id: string;
  name: string;
  batch: string;
  profession: string;
  company: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  members: number;
  mentor: string;
  nextMeeting: string;
  category: 'Tech' | 'Arts' | 'Sports' | 'Other';
}

export interface SalarySlip {
  id: string;
  teacherId: string;
  month: string;
  year: number;
  basic: number;
  hra: number;
  allowance: number;
  deductions: number;
  netAmount: number;
  status: 'Paid' | 'Pending';
}

export interface PTMSlot {
  id: string;
  teacherId: string;
  time: string;
  status: 'Available' | 'Booked';
}

export type ViewState = 
  | 'dashboard' 
  | 'students' 
  | 'teachers' 
  | 'finance' 
  | 'transport' 
  | 'diary' 
  | 'attendance'
  | 'timetable'
  | 'exams'
  | 'library'
  | 'resources'
  | 'inventory'
  | 'wellness'
  | 'virtual'
  | 'alumni'
  | 'clubs'
  | 'rewards'
  | 'ptm'
  | 'vault'
  | 'gallery'
  | 'helpdesk'
  | 'enterprise'
  | 'registry'
  | 'billing'
  | 'payroll';
