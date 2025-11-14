import type { Product } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function ProductGrid({ products, onProductClick }: ProductGridProps) {
  const { t } = useTranslation();

  if (products.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="max-w-md mx-auto">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first product to the inventory.
          </p>
          <div className="mt-6">
            <a
              href="/inventory"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Go to Inventory
            </a>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Or check the browser console for any errors loading products.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map(product => (
        <div
          key={product.id}
          onClick={() => onProductClick(product)}
          className={`bg-white rounded-lg shadow-sm border-2 cursor-pointer transition-all hover:shadow-md hover:border-primary-500 ${
            product.stock <= 0 ? 'opacity-50 border-red-300' : 'border-gray-200'
          }`}
        >
          {product.image && (
            <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
                crossOrigin="anonymous"
              />
            </div>
          )}
          <div className="p-3">
            <h3 className="font-semibold text-sm text-gray-900 truncate">
              {product.name}
            </h3>
            {product.barcode && (
              <p className="text-xs text-gray-500 mt-1">
                {product.barcode}
              </p>
            )}
            <div className="mt-2 flex items-center justify-between">
              <span className="text-lg font-bold text-primary-600">
                ₨{product.sale_price.toFixed(2)}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  product.stock <= 0
                    ? 'bg-red-100 text-red-800'
                    : product.stock <= product.low_stock_alert
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {product.stock <= 0
                  ? t('products.outOfStock')
                  : product.stock <= product.low_stock_alert
                  ? t('products.lowStock')
                  : `${product.stock} ${t('products.inStock')}`}
              </span>
            </div>
            {product.category && (
              <p className="text-xs text-gray-400 mt-1">
                {product.category}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

