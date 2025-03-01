
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface AffiliateEarningsProps {
  viewType: 'personal' | 'all';
  isTransitioning?: boolean;
}

interface EarningsData {
  earnings_30_days: number;
  earnings_this_month: number;
  total_earnings: number;
  purchases_30_days: number;
  purchases_this_month: number;
  total_purchases: number;
}

const mockEarnings: EarningsData = {
  earnings_30_days: 1862.00,
  earnings_this_month: 1274.00,
  total_earnings: 8945.00,
  purchases_30_days: 42,
  purchases_this_month: 28,
  total_purchases: 195
};

const fetchEarnings = async (): Promise<EarningsData> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockEarnings;
};

export const AffiliateEarnings = ({ viewType, isTransitioning = false }: AffiliateEarningsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["affiliateEarnings", viewType, refreshTrigger],
    queryFn: fetchEarnings,
    refetchInterval: 30000,
    retry: 1,
    staleTime: 60000, // Consider data fresh for 1 minute
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

  // Pre-fetch data for the other view type to make switching faster
  useEffect(() => {
    const otherViewType = viewType === 'personal' ? 'all' : 'personal';
    queryClient.prefetchQuery({
      queryKey: ["affiliateEarnings", otherViewType, refreshTrigger],
      queryFn: fetchEarnings
    });
  }, [viewType, queryClient, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: "Refreshing data",
      description: "Getting the latest earnings information...",
    });
  };

  const showSkeleton = isLoading || isTransitioning;
  const isAllView = viewType === 'all';

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
          disabled={showSkeleton}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${showSkeleton ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {isAllView ? "Purchases Last 30 Days" : "Earned Last 30 Days"}
            </h3>
            {showSkeleton ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <p className="text-2xl font-bold">
                {isAllView 
                  ? data?.purchases_30_days || '0'
                  : `$${data?.earnings_30_days?.toFixed(2) || '0.00'}`
                }
              </p>
            )}
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {isAllView ? "Purchases This Month" : "Earned This Month"}
            </h3>
            {showSkeleton ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <p className="text-2xl font-bold">
                {isAllView 
                  ? data?.purchases_this_month || '0'
                  : `$${data?.earnings_this_month?.toFixed(2) || '0.00'}`
                }
              </p>
            )}
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {isAllView ? "Total Purchases" : "Total Earnings"}
            </h3>
            {showSkeleton ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <p className="text-2xl font-bold">
                {isAllView 
                  ? data?.total_purchases || '0'
                  : `$${data?.total_earnings?.toFixed(2) || '0.00'}`
                }
              </p>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
