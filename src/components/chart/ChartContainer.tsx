
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
import type { CouponData } from "@/types/coupon";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--destructive))",
  "#10B981",
  "#6366F1",
  "#F59E0B",
];

interface ChartContainerProps {
  data: CouponData[];
  couponCodes: string[];
}

export const ChartContainer = ({ data, couponCodes }: ChartContainerProps) => {
  return (
    <Card className="w-full h-[400px] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
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
          {couponCodes.map((code, index) => (
            <Line
              key={code}
              type="monotone"
              dataKey={`${code}_earnings`}
              name={`${code} Earnings`}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
