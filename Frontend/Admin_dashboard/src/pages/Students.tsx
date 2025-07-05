
import React, { useState } from 'react';
import StudentForm from '@/components/forms/StudentForm';
import StudentList from '@/components/lists/StudentList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Students = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);

  const handleEditStudent = (student: any) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingStudent(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Students</h1>
            <p className="text-gray-500">Manage university students</p>
          </div>
          <Button 
            onClick={() => { setEditingStudent(null); setShowForm(true); }}
            className="bg-primary hover:bg-primary-hover transition-all duration-200 hover:scale-105"
          >
            <Plus className="mr-1 h-4 w-4" /> Add New Student
          </Button>
        </div>
      </div>
      
      {showForm ? (
        <StudentForm student={editingStudent} onClose={handleCloseForm} />
      ) : (
        <StudentList onEditStudent={handleEditStudent} />
      )}
    </div>
  );
};

export default Students;
