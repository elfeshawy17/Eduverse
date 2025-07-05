import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { LectureData } from "@/components/modals/LectureFormModal";

interface LectureDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecture: LectureData;
}

const LectureDetailsModal = ({
  isOpen,
  onClose,
  lecture,
}: LectureDetailsModalProps) => {
  const handleDownload = () => {
    if (lecture.fileUrl) {
      const link = document.createElement('a');
      link.href = lecture.fileUrl;
      link.download = `${lecture.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl animate-fade-in max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{lecture.title}</DialogTitle>
          <DialogDescription className="flex justify-between items-center">
            <span>Lecture Document</span>
            {lecture.fileUrl && (
              <Button variant="outline" size="sm" onClick={handleDownload} className="flex items-center gap-1">
                <Download size={16} />
                <span>Download</span>
              </Button>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="h-[60vh] overflow-hidden rounded border">
          {lecture.fileUrl ? (
            <iframe 
              src={lecture.fileUrl} 
              className="w-full h-full" 
              title={lecture.title}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-muted">
              <p className="text-muted-foreground">No PDF attachment available</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LectureDetailsModal;
