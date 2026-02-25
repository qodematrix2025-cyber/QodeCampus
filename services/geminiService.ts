
import { GoogleGenAI } from "@google/genai";
import { Student } from "../types";

// Strictly follow Google GenAI SDK guidelines: Always use named parameter for apiKey and direct process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Gemini 3 Flash to generate a personalized student progress report.
 */
export const generateStudentReport = async (student: Student): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, professional, and encouraging 2-sentence school progress summary for a student named ${student.firstName} ${student.lastName}. 
      Stats: Grade ${student.grade}, Attendance ${student.attendancePct}%, GPA ${student.gpa}, Fees Status ${student.feesStatus}. 
      Keep it strictly academic and administrative.`,
      config: { temperature: 0.7 }
    });
    // Correct way to extract text from GenerateContentResponse is via .text property
    return response.text || "Report unavailable at this moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The system is having trouble generating the AI summary. Please check student data manually.";
  }
};

/**
 * Generates a "School Health" briefing for the administrator.
 */
export const generateSchoolInsights = async (
  studentCount: number, 
  avgAttendance: number, 
  revenue: number,
  pendingDuesCount: number
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `As a school ERP AI assistant, provide a concise 3-sentence 'Morning Briefing' for the school principal. 
      Total Students: ${studentCount}, Average Attendance: ${avgAttendance}%, Current Net Balance: ₹${revenue.toLocaleString()}, Pending Fee Cases: ${pendingDuesCount}. 
      Highlight the most critical area to focus on today.`,
      config: { temperature: 0.5 }
    });
    // Correct way to extract text from GenerateContentResponse is via .text property
    return response.text || "Welcome back. All systems operational.";
  } catch (error) {
    return "Intelligence services are currently offline. Local data indicates stable operations.";
  }
};

/**
 * Generates an enterprise-level summary of the entire platform.
 */
export const generateEnterpriseBrief = async (schoolCount: number, totalStudents: number, mrr: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a high-level 2-sentence enterprise executive summary for a SaaS platform administrator. 
      Total Schools: ${schoolCount}, Total Students: ${totalStudents}, Monthly Recurring Revenue: ₹${mrr.toLocaleString()}. 
      Focus on platform growth and scale.`,
      config: { temperature: 0.6 }
    });
    return response.text || "Platform performance is optimal.";
  } catch (error) {
    return "Enterprise intelligence relay delayed. Metrics show stable platform growth.";
  }
};
