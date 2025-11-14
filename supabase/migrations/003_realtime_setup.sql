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

