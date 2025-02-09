
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
  coupon_code: string;
  amount: number;
  user_id: string;
}

export type Database = {
  public: {
    Tables: {
      'Affiliate Users': {
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
