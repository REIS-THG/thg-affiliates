import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { LeaderboardChart } from "@/components/LeaderboardChart";
import { supabase } from "@/lib/supabase";

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

  if (!couponCode) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{couponCode} Chart & Earnings</h1>
      <div className="grid gap-6">
        <Card className="p-6">
          <LeaderboardChart />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;