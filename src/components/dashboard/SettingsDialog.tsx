
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SettingsDialogProps {
  couponCode: string;
  initialSettings: {
    paymentMethod: string;
    paymentDetails: string;
    emailNotifications: boolean;
    notificationEmail: string;
    notificationFrequency: string;
  };
}

export const SettingsDialog = ({ couponCode, initialSettings }: SettingsDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState(initialSettings.paymentMethod);
  const [paymentDetails, setPaymentDetails] = useState(initialSettings.paymentDetails);
  const [emailNotifications, setEmailNotifications] = useState(initialSettings.emailNotifications);
  const [notificationEmail, setNotificationEmail] = useState(initialSettings.notificationEmail);
  const [notificationFrequency, setNotificationFrequency] = useState(initialSettings.notificationFrequency);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSaveSettings = async () => {
    try {
      const { error } = await supabase
        .from('THG_Affiliate_Users')
        .update({
          payment_method: paymentMethod,
          payment_details: paymentDetails,
          notification_email: notificationEmail,
          notification_frequency: notificationFrequency,
          email_notifications: emailNotifications
        })
        .eq('coupon', couponCode);

      if (error) throw error;

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    }
  };

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
      // Verify current password
      const { data: user, error: verifyError } = await supabase
        .from('THG_Affiliate_Users')
        .select('*')
        .eq('coupon', couponCode)
        .eq('password', currentPassword)
        .maybeSingle();

      if (verifyError || !user) {
        toast.error("Current password is incorrect");
        return;
      }

      // Update password
      const { error: updateError } = await supabase
        .from('THG_Affiliate_Users')
        .update({ password: newPassword })
        .eq('coupon', couponCode);

      if (updateError) throw updateError;

      // Log password change
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background/95">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Manage your affiliate account preferences
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="font-medium">Your Coupon Code</h3>
            <p className="text-sm text-muted-foreground">{couponCode}</p>
          </div>
          
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

          <div className="space-y-4">
            <h3 className="font-medium">Payout Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <SelectTrigger className="bg-background/95">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95">
                    <SelectItem value="venmo">Venmo</SelectItem>
                    <SelectItem value="cashapp">Cashapp</SelectItem>
                    <SelectItem value="ach">Account Number (ACH)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Details</Label>
                <Input
                  value={paymentDetails}
                  onChange={(e) => setPaymentDetails(e.target.value)}
                  placeholder="Enter your payment details"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                {emailNotifications && (
                  <>
                    <div className="space-y-2">
                      <Label>Notification Email</Label>
                      <Input
                        type="email"
                        value={notificationEmail}
                        onChange={(e) => setNotificationEmail(e.target.value)}
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Notification Frequency</Label>
                      <Select
                        value={notificationFrequency}
                        onValueChange={setNotificationFrequency}
                      >
                        <SelectTrigger className="bg-background/95">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95">
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <Button onClick={handleSaveSettings} className="w-full">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
