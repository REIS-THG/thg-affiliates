
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { generateMockData } from "@/utils/mockDataGenerator";
import { getStartDate } from "@/utils/dateUtils";
import { useEffect } from "react";
import type { CouponUsage } from "@/types/coupon";

const fetchCouponData = async (days: number, viewAll: boolean = false): Promise<CouponUsage[]> => {
  try {
    const startDate = getStartDate(days);
    
    // Get user data from localStorage if available, but don't error out if missing
    const userStr = localStorage.getItem('affiliateUser');
    const user = userStr ? JSON.parse(userStr) : null;
    
    // For production, we'd filter by user's coupon code
    // For demo, fetch all data regardless
    const query = supabase
      .from('coupon_usage')
      .select('*')
      .gte('date', startDate)
      .order('date', { ascending: true });
      
    // If not admin and not viewAll, filter by user's coupon code
    if (user && user.role !== 'admin' && !viewAll && user.coupon_code) {
      query.eq('code', user.coupon_code);
    }
    
    const { data: couponData, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return generateMockData(days);
    }

    if (!couponData || couponData.length === 0) {
      console.log('No coupon data found, using mock data');
      return generateMockData(days);
    }

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
    return generateMockData(days);
  }
};

export const useCouponData = (timeRange: string, viewAll: boolean = false) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["couponData", timeRange, viewAll],
    queryFn: () => fetchCouponData(parseInt(timeRange), viewAll),
    refetchInterval: 30000,
  });

  useEffect(() => {
    const subscription = supabase
      .channel('coupon_usage_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'coupon_usage' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['couponData', timeRange] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, timeRange]);

  return query;
};
