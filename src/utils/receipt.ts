import type { Sale, SaleItem } from '../lib/supabase';
import type { WhiteLabelConfig } from '../store/configStore';

export interface ReceiptData {
  shopName: string;
  address?: string;
  phone?: string;
  invoiceNo: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  customerName?: string;
  footer?: string;
}

export function generateReceiptData(
  sale: Partial<Sale> & { invoice_no: string; created_at: string; subtotal: number; discount: number; tax: number; total: number; payment_method: string; customer_name?: string | null },
  items: Array<SaleItem & { product?: { name: string } }>,
  config: WhiteLabelConfig
): ReceiptData {
  return {
    shopName: config.shopName,
    address: config.shopAddress,
    phone: config.shopPhone,
    invoiceNo: sale.invoice_no,
    date: new Date(sale.created_at).toLocaleString(),
    items: items.map(item => ({
      name: item.product?.name || 'Unknown Product',
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal
    })),
    subtotal: sale.subtotal,
    discount: sale.discount,
    tax: sale.tax,
    total: sale.total,
    paymentMethod: sale.payment_method,
    customerName: sale.customer_name || undefined,
    footer: config.receiptFooter
  };
}

export function generateReceiptHTML(receipt: ReceiptData, config: WhiteLabelConfig): string {
  const width = config.printerWidth === 58 ? '58mm' : '80mm';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Receipt - ${receipt.invoiceNo}</title>
      <style>
        @media print {
          @page {
            size: ${width} auto;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 10px;
            font-family: monospace;
            font-size: 12px;
          }
        }
        body {
          font-family: monospace;
          font-size: 12px;
          width: ${width};
          margin: 0 auto;
          padding: 10px;
        }
        .header {
          text-align: center;
          margin-bottom: 10px;
        }
        .shop-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .separator {
          border-top: 1px dashed #000;
          margin: 10px 0;
        }
        .item {
          margin: 5px 0;
        }
        .item-name {
          font-weight: bold;
        }
        .item-details {
          display: flex;
          justify-content: space-between;
          margin-left: 20px;
        }
        .total {
          font-weight: bold;
          font-size: 14px;
          margin-top: 10px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="shop-name">${receipt.shopName}</div>
        ${receipt.address ? `<div>${receipt.address}</div>` : ''}
        ${receipt.phone ? `<div>${receipt.phone}</div>` : ''}
      </div>
      <div class="separator"></div>
      <div>
        <div>Invoice: ${receipt.invoiceNo}</div>
        <div>Date: ${receipt.date}</div>
        ${receipt.customerName ? `<div>Customer: ${receipt.customerName}</div>` : ''}
      </div>
      <div class="separator"></div>
      ${receipt.items.map(item => `
        <div class="item">
          <div class="item-name">${item.name}</div>
          <div class="item-details">
            <span>${item.quantity} x ${config.currencySymbol}${item.price.toFixed(2)}</span>
            <span>${config.currencySymbol}${item.subtotal.toFixed(2)}</span>
          </div>
        </div>
      `).join('')}
      <div class="separator"></div>
      <div>Subtotal: ${config.currencySymbol}${receipt.subtotal.toFixed(2)}</div>
      ${receipt.discount > 0 ? `<div>Discount: ${config.currencySymbol}${receipt.discount.toFixed(2)}</div>` : ''}
      ${receipt.tax > 0 ? `<div>Tax: ${config.currencySymbol}${receipt.tax.toFixed(2)}</div>` : ''}
      <div class="total">Total: ${config.currencySymbol}${receipt.total.toFixed(2)}</div>
      <div>Payment: ${receipt.paymentMethod}</div>
      <div class="separator"></div>
      ${receipt.footer ? `<div class="footer">${receipt.footer}</div>` : ''}
    </body>
    </html>
  `;
}

