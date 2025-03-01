
import { supabase } from "@/integrations/supabase/client";
import { generateMockTableData } from "@/utils/mockDataGenerator";
import { CouponUsage } from "@/components/table/UsageTable";
import { supabaseService } from "./SupabaseService";

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
    
    // Use safeQuery for better error handling and connectivity monitoring
    return await supabaseService.safeQuery(
      async () => {
        const query = supabase
          .from('coupon_usage')
          .select('*', { count: 'exact' })
          .order('date', { ascending: false });
        
        if (user.role !== 'admin' && !viewAll) {
          query.eq('code', user.coupon_code);
        }
          
        query.range(startIndex, startIndex + ITEMS_PER_PAGE - 1);
        
        const { data, error, count } = await query;
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          throw new Error('No data found for the requested parameters');
        }
        
        return {
          data: data as CouponUsage[],
          count: count || 0
        };
      },
      // Fallback to mock data if the query fails
      {
        data: generateMockTableData(30).slice(startIndex, startIndex + ITEMS_PER_PAGE),
        count: 30
      },
      'Failed to load coupon usage data'
    );
  } catch (error) {
    console.error('Error in fetchCouponUsage:', error);
    throw error;
  }
};
