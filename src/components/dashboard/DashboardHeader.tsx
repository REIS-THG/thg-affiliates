
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { NotificationsDialog } from "@/components/dashboard/NotificationsDialog";
import { SettingsDialog } from "@/components/dashboard/SettingsDialog";

interface DashboardHeaderProps {
  isAdmin: boolean;
  viewAll: boolean;
  onViewToggle: (checked: boolean) => void;
  couponCode: string;
  userSettings: {
    paymentMethod: string;
    paymentDetails: string;
    emailNotifications: boolean;
    notificationEmail: string;
    notificationFrequency: string;
    viewType: string;
  };
  isTransitioning?: boolean;
}

export const DashboardHeader = ({
  isAdmin,
  viewAll,
  onViewToggle,
  couponCode,
  userSettings,
  isTransitioning = false
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#3B751E]">Dashboard</h1>
        <p className="text-[#9C7705]/70">
          {isAdmin ? "Admin Dashboard Overview" : "Track your affiliate performance and earnings"}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        {!isAdmin && (
          <div className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-lg shadow-sm border border-[#9C7705]/10">
            <Switch
              id="view-toggle"
              checked={viewAll}
              onCheckedChange={onViewToggle}
              className="data-[state=checked]:bg-[#3B751E]"
            />
            <Label htmlFor="view-toggle" className="text-sm text-[#3B751E] font-medium">
              {viewAll ? "All Affiliates" : "Personal View"}
            </Label>
          </div>
        )}
        <div className="flex gap-2">
          <NotificationsDialog />
          {!isAdmin && (
            <SettingsDialog 
              couponCode={couponCode}
              initialSettings={userSettings}
            />
          )}
        </div>
      </div>
    </div>
  );
};
