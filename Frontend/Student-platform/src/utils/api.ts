import { Course, BackendCourse, Lecture, Assignment, StudentProfile, BackendLecture, BackendDetailedCourse } from "@/types";
import { api } from "./auth";

// Real API function
export async function getCourses(): Promise<Course[]> {
  const response = await api.get<{ status: string; data: BackendCourse[] }>(
    '/users/courses'
  );
  if (response.data.status !== 'SUCCESS') {
    throw new Error('Failed to fetch courses');
  }
  // Transform backend data to frontend Course type
  return response.data.data.map((course) => ({
    id: course._id,
    title: course.title,
    professor: course.professor.name,
    totalHours: course.hours,
  }));
}

export async function getCourseById(courseId: string): Promise<Course | undefined> {
  const response = await api.get<{ status: string; data: BackendCourse }>(
    `/courses/${courseId}`
  );
  if (response.data.status !== 'SUCCESS') {
    throw new Error('Failed to fetch course');
  }
  const course = response.data.data;
  return {
    id: course._id,
    title: course.title,
    professor: course.professor.name,
    totalHours: course.hours,
  };
}

export async function getCourseLectures(courseId: string, page = 1, limit = 5): Promise<Lecture[]> {
  const response = await api.get<{ status: string; data: { lectures: BackendLecture[]; total: number } }>(
    `/lectures/${courseId}?page=${page}&limit=${limit}`
  );
  if (response.data.status !== 'SUCCESS') {
    throw new Error('Failed to fetch lectures');
  }
  // Map backend lectures to frontend Lecture type
  return response.data.data.lectures.map((lecture) => ({
    id: lecture._id,
    title: lecture.title,
    fileUrl: lecture.fileUrl,
  }));
}

export async function submitAssignment(
  assignmentId: string,
  file: File
): Promise<{ submissionId: string } | false> {
  try {
    console.log('Submitting assignment:', assignmentId);
    console.log('File being uploaded:', file.name, file.size, file.type);
    
    const formData = new FormData();
    formData.append('fileUrl', file);
    
    console.log('FormData created with file:', file.name);
    
    const response = await api.post(`/submissions/${assignmentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('API Response:', response.data);
    
    if (response.data.status === 'SUCCESS' && response.data.data && response.data.data.submission && response.data.data.submission._id) {
      return { submissionId: response.data.data.submission._id };
    }
    return false;
  } catch (error) {
    console.error('Submission error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    return false;
  }
}

// TODO: Implement real API call for student profile if needed

export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate password validation
      if (currentPassword === "oldpassword") {
        if (
          newPassword.length >= 8 &&
          /[A-Z]/.test(newPassword) &&
          /[0-9]/.test(newPassword)
        ) {
          resolve({
            success: true,
            message: "Password updated successfully!",
          });
        } else {
          resolve({
            success: false,
            message:
              "Password must be at least 8 characters with 1 uppercase letter and 1 number.",
          });
        }
      } else {
        resolve({
          success: false,
          message: "Current password is incorrect.",
        });
      }
    }, 800);
  });
}

export async function getCourseDetails(courseId: string): Promise<BackendDetailedCourse> {
  const response = await api.get<{ status: string; data: { course: BackendDetailedCourse } }>(
    `/courses/${courseId}`
  );
  if (response.data.status !== 'SUCCESS') {
    throw new Error('Failed to fetch course details');
  }
  return response.data.data.course;
}

export async function deleteSubmission(submissionId: string): Promise<boolean> {
  try {
    const response = await api.delete(`/submissions/${submissionId}`);
    return response.data.status === 'SUCCESS';
  } catch (error) {
    return false;
  }
}

export async function getAssignmentSubmissionStatus(assignmentId: string): Promise<{ status: 'submitted' | 'pending' | 'missed', submissionId?: string }> {
  const response = await api.get(`/submissions/${assignmentId}/status`);
  if (response.data.status === 'SUCCESS' && response.data.data && response.data.data.status) {
    return {
      status: response.data.data.status,
      submissionId: response.data.data.id
    };
  }
  throw new Error('Failed to fetch assignment submission status');
}

export async function getSubmissionGrade(submissionId: string): Promise<{ grade: number; maxGrade: number } | null> {
  try {
    const response = await api.get(`/submissions/grade/${submissionId}`);
    if (response.data.status === 'SUCCESS') {
      return response.data.data; // Returns { grade, maxGrade } or null
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch submission grade:', error);
    return null;
  }
}

// Payment API functions
export interface PaymentStatus {
  _id: string;
  student: string;
  orderId: string;
  level: number;
  term: number;
  courses: string[];
  totalHours: number;
  hourRate: number;
  totalAmount: number;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentStatusResponse {
  status: 'SUCCESS' | 'FAIL';
  data: PaymentStatus | null;
  message?: string;
}

export interface StripeSession {
  id: string;
  object: string;
  url: string;
  payment_status: string;
  amount_total: number;
  currency: string;
  customer_email: string;
  mode: string;
  status: string;
}

export interface CreateSessionResponse {
  success: 'SUCCESS' | 'FAIL';
  data: StripeSession;
  message?: string;
}

export async function checkPaymentStatus(): Promise<PaymentStatusResponse> {
  try {
    const response = await api.get<PaymentStatusResponse>('/payment/student/status');
    return response.data;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
}

export async function createPaymentSession(): Promise<CreateSessionResponse> {
  try {
    const response = await api.post<CreateSessionResponse>('/payment/create-session');
    return response.data;
  } catch (error) {
    console.error('Error creating payment session:', error);
    throw error;
  }
}
