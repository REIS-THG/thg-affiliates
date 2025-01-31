import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface EarningsData {
  total_earnings: number;
  monthly_earnings: number;
  weekly_earnings: number;
}

const fetchEarnings = async (): Promise<EarningsData> => {
  const { data, error } = await supabase
    .rpc('get_affiliate_earnings');
  
  if (error) throw error;
  return data;
};

export const AffiliateEarnings = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["affiliateEarnings"],
    queryFn: fetchEarnings,
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-6 bg-gray-200 rounded w-3/4" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Total Earnings</h3>
        <p className="text-2xl font-bold">${data?.total_earnings.toFixed(2)}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Monthly Earnings</h3>
        <p className="text-2xl font-bold">${data?.monthly_earnings.toFixed(2)}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Weekly Earnings</h3>
        <p className="text-2xl font-bold">${data?.weekly_earnings.toFixed(2)}</p>
      </Card>
    </div>
  );
};