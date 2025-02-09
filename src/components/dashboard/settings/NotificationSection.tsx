
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NotificationSectionProps {
  emailNotifications: boolean;
  setEmailNotifications: (value: boolean) => void;
  notificationEmail: string;
  setNotificationEmail: (value: string) => void;
  notificationFrequency: string;
  setNotificationFrequency: (value: string) => void;
}

export const NotificationSection = ({
  emailNotifications,
  setEmailNotifications,
  notificationEmail,
  setNotificationEmail,
  notificationFrequency,
  setNotificationFrequency,
}: NotificationSectionProps) => {
  return (
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
  );
};
