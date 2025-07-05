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
import { api } from "@/lib/auth";

interface LectureFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lecture: LectureData) => void;
  initialData?: LectureData;
  courseId: string;
}

export interface LectureData {
  id?: string;
  title: string;
  courseId: string;
  order: number;
  attachment?: File | null;
  fileUrl?: string;
}

const LectureFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  courseId,
}: LectureFormModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<LectureData>(
    initialData || {
      title: "",
      courseId: courseId,
      order: 1,
      attachment: null,
      fileUrl: "",
    }
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
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
    
    // Check file size (e.g., 10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setSelectedFile(file);
    setFormData(prev => ({ 
      ...prev, 
      attachment: file
    }));
  };

  const validateForm = () => {
    // For new lectures, title is required
    if (!initialData && !formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }

    // For new lectures, file is required
    if (!initialData && !selectedFile) {
      toast({
        title: "Validation Error",
        description: "Please upload file",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }

    // For new lectures, order is required and must be positive
    if (!initialData && (!formData.order || formData.order < 1)) {
      toast({
        title: "Validation Error",
        description: "Order must be a positive number",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }

    // For updates, if title is provided, validate its length
    if (formData.title.trim() && (formData.title.length < 3 || formData.title.length > 100)) {
      toast({
        title: "Validation Error",
        description: "Title must be between 3 and 100 characters",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Create the form data to submit
      const formDataToSubmit = {
        ...formData,
        attachment: selectedFile,
        courseId: courseId
      };
      
      // Call the parent's onSubmit function
      await onSubmit(formDataToSubmit);
      
      // Only close if submission was successful
      onClose();
    } catch (error) {
      console.error("Error submitting lecture:", error);
      let errorMessage = "Failed to save lecture. Please try again.";
      
      if (error instanceof Error) {
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
            {initialData ? "Edit Lecture" : "Add New Lecture"}
          </DialogTitle>
          <DialogDescription>
            {initialData ? "Update the lecture title." : "Fill in the details for this lecture."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">
                Title {!initialData && <span className="text-red-500">*</span>}
                <span className="text-sm text-muted-foreground ml-1">(3-100 characters)</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required={!initialData}
                minLength={3}
                maxLength={100}
                className={formData.title.length > 0 && (formData.title.length < 3 || formData.title.length > 100) ? 'border-red-500' : ''}
              />
            </div>
            {!initialData && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="order">
                    Order <span className="text-red-500">*</span>
                    <span className="text-sm text-muted-foreground ml-1">(minimum: 1)</span>
                  </Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    min={1}
                    value={formData.order}
                    onChange={handleChange}
                    required={true}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="file">
                    PDF File <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    required={true}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : initialData ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LectureFormModal;

