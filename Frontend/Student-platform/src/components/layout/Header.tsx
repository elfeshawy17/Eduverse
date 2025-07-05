import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <h2 className="text-xl font-bold text-text-primary">Dashboard</h2>
      </div>
      <div className="flex items-center">
        <div className="flex items-center">
          <Avatar>
            <AvatarFallback
              className="bg-primary text-white border border-primary/30 shadow flex items-center justify-center"
            >
              <User size={22} />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
