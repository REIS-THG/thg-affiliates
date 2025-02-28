
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/UserManagement";
import { DataExport } from "@/components/admin/DataExport";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { AlertCircle, User, FileText, Settings } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminStats, setAdminStats] = useState({
    totalAffiliates: 0,
    activeAffiliates: 0,
    totalEarnings: 0,
    pendingPayouts: 0
  });

  useEffect(() => {
    const checkAdminAuth = async () => {
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
        if (user.role !== "admin") {
          throw new Error("Admin access required");
        }
        setIsAdmin(true);
        
        // Fetch admin statistics
        try {
          // Get total affiliates count
          const { count: totalAffiliates, error: countError } = await supabase
            .from('thg_affiliate_users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'affiliate');
            
          if (countError) throw countError;
          
          // Get total earnings and pending payouts
          const { data: earningsData, error: earningsError } = await supabase
            .from('coupon_usage')
            .select('earnings, order_status, payout_date');
            
          if (earningsError) throw earningsError;
          
          const totalEarnings = earningsData?.reduce((sum, item) => sum + Number(item.earnings), 0) || 0;
          const pendingPayouts = earningsData?.reduce((sum, item) => 
            item.order_status === 'completed' && !item.payout_date ? sum + Number(item.earnings) : sum, 0) || 0;
          
          // Get active affiliates (those with usage in the last 30 days)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          const { data: activeData, error: activeError } = await supabase
            .from('coupon_usage')
            .select('code')
            .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
            .order('code');
            
          if (activeError) throw activeError;
          
          const activeAffiliates = activeData ? new Set(activeData.map(item => item.code)).size : 0;
          
          setAdminStats({
            totalAffiliates: totalAffiliates || 0,
            activeAffiliates,
            totalEarnings,
            pendingPayouts
          });
            
        } catch (statsError) {
          console.error('Error fetching admin statistics:', statsError);
          // Don't throw here, just continue with zeroed stats
        }
        
        toast.success("Admin Panel Loaded", {
          description: "Welcome to the affiliate admin panel",
        });
        
      } catch (error) {
        console.error("Authentication error:", error);
        uiToast({
          title: "Access Denied",
          description: "You need admin privileges to access this page",
          variant: "destructive",
        });
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuth();
  }, [navigate, uiToast]);

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
        <div className="animate-pulse text-[#3B751E] text-xl">Loading admin panel...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="min-h-screen bg-[#F9F7F0]">
      <Header onLogout={handleLogout} />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#3B751E]">Admin Panel</h1>
          <p className="text-[#9C7705]/70">
            Manage affiliates, export data, and configure system settings
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/70 p-4 rounded-lg shadow-sm border border-[#9C7705]/10 backdrop-blur-sm">
            <div className="text-[#3B751E] text-lg font-semibold">Total Affiliates</div>
            <div className="text-3xl font-bold mt-2">{adminStats.totalAffiliates}</div>
          </div>
          <div className="bg-white/70 p-4 rounded-lg shadow-sm border border-[#9C7705]/10 backdrop-blur-sm">
            <div className="text-[#3B751E] text-lg font-semibold">Active Affiliates</div>
            <div className="text-3xl font-bold mt-2">{adminStats.activeAffiliates}</div>
          </div>
          <div className="bg-white/70 p-4 rounded-lg shadow-sm border border-[#9C7705]/10 backdrop-blur-sm">
            <div className="text-[#3B751E] text-lg font-semibold">Total Earnings</div>
            <div className="text-3xl font-bold mt-2">${adminStats.totalEarnings.toFixed(2)}</div>
          </div>
          <div className="bg-white/70 p-4 rounded-lg shadow-sm border border-[#9C7705]/10 backdrop-blur-sm">
            <div className="text-[#3B751E] text-lg font-semibold">Pending Payouts</div>
            <div className="text-3xl font-bold mt-2">${adminStats.pendingPayouts.toFixed(2)}</div>
          </div>
        </div>
        
        <Alert className="mb-6 border-amber-300 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Important</AlertTitle>
          <AlertDescription className="text-amber-700">
            CSV imports should be performed directly in the Supabase dashboard. Please refer to the data import guide for details.
          </AlertDescription>
        </Alert>
        
        <div className="bg-white/70 rounded-lg shadow-sm border border-[#9C7705]/10 backdrop-blur-sm">
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="w-full border-b border-[#9C7705]/10 rounded-t-lg rounded-b-none bg-[#F9F7F0] p-0">
              <TabsTrigger value="users" className="flex-1 rounded-none rounded-tl-lg data-[state=active]:bg-white data-[state=active]:shadow-none py-3">
                <User className="w-4 h-4 mr-2" />
                User Management
              </TabsTrigger>
              <TabsTrigger value="export" className="flex-1 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none py-3">
                <FileText className="w-4 h-4 mr-2" />
                Data Export
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1 rounded-none rounded-tr-lg data-[state=active]:bg-white data-[state=active]:shadow-none py-3">
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="p-6 focus-visible:outline-none focus-visible:ring-0">
              <UserManagement />
            </TabsContent>
            <TabsContent value="export" className="p-6 focus-visible:outline-none focus-visible:ring-0">
              <DataExport />
            </TabsContent>
            <TabsContent value="settings" className="p-6 focus-visible:outline-none focus-visible:ring-0">
              <SystemSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
