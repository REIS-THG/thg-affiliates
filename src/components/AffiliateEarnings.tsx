
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EarningsData {
  earnings_30_days: number;
  earnings_this_month: number;
  total_earnings: number;
}

const mockEarnings: EarningsData = {
  earnings_30_days: 1862.00,
  earnings_this_month: 1274.00,
  total_earnings: 8945.00
};

const fetchEarnings = async (): Promise<EarningsData> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockEarnings;
};

export const AffiliateEarnings = () => {
  const { toast } = useToast();
  const { data, isLoading, error, refetch } = useQuery({
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

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing data",
      description: "Getting the latest earnings information...",
    });
  };

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

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Earned Last 30 Days</h3>
          {isLoading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-bold">${data?.earnings_30_days?.toFixed(2) || '0.00'}</p>
          )}
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Earned This Month</h3>
          {isLoading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-bold">${data?.earnings_this_month?.toFixed(2) || '0.00'}</p>
          )}
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Earnings</h3>
          {isLoading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-bold">${data?.total_earnings?.toFixed(2) || '0.00'}</p>
          )}
        </Card>
      </div>
    </div>
  );
};
