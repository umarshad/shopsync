import localforage from 'localforage';

// Configure localforage
localforage.config({
  name: 'shopsync',
  storeName: 'shopsync_store',
  description: 'ShopSync offline storage'
});

export const storage = {
  // Products cache
  async getProducts(): Promise<any[]> {
    return (await localforage.getItem('products')) || [];
  },
  
  async setProducts(products: any[]): Promise<void> {
    await localforage.setItem('products', products);
  },
  
  // Sales cache
  async getSales(): Promise<any[]> {
    return (await localforage.getItem('sales')) || [];
  },
  
  async setSales(sales: any[]): Promise<void> {
    await localforage.setItem('sales', sales);
  },
  
  // Cart cache
  async getCart(): Promise<any[]> {
    return (await localforage.getItem('cart')) || [];
  },
  
  async setCart(cart: any[]): Promise<void> {
    await localforage.setItem('cart', cart);
  },
  
  // Sync queue
  async getSyncQueue(): Promise<any[]> {
    return (await localforage.getItem('sync_queue')) || [];
  },
  
  async setSyncQueue(queue: any[]): Promise<void> {
    await localforage.setItem('sync_queue', queue);
  },
  
  async addToSyncQueue(item: any): Promise<void> {
    const queue = await this.getSyncQueue();
    queue.push({
      ...item,
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    });
    await this.setSyncQueue(queue);
  },
  
  async removeFromSyncQueue(id: string): Promise<void> {
    const queue = await this.getSyncQueue();
    const filtered = queue.filter((item: any) => item.id !== id);
    await this.setSyncQueue(filtered);
  },
  
  // User profile cache
  async getProfile(): Promise<any | null> {
    return await localforage.getItem('profile');
  },
  
  async setProfile(profile: any): Promise<void> {
    await localforage.setItem('profile', profile);
  },
  
  // Clear all data
  async clear(): Promise<void> {
    await localforage.clear();
  },
  
  // Get last sync timestamp
  async getLastSync(): Promise<number | null> {
    return await localforage.getItem('last_sync');
  },
  
  async setLastSync(timestamp: number): Promise<void> {
    await localforage.setItem('last_sync', timestamp);
  }
};

export default storage;

