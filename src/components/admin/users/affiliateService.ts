
import { supabase } from "@/integrations/supabase/client";
import { AffiliateUser } from "@/components/admin/users/types";

const ITEMS_PER_PAGE = 10;

export const fetchAffiliates = async (
  currentPage: number, 
  searchTerm: string
): Promise<{ affiliates: AffiliateUser[], totalCount: number }> => {
  const startIndex = currentPage * ITEMS_PER_PAGE;
  
  let query = supabase
    .from('thg_affiliate_users')
    .select('*', { count: 'exact' })
    .eq('role', 'affiliate')
    .order('created_at', { ascending: false });
    
  if (searchTerm) {
    query = query.or(`coupon.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
  }
  
  const { data, count, error } = await query
    .range(startIndex, startIndex + ITEMS_PER_PAGE - 1);
  
  if (error) throw error;
  
  return { 
    affiliates: data || [], 
    totalCount: count || 0 
  };
};

export const ITEMS_PER_PAGE_EXPORT = ITEMS_PER_PAGE;
