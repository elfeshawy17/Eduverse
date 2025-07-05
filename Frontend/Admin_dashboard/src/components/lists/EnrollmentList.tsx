import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trash2, Edit } from 'lucide-react';
import EnrollmentForm from '@/components/forms/EnrollmentForm';
import axios from 'axios';

interface Course {
  title: string;
  courseCode: string;
}

interface Enrollment {
  _id: string;
  studentName: string;
  academicId: string;
  courses: Course[];
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  status: string;
  data: {
    enrollments: Enrollment[];
  };
}

interface EnrollmentListProps {
  onCreateEnrollment: () => void;
}

const EnrollmentList: React.FC<EnrollmentListProps> = ({ onCreateEnrollment }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null);
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollments = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Access denied. No token provided.');
      }

      const response = await axios.get<ApiResponse>(`/api/enrollments?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status && response.data.status.toLowerCase() === 'success') {
        setEnrollments(response.data.data.enrollments);
      } else {
        throw new Error('Failed to fetch enrollments');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch enrollments';
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments(currentPage);
  }, [currentPage]);

  // Filter enrollments based on search query
  const filteredEnrollments = searchQuery 
    ? enrollments.filter(enrollment => 
        enrollment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        enrollment.academicId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enrollment.courses.some(course => 
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : enrollments;

  const handleDeleteClick = (academicId: string) => {
    setSelectedEnrollmentId(academicId);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (enrollment: Enrollment) => {
    // Convert courses array to comma-separated string for the form
    const courseCodes = enrollment.courses.map(course => course.courseCode).join(', ');
    setEditingEnrollment({
      ...enrollment,
      courseCodes
    });
  };

  const handleConfirmDelete = async () => {
    if (!selectedEnrollmentId) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Access denied. No token provided.');
      }

      await axios.delete(`/api/enrollments/${selectedEnrollmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      toast.success('Enrollment removed successfully');
      fetchEnrollments(currentPage); // Refresh the list
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to delete enrollment');
      }
    } finally {
      setDeleteDialogOpen(false);
      setSelectedEnrollmentId(null);
    }
  };

  const handleCloseForm = (success?: boolean) => {
    setEditingEnrollment(null);
    if (success) {
      fetchEnrollments(currentPage); // Refresh the list
    }
  };

  if (error) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="py-10">
          <div className="text-center text-red-500">
            <p>{error}</p>
            <Button 
              onClick={() => fetchEnrollments(currentPage)}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Enrollments</CardTitle>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search enrollments..."
                className="form-input w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
              <p className="mt-2">Loading enrollments...</p>
            </div>
          ) : editingEnrollment ? (
            <EnrollmentForm 
              enrollment={editingEnrollment}
              onClose={handleCloseForm}
            />
          ) : filteredEnrollments.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Academic ID</TableHead>
                    <TableHead>All Courses</TableHead>
                    <TableHead>Enrolled Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnrollments.map(enrollment => (
                    <TableRow key={enrollment._id} className="animate-fade-in">
                      <TableCell>{enrollment.studentName}</TableCell>
                      <TableCell>{enrollment.academicId}</TableCell>
                      <TableCell>
                        <ul className="list-disc pl-5">
                          {enrollment.courses.map((course, index) => (
                            <li key={index}>
                              {typeof course === 'string' ? course : `${course.title} (${course.courseCode})`}
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        {new Date(enrollment.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(enrollment)}
                            className="hover:bg-blue-100 hover:text-blue-500"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(enrollment.academicId)}
                            className="hover:bg-red-100 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="py-2 px-4">
                  Page {currentPage}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={enrollments.length < 4}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No enrollments found.</p>
              <Button 
                onClick={onCreateEnrollment}
                className="mt-4"
              >
                Add your first enrollment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Enrollment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this student's enrollment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EnrollmentList;
