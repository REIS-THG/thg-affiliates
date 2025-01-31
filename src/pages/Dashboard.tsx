import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { LeaderboardChart } from "@/components/LeaderboardChart";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

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
      <header className="border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">THG Affiliate Dashboard</h1>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      <main className="container mx-auto p-6 space-y-6">
        <div className="grid gap-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">{couponCode} Usage Analytics</h2>
            <Card className="p-6">
              <LeaderboardChart />
            </Card>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-4">Usage History</h2>
            <DataTable />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;