
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { UsageAnalytics } from "@/components/UsageAnalytics";
import { UsageHistory } from "@/components/UsageHistory";
import { AffiliateEarnings } from "@/components/AffiliateEarnings";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { NotificationsDialog } from "@/components/dashboard/NotificationsDialog";
import { SettingsDialog } from "@/components/dashboard/SettingsDialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Dashboard = () => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast: uiToast } = useToast();
  const [viewAll, setViewAll] = useState(false);
  const [userSettings, setUserSettings] = useState({
    paymentMethod: "",
    paymentDetails: "",
    emailNotifications: true,
    notificationEmail: "",
    notificationFrequency: "daily",
    viewType: "personal"
  });

  useEffect(() => {
    const checkAuth = async () => {
      const userStr = localStorage.getItem('affiliateUser');
      if (!userStr) {
        uiToast({
          title: "Authentication Required",
          description: "Please log in to access the dashboard",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      try {
        const user = JSON.parse(userStr);
        if (!user.coupon_code) {
          throw new Error("Invalid user data");
        }
        setCouponCode(user.coupon_code);
        setIsAdmin(user.role === "admin");
        
        // Only fetch affiliate preferences if not an admin
        if (!isAdmin) {
          const { data: affiliateUser, error } = await supabase
            .from('THG_Affiliate_Users')
            .select('*')
            .eq('coupon', user.coupon_code)
            .maybeSingle();

          if (error) {
            console.error("Error fetching user preferences:", error);
            throw error;
          }

          if (affiliateUser) {
            setUserSettings({
              paymentMethod: affiliateUser.payment_method || '',
              paymentDetails: affiliateUser.payment_details || '',
              emailNotifications: affiliateUser.email_notifications ?? true,
              notificationEmail: affiliateUser.notification_email || '',
              notificationFrequency: affiliateUser.notification_frequency || 'daily',
              viewType: affiliateUser.view_type || 'personal'
            });
            setViewAll(affiliateUser.view_type === 'all');
          }
        }
        
        // Show welcome notification
        toast.success("Welcome back!", {
          description: isAdmin ? "Admin dashboard is ready" : "Your dashboard is ready to view",
        });
        
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem('affiliateUser');
        uiToast({
          title: "Error",
          description: "Session expired. Please log in again",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, uiToast, isAdmin]);

  const handleViewToggle = async (checked: boolean) => {
    try {
      const newViewType = checked ? 'all' : 'personal';
      const { error } = await supabase
        .from('THG_Affiliate_Users')
        .update({ view_type: newViewType })
        .eq('coupon', couponCode);

      if (error) throw error;

      setViewAll(checked);
      setUserSettings(prev => ({ ...prev, viewType: newViewType }));
      
      toast.success(`Switched to ${checked ? 'all affiliates' : 'personal'} view`);
    } catch (error) {
      console.error('Error updating view preference:', error);
      toast.error('Failed to update view preference');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('affiliateUser');
    uiToast({
      title: "Success",
      description: "Successfully logged out",
    });
    navigate('/login');
  };

  if (!couponCode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={handleLogout} />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              {isAdmin ? "Admin Dashboard Overview" : "Track your affiliate performance and earnings"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {!isAdmin && (
              <div className="flex items-center gap-2">
                <Switch
                  id="view-toggle"
                  checked={viewAll}
                  onCheckedChange={handleViewToggle}
                />
                <Label htmlFor="view-toggle" className="text-sm">
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
        
        <div className="space-y-6">
          <AffiliateEarnings viewType={viewAll ? 'all' : 'personal'} />
          <UsageAnalytics couponCode={couponCode} viewAll={viewAll} />
          <UsageHistory viewAll={viewAll} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
