import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

const departments = [
  'Communication Engineering',
  'Control Engineering',
  'Computer Science',
  'Biomedical Engineering',
  'Networking',
  'Automation',
  'Cybersecurity'
];

// Mock professors for dropdown
const mockProfessors = [
  { id: 1, name: 'Dr. Alan Smith' },
  { id: 2, name: 'Dr. Lisa Johnson' },
  { id: 3, name: 'Dr. Robert Chen' },
  { id: 4, name: 'Dr. Maria Garcia' },
  { id: 5, name: 'Dr. James Wilson' },
];

// Define schema for validation
const courseSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  courseCode: z.string().min(1, { message: "Course code is required" }),
  professor: z.string().min(1, { message: "Professor is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  hours: z.string().min(1, { message: "Hours is required" }).refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0, 
    { message: "Hours must be a positive number" }
  ),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  course?: any;
  onClose: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ course, onClose }) => {
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    courseCode: '',
    professor: '',
    department: '',
    hours: '',
  });
  const [professorSearch, setProfessorSearch] = useState('');
  const [filteredProfessors, setFilteredProfessors] = useState(mockProfessors);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!course;

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        courseCode: course.courseCode || '',
        professor: course.professor || '',
        department: course.department || '',
        hours: course.hours?.toString() || '',
      });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate the form data
      courseSchema.parse(formData);
      
      // Show loading state
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        // Success message
        toast.success(
          isEditing
            ? `Course ${formData.title} updated successfully!`
            : `Course ${formData.title} added successfully!`
        );
        
        // Reset form and close
        setIsSubmitting(false);
        onClose();
      }, 1000);
      
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
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Card className="max-w-2xl mx-auto animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {isEditing ? 'Edit Course' : 'Add New Course'}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
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
                  onChange={(e) => {
                    setProfessorSearch(e.target.value);
                    const filtered = mockProfessors.filter(prof =>
                      prof.name.toLowerCase().includes(e.target.value.toLowerCase())
                    );
                    setFilteredProfessors(filtered);
                  }}
                  className="form-input"
                />
                {professorSearch && (
                  <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                    {filteredProfessors.map((prof) => (
                      <div
                        key={prof.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, professor: prof.name }));
                          setProfessorSearch(prof.name);
                          setFilteredProfessors([]);
                        }}
                      >
                        {prof.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="hidden"
                name="professor"
                value={formData.professor}
              />
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
              <label htmlFor="hours" className="form-label">Weekly Hours</label>
              <Input
                type="number"
                id="hours"
                name="hours"
                placeholder="e.g. 4"
                value={formData.hours}
                onChange={handleChange}
                className="form-input"
                min="1"
              />
              {errors.hours && <p className="form-error">{errors.hours}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
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
