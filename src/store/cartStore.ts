import { create } from 'zustand';
import type { Product, SaleItem } from '../lib/supabase';
import { storage } from '../lib/localforage';
import { syncService } from '../lib/sync';

interface CartItem extends SaleItem {
  product?: Product;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  customerName: string;
  customerPhone: string;
  paymentMethod: 'cash' | 'card' | 'mobile';
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setDiscount: (discount: number) => void;
  setTax: (tax: number) => void;
  setCustomer: (name: string, phone: string) => void;
  setPaymentMethod: (method: 'cash' | 'card' | 'mobile') => void;
  calculateTotals: () => void;
  loadCart: () => Promise<void>;
  saveCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,
  discount: 0,
  tax: 0,
  total: 0,
  customerName: '',
  customerPhone: '',
  paymentMethod: 'cash',

  loadCart: async () => {
    try {
      const cart = await storage.getCart();
      if (cart && cart.length > 0) {
        set({ items: cart });
        get().calculateTotals();
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  },

  saveCart: async () => {
    try {
      const { items } = get();
      await storage.setCart(items);
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  },

  addItem: (product: Product, quantity: number = 1) => {
    const { items } = get();
    const existingItem = items.find(item => item.product_id === product.id);

    if (existingItem) {
      get().updateQuantity(product.id, existingItem.quantity + quantity);
    } else {
      const newItem: CartItem = {
        id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sale_id: '',
        product_id: product.id,
        quantity,
        price: product.sale_price,
        subtotal: product.sale_price * quantity,
        created_at: new Date().toISOString(),
        product
      };

      set({ items: [...items, newItem] });
      get().calculateTotals();
      get().saveCart();
    }
  },

  removeItem: (productId: string) => {
    const { items } = get();
    const filtered = items.filter(item => item.product_id !== productId);
    set({ items: filtered });
    get().calculateTotals();
    get().saveCart();
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    const { items } = get();
    const updated = items.map(item => {
      if (item.product_id === productId) {
        return {
          ...item,
          quantity,
          subtotal: item.price * quantity
        };
      }
      return item;
    });

    set({ items: updated });
    get().calculateTotals();
    get().saveCart();
  },

  clearCart: () => {
    set({
      items: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
      customerName: '',
      customerPhone: '',
      paymentMethod: 'cash'
    });
    storage.setCart([]);
  },

  setDiscount: (discount: number) => {
    set({ discount });
    get().calculateTotals();
  },

  setTax: (tax: number) => {
    set({ tax });
    get().calculateTotals();
  },

  setCustomer: (name: string, phone: string) => {
    set({ customerName: name, customerPhone: phone });
  },

  setPaymentMethod: (method: 'cash' | 'card' | 'mobile') => {
    set({ paymentMethod: method });
  },

  calculateTotals: () => {
    const { items, discount, tax } = get();
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const total = subtotal - discount + tax;

    set({ subtotal, total });
  }
}));

