import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import axios from 'axios';

interface Student {
  _id: string;
  name: string;
  email: string;
  department: string;
  level: number;
  academicId: string;
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
const studentSchema = z.object({
  name: z.string()
    .min(1, { message: "Name is required" })
    .transform(val => val.trim().toLowerCase()),
  email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" })
    .transform(val => val.trim().toLowerCase()),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must include an uppercase letter" })
    .regex(/[a-z]/, { message: "Password must include a lowercase letter" })
    .regex(/[0-9]/, { message: "Password must include a number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must include a special character" })
    .optional()
    .or(z.literal('')), // Allow empty string for edit mode
  department: z.string()
    .min(1, { message: "Department is required" })
    .refine(val => departments.includes(val), { message: "Invalid department" }),
  level: z.string()
    .min(1, { message: "Level is required" })
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 0 && num <= 4 && Number.isInteger(num);
      },
      { message: "Level must be between 0 and 4" }
    ),
  academicId: z.string()
    .min(1, { message: "Academic ID is required" })
    .trim(),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  student?: Student | null;
  onClose: (success?: boolean) => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onClose }) => {
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    email: '',
    password: '',
    department: '',
    level: '',
    academicId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!student;

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        password: '', // Don't populate password in edit mode
        department: student.department || '',
        level: student.level?.toString() || '',
        academicId: student.academicId || '',
      });
    }
  }, [student]);

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
      // Validate the form data
      const validatedData = studentSchema.parse(formData);
      
      // Show loading state
      setIsSubmitting(true);
      
      const token = localStorage.getItem('token');
      const studentData = {
        ...validatedData,
        level: parseInt(validatedData.level),
        role: 'student', // Always set role to student
      };

      // Remove password from data if it's empty in edit mode
      if (isEditing && !studentData.password) {
        delete studentData.password;
      }

      if (isEditing && student) {
        await axios.put(`/api/users/${student._id}`, studentData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(`Student ${formData.name} updated successfully!`);
      } else {
        await axios.post('/api/users', studentData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(`Student ${formData.name} added successfully!`);
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
        toast.error(error.response?.data?.message || 'Failed to save student');
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
          {isEditing ? 'Edit Student' : 'Add New Student'}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={() => onClose()}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="e.g. John Doe"
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
                placeholder="e.g. john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                {isEditing ? 'New Password (leave blank to keep current)' : 'Password'}
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder={isEditing ? 'Enter new password' : 'Enter password'}
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required={!isEditing} // Only required for new students
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
              <label htmlFor="level" className="form-label">Level</label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select Level</option>
                {[0, 1, 2, 3, 4].map((level) => (
                  <option key={level} value={level}>
                    Level {level}
                  </option>
                ))}
              </select>
              {errors.level && <p className="form-error">{errors.level}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="academicId" className="form-label">Academic ID</label>
              <Input
                type="text"
                id="academicId"
                name="academicId"
                placeholder="e.g. 2024001"
                value={formData.academicId}
                onChange={handleChange}
                className="form-input"
              />
              {errors.academicId && <p className="form-error">{errors.academicId}</p>}
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
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Student' : 'Save Student'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StudentForm;
