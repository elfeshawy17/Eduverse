import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  UserCircle, 
  LogOut, 
  Menu, 
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { logout } from "@/lib/auth";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    logout(() => {});
  };

  const navItems = [
    { name: "Home", path: "/eduverse/professor/home", icon: Home },
    { name: "Profile", path: "/eduverse/professor/profile", icon: UserCircle },
  ];

  return (
    <div className={cn(
      "bg-white h-screen transition-all duration-300 flex flex-col border-r",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex justify-between items-center p-4 border-b">
        {!collapsed && (
          <h1 className="text-lg font-bold text-primary">Professor Dashboard</h1>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>
      
      <div className="flex flex-col flex-grow mt-6">
        {navItems.map((item) => (
          <TooltipProvider key={item.path}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center p-3 mb-2 mx-2 rounded-md transition-colors hover:bg-gray-100",
                    location.pathname === item.path && "bg-primary text-white hover:bg-primary/90",
                    collapsed && "justify-center"
                  )}
                >
                  <item.icon size={20} />
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  <p>{item.name}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      
      <div className="p-4 border-t mt-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                onClick={handleLogout} 
                className="w-full flex items-center hover:bg-gray-100"
              >
                <LogOut size={20} />
                {!collapsed && <span className="ml-3">Logout</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                <p>Logout</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Sidebar;
