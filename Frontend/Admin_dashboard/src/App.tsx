import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import Professors from "./pages/Professors";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Enrollments from "./pages/Enrollments";
import Payments from "./pages/Payments";
import Admins from "./pages/Admins";
import Profile from "./pages/Profile";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/eduverse/admin" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/eduverse/admin/professors" element={<ProtectedRoute><MainLayout><Professors /></MainLayout></ProtectedRoute>} />
          <Route path="/eduverse/admin/courses" element={<ProtectedRoute><MainLayout><Courses /></MainLayout></ProtectedRoute>} />
          <Route path="/eduverse/admin/students" element={<ProtectedRoute><MainLayout><Students /></MainLayout></ProtectedRoute>} />
          <Route path="/eduverse/admin/enrollments" element={<ProtectedRoute><MainLayout><Enrollments /></MainLayout></ProtectedRoute>} />
          <Route path="/eduverse/admin/payments" element={<ProtectedRoute><MainLayout><Payments /></MainLayout></ProtectedRoute>} />
          <Route path="/eduverse/admin/admins" element={<ProtectedRoute><MainLayout><Admins /></MainLayout></ProtectedRoute>} />
          <Route path="/eduverse/admin/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
