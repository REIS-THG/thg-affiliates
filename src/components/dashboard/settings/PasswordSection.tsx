
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordSectionProps {
  couponCode: string;
}

export const PasswordSection = ({ couponCode }: PasswordSectionProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsChangingPassword(true);
    try {
      const { data: user, error: verifyError } = await supabase
        .from('thg_affiliate_users')
        .select('*')
        .eq('coupon', couponCode)
        .eq('password', currentPassword)
        .maybeSingle();

      if (verifyError || !user) {
        toast.error("Current password is incorrect");
        return;
      }

      const { error: updateError } = await supabase
        .from('thg_affiliate_users')
        .update({ password: newPassword })
        .eq('coupon', couponCode);

      if (updateError) throw updateError;

      await supabase
        .from('password_change_history')
        .insert({
          coupon_code: couponCode,
          changed_by: couponCode
        });

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
      <h3 className="font-medium">Change Password</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Current Password</Label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
        </div>
        <div className="space-y-2">
          <Label>New Password</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>
        <div className="space-y-2">
          <Label>Confirm New Password</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>
        <Button 
          onClick={handleChangePassword}
          disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
          className="w-full"
        >
          {isChangingPassword ? "Changing Password..." : "Change Password"}
        </Button>
      </div>
    </div>
  );
};
