export interface AffiliateUser {
  id: string;
  created_at: string;
  email: string;
  user_id: string;
  // Add any other columns that exist in your Affiliate Users table
}

export type Database = {
  public: {
    Tables: {
      'Affiliate Users': {
        Row: AffiliateUser;
        Insert: Omit<AffiliateUser, 'id' | 'created_at'>;
        Update: Partial<Omit<AffiliateUser, 'id' | 'created_at'>>;
      };
    };
  };
};