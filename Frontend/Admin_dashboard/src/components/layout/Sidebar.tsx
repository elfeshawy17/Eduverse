import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, Book, Users, UserPlus, UserRoundPlus, LogOut, Settings, CreditCard } from 'lucide-react';
import { logout } from '../../utils/auth';

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/eduverse/admin' },
  { name: 'Professors', icon: User, path: '/eduverse/admin/professors' },
  { name: 'Courses', icon: Book, path: '/eduverse/admin/courses' },
  { name: 'Students', icon: Users, path: '/eduverse/admin/students' },
  { name: 'Enrollments', icon: UserPlus, path: '/eduverse/admin/enrollments' },
  { name: 'Payments', icon: CreditCard, path: '/eduverse/admin/payments' },
  { name: 'Admins', icon: UserRoundPlus, path: '/eduverse/admin/admins' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    // Use the logout utility to clear all localStorage data and redirect
    logout(navigate);
  };

  return (
    <div className={`bg-white border-r border-gray-200 h-screen fixed left-0 top-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <nav className="h-full flex flex-col p-4">
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <img src="https://www.channelengine.com/hubfs/Website/Icons/Blue/book.svg" alt="Logo" className="w-8 h-8" />
              <h1 className="text-xl font-bold text-gray-800">EduVerse</h1>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
        
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-lg transition-all duration-200 group
                ${location.pathname === item.path ? 'bg-sidebar-primary text-white' : 'hover:bg-sidebar-accent hover:text-sidebar-primary'}`}
            >
              <item.icon 
                size={20} 
                className={collapsed ? 'mx-auto' : 'mr-3'} 
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </div>
        
        <div className="mt-auto px-3 space-y-2">
          <Link
            to="/eduverse/admin/profile"
            className={`flex items-center p-3 rounded-lg transition-all duration-200 group
              ${location.pathname === '/eduverse/admin/profile' ? 'bg-sidebar-primary text-white' : 'hover:bg-sidebar-accent hover:text-sidebar-primary'}`}
          >
            <Settings 
              size={20} 
              className={collapsed ? 'mx-auto' : 'mr-3'} 
            />
            {!collapsed && <span>Profile</span>}
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-lg text-red-500 transition-all duration-200 hover:bg-red-50 group"
          >
            <LogOut 
              size={20} 
              className={collapsed ? 'mx-auto' : 'mr-3'} 
            />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
