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
import { Download, Eye, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface SubmissionData {
  id: string;
  studentName: string;
  studentEmail: string;
  submissionTime: string;
  fileName: string;
  fileUrl: string;
  status: string;
  grade?: number;
  finalGrade?: number;
  feedback?: string;
  maxGrade?: number;
}

interface SubmissionsTableProps {
  submissions: SubmissionData[];
  onDownload: (fileUrl: string) => void;
  onView: (fileUrl: string) => void;
  onGrade: (submission: SubmissionData) => void;
}

const SubmissionsTable = ({ submissions, onDownload, onView, onGrade }: SubmissionsTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGradeColor = (grade: number, maxGrade?: number) => {
    if (!maxGrade || maxGrade === 0) return "bg-gray-200 text-gray-700";
    const percent = (grade / maxGrade) * 100;
    if (percent >= 90) return "bg-green-100 text-green-800";
    if (percent >= 80) return "bg-blue-100 text-blue-800";
    if (percent >= 70) return "bg-yellow-100 text-yellow-800";
    if (percent >= 60) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="rounded-md border bg-white shadow-sm !bg-white">
      <Table className="bg-white">
        <TableHeader className="bg-white">
          <TableRow className="bg-white hover:bg-gray-50">
            <TableHead className="bg-white">Student Name</TableHead>
            <TableHead className="bg-white">Email</TableHead>
            <TableHead className="bg-white">Submission Time</TableHead>
            <TableHead className="bg-white">Grade</TableHead>
            <TableHead className="bg-white text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {submissions.length === 0 ? (
            <TableRow className="bg-white">
              <TableCell colSpan={5} className="text-center text-medium-gray py-8 bg-white">
                No submissions available
              </TableCell>
            </TableRow>
          ) : (
            submissions.map((submission, index) => (
              <TableRow 
                key={submission.id}
                onMouseEnter={() => setHoveredRow(submission.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={cn(
                  "transition-all duration-300 bg-white", 
                  hoveredRow === submission.id ? "bg-gray-50" : "",
                  `animate-slide-in [animation-delay:${index * 0.05}s]`
                )}
              >
                <TableCell className="font-medium bg-white">{submission.studentName}</TableCell>
                <TableCell className="bg-white">{submission.studentEmail}</TableCell>
                <TableCell className="bg-white">{formatTime(submission.submissionTime)}</TableCell>
                <TableCell className="bg-white">
                  {submission.grade !== undefined ? (
                    <span className="inline-flex rounded-full overflow-hidden border border-gray-200 shadow-sm">
                      <span className={cn(
                        "px-3 py-1 text-sm font-semibold flex items-center justify-center",
                        getGradeColor(submission.grade, submission.maxGrade),
                        "border-r border-gray-200"
                      )}>
                        {submission.grade}
                      </span>
                      <span className="px-3 py-1 text-sm font-semibold flex items-center justify-center bg-gray-100 text-gray-700">
                        {submission.maxGrade !== undefined ? submission.maxGrade : "/100"}
                      </span>
                    </span>
                  ) : (
                    <span className="text-medium-gray">Not graded</span>
                  )}
                </TableCell>
                <TableCell className="text-right bg-white">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onGrade(submission)}
                      className="hover:bg-primary/10 hover:text-primary"
                      title="Grade submission"
                    >
                      <Edit size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onView(submission.fileUrl)}
                      className="hover:bg-primary/10 hover:text-primary"
                      title="View submission"
                    >
                      <Eye size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDownload(submission.fileUrl)}
                      className="hover:bg-primary/10 hover:text-primary"
                      title="Download submission"
                    >
                      <Download size={18} />
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

export default SubmissionsTable;
