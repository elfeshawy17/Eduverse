import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

export interface GradingData {
  grade: number;
  maxGrade: number;
}

interface GradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (gradingData: GradingData) => Promise<void>;
  submission: {
    id: string;
    studentName: string;
    studentEmail: string;
    fileName: string;
    submissionTime: string;
    grade?: number;
    maxGrade?: number;
  } | null;
}

const GradingModal = ({ isOpen, onClose, onSubmit, submission }: GradingModalProps) => {
  const [formData, setFormData] = useState<GradingData>({
    grade: 0,
    maxGrade: 100,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (submission) {
      setFormData({
        grade: submission.grade || 0,
        maxGrade: submission.maxGrade || 100,
      });
    }
  }, [submission]);

  const handleInputChange = (field: keyof GradingData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (formData.grade < 0 || formData.grade > formData.maxGrade) {
      toast({
        title: "Invalid Grade",
        description: `Grade must be between 0 and ${formData.maxGrade}`,
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
    if (formData.maxGrade < 0 || formData.maxGrade > 100) {
      toast({
        title: "Invalid Max Grade",
        description: "Max grade must be between 0 and 100",
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
      await onSubmit(formData);
      onClose();
      toast({
        title: "Success",
        description: "Grades submitted successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error submitting grades:", error);
      toast({
        title: "Error",
        description: "Failed to submit grades. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Grade Submission</DialogTitle>
        </DialogHeader>
        
        {submission && (
          <div className="space-y-6">
            {/* Submission Information */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-medium-gray">Student Name</Label>
                    <p className="font-medium">{submission.studentName}</p>
                  </div>
                  <div>
                    <Label className="text-medium-gray">Email</Label>
                    <p className="font-medium">{submission.studentEmail}</p>
                  </div>
                  <div>
                    <Label className="text-medium-gray">File Name</Label>
                    <p className="font-medium">{submission.fileName}</p>
                  </div>
                  <div>
                    <Label className="text-medium-gray">Submission Time</Label>
                    <p className="font-medium">{formatTime(submission.submissionTime)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grading Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    type="number"
                    min="0"
                    max={formData.maxGrade}
                    value={formData.grade}
                    onChange={(e) => handleInputChange('grade', parseInt(e.target.value) || 0)}
                    placeholder="Enter grade"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="maxGrade">Max Grade</Label>
                  <Input
                    id="maxGrade"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.maxGrade}
                    onChange={(e) => handleInputChange('maxGrade', parseInt(e.target.value) || 0)}
                    placeholder="Enter max grade"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Grades"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GradingModal; 