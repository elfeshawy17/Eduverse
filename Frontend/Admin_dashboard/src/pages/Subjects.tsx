import React, { useState } from 'react';
import CourseList from '@/components/lists/CourseList';
import CourseForm from '@/components/forms/CourseForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Courses = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  const handleEditCourse = (course: any) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingCourse(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Courses</h1>
            <p className="text-gray-500">Manage university courses</p>
          </div>
          <Button 
            onClick={() => { setEditingCourse(null); setShowForm(true); }}
            className="bg-primary hover:bg-primary-hover transition-all duration-200 hover:scale-105"
          >
            <Plus className="mr-1 h-4 w-4" /> Add New Course
          </Button>
        </div>
      </div>
      
      {showForm ? (
        <CourseForm course={editingCourse} onClose={handleCloseForm} />
      ) : (
        <CourseList onEditCourse={handleEditCourse} />
      )}
    </div>
  );
};

export default Courses;
