
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
import { PasswordSection } from "./settings/PasswordSection";
import { PayoutSection } from "./settings/PayoutSection";
import { NotificationSection } from "./settings/NotificationSection";

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
        .from('thg_affiliate_users')
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
          
          <PasswordSection couponCode={couponCode} />

          <PayoutSection
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            paymentDetails={paymentDetails}
            setPaymentDetails={setPaymentDetails}
          />

          <NotificationSection
            emailNotifications={emailNotifications}
            setEmailNotifications={setEmailNotifications}
            notificationEmail={notificationEmail}
            setNotificationEmail={setNotificationEmail}
            notificationFrequency={notificationFrequency}
            setNotificationFrequency={setNotificationFrequency}
          />

          <Button onClick={handleSaveSettings} className="w-full">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
