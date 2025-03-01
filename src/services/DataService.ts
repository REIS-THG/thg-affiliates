
import { supabase } from "@/integrations/supabase/client";
import { generateMockTableData } from "@/utils/mockDataGenerator";
import { CouponUsage } from "@/components/table/UsageTable";

export const ITEMS_PER_PAGE = 10;

export const fetchCouponUsage = async (page: number, viewAll: boolean): Promise<{ data: CouponUsage[], count: number }> => {
  try {
    const userStr = localStorage.getItem('affiliateUser');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user) {
      throw new Error('No user data found. Please log in again.');
    }
    
    const startIndex = page * ITEMS_PER_PAGE;
    
    console.log('Fetching coupon usage data for:', { 
      user_coupon: user.coupon_code,
      is_admin: user.role === 'admin',
      viewAll,
      page,
      startIndex
    });
    
    try {
      const query = supabase
        .from('coupon_usage')
        .select('*', { count: 'exact' })
        .order('date', { ascending: false });
      
      if (user.role !== 'admin' && !viewAll) {
        query.eq('code', user.coupon_code);
      }
        
      query.range(startIndex, startIndex + ITEMS_PER_PAGE - 1);
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log('Supabase returned data:', { count, firstItem: data[0] });
        return {
          data: data as CouponUsage[],
          count: count || 0
        };
      } else {
        console.log('Supabase returned no data, using mock data');
      }
    } catch (supabaseError) {
      console.error('Supabase fetch error:', supabaseError);
    }
    
    console.log('Generating mock data for table');
    const mockData = generateMockTableData(30);
    return {
      data: mockData.slice(startIndex, startIndex + ITEMS_PER_PAGE),
      count: mockData.length
    };
  } catch (error) {
    console.error('Error in fetchCouponUsage:', error);
    throw error;
  }
};
