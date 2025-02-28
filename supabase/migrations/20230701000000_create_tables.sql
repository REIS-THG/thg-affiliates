
-- Create affiliate_users table
CREATE TABLE IF NOT EXISTS public.thg_affiliate_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  coupon TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'affiliate',
  payment_method TEXT,
  payment_details TEXT,
  notification_email TEXT,
  notification_frequency TEXT,
  email_notifications BOOLEAN DEFAULT FALSE
);

-- Create coupon_usage table
CREATE TABLE IF NOT EXISTS public.coupon_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  code TEXT NOT NULL REFERENCES public.thg_affiliate_users(coupon),
  date DATE NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  earnings DECIMAL(10, 2) NOT NULL DEFAULT 0,
  order_status TEXT DEFAULT 'pending',
  payout_date DATE
);

-- Create password change history table
CREATE TABLE IF NOT EXISTS public.password_change_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  coupon_code TEXT NOT NULL REFERENCES public.thg_affiliate_users(coupon),
  changed_by TEXT NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_coupon_usage_code ON public.coupon_usage(code);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_date ON public.coupon_usage(date);
