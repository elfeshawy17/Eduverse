import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';

interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  element, 
  allowedRoles = [] 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  // Check for both token and authentication state
  const token = localStorage.getItem('token');
  if (!isAuthenticated || !token) {
    return <Navigate to="/eduverse/login" replace />;
  }
  
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect based on role if they're authenticated but accessing wrong area
    if (user.role === 'admin') {
      return <Navigate to="/eduverse/admin" replace />;
    } else if (user.role === 'professor') {
      return <Navigate to="/eduverse/professor" replace />;
    } else {
      return <Navigate to="/eduverse" replace />;
    }
  }
  
  return <>{element}</>;
};

// Placeholder pages
const AdminDashboard = () => <div className="p-8"><h1>Admin Dashboard</h1></div>;
const ProfessorDashboard = () => <div className="p-8"><h1>Professor Dashboard</h1></div>;
const StudentPlatform = () => <div className="p-8"><h1>Student Platform</h1></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/eduverse/login" element={<LoginPage />} />
          
          <Route 
            path="/eduverse/admin" 
            element={
              <ProtectedRoute 
                element={<AdminDashboard />} 
                allowedRoles={['admin']} 
              />
            } 
          />
          
          <Route 
            path="/eduverse/professor" 
            element={
              <ProtectedRoute 
                element={<ProfessorDashboard />} 
                allowedRoles={['professor']} 
              />
            } 
          />
          
          <Route 
            path="/eduverse" 
            element={
              <ProtectedRoute 
                element={<StudentPlatform />} 
                allowedRoles={['student']} 
              />
            } 
          />
          
          <Route path="/" element={<Navigate to="/eduverse/login" replace />} />
          <Route path="*" element={<Navigate to="/eduverse/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;