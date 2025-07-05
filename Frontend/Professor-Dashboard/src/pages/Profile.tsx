import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

interface Professor {
  name: string;
  email: string;
  dept: string;
  role: string;
}

interface ApiErrorResponse {
  message?: string;
}

const Profile = () => {
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfessorData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }
      
      const response = await axios.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.status === "SUCCESS") {
        setProfessor({
          ...response.data.data,
          role: "Professor"
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch profile");
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage = 
        axiosError.response?.data?.message || 
        (error as Error).message || 
        "Failed to load profile";
      
      setError(errorMessage);
      toast({
        title: "Error loading profile",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessorData();
  }, []);

  const handleRefresh = () => {
    fetchProfessorData();
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-3xl animate-fade-in">
          <h1 className="text-2xl font-bold text-dark-gray mb-8">Profile</h1>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-3xl animate-fade-in">
          <h1 className="text-2xl font-bold text-dark-gray mb-8">Profile</h1>
          <Card className="mb-8 border-destructive">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={handleRefresh}>Retry</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl animate-fade-in">
        <h1 className="text-2xl font-bold text-dark-gray mb-8">Profile</h1>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Professor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-medium-gray">Name</h3>
                <p className="mt-1 text-dark-gray">{professor?.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-medium-gray">Email</h3>
                <p className="mt-1 text-dark-gray">{professor?.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-medium-gray">Department</h3>
                <p className="mt-1 text-dark-gray">{professor?.dept}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-medium-gray">Role</h3>
                <p className="mt-1 text-dark-gray">{professor?.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-medium-gray mb-4">Password</h3>
              <Button 
                variant="outline" 
                onClick={() => setIsChangePasswordModalOpen(true)}
                className="btn-hover"
              >
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={() => setIsChangePasswordModalOpen(false)}
        />
      </div>
    </MainLayout>
  );
};

export default Profile;
