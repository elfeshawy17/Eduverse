import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Book, Users, UserRoundPlus, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { getValidatedToken } from '../utils/auth';

const Dashboard = () => {
  const [stats, setStats] = useState({
    studentsCount: 0,
    professorsCount: 0,
    adminsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = getValidatedToken();
        if (!token) {
          setError('Invalid or missing authentication token');
          setLoading(false);
          return;
        }
        
        const response = await axios.get('/api/users/states', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats({
          studentsCount: response.data.studentsCount,
          professorsCount: response.data.professorsCount,
          adminsCount: response.data.adminsCount,
        });
      } catch (err: unknown) {
        console.error('Dashboard API error:', err);
        const axiosError = err as AxiosError;
        const errorMessage = axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data 
          ? (axiosError.response.data as { message: string }).message 
          : 'Failed to fetch user stats';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Students', count: stats.studentsCount, icon: Users, color: 'bg-amber-100 text-amber-600', path: '/eduverse/admin/students' },
    { title: 'Professors', count: stats.professorsCount, icon: User, color: 'bg-blue-100 text-blue-600', path: '/eduverse/admin/professors' },
    { title: 'Admins', count: stats.adminsCount, icon: UserRoundPlus, color: 'bg-purple-100 text-purple-600', path: '/eduverse/admin/admins' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold animate-fade-in">Dashboard</h1>
      {loading ? (
        <div className="text-center py-8">Loading user stats...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statCards.map((stat) => (
              <Link to={stat.path} key={stat.title}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">{stat.title}</CardTitle>
                    <div className={`p-2 rounded-full ${stat.color}`}>
                      <stat.icon size={18} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.count}</div>
                    <CardDescription>Total {stat.title.toLowerCase()}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {statCards.map((stat) => (
                    <Link 
                      key={stat.title} 
                      to={stat.path}
                      className="flex items-center p-3 bg-white border rounded-lg hover:bg-gray-50 transition-all"
                    >
                      <div className={`p-2 rounded-full mr-3 ${stat.color}`}>
                        <stat.icon size={16} />
                      </div>
                      <span>Add New {stat.title.slice(0, -1)}</span>
                    </Link>
                  ))}
                  <Link 
                    to="/eduverse/admin/payments"
                    className="flex items-center p-3 bg-white border rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <div className="p-2 rounded-full mr-3 bg-green-100 text-green-600">
                      <CreditCard size={16} />
                    </div>
                    <span>Manage Payments</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
