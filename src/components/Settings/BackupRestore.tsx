import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { storage } from '../../lib/localforage';
import { useConfigStore } from '../../store/configStore';

export default function BackupRestore() {
  const { t } = useTranslation();
  const { profile } = useAuthStore();
  const { config } = useConfigStore();
  const [loading, setLoading] = useState(false);

  const handleBackup = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      // Export data from Supabase
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('shop_id', profile.shop_id);

      const { data: sales } = await supabase
        .from('sales')
        .select('*')
        .eq('shop_id', profile.shop_id);

      const { data: saleItems } = await supabase
        .from('sale_items')
        .select('*')
        .in('sale_id', sales?.map(s => s.id) || []);

      // Create backup object
      const backup = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        shop_id: profile.shop_id,
        config,
        products: products || [],
        sales: sales || [],
        sale_items: saleItems || []
      };

      // Download as JSON
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shopsync-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      alert(t('settings.backupCreated'));
    } catch (error: any) {
      alert(error.message || t('errors.unknownError'));
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!confirm('Are you sure you want to restore? This will overwrite existing data.')) {
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setLoading(true);
      try {
        const text = await file.text();
        const backup = JSON.parse(text);

        // Restore config
        if (backup.config) {
          // Update config store
          // This would need to be implemented in the config store
        }

        // Restore products
        if (backup.products && backup.products.length > 0) {
          // Delete existing products
          await supabase
            .from('products')
            .delete()
            .eq('shop_id', profile?.shop_id);

          // Insert backed up products
          await supabase
            .from('products')
            .insert(backup.products);
        }

        alert(t('settings.restoreCompleted'));
      } catch (error: any) {
        alert(error.message || t('errors.unknownError'));
      } finally {
        setLoading(false);
      }
    };
    input.click();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">{t('settings.backup')}</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Backup</h3>
          <p className="text-sm text-gray-600 mb-4">
            Export all your data including products, sales, and configuration.
          </p>
          <button
            onClick={handleBackup}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('settings.backup')}
          </button>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Restore</h3>
          <p className="text-sm text-gray-600 mb-4">
            Import data from a backup file. This will overwrite existing data.
          </p>
          <button
            onClick={handleRestore}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('settings.restore')}
          </button>
        </div>
      </div>
    </div>
  );
}

