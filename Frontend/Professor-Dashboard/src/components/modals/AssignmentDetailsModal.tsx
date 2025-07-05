import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { AssignmentData } from "@/components/modals/AssignmentFormModal";

interface AssignmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: AssignmentData | null;
}

const AssignmentDetailsModal = ({ isOpen, onClose, assignment }: AssignmentDetailsModalProps) => {
  const handleDownload = () => {
    if (assignment?.fileUrl) {
      window.open(assignment.fileUrl, '_blank');
    }
  };

  const handleView = () => {
    if (assignment?.fileUrl) {
      window.open(assignment.fileUrl, '_blank');
    }
  };

  if (!assignment) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assignment Details</DialogTitle>
          <DialogDescription>
            View and manage assignment information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Assignment Information */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-dark-gray mb-2">Assignment Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-medium-gray font-medium">Title:</span>
                  <span className="text-dark-gray">{assignment.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medium-gray font-medium">Due Date:</span>
                  <span className="text-dark-gray">
                    {new Date(assignment.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medium-gray font-medium">Course ID:</span>
                  <span className="text-dark-gray">{assignment.courseId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* File Preview */}
          {assignment.fileUrl && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-dark-gray">Assignment File</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                      <span className="text-red-600 text-xs font-bold">PDF</span>
                    </div>
                    <span className="text-dark-gray font-medium">
                      {assignment.fileUrl.split('/').pop() || 'assignment.pdf'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleView}
                      className="flex items-center space-x-1"
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="flex items-center space-x-1"
                    >
                      <Download size={16} />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>
                <iframe
                  className="w-full h-64 border rounded"
                  src={`${assignment.fileUrl}#toolbar=1&navpanes=1&view=FitH`}
                  title="Assignment Preview"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentDetailsModal; 