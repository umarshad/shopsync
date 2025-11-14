import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { syncService } from '../../lib/sync';
import { generateReceiptData } from '../../utils/receipt';
import { useConfigStore } from '../../store/configStore';
import { printer } from '../../utils/printer';

interface CartProps {
  onClearCart: () => void;
}

export default function Cart({ onClearCart }: CartProps) {
  const { t } = useTranslation();
  const { profile } = useAuthStore();
  const { config } = useConfigStore();
  const {
    items,
    subtotal,
    discount,
    tax,
    total,
    customerName,
    customerPhone,
    paymentMethod,
    updateQuantity,
    removeItem,
    setDiscount,
    setTax,
    setCustomer,
    setPaymentMethod,
    calculateTotals
  } = useCartStore();
  
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [tempCustomerName, setTempCustomerName] = useState(customerName);
  const [tempCustomerPhone, setTempCustomerPhone] = useState(customerPhone);
  const [tempDiscount, setTempDiscount] = useState(discount.toString());
  const [tempTax, setTempTax] = useState(tax.toString());
  const [processing, setProcessing] = useState(false);

  const handleCompleteSale = async () => {
    if (items.length === 0) return;
    if (!profile) return;

    setProcessing(true);
    try {
      // Generate invoice number
      const invoiceNo = `INV-${Date.now()}`;

      // Create sale
      const saleData = {
        shop_id: profile.shop_id,
        invoice_no: invoiceNo,
        customer_name: customerName || null,
        customer_phone: customerPhone || null,
        subtotal,
        discount,
        tax,
        total,
        payment_method: paymentMethod,
        cashier_id: profile.id
      };

      // Try to insert directly if online
      let saleId: string;
      if (navigator.onLine) {
        const { data, error } = await supabase
          .from('sales')
          .insert(saleData)
          .select()
          .single();

        if (error) throw error;
        saleId = data.id;

        // Insert sale items
        const saleItems = items.map(item => ({
          sale_id: saleId,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        }));

        const { error: itemsError } = await supabase
          .from('sale_items')
          .insert(saleItems);

        if (itemsError) throw itemsError;
      } else {
        // Queue for sync
        await syncService.queueSync('sales', 'insert', saleData);
        
        // Create temporary sale ID for local reference
        saleId = `temp_${Date.now()}`;
      }

      // Print receipt
      try {
        const receiptData = generateReceiptData(
          {
            invoice_no: invoiceNo,
            customer_name: customerName,
            customer_phone: customerPhone,
            subtotal,
            discount,
            tax,
            total,
            payment_method: paymentMethod,
            created_at: new Date().toISOString()
          },
          items.map(item => ({
            ...item,
            product: item.product
          })),
          config
        );

        const connected = await printer.connect();
        if (connected) {
          await printer.printReceipt(receiptData);
          await printer.disconnect();
        }
      } catch (error) {
        console.error('Print error:', error);
        // Don't fail the sale if printing fails
      }

      // Clear cart
      onClearCart();
      alert(t('pos.saleComplete'));
    } catch (error: any) {
      console.error('Sale error:', error);
      alert(error.message || t('errors.unknownError'));
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateDiscount = () => {
    const disc = parseFloat(tempDiscount) || 0;
    setDiscount(disc);
    calculateTotals();
  };

  const handleUpdateTax = () => {
    const taxAmount = parseFloat(tempTax) || 0;
    setTax(taxAmount);
    calculateTotals();
  };

  const handleSaveCustomer = () => {
    setCustomer(tempCustomerName, tempCustomerPhone);
    setShowCustomerForm(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Cart Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{t('pos.cart')}</h2>
        <p className="text-sm text-gray-500">
          {items.length} {t('pos.items')}
        </p>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>{t('pos.noItems')}</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm text-gray-900">
                  {item.product?.name || 'Unknown Product'}
                </h4>
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  ₨{item.subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                ₨{item.price.toFixed(2)} each
              </p>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary */}
      {items.length > 0 && (
        <div className="border-t border-gray-200 p-4 space-y-3">
          {/* Customer Info */}
          {!showCustomerForm ? (
            <button
              onClick={() => setShowCustomerForm(true)}
              className="w-full text-left text-sm text-gray-600 hover:text-gray-900"
            >
              {customerName ? `${customerName} - ${customerPhone}` : t('pos.customerName')}
            </button>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                placeholder={t('pos.customerName')}
                value={tempCustomerName}
                onChange={(e) => setTempCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="text"
                placeholder={t('pos.customerPhone')}
                value={tempCustomerPhone}
                onChange={(e) => setTempCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveCustomer}
                  className="flex-1 px-3 py-1 bg-primary-600 text-white rounded-md text-sm"
                >
                  {t('common.save')}
                </button>
                <button
                  onClick={() => setShowCustomerForm(false)}
                  className="flex-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          )}

          {/* Discount */}
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder={t('pos.discount')}
              value={tempDiscount}
              onChange={(e) => setTempDiscount(e.target.value)}
              onBlur={handleUpdateDiscount}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={handleUpdateDiscount}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm"
            >
              {t('common.save')}
            </button>
          </div>

          {/* Tax */}
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder={t('pos.tax')}
              value={tempTax}
              onChange={(e) => setTempTax(e.target.value)}
              onBlur={handleUpdateTax}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={handleUpdateTax}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm"
            >
              {t('common.save')}
            </button>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('pos.paymentMethod')}
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card' | 'mobile')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="cash">{t('pos.cash')}</option>
              <option value="card">{t('pos.card')}</option>
              <option value="mobile">{t('pos.mobile')}</option>
            </select>
          </div>

          {/* Totals */}
          <div className="space-y-1 pt-2 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span>{t('pos.subtotal')}</span>
              <span>₨{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-red-600">
                <span>{t('pos.discount')}</span>
                <span>-₨{discount.toFixed(2)}</span>
              </div>
            )}
            {tax > 0 && (
              <div className="flex justify-between text-sm">
                <span>{t('pos.tax')}</span>
                <span>₨{tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
              <span>{t('pos.total')}</span>
              <span>₨{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Complete Sale Button */}
          <button
            onClick={handleCompleteSale}
            disabled={processing}
            className="w-full py-3 bg-primary-600 text-white rounded-md font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? t('common.loading') : t('pos.completeSale')}
          </button>
        </div>
      )}
    </div>
  );
}

