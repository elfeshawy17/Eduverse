import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import ProfileForm from "@/components/profile/ProfileForm";
import { StudentProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { api } from "@/utils/auth";
import { useToast } from "@/hooks/use-toast";

export interface ApiProfileResponse {
  name: string;
  email: string;
  dept: string;
  id: string;
  level: number;
}

const Profile = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get<{ status: string; data: ApiProfileResponse }>('/users/me');
      
      if (response.data.status === 'SUCCESS') {
        const profileData: StudentProfile = {
          name: response.data.data.name,
          email: response.data.data.email,
          academicId: response.data.data.id,
          level: response.data.data.level.toString(),
          department: response.data.data.dept
        };
        
        setProfile(profileData);
        toast({
          title: "Profile Loaded",
          description: "Your profile information has been loaded successfully.",
          variant: "default",
          className: "bg-secondary text-white",
        });
      } else {
        setError(response.data.message || 'Failed to load profile');
        toast({
          title: "Error",
          description: response.data.message || 'Failed to load profile',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setError("Network error. Please try again later.");
      toast({
        title: "Error",
        description: "Network error. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setContentVisible(true), 100);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <Header />
      <main className="p-6 max-w-5xl mx-auto">
        <div 
          className={cn(
            "mb-6 transition-all duration-700 transform",
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <Link to="/">
            <Button 
              variant="ghost" 
              className="pl-0 mb-2 hover:translate-x-1 transition-transform"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <h1 className="text-2xl font-bold mb-1 text-primary">My Profile</h1>
          <p className="text-text-secondary">View and manage your account information</p>
        </div>
        
        <div 
          className={cn(
            "bg-white rounded-lg shadow-md p-6 overflow-hidden hover:shadow-lg transition-all duration-700 transform",
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {loading ? (
            <div className="space-y-8">
              <div className="space-y-6">
                <Skeleton className="h-8 w-48 mb-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-8 space-y-6">
                <Skeleton className="h-8 w-48 mb-6" />
                
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                  
                  <Skeleton className="h-10 w-36 mt-4" />
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <div className="flex flex-col items-center animate-fade-in">
                <p className="text-text-secondary mb-4">{error}</p>
                <Button 
                  onClick={fetchProfile}
                  className="flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <RefreshCw size={16} className="animate-spin-slow" />
                  Retry
                </Button>
              </div>
            </div>
          ) : profile ? (
            <ProfileForm profile={profile} />
          ) : (
            <div className="py-12 text-center">
              <div className="flex flex-col items-center animate-fade-in">
                <p className="text-text-secondary mb-4">Unable to load profile information.</p>
                <Button 
                  onClick={fetchProfile}
                  className="flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <RefreshCw size={16} className="animate-spin-slow" />
                  Retry
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
