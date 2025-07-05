import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import axios from 'axios';

interface Professor {
  _id: string;
  name: string;
}

interface Lecture {
  _id: string;
  title: string;
}

interface Assignment {
  _id: string;
  title: string;
}

interface Course {
  _id: string;
  title: string;
  courseCode: string;
  professor: Professor;
  department: string;
  hours: number;
  lecture: Lecture[];
  assignment: Assignment[];
  createdAt?: string;
  updatedAt?: string;
}

const departments = [
  'Communication Engineering',
  'Control Engineering',
  'Computer Science',
  'Biomedical Engineering',
  'Networking',
  'Automation',
  'Cybersecurity'
];

// Define schema for validation
const courseSchema = z.object({
  title: z.string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must not exceed 100 characters" })
    .transform(val => val.trim()),
  courseCode: z.string()
    .min(2, { message: "Course code must be at least 2 characters" })
    .max(10, { message: "Course code must not exceed 10 characters" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Course code must be alphanumeric" })
    .transform(val => val.trim()),
  professor: z.string()
    .min(1, { message: "Professor is required" }),
  department: z.string()
    .min(2, { message: "Department must be at least 2 characters" })
    .max(50, { message: "Department must not exceed 50 characters" })
    .refine(val => departments.includes(val), { message: "Invalid department" })
    .transform(val => val.trim()),
  hours: z.string()
    .min(1, { message: "Hours is required" })
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 1 && num <= 6 && Number.isInteger(num);
      },
      { message: "Hours must be between 1 and 6" }
    ),
  lecture: z.array(z.string()).optional(),
  assignment: z.array(z.string()).optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  course?: Course | null;
  onClose: (success?: boolean) => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ course, onClose }) => {
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    courseCode: '',
    professor: '',
    department: '',
    hours: '',
    lecture: [],
    assignment: [],
  });
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [professorSearch, setProfessorSearch] = useState('');
  const [filteredProfessors, setFilteredProfessors] = useState<Professor[]>([]);
  const [showProfessorDropdown, setShowProfessorDropdown] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!course;

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users/professors', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfessors(response.data.data.professors);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || 'Failed to fetch professors');
        } else {
          toast.error('An unexpected error occurred');
        }
      }
    };

    fetchProfessors();
  }, []);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        courseCode: course.courseCode || '',
        professor: course.professor?._id || '',
        department: course.department || '',
        hours: course.hours?.toString() || '',
        lecture: course.lecture?.map(l => l._id) || [],
        assignment: course.assignment?.map(a => a._id) || [],
      });
      if (course.professor?.name) {
        setProfessorSearch(course.professor.name);
      }
    }
  }, [course]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleProfessorSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setProfessorSearch(searchValue);
    
    if (searchValue.trim()) {
      const filtered = professors.filter(prof =>
        prof.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredProfessors(filtered);
      setShowProfessorDropdown(true);
    } else {
      setFilteredProfessors([]);
      setShowProfessorDropdown(false);
    }
  };

  const handleProfessorSelect = (professor: Professor) => {
    setFormData(prev => ({ ...prev, professor: professor._id }));
    setProfessorSearch(professor.name);
    setShowProfessorDropdown(false);
    
    // Clear error when professor is selected
    if (errors.professor) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.professor;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate the form data
      courseSchema.parse(formData);
      
      // Show loading state
      setIsSubmitting(true);
      
      // Prepare professor name for backend (trimmed and lowercased)
      let normalizedProfessor = formData.professor;
      // If professor is an object or ID, find the name from the professors list
      if (professors && professors.length > 0) {
        const found = professors.find(
          (prof) => prof._id === formData.professor || prof.name === formData.professor
        );
        if (found) {
          normalizedProfessor = found.name.trim().toLowerCase();
        } else {
          normalizedProfessor = formData.professor.trim().toLowerCase();
        }
      } else {
        normalizedProfessor = formData.professor.trim().toLowerCase();
      }
      
      const token = localStorage.getItem('token');
      const requestData = {
        ...formData,
        professor: normalizedProfessor,
        hours: Number(formData.hours),
      };

      if (isEditing && course) {
        await axios.put(`/api/courses/${course._id}`, requestData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(`Course ${formData.title} updated successfully!`);
      } else {
        await axios.post('/api/courses', requestData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(`Course ${formData.title} added successfully!`);
      }
      
      // Reset form and close
      setIsSubmitting(false);
      onClose(true);
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Map Zod errors to our errors object
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      } else if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to save course');
      } else {
        toast.error('An unexpected error occurred');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {isEditing ? 'Edit Course' : 'Add New Course'}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={() => onClose()}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="form-group">
              <label htmlFor="title" className="form-label">Title</label>
              <Input
                type="text"
                id="title"
                name="title"
                placeholder="e.g. Introduction to Computer Science"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
              />
              {errors.title && <p className="form-error">{errors.title}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="courseCode" className="form-label">Course Code</label>
              <Input
                type="text"
                id="courseCode"
                name="courseCode"
                placeholder="e.g. CS101"
                value={formData.courseCode}
                onChange={handleChange}
                className="form-input"
              />
              {errors.courseCode && <p className="form-error">{errors.courseCode}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="professor" className="form-label">Professor</label>
              <div className="relative">
                <Input
                  type="text"
                  id="professorSearch"
                  placeholder="Search professor by name"
                  value={professorSearch}
                  onChange={handleProfessorSearch}
                  className="form-input"
                  autoComplete="off"
                />
                <input
                  type="hidden"
                  name="professor"
                  value={formData.professor}
                />
                {showProfessorDropdown && filteredProfessors.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                    {filteredProfessors.map((prof) => (
                      <div
                        key={prof._id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleProfessorSelect(prof)}
                      >
                        {prof.name}
                      </div>
                    ))}
                  </div>
                )}
                {showProfessorDropdown && filteredProfessors.length === 0 && (
                  <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1">
                    <div className="px-4 py-2 text-gray-500">
                      No professors found
                    </div>
                  </div>
                )}
              </div>
              {errors.professor && <p className="form-error">{errors.professor}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="department" className="form-label">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && <p className="form-error">{errors.department}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="hours" className="form-label">Hours</label>
              <select
                id="hours"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select Hours</option>
                {[1, 2, 3, 4, 5, 6].map((hour) => (
                  <option key={hour} value={hour}>
                    {hour} {hour === 1 ? 'Hour' : 'Hours'}
                  </option>
                ))}
              </select>
              {errors.hours && <p className="form-error">{errors.hours}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onClose()}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-hover transition-all duration-200 hover:scale-105 flex items-center"
          >
            {isSubmitting ? (
              <span className="inline-block h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Course' : 'Save Course'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CourseForm;
