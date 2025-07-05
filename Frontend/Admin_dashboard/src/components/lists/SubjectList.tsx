import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Search } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

// Mock data for courses
const mockCourses = [
  { id: 1, title: 'Introduction to Computer Science', courseCode: 'CS101', professor: 'Dr. Alan Smith', department: 'Computer Science', hours: 4 },
  { id: 2, title: 'Calculus I', courseCode: 'MATH101', professor: 'Dr. Lisa Johnson', department: 'Mathematics', hours: 3 },
  { id: 3, title: 'Quantum Physics', courseCode: 'PHYS301', professor: 'Dr. Robert Chen', department: 'Physics', hours: 5 },
  { id: 4, title: 'Organic Chemistry', courseCode: 'CHEM201', professor: 'Dr. Maria Garcia', department: 'Chemistry', hours: 4 },
  { id: 5, title: 'Cell Biology', courseCode: 'BIO101', professor: 'Dr. James Wilson', department: 'Biology', hours: 3 },
];

interface CourseListProps {
  onEditCourse: (course: any) => void;
}

const CourseList: React.FC<CourseListProps> = ({ onEditCourse }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter courses based on search term
  const filteredCourses = mockCourses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.professor.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate courses
  const indexOfLastCourse = currentPage * itemsPerPage;
  const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const handleDelete = (id: number) => {
    // In a real app, you would call an API to delete the course
    console.log(`Deleting course with id ${id}`);
    toast.success("Course deleted successfully");
  };

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search by title, professor or department..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-9"
          />
        </div>
      </div>
      
      {currentCourses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No courses found
        </div>
      ) : (
        <>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Course Code</TableHead>
                  <TableHead className="hidden md:table-cell">Professor</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden md:table-cell">Hours</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCourses.map((course) => (
                  <TableRow key={course.id} className="animate-fade-in">
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell className="hidden md:table-cell">{course.courseCode}</TableCell>
                    <TableCell className="hidden md:table-cell">{course.professor}</TableCell>
                    <TableCell className="hidden md:table-cell">{course.department}</TableCell>
                    <TableCell className="hidden md:table-cell">{course.hours}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onEditCourse(course)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 border-red-200 hover:bg-red-100 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Course</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {course.title}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(course.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredCourses.length > itemsPerPage && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: Math.ceil(filteredCourses.length / itemsPerPage) }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredCourses.length / itemsPerPage)))}
                    className={currentPage === Math.ceil(filteredCourses.length / itemsPerPage) ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default CourseList;
