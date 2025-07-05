import React, { useState } from 'react';
import ProfessorForm from '@/components/forms/ProfessorForm';
import ProfessorList from '@/components/lists/ProfessorList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Professors = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<any>(null);
  const [refreshList, setRefreshList] = useState(false);

  const handleEditProfessor = (professor: any) => {
    setEditingProfessor(professor);
    setShowForm(true);
  };

  const handleCloseForm = (shouldRefresh = false) => {
    setEditingProfessor(null);
    setShowForm(false);
    if (shouldRefresh) setRefreshList((prev) => !prev);
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Professors</h1>
            <p className="text-gray-500">Manage university professors</p>
          </div>
          <Button 
            onClick={() => { setEditingProfessor(null); setShowForm(true); }}
            className="bg-primary hover:bg-primary-hover transition-all duration-200 hover:scale-105"
          >
            <Plus className="mr-1 h-4 w-4" /> Add New Professor
          </Button>
        </div>
      </div>
      
      {showForm ? (
        <ProfessorForm professor={editingProfessor} onClose={handleCloseForm} />
      ) : (
        <ProfessorList onEditProfessor={handleEditProfessor} refresh={refreshList} />
      )}
    </div>
  );
};

export default Professors;
