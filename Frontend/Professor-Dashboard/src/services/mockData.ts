import { LectureData } from "@/components/modals/LectureFormModal";
import { AssignmentData } from "@/components/modals/AssignmentFormModal";
import { SubmissionData } from "@/components/tables/SubmissionsTable";

// Professor Data
export const professorData = {
  id: 1,
  name: "Dr. Jane Smith",
  email: "jane.smith@university.edu",
  department: "Computer Science",
  role: "Professor",
};

// Course Data
export const coursesData = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    totalHours: 48,
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 2,
    title: "Data Structures and Algorithms",
    totalHours: 36,
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 3,
    title: "Web Development Fundamentals",
    totalHours: 42,
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 4,
    title: "Machine Learning Basics",
    totalHours: 54,
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=60",
  },
];

// Lecture Data
export const lecturesData: Record<number, LectureData[]> = {
  1: [
    {
      id: "1",
      title: "Introduction to Programming Concepts",
      courseId: "1",
      order: 1,
    },
    {
      id: "2",
      title: "Variables and Data Types",
      courseId: "1",
      order: 2,
    },
    {
      id: "3",
      title: "Control Structures",
      courseId: "1",
      order: 3,
    },
  ],
  2: [
    {
      id: "4",
      title: "Introduction to Data Structures",
      courseId: "2",
      order: 1,
    },
    {
      id: "5",
      title: "Arrays and Linked Lists",
      courseId: "2",
      order: 2,
    },
  ],
};

// Assignment Data
export const assignmentsData: Record<number, AssignmentData[]> = {
  1: [
    {
      id: "1",
      title: "Hello World Program",
      deadline: "2025-05-13",
      courseId: "1",
    },
    {
      id: "2",
      title: "Calculator Program",
      deadline: "2025-05-20",
      courseId: "1",
    },
    {
      id: "3",
      title: "Temperature Converter",
      deadline: "2025-05-27",
      courseId: "1",
    },
  ],
  2: [
    {
      id: "4",
      title: "Array Implementation",
      deadline: "2025-05-14",
      courseId: "2",
    },
    {
      id: "5",
      title: "Linked List Implementation",
      deadline: "2025-05-21",
      courseId: "2",
    },
  ],
};

// Submissions Data
export const submissionsData: Record<number, SubmissionData[]> = {
  1: [
    {
      id: "1",
      studentName: "Alex Johnson",
      studentEmail: "alex.johnson@student.edu",
      submissionTime: "2025-05-12T15:30:00",
      fileName: "alex_helloworld.py",
      fileUrl: "/files/alex_helloworld.py",
      status: "submitted",
      grade: 85,
      finalGrade: 88,
      feedback: "Good implementation! Consider adding more comments for better code readability.",
    },
    {
      id: "2",
      studentName: "Sarah Williams",
      studentEmail: "sarah.williams@student.edu",
      submissionTime: "2025-05-11T14:22:00",
      fileName: "williams_hello.py",
      fileUrl: "/files/williams_hello.py",
      status: "submitted",
      grade: 92,
      finalGrade: 95,
      feedback: "Excellent work! Clean code and good documentation.",
    },
    {
      id: "3",
      studentName: "Michael Brown",
      studentEmail: "michael.brown@student.edu",
      submissionTime: "2025-05-13T09:15:00",
      fileName: "michael_helloworld.py",
      fileUrl: "/files/michael_helloworld.py",
      status: "submitted",
    },
  ],
  2: [
    {
      id: "4",
      studentName: "Alex Johnson",
      studentEmail: "alex.johnson@student.edu",
      submissionTime: "2025-05-19T16:45:00",
      fileName: "alex_calculator.py",
      fileUrl: "/files/alex_calculator.py",
      status: "submitted",
      grade: 78,
      finalGrade: 80,
      feedback: "Good basic functionality. Consider adding input validation.",
    },
    {
      id: "5",
      studentName: "Sarah Williams",
      studentEmail: "sarah.williams@student.edu",
      submissionTime: "2025-05-18T17:30:00",
      fileName: "williams_calculator.py",
      fileUrl: "/files/williams_calculator.py",
      status: "submitted",
    },
  ],
  // Other assignments have no submissions yet
};

// Helper Functions
export const getCourse = (courseId: number) => {
  return coursesData.find(course => course.id === courseId);
};

export const getLectures = (courseId: number) => {
  return lecturesData[courseId] || [];
};

export const getAssignments = (courseId: number) => {
  return assignmentsData[courseId] || [];
};

export const getSubmissions = (assignmentId: number) => {
  return submissionsData[assignmentId] || [];
};
