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
import { Pencil, Trash2, Eye } from "lucide-react";
import { LectureData } from "@/components/modals/LectureFormModal";
import { cn } from "@/lib/utils";

interface LecturesTableProps {
  lectures: LectureData[];
  onEdit: (lecture: LectureData) => void;
  onDelete: (lectureId: string) => void;
  onView: (lecture: LectureData) => void;
}

const LecturesTable = ({ lectures, onEdit, onDelete, onView }: LecturesTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <div className="rounded-md border bg-white shadow-sm !bg-white">
      <Table className="bg-white">
        <TableHeader className="bg-white">
          <TableRow className="bg-white hover:bg-gray-50">
            <TableHead className="bg-white">Title</TableHead>
            <TableHead className="bg-white text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {lectures.length === 0 ? (
            <TableRow className="bg-white">
              <TableCell colSpan={2} className="text-center text-medium-gray py-8 bg-white">
                No lectures available
              </TableCell>
            </TableRow>
          ) : (
            lectures.map((lecture, index) => (
              <TableRow 
                key={lecture.id}
                onMouseEnter={() => setHoveredRow(lecture.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={cn(
                  "transition-all duration-300 bg-white", 
                  hoveredRow === lecture.id ? "bg-gray-50" : "",
                  `animate-slide-in [animation-delay:${index * 0.05}s]`
                )}
              >
                <TableCell className="font-medium bg-white">{lecture.title}</TableCell>
                <TableCell className="text-right bg-white">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(lecture)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <Eye size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(lecture)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <Pencil size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(lecture.id)}
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

export default LecturesTable;
