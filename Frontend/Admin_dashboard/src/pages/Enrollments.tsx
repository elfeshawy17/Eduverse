
import React, { useState } from 'react';
import EnrollmentForm from '@/components/forms/EnrollmentForm';
import EnrollmentList from '@/components/lists/EnrollmentList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Enrollments = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Enrollments</h1>
            <p className="text-gray-500">Manage student course enrollments</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary-hover transition-all duration-200 hover:scale-105"
          >
            <Plus className="mr-1 h-4 w-4" /> Add New Enrollment
          </Button>
        </div>
      </div>
      
      {showForm ? (
        <EnrollmentForm onClose={() => setShowForm(false)} />
      ) : (
        <EnrollmentList onCreateEnrollment={() => setShowForm(true)} />
      )}
    </div>
  );
};

export default Enrollments;
