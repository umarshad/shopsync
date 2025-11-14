import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../../store/cartStore';
import { useConfigStore } from '../../store/configStore';

export default function CustomerDisplay() {
  const { t } = useTranslation();
  const { items, subtotal, discount, tax, total } = useCartStore();
  const { config } = useConfigStore();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // WebSocket connection for customer display
    // This would connect to a WebSocket server for real-time updates
    // For now, we'll use local state
    
    // In a real implementation, you would:
    // 1. Connect to a WebSocket server
    // 2. Listen for cart updates
    // 3. Display the current cart on the customer display
    
    setIsConnected(true);
  }, []);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-xl">Connecting to display...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto">
        {/* Shop Name */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{config.shopName}</h1>
          {config.shopAddress && (
            <p className="text-gray-400 text-sm">{config.shopAddress}</p>
          )}
          {config.shopPhone && (
            <p className="text-gray-400 text-sm">{config.shopPhone}</p>
          )}
        </div>

        {/* Cart Items */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">{t('pos.cart')}</h2>
          {items.length === 0 ? (
            <p className="text-gray-400 text-center py-8">{t('pos.noItems')}</p>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b border-gray-700 pb-4">
                  <div className="flex-1">
                    <p className="text-lg font-medium">{item.product?.name || 'Unknown Product'}</p>
                    <p className="text-gray-400 text-sm">
                      {item.quantity} x {config.currencySymbol}{item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-xl font-bold">
                    {config.currencySymbol}{item.subtotal.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals */}
        {items.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-lg">
                <span>{t('pos.subtotal')}</span>
                <span>{config.currencySymbol}{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-lg text-red-400">
                  <span>{t('pos.discount')}</span>
                  <span>-{config.currencySymbol}{discount.toFixed(2)}</span>
                </div>
              )}
              {tax > 0 && (
                <div className="flex justify-between text-lg">
                  <span>{t('pos.tax')}</span>
                  <span>{config.currencySymbol}{tax.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between text-3xl font-bold">
                <span>{t('pos.total')}</span>
                <span className="text-primary-400">{config.currencySymbol}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>{config.receiptFooter || 'Thank you for your purchase!'}</p>
        </div>
      </div>
    </div>
  );
}

