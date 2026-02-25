
import { Student, FinanceRecord, User, Teacher, DiaryEntry, Book, StudyMaterial, AttendanceRecord, School, ExamSchedule, ReportCard, TimetableEntry } from '../types';

// Use relative path for API calls - Vite will proxy to backend via vite.config.ts
const BASE_URL = '/api';

export const apiService = {
  getHeaders() {
    const token = localStorage.getItem('qc_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'school-id': localStorage.getItem('qc_schoolId') || 'school1'
    };
  },

  async login(credentials: { identifier: string; password: string }): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.identifier, password: credentials.password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('qc_token', data.token);
      localStorage.setItem('qc_schoolId', data.user.schoolId || 'school1');
      return data.user;
    } catch (err: any) {
      console.error('Login error:', err.message);
      throw err;
    }
  },

  // --- STUDENT MODULE ---
  async getStudents(): Promise<Student[]> {
    try {
      const response = await fetch(`${BASE_URL}/students`, { headers: this.getHeaders() });
      return response.ok ? response.json() : [];
    } catch (err) {
      console.error('Error fetching students:', err);
      return [];
    }
  },

  async registerStudent(student: Student, user: User): Promise<any> {
    const response = await fetch(`${BASE_URL}/students/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ ...student, schoolId: user.schoolId || 'school1' })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || 'Failed to register student');
    }

    // If a user object was provided (parent account), attempt to create it via auth/register
    if (user && user.email && user.password) {
      try {
        await fetch(`${BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: user.name, email: user.email, password: user.password })
        });
      } catch (e) {
        // non-blocking: student registration succeeded even if creating user fails
        console.warn('Parent user creation failed:', e?.message || e);
      }
    }

    return data;
  },

  // --- TEACHER MODULE ---
  async getTeachers(): Promise<Teacher[]> {
    try {
      const response = await fetch(`${BASE_URL}/teachers`, { headers: this.getHeaders() });
      return response.ok ? response.json() : [];
    } catch (err) {
      console.error('Error fetching teachers:', err);
      return [];
    }
  },

  async onboardTeacher(teacher: Teacher, user: User): Promise<any> {
    const response = await fetch(`${BASE_URL}/teachers`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ ...teacher, schoolId: user.schoolId || 'school1' })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Failed to create teacher');
    return data;
  },

  // --- FINANCE MODULE ---
  async getFinance(): Promise<FinanceRecord[]> {
    try {
      const response = await fetch(`${BASE_URL}/finance`, { headers: this.getHeaders() });
      return response.ok ? response.json() : [];
    } catch (err) {
      console.error('Error fetching finance:', err);
      return [];
    }
  },

  async addTransaction(record: FinanceRecord): Promise<any> {
    return fetch(`${BASE_URL}/finance`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ ...record, schoolId: localStorage.getItem('qc_schoolId') || 'school1' })
    });
  },

  // --- DIARY & NOTICES ---
  async getDiary(): Promise<DiaryEntry[]> {
    try {
      const response = await fetch(`${BASE_URL}/diary`, { headers: this.getHeaders() });
      return response.ok ? response.json() : [];
    } catch (err) {
      console.error('Error fetching diary:', err);
      return [];
    }
  },

  async addDiaryEntry(entry: DiaryEntry): Promise<any> {
    return fetch(`${BASE_URL}/diary`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ ...entry, schoolId: localStorage.getItem('qc_schoolId') || 'school1' })
    });
  },

  // --- LIBRARY MODULE ---
  async getBooks(): Promise<Book[]> {
    try {
      const response = await fetch(`${BASE_URL}/library`, { headers: this.getHeaders() });
      return response.ok ? response.json() : [];
    } catch (err) {
      console.error('Error fetching books:', err);
      return [];
    }
  },

  async addBook(book: Book): Promise<any> {
    return fetch(`${BASE_URL}/library`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ ...book, schoolId: localStorage.getItem('qc_schoolId') || 'school1' })
    });
  },

  async issueBook(bookId: string, studentId: string): Promise<any> {
    return fetch(`${BASE_URL}/library/issue`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ bookId, studentId })
    });
  },

  async returnBook(bookId: string, studentId?: string): Promise<any> {
    return fetch(`${BASE_URL}/library/return`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ bookId, studentId })
    });
  },

  // --- ACADEMICS & EXAMS ---
  async getExamSchedules(): Promise<ExamSchedule[]> {
    try {
      const response = await fetch(`${BASE_URL}/exams/schedules`, { headers: this.getHeaders() });
      return response.ok ? response.json() : [];
    } catch (err) {
      console.error('Error fetching exam schedules:', err);
      return [];
    }
  },

  async getReportCards(): Promise<ReportCard[]> {
    try {
      const response = await fetch(`${BASE_URL}/exams/reports`, { headers: this.getHeaders() });
      return response.ok ? response.json() : [];
    } catch (err) {
      console.error('Error fetching report cards:', err);
      return [];
    }
  },

  async updateTimetable(entries: TimetableEntry[]): Promise<any> {
    return fetch(`${BASE_URL}/timetable`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ entries, schoolId: localStorage.getItem('qc_schoolId') || 'school1' })
    });
  },

  // --- ATTENDANCE MODULE ---
  async markAttendance(records: AttendanceRecord[]): Promise<any> {
    return fetch(`${BASE_URL}/attendance`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ records, schoolId: localStorage.getItem('qc_schoolId') || 'school1' })
    });
  },

  // --- RESOURCES ---
  async getResources(): Promise<StudyMaterial[]> {
    try {
      const response = await fetch(`${BASE_URL}/resources`, { headers: this.getHeaders() });
      return response.ok ? response.json() : [];
    } catch (err) {
      console.error('Error fetching resources:', err);
      return [];
    }
  },

  async addResource(material: StudyMaterial): Promise<any> {
    return fetch(`${BASE_URL}/resources`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ ...material, schoolId: localStorage.getItem('qc_schoolId') || 'school1' })
    });
  }
};
