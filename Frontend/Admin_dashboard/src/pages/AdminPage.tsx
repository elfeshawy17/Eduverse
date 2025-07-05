import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleAdminPageToken, isAuthenticated } from '../utils/auth';

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // First try to handle the admin page token
    const hasAdminToken = handleAdminPageToken();
    
    // If no token in URL and no token in localStorage, redirect to login
    if (!hasAdminToken && !isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Token is now stored in localStorage and removed from URL
    // You can proceed with admin page initialization
  }, [navigate]);

  return (
    <div>
      {/* Your admin page content */}
    </div>
  );
};

export default AdminPage; 