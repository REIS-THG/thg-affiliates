
-- Create affiliate_users table
CREATE TABLE IF NOT EXISTS public.affiliate_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  coupon_code TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'affiliate',
  payment_method TEXT,
  payment_details TEXT,
  notification_email TEXT,
  notification_frequency TEXT,
  email_notifications BOOLEAN DEFAULT FALSE,
  view_type TEXT DEFAULT 'standard'
);

-- Create coupon_usage table
CREATE TABLE IF NOT EXISTS public.coupon_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  code TEXT NOT NULL REFERENCES public.affiliate_users(coupon_code),
  date DATE NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  earnings DECIMAL(10, 2) NOT NULL DEFAULT 0,
  order_status TEXT DEFAULT 'pending',
  payout_date DATE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_coupon_usage_code ON public.coupon_usage(code);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_date ON public.coupon_usage(date);

-- Add RLS policies
ALTER TABLE public.affiliate_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own data
CREATE POLICY affiliate_users_select ON public.affiliate_users
  FOR SELECT USING (auth.uid()::text = id::text OR role = 'admin');

-- Admins can see all coupon usage, affiliates can only see their own
CREATE POLICY coupon_usage_select ON public.coupon_usage
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.affiliate_users
      WHERE id::text = auth.uid()::text
      AND (role = 'admin' OR coupon_code = code)
    )
  );

-- Script to import CSV data
-- Create function to import coupon usage data from CSV
CREATE OR REPLACE FUNCTION import_coupon_usage_from_csv(csv_file_path TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  result TEXT;
BEGIN
  EXECUTE format('COPY public.coupon_usage(code, date, product_name, quantity, earnings, order_status, payout_date)
                 FROM %L
                 DELIMITER '',''
                 CSV HEADER', csv_file_path);
  
  GET DIAGNOSTICS result = ROW_COUNT;
  RETURN result || ' rows imported successfully';
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'Error importing data: ' || SQLERRM;
END;
$$;
