import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StudentProfile } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { changePassword, validatePassword } from "@/utils/auth";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Lock, User, Mail, School, Building, Save, CheckCircle2, XCircle } from "lucide-react";

interface ProfileFormProps {
  profile: StudentProfile;
}

const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
  <div className="flex items-center space-x-2">
    {met ? (
      <CheckCircle2 size={16} className="text-green-500" />
    ) : (
      <XCircle size={16} className="text-gray-300" />
    )}
    <span className={cn("text-sm", met ? "text-green-500" : "text-gray-500")}>
      {text}
    </span>
  </div>
);

const ProfileForm = ({ profile }: ProfileFormProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  // Check password requirements
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword !== "";

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error
    setPasswordError("");
    
    // Client-side validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }
    
    if (!passwordsMatch) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    // Password validation
    const validation = validatePassword(newPassword);
    if (!validation.valid) {
      setPasswordError(validation.message || "Password doesn't meet the requirements");
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await changePassword(currentPassword, newPassword);
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
          variant: "default",
          className: "bg-secondary text-white",
        });
        
        // Reset form fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(result.message);
      }
    } catch (error) {
      setPasswordError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile information */}
      <div className="space-y-6">
        <h2 className="text-xl font-medium text-primary flex items-center">
          <User size={20} className="mr-2" />
          Personal Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 group transition-all">
            <Label htmlFor="name" className="flex items-center text-sm font-medium">
              <User size={16} className="mr-1 opacity-70" />
              Full Name
            </Label>
            <Input 
              id="name" 
              value={profile.name} 
              disabled 
              className="bg-gray-50/80 focus:bg-white transition-colors group-hover:border-primary/30" 
            />
          </div>
          
          <div className="space-y-2 group transition-all">
            <Label htmlFor="email" className="flex items-center text-sm font-medium">
              <Mail size={16} className="mr-1 opacity-70" />
              Email Address
            </Label>
            <Input 
              id="email" 
              type="email" 
              value={profile.email} 
              disabled 
              className="bg-gray-50/80 focus:bg-white transition-colors group-hover:border-primary/30" 
            />
          </div>
          
          <div className="space-y-2 group transition-all">
            <Label htmlFor="academicId" className="flex items-center text-sm font-medium">
              <School size={16} className="mr-1 opacity-70" />
              Academic ID
            </Label>
            <Input 
              id="academicId" 
              value={profile.academicId} 
              disabled 
              className="bg-gray-50/80 focus:bg-white transition-colors group-hover:border-primary/30" 
            />
          </div>
          
          <div className="space-y-2 group transition-all">
            <Label htmlFor="level" className="flex items-center text-sm font-medium">
              <School size={16} className="mr-1 opacity-70" />
              Academic Level
            </Label>
            <Input 
              id="level" 
              value={profile.level} 
              disabled 
              className="bg-gray-50/80 focus:bg-white transition-colors group-hover:border-primary/30" 
            />
          </div>
          
          <div className="space-y-2 md:col-span-2 group transition-all">
            <Label htmlFor="department" className="flex items-center text-sm font-medium">
              <Building size={16} className="mr-1 opacity-70" />
              Department
            </Label>
            <Input 
              id="department" 
              value={profile.department} 
              disabled 
              className="bg-gray-50/80 focus:bg-white transition-colors group-hover:border-primary/30" 
            />
          </div>
        </div>
      </div>
      
      {/* Password change form */}
      <div className="border-t pt-8 space-y-6">
        <h2 className="text-xl font-medium text-primary flex items-center">
          <Lock size={20} className="mr-2" />
          Change Password
        </h2>
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="flex items-center text-sm font-medium">
              <Lock size={16} className="mr-1 opacity-70" />
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="focus:border-primary pr-10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="flex items-center text-sm font-medium">
              <Lock size={16} className="mr-1 opacity-70" />
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="focus:border-primary pr-10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            {/* Password requirements */}
            <div className="mt-2 p-3 bg-gray-50 rounded-md space-y-1">
              <PasswordRequirement met={hasMinLength} text="At least 8 characters" />
              <PasswordRequirement met={hasUppercase} text="At least one uppercase letter" />
              <PasswordRequirement met={hasLowercase} text="At least one lowercase letter" />
              <PasswordRequirement met={hasNumber} text="At least one number" />
              <PasswordRequirement met={hasSpecialChar} text="At least one special character" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="flex items-center text-sm font-medium">
              <Lock size={16} className="mr-1 opacity-70" />
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="focus:border-primary pr-10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {confirmPassword && newPassword && !passwordsMatch && (
              <p className="text-red-500 text-sm mt-1">Passwords don't match</p>
            )}
          </div>
          
          {passwordError && (
            <div className="text-destructive text-sm bg-red-50 p-2 rounded-md border border-red-100 animate-fade-in">
              {passwordError}
            </div>
          )}
          
          <div className="pt-2">
            <Button 
              type="submit" 
              disabled={loading} 
              className="flex items-center gap-2 hover:translate-y-[-2px] transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  Changing Password...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Change Password
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
