import { create } from 'zustand';
import { getLocalCartItemCount } from '@/lib/localCart';

interface CartStore {
  itemCount: number;
  setItemCount: (count: number) => void;
  incrementCount: (amount: number) => void;
  fetchItemCount: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set) => ({
  itemCount: 0,
  
  setItemCount: (count) => set({ itemCount: count }),
  
  incrementCount: (amount) => set((state) => ({ 
    itemCount: state.itemCount + amount 
  })),
  
  fetchItemCount: async () => {
    try {
      // Try fetching authenticated cart count
      const response = await fetch('/api/cart/count', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        set({ itemCount: data.count || 0 });
      } else if (response.status === 401) {
        // User not authenticated - use local cart count
        const localCount = getLocalCartItemCount();
        set({ itemCount: localCount });
      } else {
        set({ itemCount: 0 });
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      // Fallback to local cart count
      const localCount = getLocalCartItemCount();
      set({ itemCount: localCount });
    }
  },
}));
