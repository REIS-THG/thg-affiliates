
-- Insert a test admin user
INSERT INTO public.thg_affiliate_users 
(coupon, password, email, role, payment_method, payment_details, notification_email, notification_frequency, email_notifications)
VALUES 
('ADMIN1', 'admin123', 'admin@example.com', 'admin', NULL, NULL, 'admin@example.com', 'daily', true);

-- Insert some test affiliate users
INSERT INTO public.thg_affiliate_users 
(coupon, password, email, role, payment_method, payment_details, notification_email, notification_frequency, email_notifications)
VALUES 
('JOHN15', 'password123', 'john@example.com', 'affiliate', 'venmo', '@john-doe', 'john@example.com', 'weekly', true),
('SARAH20', 'password123', 'sarah@example.com', 'affiliate', 'cashapp', '$sarahsmith', 'sarah@example.com', 'monthly', true),
('MIKE25', 'password123', 'mike@example.com', 'affiliate', 'ach', '1234567890', 'mike@example.com', 'daily', false);

-- Insert sample coupon usage data
INSERT INTO public.coupon_usage 
(code, date, product_name, quantity, earnings, order_status, payout_date)
VALUES 
('JOHN15', '2023-06-01', 'Premium Membership', 2, 50.00, 'completed', '2023-06-15'),
('JOHN15', '2023-06-05', 'Basic Package', 1, 25.00, 'completed', '2023-06-15'),
('JOHN15', '2023-06-10', 'Pro Plan', 1, 75.00, 'completed', '2023-06-15'),
('JOHN15', '2023-06-20', 'Premium Membership', 3, 75.00, 'pending', NULL),
('SARAH20', '2023-06-02', 'Basic Package', 1, 25.00, 'completed', '2023-06-15'),
('SARAH20', '2023-06-07', 'Premium Membership', 2, 50.00, 'completed', '2023-06-15'),
('SARAH20', '2023-06-12', 'Pro Plan', 1, 75.00, 'processing', NULL),
('SARAH20', '2023-06-25', 'Basic Package', 2, 50.00, 'pending', NULL),
('MIKE25', '2023-06-03', 'Pro Plan', 3, 150.00, 'completed', '2023-06-15'),
('MIKE25', '2023-06-08', 'Premium Membership', 1, 25.00, 'completed', '2023-06-15'),
('MIKE25', '2023-06-15', 'Basic Package', 2, 50.00, 'cancelled', NULL),
('MIKE25', '2023-06-30', 'Pro Plan', 1, 75.00, 'pending', NULL);
