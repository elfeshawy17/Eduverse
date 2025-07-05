import React, { useState, useEffect } from 'react';
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
import axios from 'axios';

interface ProfessorListProps {
  onEditProfessor: (professor: any) => void;
  refresh?: boolean;
}

const ProfessorList: React.FC<ProfessorListProps> = ({ onEditProfessor, refresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  const fetchProfessors = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/users/professors?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfessors(response.data.data.professors);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      setError('Failed to fetch professors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessors(currentPage);
  }, [currentPage]);

  const filteredProfessors = professors.filter((professor: any) =>
    professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Professor deleted successfully');
      setProfessors((prev: any) => prev.filter((prof: any) => prof._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete professor');
    }
  };

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search by name, email or department..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-9"
          />
        </div>
      </div>
      
      {filteredProfessors.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No professors found
        </div>
      ) : (
        <>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfessors.map((professor) => (
                  <TableRow key={professor._id} className="animate-fade-in">
                    <TableCell className="font-medium">{professor.name}</TableCell>
                    <TableCell>{professor.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{professor.department}</TableCell>
                    <TableCell className="hidden md:table-cell">{professor.role}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onEditProfessor(professor)}
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
                              <AlertDialogTitle>Delete Professor</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {professor.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(professor._id)}
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
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="py-2 px-4">Page {currentPage}</span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={professors.length < 4}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfessorList;
