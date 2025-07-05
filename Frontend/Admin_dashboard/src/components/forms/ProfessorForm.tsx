import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import axios from 'axios';

const departments = [
  'Communication Engineering',
  'Control Engineering',
  'Computer Science',
  'Biomedical Engineering',
  'Networking',
  'Automation',
  'Cybersecurity'
];

const professorRoles = [
  'Lecturer',
  'Assistant Professor',
  'Associate Professor',
  'Professor',
  'Distinguished Professor',
];

// Define schema for validation
const professorSchema = z.object({
  name: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).optional().nullable(),
  department: z.string().min(1, { message: "Department is required" }),
});

type ProfessorFormData = z.infer<typeof professorSchema>;

interface ProfessorFormProps {
  professor?: {
    name?: string;
    email?: string;
    password?: string | null;
    department?: string;
    _id?: string;
  };
  onClose: (success?: boolean) => void;
}

const ProfessorForm: React.FC<ProfessorFormProps> = ({ professor, onClose }) => {
  const [formData, setFormData] = useState<ProfessorFormData>({
    name: '',
    email: '',
    password: '',
    department: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!professor;

  useEffect(() => {
    if (professor) {
      setFormData({
        name: professor.name || '',
        email: professor.email || '',
        password: null, // Don't populate password for editing
        department: professor.department || '',
      });
    }
  }, [professor]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const schemaToUse = isEditing
        ? professorSchema.partial({ password: true })
        : professorSchema;
      const formDataWithRole = { ...formData, role: 'professor' };
      schemaToUse.parse(formDataWithRole);
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      if (isEditing) {
        await axios.put(`/api/users/${professor?._id}`, {
          name: formData.name,
          email: formData.email,
          department: formData.department,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(`Professor ${formData.name} updated successfully!`);
      } else {
        await axios.post('/api/users', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          department: formData.department,
          role: 'professor',
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(`Professor ${formData.name} added successfully!`);
      }
        setIsSubmitting(false);
      onClose(true);
    } catch (error: unknown) {
      // Log error for debugging
      console.error('Professor API error:', error);
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      } else if (axios.isAxiosError(error)) {
        // Show backend error(s)
        const backendMsg = error.response?.data?.message;
        if (Array.isArray(backendMsg)) {
          setErrors({ general: backendMsg.join(' ') });
          toast.error(backendMsg.join(' '));
        } else if (typeof backendMsg === 'string') {
          setErrors({ general: backendMsg });
          toast.error(backendMsg);
        } else {
          setErrors({ general: 'An error occurred' });
          toast.error('An error occurred');
        }
      } else {
        setErrors({ general: 'An error occurred' });
        toast.error('An error occurred');
      }
        setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {isEditing ? 'Edit Professor' : 'Add New Professor'}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={() => onClose()}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="e.g. Dr. Alan Smith"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="e.g. alan.smith@university.edu"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                {isEditing ? 'Password (leave blank to keep unchanged)' : 'Password'}
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder={isEditing ? "••••••••" : "Minimum 8 characters"}
                value={formData.password || ''}
                onChange={handleChange}
                className="form-input"
                required={!isEditing}
              />
              {errors.password && <p className="form-error">{errors.password}</p>}
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
              <label htmlFor="role" className="form-label">Role</label>
              <Input
                type="text"
                id="role"
                name="role"
                value="professor"
                disabled
                className="form-input"
              />
              <input type="hidden" name="role" value="professor" />
            </div>
          </div>
          {errors.general && <p className="form-error text-center col-span-2">{errors.general}</p>}
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
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Professor' : 'Save Professor'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProfessorForm;
