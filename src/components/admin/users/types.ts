
export interface AffiliateUser {
  id: string;
  coupon: string;
  email: string | null;
  role: string | null;
  payment_method: string | null;
  payment_details: string | null;
  email_notifications: boolean | null;
  notification_email: string | null;
  notification_frequency: string | null;
  created_at: string | null;
}

export interface NewAffiliateForm {
  coupon: string;
  email: string;
  password: string;
  confirmPassword: string;
  payment_method: string;
  payment_details: string;
  notification_email: string;
  email_notifications: boolean;
  notification_frequency: string;
}
