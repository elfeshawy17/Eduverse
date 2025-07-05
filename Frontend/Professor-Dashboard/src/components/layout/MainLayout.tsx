
import React from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout = ({ children, className }: MainLayoutProps) => {
  return (
    <div className="flex h-screen bg-light-gray">
      <Sidebar />
      <main className={cn("flex-1 p-6 overflow-y-auto", className)}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
