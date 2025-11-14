-- ShopSync Database Migrations
-- Combined file for easy execution in Supabase SQL Editor
-- Run this entire file in one go: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/sql
-- Generated: 2025-11-14T22:45:58.136Z


-- ========================================
-- Migration 1: 001_initial_schema.sql
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS on auth.users (if not already enabled)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_name TEXT,
  shop_id UUID DEFAULT uuid_generate_v4(),
  role TEXT CHECK (role IN ('cashier', 'manager', 'owner')) DEFAULT 'cashier',
  pin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES public.profiles(shop_id) ON DELETE CASCADE,
  barcode TEXT,
  name TEXT NOT NULL,
  category TEXT,
  purchase_price NUMERIC(10, 2) DEFAULT 0,
  sale_price NUMERIC(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  low_stock_alert INTEGER DEFAULT 5,
  image TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(shop_id, barcode)
);

-- Create sales table
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES public.profiles(shop_id) ON DELETE CASCADE,
  invoice_no TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) DEFAULT 0,
  tax NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'mobile')) DEFAULT 'cash',
  cashier_id UUID REFERENCES auth.users(id),
  notes TEXT,
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(shop_id, invoice_no)
);

-- Create sale_items table
CREATE TABLE IF NOT EXISTS public.sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sync_queue table for offline operations
CREATE TABLE IF NOT EXISTS public.sync_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES public.profiles(shop_id) ON DELETE CASCADE,
  table_name TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('insert', 'update', 'delete')),
  data JSONB NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_shop_id ON public.products(shop_id);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON public.products(barcode);
CREATE INDEX IF NOT EXISTS idx_sales_shop_id ON public.sales(shop_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON public.sales(created_at);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON public.sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON public.sale_items(product_id);
CREATE INDEX IF NOT EXISTS idx_sync_queue_shop_id ON public.sync_queue(shop_id);
CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON public.sync_queue(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON public.sales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_no(shop_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT := 'INV-';
  shop_prefix TEXT;
  last_invoice TEXT;
  invoice_num INTEGER;
BEGIN
  -- Get shop prefix (first 4 chars of shop_id)
  shop_prefix := UPPER(SUBSTRING(shop_uuid::TEXT FROM 1 FOR 4));
  
  -- Get last invoice number for this shop
  SELECT invoice_no INTO last_invoice
  FROM public.sales
  WHERE shop_id = shop_uuid
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF last_invoice IS NULL THEN
    invoice_num := 1;
  ELSE
    invoice_num := CAST(SUBSTRING(last_invoice FROM '[0-9]+$') AS INTEGER) + 1;
  END IF;
  
  RETURN prefix || shop_prefix || '-' || LPAD(invoice_num::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;




-- ========================================
-- Migration 2: 002_rls_policies.sql
-- ========================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_queue ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's shop_id
CREATE OR REPLACE FUNCTION get_user_shop_id()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT shop_id FROM public.profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Products policies
CREATE POLICY "Users can view products in their shop"
  ON public.products FOR SELECT
  USING (shop_id = get_user_shop_id());

CREATE POLICY "Managers and owners can insert products"
  ON public.products FOR INSERT
  WITH CHECK (
    shop_id = get_user_shop_id() AND
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'owner')
  );

CREATE POLICY "Managers and owners can update products"
  ON public.products FOR UPDATE
  USING (
    shop_id = get_user_shop_id() AND
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'owner')
  );

CREATE POLICY "Only owners can delete products"
  ON public.products FOR DELETE
  USING (
    shop_id = get_user_shop_id() AND
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'owner'
  );

-- Sales policies
CREATE POLICY "Users can view sales in their shop"
  ON public.sales FOR SELECT
  USING (shop_id = get_user_shop_id());

CREATE POLICY "Cashiers, managers, and owners can create sales"
  ON public.sales FOR INSERT
  WITH CHECK (
    shop_id = get_user_shop_id() AND
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('cashier', 'manager', 'owner')
  );

CREATE POLICY "Managers and owners can update sales"
  ON public.sales FOR UPDATE
  USING (
    shop_id = get_user_shop_id() AND
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'owner')
  );

CREATE POLICY "Only owners can delete sales"
  ON public.sales FOR DELETE
  USING (
    shop_id = get_user_shop_id() AND
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'owner'
  );

-- Sale items policies
CREATE POLICY "Users can view sale items in their shop"
  ON public.sale_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sales
      WHERE sales.id = sale_items.sale_id
      AND sales.shop_id = get_user_shop_id()
    )
  );

CREATE POLICY "Cashiers, managers, and owners can create sale items"
  ON public.sale_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sales
      WHERE sales.id = sale_items.sale_id
      AND sales.shop_id = get_user_shop_id()
      AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('cashier', 'manager', 'owner')
    )
  );

CREATE POLICY "Managers and owners can update sale items"
  ON public.sale_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.sales
      WHERE sales.id = sale_items.sale_id
      AND sales.shop_id = get_user_shop_id()
      AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'owner')
    )
  );

CREATE POLICY "Only owners can delete sale items"
  ON public.sale_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.sales
      WHERE sales.id = sale_items.sale_id
      AND sales.shop_id = get_user_shop_id()
      AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'owner'
    )
  );

-- Sync queue policies
CREATE POLICY "Users can view their sync queue"
  ON public.sync_queue FOR SELECT
  USING (shop_id = get_user_shop_id());

CREATE POLICY "Users can insert into their sync queue"
  ON public.sync_queue FOR INSERT
  WITH CHECK (shop_id = get_user_shop_id());

CREATE POLICY "Users can update their sync queue"
  ON public.sync_queue FOR UPDATE
  USING (shop_id = get_user_shop_id());

CREATE POLICY "Users can delete from their sync queue"
  ON public.sync_queue FOR DELETE
  USING (shop_id = get_user_shop_id());




-- ========================================
-- Migration 3: 003_realtime_setup.sql
-- ========================================

-- Enable Realtime for tables
ALTER publication supabase_realtime ADD TABLE public.products;
ALTER publication supabase_realtime ADD TABLE public.sales;
ALTER publication supabase_realtime ADD TABLE public.sale_items;

-- Create function to handle stock updates on sale
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Decrease stock when sale item is created
    UPDATE public.products
    SET stock = stock - NEW.quantity,
        updated_at = NOW()
    WHERE id = NEW.product_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Increase stock when sale item is deleted
    UPDATE public.products
    SET stock = stock + OLD.quantity,
        updated_at = NOW()
    WHERE id = OLD.product_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Update stock when sale item quantity changes
    UPDATE public.products
    SET stock = stock + OLD.quantity - NEW.quantity,
        updated_at = NOW()
    WHERE id = NEW.product_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for stock updates
CREATE TRIGGER update_stock_on_sale_item
  AFTER INSERT OR UPDATE OR DELETE ON public.sale_items
  FOR EACH ROW EXECUTE FUNCTION update_product_stock();

-- Create function to calculate sale totals
CREATE OR REPLACE FUNCTION calculate_sale_totals()
RETURNS TRIGGER AS $$
DECLARE
  sale_subtotal NUMERIC(10, 2);
  sale_total NUMERIC(10, 2);
BEGIN
  -- Calculate subtotal from sale items
  SELECT COALESCE(SUM(subtotal), 0) INTO sale_subtotal
  FROM public.sale_items
  WHERE sale_id = NEW.id;
  
  -- Calculate total (subtotal - discount + tax)
  sale_total := sale_subtotal - COALESCE(NEW.discount, 0) + COALESCE(NEW.tax, 0);
  
  -- Update sale totals
  UPDATE public.sales
  SET subtotal = sale_subtotal,
      total = sale_total,
      updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for sale total calculation (when sale_items change)
CREATE OR REPLACE FUNCTION recalculate_sale_on_item_change()
RETURNS TRIGGER AS $$
DECLARE
  sale_record UUID;
  sale_subtotal NUMERIC(10, 2);
  sale_total NUMERIC(10, 2);
  sale_discount NUMERIC(10, 2);
  sale_tax NUMERIC(10, 2);
BEGIN
  -- Get sale_id from the trigger
  IF TG_OP = 'DELETE' THEN
    sale_record := OLD.sale_id;
  ELSE
    sale_record := NEW.sale_id;
  END IF;
  
  -- Get discount and tax from sale
  SELECT discount, tax INTO sale_discount, sale_tax
  FROM public.sales
  WHERE id = sale_record;
  
  -- Recalculate subtotal
  SELECT COALESCE(SUM(subtotal), 0) INTO sale_subtotal
  FROM public.sale_items
  WHERE sale_id = sale_record;
  
  -- Calculate total
  sale_total := sale_subtotal - COALESCE(sale_discount, 0) + COALESCE(sale_tax, 0);
  
  -- Update sale
  UPDATE public.sales
  SET subtotal = sale_subtotal,
      total = sale_total,
      updated_at = NOW()
  WHERE id = sale_record;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for sale total recalculation
CREATE TRIGGER recalculate_sale_totals
  AFTER INSERT OR UPDATE OR DELETE ON public.sale_items
  FOR EACH ROW EXECUTE FUNCTION recalculate_sale_on_item_change();



