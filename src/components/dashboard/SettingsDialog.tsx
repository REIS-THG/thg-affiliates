
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

  const handleSaveSettings = async () => {
    try {
      const { error } = await supabase
        .from('Affiliate Users')
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
            <h3 className="font-medium">Payout Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venmo">Venmo</SelectItem>
                    <SelectItem value="cashapp">Cashapp</SelectItem>
                    <SelectItem value="debit">Debit Card Number</SelectItem>
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
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
