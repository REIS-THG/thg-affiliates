
import { format, subDays } from "date-fns";
import type { CouponUsage } from "@/types/coupon";

const PRODUCTS = [
  { name: 'Premium Course Bundle', basePrice: 49 },
  { name: 'Digital Marketing Workshop', basePrice: 39 },
  { name: 'SEO Masterclass', basePrice: 29 },
  { name: 'Social Media Strategy Course', basePrice: 45 },
  { name: 'Content Creation Basics', basePrice: 35 },
  { name: 'Email Marketing Guide', basePrice: 25 },
  { name: 'Affiliate Marketing 101', basePrice: 42 },
  { name: 'Business Analytics Course', basePrice: 55 },
  { name: 'WordPress Development', basePrice: 65 },
  { name: 'UI/UX Design Fundamentals', basePrice: 49 }
];

const AFFILIATE_CODES = [
  { code: 'SARAH20', commission: 0.25 },
  { code: 'JOHN15', commission: 0.20 },
  { code: 'MIKE25', commission: 0.30 },
  { code: 'EMMA10', commission: 0.22 },
  { code: 'ALEX30', commission: 0.28 }
];

const generateDailyData = (date: string, affiliateCode: string, commission: number) => {
  // Generate 1-3 purchases per day
  const numberOfPurchases = Math.floor(Math.random() * 3) + 1;
  const quantity = numberOfPurchases;
  
  // Calculate earnings based on random products and commission
  let totalEarnings = 0;
  for (let i = 0; i < numberOfPurchases; i++) {
    const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    totalEarnings += product.basePrice * commission;
  }

  return {
    date,
    quantity,
    earnings: Number(totalEarnings.toFixed(2))
  };
};

export const generateMockData = (days: number): CouponUsage[] => {
  const mockData: CouponUsage[] = [];

  AFFILIATE_CODES.forEach(({ code, commission }) => {
    const data = [];
    for (let i = days; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      // Some days might have no purchases (20% chance)
      if (Math.random() > 0.2) {
        data.push(generateDailyData(date, code, commission));
      } else {
        data.push({
          date,
          quantity: 0,
          earnings: 0
        });
      }
    }
    mockData.push({
      code,
      data
    });
  });

  return mockData;
};

// Helper function to generate a random user for demo purposes
export const generateMockUser = (couponCode: string) => {
  return {
    coupon_code: couponCode,
    role: Math.random() > 0.9 ? "admin" : "affiliate", // 10% chance of being admin
    email: `${couponCode.toLowerCase()}@example.com`,
    payment_method: "PayPal",
    payment_details: "demo@example.com",
    notification_email: `${couponCode.toLowerCase()}@example.com`,
    notification_frequency: "daily",
    email_notifications: true
  };
};

// Generate mock data for the data table
export const generateMockTableData = (days: number = 15) => {
  const data = [];
  for (let i = 0; i < days; i++) {
    const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    data.push({
      date: format(subDays(new Date(), i), 'yyyy-MM-dd'),
      product_name: product.name,
      quantity: Math.floor(Math.random() * 3) + 1,
      earnings: Number((product.basePrice * 0.25).toFixed(2))
    });
  }
  return data;
};
