
import { AffiliateEarnings } from "@/components/AffiliateEarnings";
import { UsageAnalytics } from "@/components/UsageAnalytics";
import { UsageHistory } from "@/components/UsageHistory";

interface DashboardContentProps {
  viewAll: boolean;
  couponCode: string;
}

export const DashboardContent = ({ viewAll, couponCode }: DashboardContentProps) => {
  return (
    <div className="space-y-8">
      <section className="bg-white/70 p-6 rounded-lg shadow-sm border border-[#9C7705]/10 backdrop-blur-sm">
        <AffiliateEarnings viewType={viewAll ? 'all' : 'personal'} />
      </section>
      
      <section className="bg-white/70 p-6 rounded-lg shadow-sm border border-[#9C7705]/10 backdrop-blur-sm">
        <UsageAnalytics couponCode={couponCode} viewAll={viewAll} />
      </section>
      
      <section className="bg-white/70 p-6 rounded-lg shadow-sm border border-[#9C7705]/10 backdrop-blur-sm">
        <UsageHistory viewAll={viewAll} />
      </section>
    </div>
  );
};
