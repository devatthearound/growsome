import create from 'zustand';

const useAffiliStore = create((set) => ({
  products: [],
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  removeProduct: (id) => set((state) => ({ products: state.products.filter(product => product.id !== id) })),
}));

export default useAffiliStore;