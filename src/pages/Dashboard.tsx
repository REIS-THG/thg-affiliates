
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { UsageAnalytics } from "@/components/UsageAnalytics";
import { UsageHistory } from "@/components/UsageHistory";
import { AffiliateEarnings } from "@/components/AffiliateEarnings";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client"; // Updated to use the correct Supabase client
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
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
        if (user.role !== "admin") {
          try {
            const { data: affiliateUser, error } = await supabase
              .from('thg_affiliate_users')
              .select('*')
              .eq('coupon', user.coupon_code)
              .maybeSingle();

            if (error) {
              console.error("Error fetching user preferences:", error);
              // Continue with default settings instead of throwing
              console.log("Using default settings due to fetch error");
            } else if (affiliateUser) {
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
          } catch (fetchError) {
            console.error("Fetch error:", fetchError);
            // Continue with default settings
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
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, uiToast, isAdmin]);

  const handleViewToggle = async (checked: boolean) => {
    try {
      const newViewType = checked ? 'all' : 'personal';
      
      try {
        const { error } = await supabase
          .from('thg_affiliate_users')
          .update({ view_type: newViewType })
          .eq('coupon', couponCode);

        if (error) {
          console.error('Supabase update error:', error);
        }
      } catch (updateError) {
        console.error('Error updating view preference in database:', updateError);
        // Continue with UI update even if database update fails
      }

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F7F0] flex items-center justify-center">
        <div className="animate-pulse text-[#3B751E] text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  if (!couponCode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F9F7F0]">
      <Header onLogout={handleLogout} />
      <div className="container mx-auto p-6">
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
                  onCheckedChange={handleViewToggle}
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
        
        <div className="space-y-8">
          <section className="bg-white/70 p-6 rounded-lg shadow-sm border border-[#9C7705]/10 backdrop-blur-sm">
            <AffiliateEarnings viewType={viewAll ? 'all' : 'personal'} />
          </section>
          
          <section className="bg-white/70 p-6 rounded-lg shadow-sm border border-[#9C7705]/10 backdrop-blur-sm">
            <UsageAnalytics couponCode={couponCode} viewAll={viewAll} />
          </section>
          
          <section className="bg-white/70 p-6 rounded-lg shadow-sm border border-[#9C7705]/10 backdrop-blur-sm">
            <UsageHistory viewAll={viewAll} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
