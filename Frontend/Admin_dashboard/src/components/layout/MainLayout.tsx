
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Toaster } from '@/components/ui/sonner';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Listen to custom event for sidebar toggle
  useEffect(() => {
    const handleStorageChange = () => {
      const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
      setSidebarCollapsed(isCollapsed);
    };
    
    // Set initial value
    handleStorageChange();
    
    // Listen for changes
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <main className={`flex-1 transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      } p-6`}>
        <Toaster position="top-right" />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
