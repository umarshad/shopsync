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

