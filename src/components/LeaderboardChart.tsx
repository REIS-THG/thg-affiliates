import { useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Toggle } from "@/components/ui/toggle";
import { supabase } from "@/lib/supabase";

interface CouponData {
  date: string;
  [key: string]: string | number;
}

interface CouponUsage {
  code: string;
  data: { date: string; quantity: number; earnings: number }[];
}

const fetchCouponData = async (): Promise<CouponUsage[]> => {
  try {
    const { data: couponData, error } = await supabase
      .from('coupon_usage')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!couponData || couponData.length === 0) {
      console.log('No coupon data found');
      return [];
    }

    // Transform the data into the required format
    const groupedData = couponData.reduce((acc: { [key: string]: any }, curr) => {
      if (!acc[curr.code]) {
        acc[curr.code] = {
          code: curr.code,
          data: []
        };
      }
      acc[curr.code].data.push({
        date: curr.date,
        quantity: curr.quantity || 0,
        earnings: curr.earnings || 0
      });
      return acc;
    }, {});

    return Object.values(groupedData);
  } catch (error) {
    console.error('Error fetching coupon data:', error);
    throw error;
  }
};

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--destructive))",
  "#10B981",
  "#6366F1",
  "#F59E0B",
];

export const LeaderboardChart = () => {
  const queryClient = useQueryClient();
  
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["couponData"],
    queryFn: fetchCouponData,
    refetchInterval: 30000,
  });

  useEffect(() => {
    const subscription = supabase
      .channel('coupon_usage_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'coupon_usage' },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['couponData'] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

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

  return (
    <div className="space-y-4">
      <Card className="w-full h-[400px] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
              }}
            />
            <Legend />
            {data.map((coupon, index) => (
              <Line
                key={coupon.code}
                type="monotone"
                dataKey={`${coupon.code}_earnings`}
                name={`${coupon.code} Earnings`}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};