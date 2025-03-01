
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
  "#3B751E", // Primary brand green
  "#9C7705", // Secondary brand gold
  "#10B981", // Additional green
  "#6366F1", // Purple
  "#F97316", // Orange
];

interface ChartContainerProps {
  data: CouponData[];
  couponCodes: string[];
}

export const ChartContainer = ({ data, couponCodes }: ChartContainerProps) => {
  return (
    <Card className="w-full h-[300px] md:h-[400px] p-2 md:p-4 border-[#9C7705]/10" role="figure" aria-label="Earnings chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            stroke="#9C7705"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#9C7705", fontWeight: 500 }}
          />
          <YAxis
            stroke="#9C7705"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#9C7705", fontWeight: 500 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Earnings']}
            labelStyle={{ fontWeight: "bold" }}
          />
          <Legend 
            formatter={(value) => {
              // Remove the "_earnings" suffix from legend labels
              return value.replace('_earnings', '');
            }}
            wrapperStyle={{ paddingTop: "10px" }}
          />
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
