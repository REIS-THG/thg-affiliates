
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, AdminStats } from "@/components/admin/AdminHeader";
import { AdminTabs } from "@/components/admin/AdminTabs";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminPermissions, setAdminPermissions] = useState<Record<string, boolean>>({});
  const [adminStats, setAdminStats] = useState({
    totalAffiliates: 0,
    activeAffiliates: 0,
    totalEarnings: 0,
    pendingPayouts: 0
  });

  useEffect(() => {
    const checkAdminAuth = async () => {
      setIsLoading(true);
      const adminUserStr = localStorage.getItem('adminUser');
      
      if (!adminUserStr) {
        uiToast({
          title: "Authentication Required",
          description: "Please log in to access the admin panel",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      try {
        const adminUser = JSON.parse(adminUserStr);
        
        if (!adminUser.username || !adminUser.id) {
          throw new Error("Invalid admin data");
        }
        
        // Verify admin in database
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', adminUser.id)
          .eq('username', adminUser.username)
          .eq('is_active', true)
          .maybeSingle();
          
        if (adminError || !adminData) {
          throw new Error("Admin verification failed");
        }
        
        setIsAdmin(true);
        
        // Safely cast permissions to Record<string, boolean> or use default
        const permissions = adminData.permissions as Record<string, boolean>;
        setAdminPermissions(permissions || {});
        
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
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuth();
  }, [navigate, uiToast]);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
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
        <AdminHeader />
        <AdminStats adminStats={adminStats} />
        <AdminTabs permissions={adminPermissions} />
      </div>
    </div>
  );
};

export default AdminPanel;
