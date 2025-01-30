import { useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { Toggle } from "@/components/ui/toggle";

interface CouponData {
  date: string;
  [key: string]: string | number; // For dynamic coupon codes
}

interface CouponUsage {
  code: string;
  data: { date: string; quantity: number }[];
}

const fetchCouponData = async (): Promise<CouponUsage[]> => {
  // TODO: Implement Square API integration
  // This is mock data for now
  return [
    {
      code: "SUMMER2024",
      data: [
        { date: "2024-01", quantity: 65 },
        { date: "2024-02", quantity: 85 },
        { date: "2024-03", quantity: 120 },
        { date: "2024-04", quantity: 90 },
      ],
    },
    {
      code: "WINTER2024",
      data: [
        { date: "2024-01", quantity: 45 },
        { date: "2024-02", quantity: 95 },
        { date: "2024-03", quantity: 80 },
        { date: "2024-04", quantity: 110 },
      ],
    },
  ];
};

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--destructive))",
  "#10B981",
  "#6366F1",
  "#F59E0B",
];

export const LeaderboardChart = () => {
  const [visibleCoupons, setVisibleCoupons] = useState<Set<string>>(new Set());
  const { data, isLoading, error } = useQuery({
    queryKey: ["couponData"],
    queryFn: fetchCouponData,
  });

  const processedData = data?.reduce((acc: CouponData[], coupon) => {
    if (!acc.length) {
      return coupon.data.map((d) => ({
        date: d.date,
        [coupon.code]: d.quantity,
      }));
    }
    return acc.map((item, i) => ({
      ...item,
      [coupon.code]: coupon.data[i].quantity,
    }));
  }, []);

  const toggleCoupon = (code: string) => {
    setVisibleCoupons((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full h-[400px] relative overflow-hidden">
        <div className="animate-pulse bg-gray-200 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <p className="text-destructive">Error loading data</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {data?.map((coupon, index) => (
          <Toggle
            key={coupon.code}
            pressed={visibleCoupons.has(coupon.code)}
            onPressedChange={() => toggleCoupon(coupon.code)}
            className="data-[state=on]:bg-primary/20"
          >
            {coupon.code}
          </Toggle>
        ))}
      </div>
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
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
              }}
            />
            <Legend />
            {data?.map((coupon, index) => (
              visibleCoupons.has(coupon.code) && (
                <Line
                  key={coupon.code}
                  type="monotone"
                  dataKey={coupon.code}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};