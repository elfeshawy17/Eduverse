import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AssignmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assignment: AssignmentData) => void;
  initialData?: AssignmentData;
  courseId: string;
}

export interface AssignmentData {
  id?: string;
  title: string;
  deadline: string;
  courseId: string;
  file?: File | null;
  fileUrl?: string;
}

const AssignmentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  courseId,
}: AssignmentFormModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Format ISO date string to YYYY-MM-DD for input
  const formatDateForInput = (isoString: string) => {
    if (!isoString) return "";
    try {
      return new Date(isoString).toISOString().split('T')[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const [formData, setFormData] = useState<AssignmentData>(
    initialData ? {
      ...initialData,
      deadline: formatDateForInput(initialData.deadline)
    } : {
      title: "",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Default: 7 days from now
      courseId: courseId,
      file: null,
      fileUrl: "",
    }
  );

  const validateForm = () => {
    // Title validation
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }

    if (formData.title.length < 3) {
      toast({
        title: "Validation Error",
        description: "Title must be at least 3 characters long",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }

    if (formData.title.length > 100) {
      toast({
        title: "Validation Error",
        description: "Title must not exceed 100 characters",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }

    // For new assignments, file is required
    if (!initialData && !selectedFile) {
      toast({
        title: "Validation Error",
        description: "Please upload a PDF file",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }

    // Deadline validation
    if (!formData.deadline) {
      toast({
        title: "Validation Error",
        description: "Due date is required",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }

    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file only",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setSelectedFile(file);
    setFormData(prev => ({ 
      ...prev, 
      file: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Validate file size (max 10MB)
      if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
          duration: 5000,
        });
        return;
      }

      // Create the form data to submit
      const formDataToSubmit = {
        ...formData,
        file: selectedFile,
        courseId: courseId,
        // Convert deadline to ISO format for API consistency
        deadline: new Date(formData.deadline).toISOString()
      };

      // Log the data being submitted
      console.log("Submitting assignment data:", {
        title: formDataToSubmit.title,
        deadline: formDataToSubmit.deadline,
        hasFile: !!formDataToSubmit.file,
        fileType: formDataToSubmit.file?.type,
        fileSize: formDataToSubmit.file?.size
      });
      
      // Call the parent's onSubmit function
      await onSubmit(formDataToSubmit);
      
      // Only close if submission was successful
      onClose();
    } catch (error) {
      console.error("Error submitting assignment:", error);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-fade-in">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Assignment" : "Add New Assignment"}
          </DialogTitle>
          <DialogDescription>
            {initialData ? "Update the assignment title." : "Fill in the details for this assignment."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={100}
                placeholder="Enter assignment title"
              />
            </div>
            {!initialData && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="file">Assignment File (PDF only)</Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    required={!initialData}
                  />
                  {selectedFile && (
                    <div className="text-sm text-muted-foreground">
                      Selected file: {selectedFile.name}
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentFormModal;

