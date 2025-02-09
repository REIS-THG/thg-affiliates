
import { Card } from "@/components/ui/card";
import { LeaderboardChart } from "@/components/LeaderboardChart";

interface UsageAnalyticsProps {
  couponCode: string;
  viewAll: boolean;
}

export const UsageAnalytics = ({ couponCode, viewAll }: UsageAnalyticsProps) => {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">
        {viewAll ? "All Affiliates" : "Personal"} Usage Analytics
      </h2>
      <Card className="p-6">
        <LeaderboardChart viewAll={viewAll} />
      </Card>
    </section>
  );
};
