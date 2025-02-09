
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { useCouponData } from "@/hooks/useCouponData";
import { TimeRangeSelector } from "@/components/chart/TimeRangeSelector";
import { ChartContainer } from "@/components/chart/ChartContainer";
import type { CouponData } from "@/types/coupon";

export const LeaderboardChart = () => {
  const [timeRange, setTimeRange] = useState<string>("30");
  const { data = [], isLoading, error } = useCouponData(timeRange);

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    try {
      return data.reduce((acc: CouponData[], coupon) => {
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
      console.error('Error processing data:', err);
      return [];
    }
  }, [data]);

  if (isLoading) {
    return (
      <Card className="w-full h-[400px] relative overflow-hidden">
        <div className="animate-pulse bg-gray-200 w-full h-full" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <p className="text-destructive">Error loading data: {error.message}</p>
      </Card>
    );
  }

  const couponCodes = data.map(coupon => coupon.code);

  return (
    <div className="space-y-4">
      <TimeRangeSelector value={timeRange} onValueChange={setTimeRange} />
      <ChartContainer data={processedData} couponCodes={couponCodes} />
    </div>
  );
};
