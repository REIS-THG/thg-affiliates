
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { UsageAnalytics } from "@/components/UsageAnalytics";
import { UsageHistory } from "@/components/UsageHistory";
import { AffiliateEarnings } from "@/components/AffiliateEarnings";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { NotificationsDialog } from "@/components/dashboard/NotificationsDialog";
import { SettingsDialog } from "@/components/dashboard/SettingsDialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState<string>("");
  const { toast: uiToast } = useToast();
  const [userSettings, setUserSettings] = useState({
    paymentMethod: "",
    paymentDetails: "",
    emailNotifications: true,
    notificationEmail: "",
    notificationFrequency: "daily"
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
        
        // Fetch user preferences from Supabase
        const { data: affiliateUser, error } = await supabase
          .from('THG_Affiliate_Users')
          .select('*')
          .eq('coupon', user.coupon_code)
          .single();

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
            notificationFrequency: affiliateUser.notification_frequency || 'daily'
          });
        }
        
        // Show welcome notification
        toast.success("Welcome back!", {
          description: "Your dashboard is ready to view",
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
  }, [navigate, uiToast]);

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
              Track your affiliate performance and earnings
            </p>
          </div>
          <div className="flex gap-2">
            <NotificationsDialog />
            <SettingsDialog 
              couponCode={couponCode}
              initialSettings={userSettings}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <AffiliateEarnings />
          <UsageAnalytics couponCode={couponCode} />
          <UsageHistory />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
