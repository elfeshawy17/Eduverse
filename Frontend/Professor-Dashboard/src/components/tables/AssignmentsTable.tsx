import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Calendar, Eye, FileText } from "lucide-react";
import { AssignmentData } from "@/components/modals/AssignmentFormModal";
import { cn } from "@/lib/utils";

interface AssignmentsTableProps {
  assignments: AssignmentData[];
  onEdit: (assignment: AssignmentData) => void;
  onDelete: (assignmentId: string) => void;
  onSetDeadline: (assignment: AssignmentData) => void;
  onView: (assignment: AssignmentData) => void;
  onViewSubmissions: (assignmentId: string) => void;
}

const AssignmentsTable = ({ 
  assignments, 
  onEdit, 
  onDelete, 
  onSetDeadline,
  onView,
  onViewSubmissions
}: AssignmentsTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No deadline set';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="rounded-md border bg-white shadow-sm !bg-white">
      <Table className="bg-white">
        <TableHeader className="bg-white">
          <TableRow className="bg-white hover:bg-gray-50">
            <TableHead className="bg-white">Assignment Title</TableHead>
            <TableHead className="bg-white">Deadline</TableHead>
            <TableHead className="bg-white text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {assignments.length === 0 ? (
            <TableRow className="bg-white">
              <TableCell colSpan={3} className="text-center text-medium-gray py-8 bg-white">
                No assignments available
              </TableCell>
            </TableRow>
          ) : (
            assignments.map((assignment, index) => (
              <TableRow 
                key={assignment.id}
                onMouseEnter={() => setHoveredRow(assignment.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={cn(
                  "transition-all duration-300 bg-white", 
                  hoveredRow === assignment.id ? "bg-gray-50" : "",
                  `animate-slide-in [animation-delay:${index * 0.05}s]`
                )}
              >
                <TableCell className="font-medium bg-white">{assignment.title}</TableCell>
                <TableCell className="bg-white">{formatDate(assignment.deadline)}</TableCell>
                <TableCell className="text-right bg-white">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(assignment)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <Eye size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewSubmissions(assignment.id)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <FileText size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(assignment)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <Pencil size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSetDeadline(assignment)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <Calendar size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(assignment.id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssignmentsTable;
