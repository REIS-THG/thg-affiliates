
import { supabase } from "@/integrations/supabase/client";
import { NewAffiliateForm } from "@/components/admin/users/types";
import * as bcrypt from 'bcryptjs';

export const createAffiliate = async (newAffiliate: NewAffiliateForm) => {
  // Hash password with bcrypt before storing
  const hashedPassword = await bcrypt.hash(newAffiliate.password, 10);
  
  const { data, error } = await supabase
    .from('thg_affiliate_users')
    .insert([
      {
        coupon: newAffiliate.coupon,
        password: hashedPassword,
        email: newAffiliate.email || null,
        role: 'affiliate',
        payment_method: newAffiliate.payment_method || null,
        payment_details: newAffiliate.payment_details || null,
        notification_email: newAffiliate.notification_email || null,
        notification_frequency: newAffiliate.notification_frequency || null,
        email_notifications: newAffiliate.email_notifications
      }
    ]);
  
  return { data, error };
};
