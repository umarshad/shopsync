-- Add sample products to the database
-- Run this in Supabase SQL Editor if you want to add test products

-- First, get a shop_id from an existing profile (or create one)
-- Replace 'YOUR-SHOP-ID' with an actual shop_id from the profiles table

-- Sample products
INSERT INTO public.products (shop_id, name, barcode, category, purchase_price, sale_price, stock, low_stock_alert, description)
VALUES 
  -- Replace 'YOUR-SHOP-ID' with your actual shop_id
  ('YOUR-SHOP-ID', 'Sample Product 1', '1234567890', 'Electronics', 50.00, 75.00, 100, 10, 'Sample product description'),
  ('YOUR-SHOP-ID', 'Sample Product 2', '1234567891', 'Clothing', 25.00, 40.00, 50, 5, 'Another sample product'),
  ('YOUR-SHOP-ID', 'Sample Product 3', '1234567892', 'Food', 10.00, 15.00, 200, 20, 'Food item sample')
ON CONFLICT DO NOTHING;

-- To get your shop_id, run this first:
-- SELECT id, shop_id, shop_name FROM profiles LIMIT 1;

