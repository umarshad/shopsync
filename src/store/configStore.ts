import { create } from 'zustand';
import { storage } from '../lib/localforage';

export interface WhiteLabelConfig {
  appName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  currency: string;
  currencySymbol: string;
  language: 'en' | 'ur';
  printerWidth: 58 | 80;
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  shopEmail: string;
  taxRate: number;
  receiptFooter: string;
}

const defaultConfig: WhiteLabelConfig = {
  appName: 'ShopSync POS',
  logo: '/logo.png',
  primaryColor: '#16a34a',
  secondaryColor: '#22c55e',
  currency: 'PKR',
  currencySymbol: '₨',
  language: 'en',
  printerWidth: 58,
  shopName: 'My Shop',
  shopAddress: '',
  shopPhone: '',
  shopEmail: '',
  taxRate: 0,
  receiptFooter: 'Thank you for your purchase!'
};

interface ConfigState {
  config: WhiteLabelConfig;
  loading: boolean;
  loadConfig: () => Promise<void>;
  updateConfig: (updates: Partial<WhiteLabelConfig>) => Promise<void>;
  resetConfig: () => Promise<void>;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  config: defaultConfig,
  loading: false,

  loadConfig: async () => {
    set({ loading: true });
    try {
      // Try to load from public config file
      try {
        const response = await fetch('/white-label/config.json');
        if (response.ok) {
          const config = await response.json();
          set({ config: { ...defaultConfig, ...config } });
          return;
        }
      } catch (error) {
        console.log('No config file found, using defaults');
      }

      // Try to load from localStorage
      try {
        const savedConfig = await storage.getProfile();
        if (savedConfig?.config) {
          set({ config: { ...defaultConfig, ...savedConfig.config } });
          return;
        }
      } catch (error) {
        console.log('No saved config found');
      }

      // Use defaults
      set({ config: defaultConfig });
    } catch (error) {
      console.error('Error loading config:', error);
      set({ config: defaultConfig });
    } finally {
      set({ loading: false });
    }
  },

  updateConfig: async (updates: Partial<WhiteLabelConfig>) => {
    const { config } = get();
    const updated = { ...config, ...updates };
    set({ config: updated });

    // Save to localStorage
    try {
      await storage.setProfile({ config: updated });
    } catch (error) {
      console.error('Error saving config:', error);
    }

    // Apply theme changes
    if (updates.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', updates.primaryColor);
    }
  },

  resetConfig: async () => {
    set({ config: defaultConfig });
    try {
      await storage.setProfile({ config: defaultConfig });
    } catch (error) {
      console.error('Error resetting config:', error);
    }
  }
}));

