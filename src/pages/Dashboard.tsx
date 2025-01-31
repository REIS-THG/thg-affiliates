import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { UsageAnalytics } from "@/components/UsageAnalytics";
import { UsageHistory } from "@/components/UsageHistory";

const Dashboard = () => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState<string>("");

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('affiliateUser');
      if (!user) {
        navigate('/login');
        return;
      }
      const { coupon_code } = JSON.parse(user);
      setCouponCode(coupon_code);
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('affiliateUser');
    navigate('/login');
  };

  if (!couponCode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={handleLogout} />
      <main className="container mx-auto p-6 space-y-6">
        <div className="grid gap-6">
          <UsageAnalytics couponCode={couponCode} />
          <UsageHistory />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;