
export interface AffiliateUser {
  id: string;
  created_at: string;
  coupon_code: string;
  password: string;
  email?: string;
  role?: string;
  payment_method?: string;
  payment_details?: string;
  notification_email?: string;
  notification_frequency?: 'daily' | 'weekly' | 'monthly';
  email_notifications?: boolean;
}

export interface CouponUsage {
  id: string;
  created_at: string;
  code: string;
  date: string;
  product_name: string;
  quantity: number;
  earnings: number;
  order_status: string;
  payout_date: string | null;
}

export type Database = {
  public: {
    Tables: {
      'affiliate_users': {
        Row: AffiliateUser;
        Insert: Omit<AffiliateUser, 'id' | 'created_at'>;
        Update: Partial<Omit<AffiliateUser, 'id' | 'created_at'>>;
      };
      'coupon_usage': {
        Row: CouponUsage;
        Insert: Omit<CouponUsage, 'id' | 'created_at'>;
        Update: Partial<Omit<CouponUsage, 'id' | 'created_at'>>;
      };
    };
  };
};
