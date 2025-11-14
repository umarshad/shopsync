-- Quick query to check if products exist and what shop_ids are in use
SELECT 
  p.id,
  p.shop_id,
  p.name,
  p.sale_price,
  p.stock,
  pr.shop_name
FROM products p
LEFT JOIN profiles pr ON p.shop_id = pr.shop_id
LIMIT 10;
