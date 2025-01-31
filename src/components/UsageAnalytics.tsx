import { Card } from "@/components/ui/card";
import { LeaderboardChart } from "@/components/LeaderboardChart";

interface UsageAnalyticsProps {
  couponCode: string;
}

export const UsageAnalytics = ({ couponCode }: UsageAnalyticsProps) => {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">{couponCode} Usage Analytics</h2>
      <Card className="p-6">
        <LeaderboardChart />
      </Card>
    </section>
  );
};