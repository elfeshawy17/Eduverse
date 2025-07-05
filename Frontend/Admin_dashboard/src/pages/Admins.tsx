
import { useState } from 'react';
import AdminForm from '@/components/forms/AdminForm';
import AdminList from '@/components/lists/AdminList';

const Admins = () => {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const handleCreateAdmin = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEditAdmin = (admin: any) => {
    setEditData(admin);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditData(null);
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admins</h1>
            <p className="text-gray-500">Manage system administrators</p>
          </div>
        </div>
      </div>
      
      {showForm ? (
        <AdminForm onClose={handleCloseForm} editData={editData} />
      ) : (
        <AdminList onCreateAdmin={handleCreateAdmin} onEditAdmin={handleEditAdmin} />
      )}
    </div>
  );
};

export default Admins;
