
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { useCouponData } from "@/hooks/useCouponData";
import { TimeRangeSelector } from "@/components/chart/TimeRangeSelector";
import { ChartContainer } from "@/components/chart/ChartContainer";
import { BarChart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CouponData } from "@/types/coupon";

interface LeaderboardChartProps {
  viewAll?: boolean;
}

export const LeaderboardChart = ({ viewAll = false }: LeaderboardChartProps) => {
  const [timeRange, setTimeRange] = useState<string>("30");
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { data = [], isLoading, error, refetch } = useCouponData(timeRange, viewAll, refreshKey);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    try {
      console.log("Processing chart data:", data);
      
      // If not viewAll, filter data to only show the current user's data
      const filteredData = viewAll ? data : data.slice(0, 1);
      
      return filteredData.reduce((acc: CouponData[], coupon) => {
        if (!acc.length && coupon.data && coupon.data.length > 0) {
          return coupon.data.map((d) => ({
            date: d.date,
            [coupon.code]: d.quantity,
            [`${coupon.code}_earnings`]: d.earnings,
          }));
        }
        
        if (!coupon.data || !acc[0]) return acc;
        
        return acc.map((item, i) => ({
          ...item,
          [coupon.code]: coupon.data[i]?.quantity || 0,
          [`${coupon.code}_earnings`]: coupon.data[i]?.earnings || 0,
        }));
      }, []);
    } catch (err) {
      console.error('Error processing chart data:', err);
      return [];
    }
  }, [data, viewAll]);

  if (isLoading) {
    return (
      <Card className="w-full h-[400px] relative overflow-hidden bg-[#F9F7F0]/50 border-[#9C7705]/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin text-[#3B751E] flex items-center justify-center">
            <RefreshCw className="h-8 w-8" />
          </div>
          <p className="text-[#9C7705]/70">Loading chart data...</p>
        </div>
      </Card>
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
          <TimeRangeSelector value={timeRange} onValueChange={setTimeRange} />
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
        <TimeRangeSelector value={timeRange} onValueChange={setTimeRange} />
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
