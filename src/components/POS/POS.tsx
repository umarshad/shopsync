import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../lib/supabase';
import { storage } from '../../lib/localforage';
import { syncService } from '../../lib/sync';
import ProductGrid from './ProductGrid';
import Cart from './Cart';
import BarcodeScanner from './BarcodeScanner';

export default function POS() {
  const { t } = useTranslation();
  const { profile } = useAuthStore();
  const { loadCart, addItem, clearCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadCart();
    loadProducts();
    
    // Set up Realtime subscription for products
    const channel = supabase
      .channel('products')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' },
        () => {
          loadProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadCart]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Load from server if online
      if (navigator.onLine) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error loading products:', error);
          // If RLS error, try loading from cache
          if (error.message?.includes('row-level security') || error.message?.includes('RLS')) {
            console.warn('RLS policy blocking access, trying cache...');
            const cachedProducts = await storage.getProducts();
            if (cachedProducts && cachedProducts.length > 0) {
              setProducts(cachedProducts);
              extractCategories(cachedProducts);
            }
          }
        } else if (data) {
          setProducts(data);
          await storage.setProducts(data);
          extractCategories(data);
        } else {
          // No data returned, try cache
          const cachedProducts = await storage.getProducts();
          if (cachedProducts && cachedProducts.length > 0) {
            setProducts(cachedProducts);
            extractCategories(cachedProducts);
          }
        }
      } else {
        // Offline - load from cache
        const cachedProducts = await storage.getProducts();
        if (cachedProducts && cachedProducts.length > 0) {
          setProducts(cachedProducts);
          extractCategories(cachedProducts);
        }
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Try cache as fallback
      try {
        const cachedProducts = await storage.getProducts();
        if (cachedProducts && cachedProducts.length > 0) {
          setProducts(cachedProducts);
          extractCategories(cachedProducts);
        }
      } catch (cacheError) {
        console.error('Error loading from cache:', cacheError);
      }
    } finally {
      setLoading(false);
    }
  };

  const extractCategories = (products: Product[]) => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))] as string[];
    setCategories(cats);
  };

  const handleBarcodeScanned = async (barcode: string) => {
    if (!barcode) return;

    const product = products.find(p => p.barcode === barcode);
    if (product) {
      addItem(product, 1);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Status Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${navigator.onLine ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {navigator.onLine ? t('sync.online') : t('sync.offline')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Products */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search and Filters */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={t('common.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">{t('products.category')} - All</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-auto p-4">
            <ProductGrid
              products={filteredProducts}
              onProductClick={(product) => addItem(product, 1)}
            />
          </div>
        </div>

        {/* Right Side - Cart */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <Cart onClearCart={clearCart} />
        </div>
      </div>

      {/* Barcode Scanner */}
      <BarcodeScanner onBarcodeScanned={handleBarcodeScanned} />
    </div>
  );
}

