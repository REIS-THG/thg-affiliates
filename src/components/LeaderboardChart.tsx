
import { useMemo, useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { useCouponData } from "@/hooks/useCouponData";
import { TimeRangeSelector } from "@/components/chart/TimeRangeSelector";
import { ChartContainer } from "@/components/chart/ChartContainer";
import { BarChart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { CouponData } from "@/types/coupon";

interface LeaderboardChartProps {
  viewAll?: boolean;
  isTransitioning?: boolean;
}

export const LeaderboardChart = ({ viewAll = false, isTransitioning = false }: LeaderboardChartProps) => {
  const [timeRange, setTimeRange] = useState<string>("30");
  const [refreshKey, setRefreshKey] = useState(0);
  const chartCacheRef = useRef<Map<string, any>>(new Map());
  
  // Cache key is composed of timeRange, viewAll state, and refreshKey
  const cacheKey = `${timeRange}-${viewAll}-${refreshKey}`;
  
  const { data = [], isLoading, error, refetch, isFetching } = useCouponData(timeRange, viewAll, refreshKey);

  // Check if we have cached data before processing
  const processedData = useMemo(() => {
    // If transitioning, show loading state
    if (isTransitioning) return [];
    
    // Return cached data if available
    if (chartCacheRef.current.has(cacheKey) && !isLoading) {
      console.log("Using cached chart data for:", cacheKey);
      return chartCacheRef.current.get(cacheKey);
    }
    
    if (!data || data.length === 0) return [];
    
    try {
      console.log("Processing chart data:", data);
      
      // If not viewAll, filter data to only show the current user's data
      const filteredData = viewAll ? data : data.slice(0, 1);
      
      const result = filteredData.reduce((acc: CouponData[], coupon) => {
        if (!acc.length && coupon.data && coupon.data.length > 0) {
          return coupon.data.map((d) => ({
            date: d.date,
            [coupon.code]: d.quantity,
            // Only include earnings data if not in viewAll mode or for the first coupon (user's own)
            ...(!viewAll && { [`${coupon.code}_earnings`]: d.earnings }),
          }));
        }
        
        if (!coupon.data || !acc[0]) return acc;
        
        return acc.map((item, i) => {
          const newItem = {
            ...item,
            [coupon.code]: coupon.data[i]?.quantity || 0,
          };
          
          // Only include earnings data if not in viewAll mode or for the first coupon (user's own)
          if (!viewAll) {
            newItem[`${coupon.code}_earnings`] = coupon.data[i]?.earnings || 0;
          }
          
          return newItem;
        });
      }, []);
      
      // Cache the processed result
      chartCacheRef.current.set(cacheKey, result);
      return result;
    } catch (err) {
      console.error('Error processing chart data:', err);
      return [];
    }
  }, [data, viewAll, cacheKey, isLoading, isTransitioning]);

  // Clear cache entries when they exceed a limit to prevent memory leaks
  useEffect(() => {
    if (chartCacheRef.current.size > 10) {
      const keysToDelete = Array.from(chartCacheRef.current.keys()).slice(0, 5);
      keysToDelete.forEach(key => chartCacheRef.current.delete(key));
      console.log("Cleared old chart cache entries");
    }
  }, [processedData]);

  const handleRefresh = () => {
    // Clear the cache for this specific view when refreshing
    chartCacheRef.current.delete(cacheKey);
    setRefreshKey(prev => prev + 1);
  };

  const handleTimeRangeChange = (newRange: string) => {
    setTimeRange(newRange);
  };

  const showSkeleton = isLoading || isFetching || isTransitioning;

  if (showSkeleton) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="w-48">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
        <Card className="p-4 bg-[#F9F7F0]/50 border-[#9C7705]/10">
          <Skeleton className="w-full h-[400px] rounded-md" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-[400px] flex flex-col items-center justify-center bg-[#F9F7F0]/50 border-[#9C7705]/10">
        <p className="text-red-500 mb-4">Error loading chart data: {error.message}</p>
        <Button 
          variant="outline" 
          onClick={() => refetch()}
          className="text-[#3B751E] border-[#3B751E]/30 hover:bg-[#3B751E]/10"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </Card>
    );
  }

  const couponCodes = viewAll ? data.map(coupon => coupon.code) : data.slice(0, 1).map(coupon => coupon.code);

  if (processedData.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <TimeRangeSelector value={timeRange} onValueChange={handleTimeRangeChange} />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="text-[#3B751E] border-[#3B751E]/30 hover:bg-[#3B751E]/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <Card className="p-8 bg-[#F9F7F0]/50 border-[#9C7705]/10 h-[400px] flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-[#3B751E]/10 flex items-center justify-center mb-4">
            <BarChart className="h-6 w-6 text-[#3B751E]" />
          </div>
          <h3 className="text-lg font-medium text-[#3B751E]">No Chart Data Available</h3>
          <p className="text-[#9C7705]/70 mt-2 text-center max-w-md">
            There is no usage data available for the selected time period. Data will appear here once coupon codes are used.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <TimeRangeSelector value={timeRange} onValueChange={handleTimeRangeChange} />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          className="text-[#3B751E] border-[#3B751E]/30 hover:bg-[#3B751E]/10"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      <Card className="p-4 bg-[#F9F7F0]/50 border-[#9C7705]/10">
        <ChartContainer data={processedData} couponCodes={couponCodes} />
      </Card>
    </div>
  );
};
