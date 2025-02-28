
# Data Import Guide

This guide explains how to import affiliate data into the system using CSV files.

## CSV Format for Coupon Usage Data

Your CSV file should have the following columns:

```
code,date,product_name,quantity,earnings,order_status,payout_date
```

Example:
```
code,date,product_name,quantity,earnings,order_status,payout_date
JOHN15,2023-06-01,Premium Membership,2,50.00,completed,2023-06-15
SARAH20,2023-06-02,Basic Package,1,25.00,completed,2023-06-15
MIKE25,2023-06-03,Pro Plan,3,150.00,pending,
```

## Importing Data Using Supabase Dashboard

1. Navigate to your Supabase project dashboard
2. Go to the SQL Editor
3. Run the following SQL command, replacing `'your_file_path'` with the path to your CSV file:

```sql
SELECT import_coupon_usage_from_csv('your_file_path');
```

## Importing Data Using Supabase CLI

1. Ensure your CSV file is properly formatted
2. Use the Supabase CLI to upload the file:

```bash
supabase storage upload --bucket affiliate-data your_file.csv
```

3. Then run the import function:

```bash
supabase db execute "SELECT import_coupon_usage_from_csv('affiliate-data/your_file.csv');"
```

## Setting Up Affiliate Users

You can use the following SQL template to add new affiliate users:

```sql
INSERT INTO public.affiliate_users 
(coupon_code, password, email, role, payment_method, payment_details, notification_email, notification_frequency, email_notifications)
VALUES 
('AFFILIATECODE', 'password123', 'affiliate@example.com', 'affiliate', 'PayPal', 'paypal@example.com', 'affiliate@example.com', 'weekly', true);
```

Replace the values with appropriate information for each affiliate.
