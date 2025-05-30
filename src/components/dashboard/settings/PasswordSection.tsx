
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface PasswordSectionProps {
  couponCode: string;
  isAdminReset?: boolean;
}

export const PasswordSection = ({ couponCode, isAdminReset = false }: PasswordSectionProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const validatePasswordChange = () => {
    // Admin reset doesn't need to verify current password
    if (isAdminReset) {
      if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return false;
      }
      
      if (newPassword !== confirmPassword) {
        toast.error("New passwords don't match!");
        return false;
      }
      
      return true;
    }
    
    // Regular user password change validation
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match!");
      return false;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    
    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordChange()) {
      return;
    }
    
    setShowConfirmDialog(true);
  };
  
  const performPasswordChange = async () => {
    setIsChangingPassword(true);
    try {
      // For regular user password change, verify current password
      if (!isAdminReset) {
        console.log("Verifying current password for coupon:", couponCode);
        
        const { data: user, error: verifyError } = await supabase
          .from('thg_affiliate_users')
          .select('*')
          .eq('coupon', couponCode)
          .eq('password', currentPassword)
          .maybeSingle();

        console.log("Verification response:", { user, verifyError });

        if (verifyError) {
          console.error("Verification error:", verifyError);
          toast.error("An error occurred while verifying your password");
          return;
        }
        
        if (!user) {
          toast.error("Current password is incorrect");
          return;
        }
      }

      console.log("Updating password for coupon:", couponCode);
      
      const { error: updateError } = await supabase
        .from('thg_affiliate_users')
        .update({ password: newPassword })
        .eq('coupon', couponCode);

      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }

      const { error: historyError } = await supabase
        .from('password_change_history')
        .insert({
          coupon_code: couponCode,
          changed_by: isAdminReset ? 'admin' : couponCode
        });
        
      if (historyError) {
        console.warn("Error recording password change history:", historyError);
        // Continue despite history error
      }

      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-[#3B751E]">
        {isAdminReset ? "Reset User Password" : "Change Password"}
      </h3>
      <div className="space-y-4">
        {!isAdminReset && (
          <div className="space-y-2">
            <Label className="text-[#9C7705]/70">Current Password</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="border-[#9C7705]/30 focus-visible:ring-[#3B751E]"
            />
          </div>
        )}
        <div className="space-y-2">
          <Label className="text-[#9C7705]/70">New Password</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="border-[#9C7705]/30 focus-visible:ring-[#3B751E]"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[#9C7705]/70">Confirm New Password</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="border-[#9C7705]/30 focus-visible:ring-[#3B751E]"
          />
        </div>
        <Button 
          onClick={handleChangePassword}
          disabled={
            isChangingPassword || 
            !newPassword || 
            !confirmPassword || 
            (!isAdminReset && !currentPassword)
          }
          className="w-full bg-[#3B751E] hover:bg-[#3B751E]/90 text-white"
        >
          {isChangingPassword ? 
            "Changing Password..." : 
            isAdminReset ? "Reset Password" : "Change Password"
          }
        </Button>
      </div>

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title={isAdminReset ? "Reset User Password" : "Change Password"}
        description={isAdminReset ? 
          "Are you sure you want to reset this user's password?" : 
          "Are you sure you want to change your password?"
        }
        confirmText={isAdminReset ? "Reset Password" : "Change Password"}
        cancelText="Cancel"
        variant="default"
        onConfirm={performPasswordChange}
      />
    </div>
  );
};
