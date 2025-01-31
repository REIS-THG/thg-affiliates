import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface EarningsData {
  total_earnings: number;
  monthly_earnings: number;
  weekly_earnings: number;
}

const fetchEarnings = async (): Promise<EarningsData> => {
  const user = JSON.parse(localStorage.getItem('affiliateUser') || '{}');
  
  if (!user.coupon_code) {
    throw new Error('User not authenticated');
  }

  console.log('Fetching earnings for user:', user.coupon_code);
  
  const { data, error } = await supabase
    .rpc('get_affiliate_earnings', {
      p_coupon_code: user.coupon_code
    });
  
  if (error) {
    console.error('Supabase RPC error:', error);
    throw error;
  }

  console.log('Earnings data received:', data);
  return data || { total_earnings: 0, monthly_earnings: 0, weekly_earnings: 0 };
};

export const AffiliateEarnings = () => {
  const { toast } = useToast();
  const { data, isLoading, error } = useQuery({
    queryKey: ["affiliateEarnings"],
    queryFn: fetchEarnings,
    refetchInterval: 30000,
    retry: 1,
    meta: {
      onError: (error: Error) => {
        console.error('Query error:', error);
        toast({
          title: "Error fetching earnings",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Error Loading Data</h3>
            <p className="text-2xl font-bold">--</p>
          </Card>
        ))}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <p className="text-2xl font-bold">${data?.total_earnings?.toFixed(2) || '0.00'}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Monthly Earnings</h3>
        <p className="text-2xl font-bold">${data?.monthly_earnings?.toFixed(2) || '0.00'}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Weekly Earnings</h3>
        <p className="text-2xl font-bold">${data?.weekly_earnings?.toFixed(2) || '0.00'}</p>
      </Card>
    </div>
  );
};