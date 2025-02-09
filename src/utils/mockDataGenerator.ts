
import { format, subDays } from "date-fns";
import type { CouponUsage } from "@/types/coupon";

export const generateMockData = (days: number): CouponUsage[] => {
  const mockCoupons = ['AFFILIATE1', 'AFFILIATE2', 'AFFILIATE3'];
  const mockData: CouponUsage[] = [];

  mockCoupons.forEach((code) => {
    const data = [];
    for (let i = days; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const baseQuantity = Math.floor(Math.random() * 10) + 1;
      const earnings = baseQuantity * (Math.random() * 50 + 25);
      
      data.push({
        date,
        quantity: baseQuantity,
        earnings: Number(earnings.toFixed(2))
      });
    }
    mockData.push({
      code,
      data
    });
  });

  return mockData;
};
