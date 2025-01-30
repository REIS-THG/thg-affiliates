import { LeaderboardChart } from "@/components/LeaderboardChart";
import { DataTable } from "@/components/DataTable";

const Index = () => {
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