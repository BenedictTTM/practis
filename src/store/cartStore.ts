import { create } from 'zustand';

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
      const response = await fetch('/api/cart/count', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        set({ itemCount: data.count || 0 });
      } else {
        set({ itemCount: 0 });
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      set({ itemCount: 0 });
    }
  },
}));
