
export interface CouponData {
  date: string;
  [key: string]: string | number;
}

export interface CouponUsage {
  code: string;
  data: Array<{
    date: string;
    quantity: number;
    earnings: number;
  }>;
}

export interface AffiliateUser {
  coupon: string;
  password: string;
  email?: string;
  notification_email?: string;
  notification_frequency?: 'daily' | 'weekly' | 'monthly';
  email_notifications?: boolean;
  payment_method?: string;
  payment_details?: string;
  view_type?: string;
}
