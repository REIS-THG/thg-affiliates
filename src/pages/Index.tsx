import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LeaderboardChart } from "@/components/LeaderboardChart";
import { DataTable } from "@/components/DataTable";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-bold tracking-tight">
            Coupon Performance
          </h1>
          <p className="text-muted-foreground">
            Track your Square coupon code usage over time
          </p>
        </div>
        <LeaderboardChart />
        <DataTable />
      </div>
    </div>
  );
};

export default Index;