import React, { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface Course {
  title: string;
  courseCode: string;
}

interface Enrollment {
  studentName: string;
  academicId: string;
  courses: Course[];
  courseCodes?: string;
}

interface EnrollmentFormProps {
  enrollment?: Enrollment;
  onClose: (success?: boolean) => void;
}

interface EnrollmentFormData {
  academicId: string;
  courseCodes: string;
}

const enrollmentSchema = z.object({
  academicId: z.string()
    .min(1, 'Academic ID is required')
    .trim(),
  courseCodes: z.string()
    .min(1, 'At least one course code is required')
    .refine(
      (val) => val.split(',').every(code => code.trim().length > 0),
      'Invalid course code format'
    )
});

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ enrollment, onClose }) => {
  const [formData, setFormData] = useState<EnrollmentFormData>({
    academicId: enrollment?.academicId || '',
    courseCodes: enrollment?.courseCodes || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate the form data
      enrollmentSchema.parse(formData);
      
      // Show loading state
      setIsSubmitting(true);

      // Convert course codes string to array
      const courses = formData.courseCodes.split(',').map(code => code.trim());
      
      const requestData = {
        academicId: formData.academicId,
        courses: courses
      };

      if (enrollment) {
        // Update existing enrollment
        await axios.put(`/api/enrollments/${enrollment.academicId}`, requestData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Enrollment updated successfully');
      } else {
        // Create new enrollment
        await axios.post('/api/enrollments', requestData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Enrollment created successfully');
      }
      
      // Reset form and close
      setFormData({
        academicId: '',
        courseCodes: ''
      });
      
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
        toast.error(error.response?.data?.message || 'Failed to save enrollment');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{enrollment ? 'Edit Enrollment' : 'Enroll Student in Courses'}</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => onClose()}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="academicId" className="form-label">Academic ID</label>
            <Input
              id="academicId"
              name="academicId"
              value={formData.academicId}
              onChange={(e) => setFormData(prev => ({ ...prev, academicId: e.target.value }))}
              placeholder="Enter student's academic ID"
              className="form-input"
              disabled={!!enrollment}
            />
            {errors.academicId && <p className="form-error">{errors.academicId}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="courseCodes" className="form-label">Course Codes</label>
            <Input
              id="courseCodes"
              name="courseCodes"
              value={formData.courseCodes}
              onChange={(e) => setFormData(prev => ({ ...prev, courseCodes: e.target.value }))}
              placeholder="Enter course codes (comma-separated)"
              className="form-input"
            />
            <p className="text-xs text-gray-500 mt-1">Enter course codes separated by commas (e.g., CS101, MATH101)</p>
            {errors.courseCodes && <p className="form-error">{errors.courseCodes}</p>}
          </div>
          
          <div className="flex gap-2 justify-end mt-6">
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
              className="bg-primary hover:bg-primary-hover transition-all duration-200 hover:scale-105 flex items-center justify-center"
            >
              {isSubmitting ? (
                <span className="inline-block h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? 'Saving...' : enrollment ? 'Update Enrollment' : 'Enroll Student'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnrollmentForm;
