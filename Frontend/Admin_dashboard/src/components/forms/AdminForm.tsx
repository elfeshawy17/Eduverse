import { useState } from 'react';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';

interface AdminFormProps {
  onClose: () => void;
  editData?: {
    _id: string;
    name: string;
    email: string;
    role: string;
    department: string;
  };
}

const AdminForm = ({ onClose, editData }: AdminFormProps) => {
  const [formData, setFormData] = useState({
    name: editData?.name || '',
    email: editData?.email || '',
    password: '',
    role: editData?.role || 'admin',
    department: 'IT', // Fixed to IT for admins
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string): boolean => {
    if (!password && editData) return true; // Password is optional for updates
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validate password
    if (!validatePassword(formData.password)) {
      newErrors.password = "Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&), minimum 6 characters.";
    }

    // If there are errors, display them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      let response;
      if (editData) {
        // Edit admin
        response = await axios.put(`/api/users/${editData._id}`, {
          name: formData.name,
          email: formData.email,
          password: formData.password || undefined,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Add new admin
        response = await axios.post('/api/users', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          department: 'IT',
          role: 'admin',
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      if (response.data.status === 'SUCCESS') {
        toast.success(`Admin ${formData.name} ${editData ? 'updated' : 'added'} successfully!`);
        onClose();
      } else {
        setErrors({ general: response.data.message || 'Failed to save admin' });
      }
    } catch (error: any) {
      setErrors({ general: error.response?.data?.message || 'Failed to save admin' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {editData ? 'Update Admin' : 'Create New Admin'}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        {!editData && (
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password (min. 8 characters)"
              required={!editData}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            <p className="text-xs text-gray-500">
              Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&), minimum 6 characters.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => handleSelectChange('role', value)}
            disabled={true} // Role is fixed to admin
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            name="department"
            value="IT"
            readOnly
            className="bg-gray-100"
          />
          <p className="text-xs text-gray-500">
            Admin department is fixed to IT
          </p>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary-hover">
            {loading ? 'Saving...' : editData ? 'Update Admin' : 'Create Admin'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminForm;
