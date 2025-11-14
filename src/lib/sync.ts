import { supabase } from './supabase';
import { storage } from './localforage';

export interface SyncJob {
  id: string;
  table_name: string;
  action: 'insert' | 'update' | 'delete';
  data: Record<string, any>;
  timestamp: number;
}

class SyncService {
  private syncInterval: number | null = null;
  private isSyncing = false;
  private syncListeners: Array<(status: string) => void> = [];

  constructor() {
    // Start sync when online
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.startSync());
      window.addEventListener('offline', () => this.stopSync());
      
      if (navigator.onLine) {
        this.startSync();
      }
    }
  }

  // Start automatic sync every 30 seconds
  startSync(): void {
    if (this.syncInterval) return;
    
    this.syncInterval = window.setInterval(() => {
      this.processSyncQueue();
    }, 30000); // 30 seconds
    
    // Process immediately
    this.processSyncQueue();
  }

  // Stop automatic sync
  stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Add item to sync queue
  async queueSync(tableName: string, action: 'insert' | 'update' | 'delete', data: Record<string, any>): Promise<void> {
    await storage.addToSyncQueue({
      table_name: tableName,
      action,
      data,
      timestamp: Date.now()
    });
    
    // Try to sync immediately if online
    if (navigator.onLine) {
      this.processSyncQueue();
    }
  }

  // Process sync queue
  async processSyncQueue(): Promise<void> {
    if (this.isSyncing || !navigator.onLine) return;
    
    this.isSyncing = true;
    this.notifyListeners('syncing');
    
    try {
      const queue = await storage.getSyncQueue();
      if (queue.length === 0) {
        this.isSyncing = false;
        this.notifyListeners('idle');
        return;
      }

      const processed: string[] = [];
      const failed: Array<{ id: string; error: string }> = [];

      for (const item of queue) {
        try {
          await this.syncItem(item);
          processed.push(item.id);
        } catch (error: any) {
          console.error('Sync error:', error);
          failed.push({
            id: item.id,
            error: error.message || 'Unknown error'
          });
        }
      }

      // Remove processed items
      for (const id of processed) {
        await storage.removeFromSyncQueue(id);
      }

      // Update last sync timestamp
      if (processed.length > 0) {
        await storage.setLastSync(Date.now());
      }

      this.notifyListeners(processed.length > 0 ? 'synced' : 'idle');
    } catch (error) {
      console.error('Sync queue processing error:', error);
      this.notifyListeners('error');
    } finally {
      this.isSyncing = false;
    }
  }

  // Sync single item
  private async syncItem(item: SyncJob): Promise<void> {
    const { table_name, action, data } = item;

    switch (action) {
      case 'insert':
        const { error: insertError } = await supabase
          .from(table_name)
          .insert(data);
        if (insertError) throw insertError;
        break;

      case 'update':
        const { id, ...updateData } = data;
        const { error: updateError } = await supabase
          .from(table_name)
          .update(updateData)
          .eq('id', id);
        if (updateError) throw updateError;
        break;

      case 'delete':
        const { error: deleteError } = await supabase
          .from(table_name)
          .delete()
          .eq('id', data.id);
        if (deleteError) throw deleteError;
        break;
    }
  }

  // Manual sync trigger
  async manualSync(): Promise<void> {
    await this.processSyncQueue();
  }

  // Get sync status
  async getSyncStatus(): Promise<{
    queueLength: number;
    isSyncing: boolean;
    lastSync: number | null;
    isOnline: boolean;
  }> {
    const queue = await storage.getSyncQueue();
    const lastSync = await storage.getLastSync();
    
    return {
      queueLength: queue.length,
      isSyncing: this.isSyncing,
      lastSync,
      isOnline: navigator.onLine
    };
  }

  // Subscribe to sync status changes
  onSyncStatusChange(listener: (status: string) => void): () => void {
    this.syncListeners.push(listener);
    return () => {
      this.syncListeners = this.syncListeners.filter(l => l !== listener);
    };
  }

  // Notify listeners
  private notifyListeners(status: string): void {
    this.syncListeners.forEach(listener => listener(status));
  }

  // Sync data from server (when coming online)
  async syncFromServer(): Promise<void> {
    if (!navigator.onLine) return;

    try {
      // Get user profile to get shop_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('shop_id')
        .eq('id', user.id)
        .single();

      if (!profile) return;

      // Fetch products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('shop_id', profile.shop_id);

      if (products) {
        await storage.setProducts(products);
      }

      // Fetch recent sales
      const { data: sales } = await supabase
        .from('sales')
        .select('*')
        .eq('shop_id', profile.shop_id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (sales) {
        await storage.setSales(sales);
      }

      await storage.setLastSync(Date.now());
    } catch (error) {
      console.error('Error syncing from server:', error);
    }
  }
}

export const syncService = new SyncService();
export default syncService;

