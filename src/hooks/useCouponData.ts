
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client"; // Updated to use the correct Supabase client
import { generateMockData } from "@/utils/mockDataGenerator";
import { getStartDate } from "@/utils/dateUtils";
import { useEffect } from "react";
import type { CouponUsage } from "@/types/coupon";

const fetchCouponData = async (days: number, viewAll: boolean = false, refreshKey: number = 0): Promise<CouponUsage[]> => {
  try {
    const startDate = getStartDate(days);
    
    // Get user data from localStorage if available
    const userStr = localStorage.getItem('affiliateUser');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user) {
      console.warn('No user data found. Using mock data.');
      return generateMockData(days);
    }
    
    console.log('Fetching coupon data:', { 
      days, 
      startDate, 
      viewAll, 
      refresh: refreshKey,
      user_coupon: user.coupon_code,
      is_admin: user.role === 'admin'
    });
    
    try {
      // Query coupon usage data
      const query = supabase
        .from('coupon_usage')
        .select('code, date, quantity, earnings')
        .gte('date', startDate)
        .order('date', { ascending: true });
        
      // If not admin and not viewAll, filter by user's coupon code
      if (user.role !== 'admin' && !viewAll) {
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

      console.log('Coupon data received:', { count: couponData.length, sample: couponData[0] });

      // Group the data by coupon code
      const groupedData = couponData.reduce((acc: { [key: string]: any }, curr) => {
        if (!acc[curr.code]) {
          acc[curr.code] = {
            code: curr.code,
            data: []
          };
        }
        
        // Check if this date already exists in the data array
        const existingDateIndex = acc[curr.code].data.findIndex((item: any) => item.date === curr.date);
        
        if (existingDateIndex >= 0) {
          // Update existing date with cumulative values
          acc[curr.code].data[existingDateIndex].quantity += (curr.quantity || 0);
          acc[curr.code].data[existingDateIndex].earnings += (curr.earnings || 0);
        } else {
          // Add new date entry
          acc[curr.code].data.push({
            date: curr.date,
            quantity: curr.quantity || 0,
            earnings: curr.earnings || 0
          });
        }
        
        return acc;
      }, {});

      // Convert the grouped data to an array
      const result = Object.values(groupedData);
      console.log('Processed coupon data:', result);
      
      return result as CouponUsage[];
    } catch (fetchError) {
      console.error('Error in Supabase fetch:', fetchError);
      return generateMockData(days);
    }
  } catch (error) {
    console.error('Error fetching coupon data:', error);
    return generateMockData(days);
  }
};

export const useCouponData = (timeRange: string, viewAll: boolean = false, refreshKey: number = 0) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["couponData", timeRange, viewAll, refreshKey],
    queryFn: () => fetchCouponData(parseInt(timeRange), viewAll, refreshKey),
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  useEffect(() => {
    // Subscribe to real-time changes in the coupon_usage table
    try {
      const subscription = supabase
        .channel('coupon_usage_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'coupon_usage' },
          (payload) => {
            console.log('Real-time update received:', payload);
            queryClient.invalidateQueries({ queryKey: ['couponData'] });
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up real-time subscription:', error);
      // Return empty cleanup function if subscription fails
      return () => {};
    }
  }, [queryClient]);

  return query;
};
