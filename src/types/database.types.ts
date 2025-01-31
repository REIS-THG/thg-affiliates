export interface AffiliateUser {
  id: string;
  created_at: string;
  coupon_code: string;
  password: string;
  email?: string;
  role?: string;
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
        Row: {
          id: string;
          created_at: string;
          coupon_code: string;
          amount: number;
          user_id: string;
        };
        Insert: Omit<Row, 'id' | 'created_at'>;
        Update: Partial<Omit<Row, 'id' | 'created_at'>>;
      };
    };
  };
};