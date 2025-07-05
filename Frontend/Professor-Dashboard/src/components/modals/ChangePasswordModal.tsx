import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { changePassword, logout } from "@/services/authService";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Password validation regex: at least one uppercase, one lowercase, one digit, 
// one special character (@$!%*?&), minimum 8 characters
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const ChangePasswordModal = ({
  isOpen,
  onClose,
}: ChangePasswordModalProps) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (name === "newPassword" && value) {
      if (!passwordRegex.test(value)) {
        setErrors((prev) => ({ 
          ...prev, 
          newPassword: "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)"
        }));
      }
    }
    if (name === "confirmPassword" && value) {
      if (value !== formData.newPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Current password is required";
      isValid = false;
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (!passwordRegex.test(formData.newPassword)) {
      newErrors.newPassword = "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)";
      isValid = false;
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    
    try {
      const result = await changePassword(
        formData.oldPassword,
        formData.newPassword
      );
      
      if (result.success) {
        toast({
          title: "Password changed successfully",
          description: "Please log in again with your new password.",
          duration: 5000,
        });
        setIsLoading(false);
        onClose();
        // Log out user since token is invalidated
        await logout();
        // Redirect to login page will happen in the logout function
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Password change failed",
        description: error instanceof Error ? error.message : "Failed to change password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-fade-in">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and a new password
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="oldPassword">Current Password</Label>
              <Input
                id="oldPassword"
                name="oldPassword"
                type="password"
                value={formData.oldPassword}
                onChange={handleChange}
                autoComplete="current-password"
              />
              {errors.oldPassword && (
                <p className="text-destructive text-sm">{errors.oldPassword}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.newPassword && (
                <p className="text-destructive text-sm">{errors.newPassword}</p>
              )}
              <div className="text-sm text-medium-gray">
                Password must contain:
                <ul className="list-disc pl-5 mt-1">
                  <li className={formData.newPassword.match(/[A-Z]/) ? "text-secondary" : ""}>At least one uppercase letter</li>
                  <li className={formData.newPassword.match(/[a-z]/) ? "text-secondary" : ""}>At least one lowercase letter</li>
                  <li className={formData.newPassword.match(/\d/) ? "text-secondary" : ""}>At least one digit</li>
                  <li className={formData.newPassword.match(/[@$!%*?&]/) ? "text-secondary" : ""}>At least one special character (@$!%*?&)</li>
                  <li className={formData.newPassword.length >= 8 ? "text-secondary" : ""}>Minimum 8 characters</li>
                </ul>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-sm">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
