
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/services/authService';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if authenticated
    if (isAuthenticated()) {
      navigate('/home');
    } else {
      // In a real app, we would redirect to login
      // For demo purposes, we'll authenticate automatically
      localStorage.setItem("professorToken", "professor_dashboard_mock_token");
      navigate('/home');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-dark-gray">Loading Professor Dashboard</h1>
        <div className="mt-4 relative w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <div className="absolute h-full bg-primary animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
