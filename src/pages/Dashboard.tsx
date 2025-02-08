
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { UsageAnalytics } from "@/components/UsageAnalytics";
import { UsageHistory } from "@/components/UsageHistory";
import { AffiliateEarnings } from "@/components/AffiliateEarnings";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem('affiliateUser');
      if (!userStr) {
        toast({
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
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem('affiliateUser');
        toast({
          title: "Error",
          description: "Session expired. Please log in again",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('affiliateUser');
    toast({
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
      <main className="container mx-auto p-6 space-y-6">
        <AffiliateEarnings />
        <div className="grid gap-6">
          <UsageAnalytics couponCode={couponCode} />
          <UsageHistory />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
