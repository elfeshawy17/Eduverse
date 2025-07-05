import { useState, useEffect } from "react";
import { Assignment, Grade } from "@/types";
import { Calendar, Download, Upload, Clock, AlertCircle, CheckCircle, Eye, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { submitAssignment, deleteSubmission, getAssignmentSubmissionStatus, getSubmissionGrade } from "@/utils/api";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePDFViewer } from "@/contexts/PDFViewerContext";
import axios from "axios";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

interface AssignmentItemProps {
  assignment: Assignment;
}

const AssignmentItem = ({ assignment }: AssignmentItemProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState(false);
  const { toast } = useToast();
  const { openPDF } = usePDFViewer();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'pending' | 'submitted' | 'missed'>('pending');
  const [fileSubmitted, setFileSubmitted] = useState(status === 'submitted');
  const [submitting, setSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | undefined>(assignment.submissionId);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [gradeLoading, setGradeLoading] = useState(false);

  // Fetch real status and submissionId on mount and after submit/delete
  useEffect(() => {
    async function fetchStatus() {
      try {
        const { status: realStatus, submissionId: realSubmissionId } = await getAssignmentSubmissionStatus(assignment.id);
        setStatus(realStatus);
        setSubmissionId(realSubmissionId);
        
        // Fetch grade if submission exists
        if (realSubmissionId) {
          setGradeLoading(true);
          const gradeData = await getSubmissionGrade(realSubmissionId);
          setGrade(gradeData);
          setGradeLoading(false);
        }
      } catch (e) {
        setStatus('pending');
        setSubmissionId(undefined);
        setGrade(null);
        setGradeLoading(false);
      }
    }
    fetchStatus();
  }, [assignment.id]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file only.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const result = await submitAssignment(assignment.id, file);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(async () => {
        setUploading(false);
        setUploadProgress(0);
        setSubmitting(false);
        if (result && typeof result === 'object' && result.submissionId) {
          setFileSubmitted(true);
          // Fetch status and submissionId after submit
          const { status: realStatus, submissionId: realSubmissionId } = await getAssignmentSubmissionStatus(assignment.id);
          setStatus(realStatus);
          setSubmissionId(realSubmissionId);
          
          // Fetch grade if submission exists
          if (realSubmissionId) {
            setGradeLoading(true);
            const gradeData = await getSubmissionGrade(realSubmissionId);
            setGrade(gradeData);
            setGradeLoading(false);
          }
          toast({
            title: "Success!",
            description: "Your assignment has been submitted successfully.",
            variant: "default",
            className: "bg-secondary text-white",
          });
        } else {
          toast({
            title: "Submission failed",
            description: "There was an error submitting your assignment.",
            variant: "destructive",
          });
        }
      }, 500);
    } catch (error) {
      clearInterval(interval);
      setUploading(false);
      setUploadProgress(0);
      setSubmitting(false);
      
      toast({
        title: "Error",
        description: "There was an error uploading your file.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    setDownloadingFile(true);
    
    // Simulate download process
    setTimeout(() => {
      setDownloadingFile(false);
      console.log(`Downloading assignment: ${assignment.id}`);
    }, 1500);
  };

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    openPDF(assignment.fileUrl, assignment.title, 'assignment');
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-400 bg-yellow-50 flex items-center gap-1 px-2">
            <AlertCircle size={12} className="text-yellow-600" />
            <span>Pending</span>
          </Badge>
        );
      case 'submitted':
        return (
          <Badge className="bg-primary/90 text-white flex items-center gap-1 px-2">
            <CheckCircle size={12} className="text-white" />
            <span>Submitted</span>
          </Badge>
        );
      case 'missed':
        return (
          <Badge className="bg-red-600 text-white flex items-center gap-1 px-2">
            <AlertCircle size={12} className="text-white" />
            <span>Missed</span>
          </Badge>
        );
      default:
        return null;
    }
  };

  const getGradeBadge = () => {
    if (gradeLoading) {
      return (
        <Badge variant="outline" className="text-gray-600 border-gray-400 bg-gray-50 flex items-center gap-1 px-2">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
          <span>Loading Grade...</span>
        </Badge>
      );
    }
    
    if (!grade) return null;
    
    const percentage = (grade.grade / grade.maxGrade) * 100;
    let bgColor = "bg-green-600";
    
    if (percentage >= 90) {
      bgColor = "bg-green-600";
    } else if (percentage >= 80) {
      bgColor = "bg-blue-600";
    } else if (percentage >= 70) {
      bgColor = "bg-yellow-600";
    } else {
      bgColor = "bg-red-600";
    }
    
    return (
      <Badge className={`${bgColor} text-white flex items-center gap-1 px-2`}>
        <Award size={12} className="text-white" />
        <span>{grade.grade}/{grade.maxGrade}</span>
      </Badge>
    );
  };

  // Check if due date is near (within 3 days)
  const isDueSoon = () => {
    const dueDate = new Date(assignment.dueDate);
    const today = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const handleDialogFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log('File selected:', file.name, file.size, file.type);
    setSelectedFile(file);
  };

  const handleDialogSubmit = async () => {
    if (!selectedFile) return;
    console.log('Submitting file:', selectedFile.name, selectedFile.size, selectedFile.type);
    setSubmitting(true);
    setUploading(true);
    setUploadProgress(0);
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 10;
      });
    }, 200);
    try {
      const response = await submitAssignment(assignment.id, selectedFile);
      console.log('Submit response:', response);
      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(async () => {
        setUploading(false);
        setUploadProgress(0);
        setSubmitting(false);
        if (response && typeof response === 'object' && response.submissionId) {
          setFileSubmitted(true);
          // Fetch status and submissionId after submit
          const { status: realStatus, submissionId: realSubmissionId } = await getAssignmentSubmissionStatus(assignment.id);
          setStatus(realStatus);
          setSubmissionId(realSubmissionId);
          
          // Fetch grade if submission exists
          if (realSubmissionId) {
            setGradeLoading(true);
            const gradeData = await getSubmissionGrade(realSubmissionId);
            setGrade(gradeData);
            setGradeLoading(false);
          }
          toast({
            title: "Success!",
            description: "Your assignment has been submitted successfully.",
            variant: "default",
            className: "bg-secondary text-white",
          });
        } else {
          toast({
            title: "Submission failed",
            description: "There was an error submitting your assignment.",
            variant: "destructive",
          });
        }
      }, 500);
    } catch (error) {
      console.error('Dialog submit error:', error);
      clearInterval(interval);
      setUploading(false);
      setUploadProgress(0);
      setSubmitting(false);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your assignment.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubmission = async () => {
    if (!submissionId) return;
    const result = await deleteSubmission(submissionId);
    if (result) {
      setSelectedFile(null);
      setFileSubmitted(false);
      // Fetch status and submissionId after delete
      const { status: realStatus, submissionId: realSubmissionId } = await getAssignmentSubmissionStatus(assignment.id);
      setStatus(realStatus);
      setSubmissionId(realSubmissionId);
      setGrade(null); // Clear grade when submission is deleted
      setGradeLoading(false); // Reset grade loading state
      toast({
        title: "Submission deleted",
        description: "Your submission has been deleted.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Delete failed",
        description: "There was an error deleting your submission.",
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className={cn(
        "flex items-center justify-between py-5 px-6 hover:bg-accent/20 transition-colors relative group",
        isDueSoon() && status === "pending" && "bg-red-50/40"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start">
        <div className={cn(
          "p-2.5 rounded-lg mr-4 transition-colors duration-300 flex-shrink-0",
          isHovered ? "bg-primary text-white" : "bg-accent text-primary"
        )}>
          <Calendar size={20} />
        </div>
        <div>
          <h4 className="font-medium text-base mb-1 group-hover:text-primary transition-colors">{assignment.title}</h4>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className={cn(
              "flex items-center text-sm px-2 py-0.5 rounded-full",
              isDueSoon() && status === "pending" 
                ? "bg-red-100 text-red-600" 
                : "bg-gray-100 text-text-secondary"
            )}>
              <Clock size={14} className="mr-1" />
              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
              {isDueSoon() && status === "pending" && (
                <span className="ml-1 font-medium animate-pulse">Due Soon!</span>
              )}
            </div>
            <div>{getStatusBadge()}</div>
            <div>{getGradeBadge()}</div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <a
          href={assignment.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center px-3 py-2 border border-primary text-primary rounded-md text-sm font-medium transition-all duration-300 hover:bg-accent/50",
            isHovered && "bg-accent/50"
          )}
        >
          <Eye size={16} className="mr-1.5" />
          View PDF
        </a>
        
        <button
          type="button"
          className={cn(
            "inline-flex items-center px-3 py-2 border border-primary text-primary rounded-md text-sm font-medium transition-all duration-300 hover:bg-primary hover:text-white",
            isHovered && "bg-primary text-white shadow-sm"
          )}
          onClick={async () => {
            try {
              const response = await axios.get(assignment.fileUrl, { responseType: 'blob' });
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', assignment.title + '.pdf');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            } catch (err) {
              alert('Failed to download file.');
            }
          }}
        >
          <Download size={16} className={cn(
            "mr-1.5 transition-transform duration-300",
            isHovered && "animate-bounce-once"
          )} />
          Download
        </button>
        
        {(status === 'pending' || status === 'submitted') && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
            <Button
              variant={isHovered ? "secondary" : "outline"}
              size="sm"
              className={cn(
                "transition-all duration-300",
                  isHovered && "transform scale-105"
              )}
            >
                <Upload size={16} className="mr-1.5" />
                Submission
            </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assignment Submission</DialogTitle>
                <DialogDescription>
                  Please upload your assignment as a PDF file.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
            <input
              type="file"
              accept=".pdf"
                  id={`dialog-file-upload-${assignment.id}`}
              className="hidden"
                  onChange={handleDialogFileChange}
                  disabled={fileSubmitted}
            />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById(`dialog-file-upload-${assignment.id}`)?.click()}
                  disabled={fileSubmitted}
                >
                  Choose File
                </Button>
                {selectedFile && (
                  <div className="text-sm text-gray-700">{selectedFile.name}</div>
                )}
                <Button
                  onClick={handleDialogSubmit}
                  disabled={!selectedFile || submitting || fileSubmitted}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
                {uploading && (
                  <Progress value={uploadProgress} className="h-1 rounded-none mt-2" />
                )}
                <Button
                  variant="destructive"
                  onClick={status === 'submitted' && submissionId ? handleDeleteSubmission : undefined}
                  disabled={status !== 'submitted' || !submissionId}
                >
                  <Trash2 size={16} className="mr-1.5" />
                  Delete Submission
                </Button>
          </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {uploading && (
        <div className="absolute left-0 right-0 bottom-0 h-1">
          <Progress value={uploadProgress} className="h-1 rounded-none" />
        </div>
      )}

      {/* Line indicator */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300 transform",
        isHovered ? "opacity-100" : "opacity-0",
        status === "missed"
          ? "bg-red-600"
          : isDueSoon() && status === "pending"
            ? "bg-red-500" 
            : status === "submitted"
              ? "bg-primary"
              : "bg-yellow-400"
      )}></div>
    </div>
  );
};

export default AssignmentItem;
