
import { useState, useEffect } from "react";
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

interface DeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deadline: string) => void;
  assignmentTitle: string;
  currentDeadline: string;
}

const DeadlineModal = ({
  isOpen,
  onClose,
  onSubmit,
  assignmentTitle,
  currentDeadline,
}: DeadlineModalProps) => {
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

  const [deadline, setDeadline] = useState(formatDateForInput(currentDeadline));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert back to ISO format for API consistency
    const isoDeadline = new Date(deadline).toISOString();
    onSubmit(isoDeadline);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-fade-in">
        <DialogHeader>
          <DialogTitle>Update Deadline</DialogTitle>
          <DialogDescription>
            Update the deadline for "{assignmentTitle}"
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="deadline">New Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeadlineModal;
