import { create } from 'zustand';

const useBillStore = create((set) => ({
  bills: [],
  loading: false,
  error: null,
  fetchBills: async () => {
    set({ loading: true });
    try {
      // Replace with your actual API call
      const response = await fetch('/api/bills');
      const data = await response.json();
      set({ bills: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useBillStore; 