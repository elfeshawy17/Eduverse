import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Course from "./pages/Course";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/layout/Sidebar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthCheck from "./components/auth/AuthCheck";
import { useEffect } from "react";
import { initAuth } from "./utils/auth";
import { PDFViewerProvider } from "./contexts/PDFViewerContext";
import { PaymentProvider } from "./contexts/PaymentContext";
import PaymentSuccess from "./pages/student/PaymentSuccess";
import PaymentFailure from "./pages/student/PaymentFailure";
import PaymentGate from "./pages/student/PaymentGate";

const queryClient = new QueryClient();

const App = () => {
  // Initialize authentication on app load
  useEffect(() => {
    initAuth();
  }, []);
  
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PaymentProvider>
        <PDFViewerProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename="/eduverse">
            <Routes>
              {/* Payment-related routes (authentication only, no payment check) */}
              <Route path="/student/payment-success" element={
                <AuthCheck>
                  <PaymentSuccess />
                </AuthCheck>
              } />
              <Route path="/student/payment-failure" element={
                <AuthCheck>
                  <PaymentFailure />
                </AuthCheck>
              } />
              <Route path="/student/payment-gate" element={
                <AuthCheck>
                  <PaymentGate />
                </AuthCheck>
              } />
              
              {/* Protected routes (require authentication + payment) */}
              <Route path="/" element={
                <ProtectedRoute>
                  <div className="flex min-h-screen">
                    <Sidebar />
                    <Index />
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/course/:courseId" element={
                <ProtectedRoute>
                  <div className="flex min-h-screen">
                    <Sidebar />
                    <Course />
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <div className="flex min-h-screen">
                    <Sidebar />
                    <Profile />
                  </div>
                </ProtectedRoute>
              } />
              <Route path="*" element={
                <ProtectedRoute>
                  <div className="flex min-h-screen">
                    <Sidebar />
                    <NotFound />
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </PDFViewerProvider>
      </PaymentProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
