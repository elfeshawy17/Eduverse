import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '@/components/layout/MainLayout';
import axios, { AxiosError } from 'axios';
import { getValidatedToken } from '../utils/auth';

interface User {
  name: string;
  email: string;
  department?: string;
  dept?: string;
  role?: string;
  level?: string;
  academicId?: string;
  id?: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        setUserError(null);
        
        const token = getValidatedToken();
        if (!token) {
          setUserError('Invalid or missing authentication token');
          setLoadingUser(false);
          return;
        }
        
        const response = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.status === 'SUCCESS') {
          setUser(response.data.data);
        } else {
          setUserError(response.data.message || 'Failed to fetch user info');
        }
      } catch (error: unknown) {
        console.error('Profile API error:', error);
        const axiosError = error as AxiosError;
        setUserError(axiosError.response?.data?.message || 'Failed to fetch user info');
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!validatePassword(passwordData.newPassword)) {
      newErrors.newPassword = "Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&), minimum 8 characters.";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = "New password cannot be the same as the old password.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      const token = getValidatedToken();
      if (!token) {
        setErrors({ general: 'Invalid or missing authentication token' });
        setLoading(false);
        return;
      }
      
      const response = await axios.post('/api/auth/changePassword', {
        email: user?.email,
        password: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status === 'SUCCESS') {
        toast.success('Password updated successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setErrors({ general: response.data.message || 'Failed to update password' });
      }
    } catch (error: unknown) {
      console.error('Password change API error:', error);
      const axiosError = error as AxiosError;
      setErrors({ general: axiosError.response?.data?.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold animate-fade-in">Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingUser ? (
                <div>Loading user info...</div>
              ) : userError ? (
                <div className="text-red-500">{userError}</div>
              ) : user ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={user.name} readOnly className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} readOnly className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" value={user.department || user.dept || ''} readOnly className="bg-gray-50" />
                  </div>
                  {user.role && (
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" value={user.role} readOnly className="bg-gray-50" />
                    </div>
                  )}
                  {user.level && (
                    <div className="space-y-2">
                      <Label htmlFor="level">Level</Label>
                      <Input id="level" value={user.level} readOnly className="bg-gray-50" />
                    </div>
                  )}
                  {user.academicId || user.id ? (
                    <div className="space-y-2">
                      <Label htmlFor="academicId">Academic ID</Label>
                      <Input id="academicId" value={user.academicId || user.id} readOnly className="bg-gray-50" />
                    </div>
                  ) : null}
                </>
              ) : null}
            </CardContent>
          </Card>
          {/* Change Password Card */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                    required
                  />
                  {errors.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    required
                  />
                  {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
                  <p className="text-xs text-gray-500">
                    Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&), minimum 8 characters.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    required
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
                {errors.general && <p className="text-sm text-red-500">{errors.general}</p>}
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-hover mt-2"
                >
                  {loading ? 'Updating Password...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
