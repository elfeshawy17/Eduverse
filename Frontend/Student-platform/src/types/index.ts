// Backend response type
export interface BackendCourse {
  _id: string;
  title: string;
  professor: {
    _id: string;
    name: string;
    courses: string[];
  };
  hours: number;
}

// Frontend type for CourseCard, etc.
export interface Course {
  id: string;
  title: string;
  professor: string;
  imageUrl?: string;
  totalHours?: number;
}

// Backend response type for lectures
export interface BackendLecture {
  _id: string;
  course: {
    _id: string;
    title: string;
  };
  title: string;
  fileUrl: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Frontend type for lectures
export interface Lecture {
  id: string;
  title: string;
  fileUrl: string;
  fileSize?: string;
}

export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  fileUrl: string;
  status: 'Pending' | 'Submitted' | 'Missed';
  submissionId?: string;
}

export interface Grade {
  grade: number;
  maxGrade: number;
}

export interface AssignmentWithGrade extends Assignment {
  grade?: Grade;
}

export interface StudentProfile {
  name: string;
  email: string;
  academicId: string;
  level: string;
  department: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PDFViewerState {
  isOpen: boolean;
  url: string;
  title: string;
  type: 'lecture' | 'assignment';
}

// Backend detailed course response type
export interface BackendDetailedCourse {
  _id: string;
  title: string;
  courseCode: string;
  professor: {
    _id: string;
    name: string;
  };
  department: string;
  hours: number;
  lecture: Array<{
    _id: string;
    title: string;
    fileUrl: string;
  }>;
  assignment: Array<{
    _id: string;
    title: string;
    fileUrl: string;
    duedate: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
