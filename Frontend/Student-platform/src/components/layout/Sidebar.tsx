import { Link, useLocation } from "react-router-dom";
import { BookOpen, User, LogOut, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { logout } from "@/utils/auth";

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [activePath, setActivePath] = useState(location.pathname);

  // Update active path when location changes
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const navItems = [
    {
      icon: <BookOpen size={22} />,
      label: "Courses",
      link: "/",
    },
    {
      icon: <User size={22} />,
      label: "Profile",
      link: "/profile",
    },
  ];

  const handleLogout = () => {
    // Clear all data and redirect to login page
    logout();
  };

  return (
    <div
      className={cn(
        "bg-white h-screen min-h-screen transition-all duration-500 border-r border-gray-200 flex flex-col sticky top-0 shadow-sm hover:shadow-md",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        {!collapsed && (
          <div className="flex items-center transition-all duration-300 animate-fade-in">
            <div className="mr-2 p-1 rounded-md">
              <img src="https://www.channelengine.com/hubfs/Website/Icons/Blue/book.svg" alt="Logo" width={22} height={22} />
            </div>
            <h1 className="text-xl font-bold text-primary">Eduverse</h1>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto transition-all duration-300 animate-fade-in">
            <div className="p-1 rounded-md">
              <img src="https://www.channelengine.com/hubfs/Website/Icons/Blue/book.svg" alt="Logo" width={22} height={22} />
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-full hover:bg-accent transition-colors duration-300 text-primary hover:scale-110 transform"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = activePath === item.link;
          
          return (
            <Link
              key={index}
              to={item.link}
              className={cn(
                "flex items-center py-3 px-4 my-1 mx-2 rounded-md text-text-secondary group transition-all duration-300",
                isActive
                  ? "bg-primary text-white font-medium shadow-sm"
                  : "hover:bg-accent hover:text-primary hover:translate-x-1 transform"
              )}
            >
              <span className={cn(
                "transition-transform duration-300",
                isActive ? "" : "group-hover:scale-110"
              )}>
                {item.icon}
              </span>
              
              {!collapsed && (
                <span className={cn(
                  "ml-3 transition-all duration-300",
                  !isActive && "group-hover:font-medium"
                )}>
                  {item.label}
                </span>
              )}
              
              {/* Active indicator */}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center py-2.5 px-3 text-red-500 bg-red-50/50 hover:bg-red-100 rounded-md transition-all duration-300 hover:-translate-y-1 transform group",
          )}
        >
          <span className="mr-3 group-hover:rotate-12 transition-transform duration-300">
            <LogOut size={20} />
          </span>
          {!collapsed && (
            <span className="font-medium">Logout</span>
          )}
        </button>
        
        {!collapsed && (
          <div className="text-xs text-text-secondary mt-4 text-center opacity-70">
            © {new Date().getFullYear()} Eduverse
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
