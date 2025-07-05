import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import LecturesTable from "@/components/tables/LecturesTable";
import AssignmentsTable from "@/components/tables/AssignmentsTable";
import SubmissionsTable from "@/components/tables/SubmissionsTable";
import LectureFormModal from "@/components/modals/LectureFormModal";
import LectureDetailsModal from "@/components/modals/LectureDetailsModal";
import AssignmentFormModal from "@/components/modals/AssignmentFormModal";
import DeadlineModal from "@/components/modals/DeadlineModal";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import GradingModal from "@/components/modals/GradingModal";
import { LectureData } from "@/components/modals/LectureFormModal";
import { AssignmentData } from "@/components/modals/AssignmentFormModal";
import { SubmissionData } from "@/components/tables/SubmissionsTable";
import { GradingData } from "@/components/modals/GradingModal";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/auth";
import AssignmentDetailsModal from "@/components/modals/AssignmentDetailsModal";

// API response interfaces
interface APIResponse<T> {
  status: "SUCCESS" | "FAIL";
  data?: {
    course: T;
  };
  message?: string;
}

interface ApiErrorResponse {
  message: string;
}

interface Professor {
  _id: string;
  name: string;
  courses: string[];
}

interface LectureResponse {
  _id: string;
  title: string;
  fileUrl: string;
  order?: number;
  course: {
    _id: string;
    title: string;
    professor: Professor;
  };
}

interface AssignmentResponse {
  _id: string;
  title: string;
  fileUrl: string;
  duedate: string;
  course: {
    _id: string;
    title: string;
    professor: Professor;
  };
}

interface SubmissionResponse {
  _id: string;
  student: {
    name: string;
    email: string;
  };
  submittedAt: string;
  fileUrl: string;
  status: string;
}

interface Course {
  _id: string;
  title: string;
  courseCode: string;
  department: string;
  hours: number;
  professor: Professor;
  lecture: LectureResponse[];
  assignment: AssignmentResponse[];
  createdAt: string;
  updatedAt: string;
}

// Update the LecturesTable props interface
interface LecturesTableProps {
  lectures: LectureData[];
  onEdit: (lecture: LectureData) => void;
  onDelete: (lectureId: string) => void;
  onView: (lecture: LectureData) => void;
}

const CourseManagement = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { toast } = useToast();
  
  // Course and loading states
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // States for lectures tab
  const [lectures, setLectures] = useState<LectureData[]>([]);
  const [isLectureFormOpen, setIsLectureFormOpen] = useState(false);
  const [isLectureDetailsOpen, setIsLectureDetailsOpen] = useState(false);
  const [isDeleteLectureModalOpen, setIsDeleteLectureModalOpen] = useState(false);
  const [currentLecture, setCurrentLecture] = useState<LectureData | null>(null);
  const [selectedLectureId, setSelectedLectureId] = useState<string>("");
  
  // States for assignments tab
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [isAssignmentFormOpen, setIsAssignmentFormOpen] = useState(false);
  const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState(false);
  const [isDeleteAssignmentModalOpen, setIsDeleteAssignmentModalOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<AssignmentData | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("");
  const [isAssignmentDetailsOpen, setIsAssignmentDetailsOpen] = useState(false);
  
  // States for submissions tab
  const [isSubmissionsVisible, setIsSubmissionsVisible] = useState(false);
  const [currentSubmissionAssignment, setCurrentSubmissionAssignment] = useState<AssignmentData | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [submissionsError, setSubmissionsError] = useState<string | null>(null);
  
  // States for grading
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<SubmissionData | null>(null);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState("lectures");

  // Load course data
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        setError("Course ID is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get<APIResponse<Course>>(`/courses/${courseId}`);
        
        if (response.data.status === "SUCCESS" && response.data.data) {
          const courseData = response.data.data.course;
          setCourse(courseData);
          
          // Transform lectures data
          const transformedLectures = courseData.lecture.map((lecture: LectureResponse) => ({
            id: lecture._id,
            title: lecture.title,
            courseId: courseId,
            order: lecture.order || 1,
            fileUrl: lecture.fileUrl
          }));
          setLectures(transformedLectures);
          
          // Transform assignments data
          console.log('Raw assignment data:', courseData.assignment);
          const transformedAssignments = courseData.assignment.map((assignment: AssignmentResponse) => {
            console.log('Processing assignment:', assignment);
            return {
            id: assignment._id,
            title: assignment.title,
            description: "", // Description is not provided in the API
            courseId: courseId,
              deadline: assignment.duedate,
            fileUrl: assignment.fileUrl
            };
          });
          console.log('Transformed assignments:', transformedAssignments);
          setAssignments(transformedAssignments);
        } else {
          throw new Error(response.data.message || "Failed to load course data");
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to load course data. Please try again.";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, toast]);

  // Lectures handlers
  const handleAddLecture = () => {
    setCurrentLecture(null);
    setIsLectureFormOpen(true);
  };

  const handleEditLecture = (lecture: LectureData) => {
    setCurrentLecture(lecture);
    setIsLectureFormOpen(true);
  };

  const handleViewLectureDetails = (lecture: LectureData) => {
    setCurrentLecture(lecture);
    setIsLectureDetailsOpen(true);
  };

  const handleDeleteLectureClick = (lectureId: string) => {
    setSelectedLectureId(lectureId);
    setIsDeleteLectureModalOpen(true);
  };

  const handleLectureDelete = async () => {
    try {
      const response = await api.delete(`/lectures/${selectedLectureId}`);
      
      if (response.data.status === "SUCCESS") {
    const updatedLectures = lectures.filter(
      (lecture) => lecture.id !== selectedLectureId
    );
    setLectures(updatedLectures);
    setIsDeleteLectureModalOpen(false);
    toast({
      title: "Lecture deleted successfully",
      className: "bg-secondary text-white animate-slide-in-right",
      duration: 3000,
    });
      } else {
        throw new Error(response.data.message || "Failed to delete lecture");
      }
    } catch (error) {
      console.error("Error deleting lecture:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete lecture. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleLectureSubmit = async (lectureData: LectureData) => {
    try {
    if (lectureData.id) {
        // For updates, send only the title as JSON
        const response = await api.put(`/lectures/${lectureData.id}`, {
          title: lectureData.title
        });

        if (response.data.status === "SUCCESS") {
          // Update existing lecture in state
      const updatedLectures = lectures.map((lecture) =>
        lecture.id === lectureData.id ? {
          ...lecture,
              title: lectureData.title
        } : lecture
      );
      setLectures(updatedLectures);
          
      toast({
        title: "Lecture updated successfully",
        className: "bg-secondary text-white animate-slide-in-right",
        duration: 3000,
      });
    } else {
          throw new Error(response.data.message || "Failed to update lecture");
        }
      } else {
        // For new lectures, use FormData for file upload
        const formData = new FormData();
        
        // Validate required fields
        if (!lectureData.title.trim()) {
          throw new Error("Title is required");
        }
        if (!lectureData.attachment) {
          throw new Error("Please upload file");
        }
        if (!lectureData.order || lectureData.order < 1) {
          throw new Error("Order must be a positive number");
        }
        
        // Append fields to FormData
        formData.append("title", lectureData.title.trim());
        formData.append("fileUrl", lectureData.attachment);
        formData.append("order", lectureData.order.toString());
        
        console.log("Sending POST request to create lecture...");
        const response = await api.post(`/lectures/${courseId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        });

        console.log("Response received:", response.data);

        if (response.data.status === "SUCCESS") {
          // Add new lecture to state
          const newLecture = {
            id: response.data.data._id,
            title: response.data.data.title,
        courseId: courseId,
            order: response.data.data.order,
            fileUrl: response.data.data.fileUrl
      };
      setLectures([...lectures, newLecture]);
          
      toast({
        title: "Lecture added successfully",
        className: "bg-secondary text-white animate-slide-in-right",
            duration: 3000,
          });
        } else {
          throw new Error(response.data.message || "Failed to create lecture");
        }
      }
    } catch (error) {
      console.error("Error submitting lecture:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save lecture. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Assignments handlers
  const handleAddAssignment = () => {
    setCurrentAssignment(null);
    setIsAssignmentFormOpen(true);
  };

  const handleEditAssignment = (assignment: AssignmentData) => {
    setCurrentAssignment(assignment);
    setIsAssignmentFormOpen(true);
  };

  const handleSetDeadline = (assignment: AssignmentData) => {
    setCurrentAssignment(assignment);
    setIsDeadlineModalOpen(true);
  };

  const handleDeleteAssignmentClick = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    setIsDeleteAssignmentModalOpen(true);
  };

  const handleAssignmentDelete = async () => {
    try {
      const response = await api.delete(`/assignments/${selectedAssignmentId}`);

      if (response.data.status === "SUCCESS") {
        // Remove the deleted assignment from state
    const updatedAssignments = assignments.filter(
      (assignment) => assignment.id !== selectedAssignmentId
    );
    setAssignments(updatedAssignments);
    setIsDeleteAssignmentModalOpen(false);
        
    toast({
      title: "Assignment deleted successfully",
      className: "bg-secondary text-white animate-slide-in-right",
      duration: 3000,
    });
      } else {
        throw new Error(response.data.message || "Failed to delete assignment");
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      let errorMessage = "Failed to delete assignment. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("401")) {
          errorMessage = "Unauthorized access. Please log in again.";
        } else if (error.message.includes("403")) {
          errorMessage = "You are not authorized to delete assignments.";
        } else if (error.message.includes("400")) {
          errorMessage = "Assignment not found.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleAssignmentSubmit = async (assignmentData: AssignmentData) => {
    try {
    if (assignmentData.id) {
        // Update existing assignment title only
        const response = await api.put(`/assignments/${assignmentData.id}`, {
          title: assignmentData.title
        });

        if (response.data.status === "SUCCESS") {
      const updatedAssignments = assignments.map((assignment) =>
            assignment.id === assignmentData.id ? {
              ...assignment,
              title: assignmentData.title
            } : assignment
      );
      setAssignments(updatedAssignments);
      toast({
            title: "Success",
            description: "Assignment title updated successfully",
        duration: 3000,
      });
        } else {
          throw new Error(response.data.message || "Failed to update assignment");
        }
    } else {
      // Add new assignment
        const formData = new FormData();
        formData.append("title", assignmentData.title);
        formData.append("duedate", assignmentData.deadline);
        if (assignmentData.file) {
          formData.append("fileUrl", assignmentData.file);
        }

        // Log the request data for debugging
        console.log("Submitting assignment with data:", {
          title: assignmentData.title,
          duedate: assignmentData.deadline,
          hasFile: !!assignmentData.file,
          fileType: assignmentData.file?.type,
          fileSize: assignmentData.file?.size
        });

        const response = await api.post(`/assignments/${courseId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // Add timeout and max content length
          timeout: 30000, // 30 seconds
          maxContentLength: 50 * 1024 * 1024, // 50MB
          maxBodyLength: 50 * 1024 * 1024, // 50MB
        });

        // Log the response for debugging
        console.log("Assignment submission response:", response.data);

        if (response.data.status === "SUCCESS" && response.data.data) {
      const newAssignment = {
            id: response.data.data._id,
            title: response.data.data.title,
            deadline: response.data.data.duedate,
            courseId: courseId,
            fileUrl: response.data.data.fileUrl
      };
      setAssignments([...assignments, newAssignment]);
      toast({
            title: "Success",
            description: "New assignment added successfully",
        duration: 3000,
          });
        } else {
          throw new Error(response.data.message || "Failed to add assignment");
        }
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      
      // More detailed error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
      
      let errorMessage = "Failed to save assignment. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      throw error; // Re-throw to let the form handle the error state
    }
  };

  const handleDeadlineUpdate = async (newDeadline: string) => {
    if (currentAssignment) {
      try {
        const response = await api.put(`/assignments/${currentAssignment.id}`, {
          duedate: newDeadline
        });

        if (response.data.status === "SUCCESS") {
      const updatedAssignments = assignments.map((assignment) =>
        assignment.id === currentAssignment.id
          ? { ...assignment, deadline: newDeadline }
          : assignment
      );
      setAssignments(updatedAssignments);
      setIsDeadlineModalOpen(false);
      toast({
            title: "Success",
            description: "Deadline updated successfully",
        duration: 3000,
      });
        } else {
          throw new Error(response.data.message || "Failed to update deadline");
        }
      } catch (error) {
        console.error("Error updating deadline:", error);
        let errorMessage = "Failed to update deadline. Please try again.";
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  };

  // Submissions handlers
  const handleViewSubmissions = async (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      setCurrentSubmissionAssignment(assignment);
      setIsSubmissionsVisible(true);
      setActiveTab("submissions");
      setCurrentPage(1); // Reset to first page
      await fetchSubmissions(assignmentId, 1);
    }
  };

  const fetchSubmissions = async (assignmentId: string, page: number) => {
    setIsLoadingSubmissions(true);
    setSubmissionsError(null);
    try {
      const response = await api.get(`/submissions/${assignmentId}`, {
        params: {
          page,
          limit: 4
        }
      });

      if (response.data.status === "SUCCESS") {
        const submissionsRaw = response.data.data.submissions;
        // Fetch grades for all submissions in parallel
        const submissionsWithGrades = await Promise.all(
          submissionsRaw.map(async (submission: SubmissionResponse) => {
            let grade = undefined;
            let maxGrade = undefined;
            try {
              const gradeRes = await api.get(`/submissions/grade/${submission._id}`);
              if (gradeRes.data.status === "SUCCESS" && gradeRes.data.data) {
                grade = gradeRes.data.data.grade;
                maxGrade = gradeRes.data.data.maxGrade;
              }
            } catch (e) {
              // If error, leave grade/maxGrade undefined
            }
            return {
              id: submission._id,
              studentName: submission.student.name,
              studentEmail: submission.student.email,
              submissionTime: submission.submittedAt,
              fileName: submission.fileUrl.split('/').pop() || 'submission.pdf',
              fileUrl: submission.fileUrl,
              status: submission.status,
              grade,
              maxGrade,
            };
          })
        );
        setSubmissions(submissionsWithGrades);
        setTotalPages(Math.ceil(response.data.data.submissions.length / 4));
      } else {
        throw new Error(response.data.message || "Failed to fetch submissions");
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      let errorMessage = "Failed to fetch submissions. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setSubmissionsError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  const handlePageChange = async (newPage: number) => {
    if (currentSubmissionAssignment) {
      setCurrentPage(newPage);
      await fetchSubmissions(currentSubmissionAssignment.id, newPage);
    }
  };

  const handleBackToAssignments = () => {
    setIsSubmissionsVisible(false);
    setActiveTab("assignments");
    setSubmissions([]);
    setCurrentPage(1);
    setTotalPages(1);
    setSubmissionsError(null);
  };

  const handleDownloadSubmission = async (fileUrl: string) => {
    try {
      // Show loading toast
      toast({
        title: "Downloading...",
        description: "Your file is being prepared for download.",
        duration: 2000,
      });

      // Fetch the file
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Failed to download file');
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from URL or use a default name
      const filename = fileUrl.split('/').pop() || 'submission.pdf';
      link.download = filename;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      window.URL.revokeObjectURL(url);

      // Show success toast
      toast({
        title: "Download Complete",
        description: "Your file has been downloaded successfully.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the file. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleViewSubmission = (fileUrl: string) => {
    // Open the PDF in a new tab
    window.open(fileUrl, '_blank');
  };

  const handleViewAssignment = (assignment: AssignmentData) => {
    setCurrentAssignment(assignment);
    setIsAssignmentDetailsOpen(true);
  };

  // Grading handlers
  const handleGradeSubmission = (submission: SubmissionData) => {
    setCurrentSubmission(submission);
    setIsGradingModalOpen(true);
  };

  const handleGradingSubmit = async (gradingData: GradingData) => {
    if (!currentSubmission) return;

    try {
      // Call real backend API with updated route
      const response = await api.post(`/submissions/grade/${currentSubmission.id}`, {
        maxGrade: gradingData.maxGrade,
        grade: gradingData.grade,
      });

      if (response.data.status === "SUCCESS" && response.data.data) {
        // Update the submission in the table with the response data
        const updatedSubmission = response.data.data;
        const updatedSubmissions = submissions.map((submission) =>
          submission.id === currentSubmission.id
            ? {
                ...submission,
                grade: updatedSubmission.grade,
                maxGrade: updatedSubmission.maxGrade,
                status: updatedSubmission.status,
                submissionTime: updatedSubmission.submittedAt,
                fileUrl: updatedSubmission.fileUrl,
                // add any other fields you want to update from backend
              }
            : submission
        );
        setSubmissions(updatedSubmissions);
        setIsGradingModalOpen(false);
        setCurrentSubmission(null);
        toast({
          title: "Success",
          description: "Grades submitted successfully",
          duration: 3000,
        });
      } else {
        throw new Error(response.data.message || "Failed to submit grades");
      }
    } catch (error: any) {
      console.error("Error submitting grades:", error);
      let errorMessage = "Failed to submit grades. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
          <div className="text-red-500 text-xl mb-4">Error: {error}</div>
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Retry
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (!course) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
          <div className="text-medium-gray text-xl">No course data available</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-dark-gray mb-4">{course.title}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-medium-gray"><span className="font-semibold">Course Code:</span> {course.courseCode}</p>
              <p className="text-medium-gray"><span className="font-semibold">Department:</span> {course.department}</p>
              <p className="text-medium-gray"><span className="font-semibold">Total Hours:</span> {course.hours}</p>
            </div>
            <div className="space-y-2">
              <p className="text-medium-gray"><span className="font-semibold">Professor:</span> {course.professor.name}</p>
              <p className="text-medium-gray"><span className="font-semibold">Created:</span> {new Date(course.createdAt).toLocaleDateString()}</p>
              <p className="text-medium-gray"><span className="font-semibold">Last Updated:</span> {new Date(course.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="lectures" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="lectures">Lectures ({course.lecture.length})</TabsTrigger>
            <TabsTrigger value="assignments">Assignments ({course.assignment.length})</TabsTrigger>
            {isSubmissionsVisible && (
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="lectures" className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Course Lectures</h2>
              <Button onClick={handleAddLecture} className="bg-primary text-white btn-hover">
                <Plus className="w-4 h-4 mr-2" />
                Add Lecture
              </Button>
            </div>

            <LecturesTable
              lectures={lectures}
              onEdit={handleEditLecture}
              onDelete={handleDeleteLectureClick}
              onView={handleViewLectureDetails}
            />

            {/* Lecture Form Modal */}
            {isLectureFormOpen && (
              <LectureFormModal
                isOpen={isLectureFormOpen}
                onClose={() => setIsLectureFormOpen(false)}
                onSubmit={handleLectureSubmit}
                initialData={currentLecture || undefined}
                courseId={courseId}
              />
            )}

            {/* Lecture Details Modal */}
            {isLectureDetailsOpen && currentLecture && (
              <LectureDetailsModal
                isOpen={isLectureDetailsOpen}
                onClose={() => setIsLectureDetailsOpen(false)}
                lecture={currentLecture}
              />
            )}

            {/* Delete Lecture Confirmation */}
            <ConfirmationModal
              isOpen={isDeleteLectureModalOpen}
              onClose={() => setIsDeleteLectureModalOpen(false)}
              onConfirm={handleLectureDelete}
              title="Delete Lecture"
              description="Are you sure you want to delete this lecture? This action cannot be undone."
              confirmText="Delete"
              destructive={true}
            />
          </TabsContent>

          <TabsContent value="assignments" className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Course Assignments</h2>
              <Button onClick={handleAddAssignment} className="bg-primary text-white btn-hover">
                <Plus className="w-4 h-4 mr-2" />
                Add Assignment
              </Button>
            </div>

            <AssignmentsTable
              assignments={assignments}
              onEdit={handleEditAssignment}
              onDelete={handleDeleteAssignmentClick}
              onSetDeadline={handleSetDeadline}
              onView={handleViewAssignment}
              onViewSubmissions={handleViewSubmissions}
            />

            {/* Assignment Form Modal */}
            {isAssignmentFormOpen && (
              <AssignmentFormModal
                isOpen={isAssignmentFormOpen}
                onClose={() => setIsAssignmentFormOpen(false)}
                onSubmit={handleAssignmentSubmit}
                initialData={currentAssignment || undefined}
                courseId={courseId}
              />
            )}

            {/* Deadline Modal */}
            {isDeadlineModalOpen && currentAssignment && (
              <DeadlineModal
                isOpen={isDeadlineModalOpen}
                onClose={() => setIsDeadlineModalOpen(false)}
                onSubmit={handleDeadlineUpdate}
                assignmentTitle={currentAssignment.title}
                currentDeadline={currentAssignment.deadline}
              />
            )}

            {/* Delete Assignment Confirmation */}
            <ConfirmationModal
              isOpen={isDeleteAssignmentModalOpen}
              onClose={() => setIsDeleteAssignmentModalOpen(false)}
              onConfirm={handleAssignmentDelete}
              title="Delete Assignment"
              description="Are you sure you want to delete this assignment? This action cannot be undone."
              confirmText="Delete"
              destructive={true}
            />

            {/* Assignment Details Modal */}
            <AssignmentDetailsModal
              isOpen={isAssignmentDetailsOpen}
              onClose={() => setIsAssignmentDetailsOpen(false)}
              assignment={currentAssignment}
            />
          </TabsContent>

          <TabsContent value="submissions" className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {currentSubmissionAssignment?.title} - Submissions
                </h2>
                <p className="text-medium-gray">
                  Deadline: {currentSubmissionAssignment?.deadline && new Date(currentSubmissionAssignment.deadline).toLocaleDateString()}
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleBackToAssignments}
                className="btn-hover"
              >
                Back to Assignments
              </Button>
            </div>

            {isLoadingSubmissions ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : submissionsError ? (
              <div className="text-red-500 text-center py-8">{submissionsError}</div>
            ) : (
              <>
                <SubmissionsTable
                  submissions={submissions}
                  onDownload={handleDownloadSubmission}
                  onView={handleViewSubmission}
                  onGrade={handleGradeSubmission}
                />
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Grading Modal */}
            <GradingModal
              isOpen={isGradingModalOpen}
              onClose={() => {
                setIsGradingModalOpen(false);
                setCurrentSubmission(null);
              }}
              onSubmit={handleGradingSubmit}
              submission={currentSubmission}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CourseManagement;
