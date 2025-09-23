import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductsState, Filter, SortBy } from '../types/product';

const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  itemsPerPage: 12,
  filters: {
    categories: [],
    priceRange: [0, 1000],
    brands: [],
    rating: 0,
    inStockOnly: false,
  },
  sortBy: 'name',
  searchQuery: '',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
      state.totalPages = Math.ceil(action.payload.length / state.itemsPerPage);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<Filter>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    setSortBy: (state, action: PayloadAction<SortBy>) => {
      state.sortBy = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    applyFiltersAndSort: (state) => {
      let filtered = [...state.products];

      // Apply search query
      if (state.searchQuery) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      }

      // Apply category filter
      if (state.filters.categories.length > 0) {
        filtered = filtered.filter(product =>
          state.filters.categories.includes(product.category)
        );
      }

      // Apply brand filter
      if (state.filters.brands.length > 0) {
        filtered = filtered.filter(product =>
          state.filters.brands.includes(product.brand)
        );
      }

      // Apply price range filter
      filtered = filtered.filter(product =>
        product.price >= state.filters.priceRange[0] &&
        product.price <= state.filters.priceRange[1]
      );

      // Apply rating filter
      if (state.filters.rating > 0) {
        filtered = filtered.filter(product => product.rating >= state.filters.rating);
      }

      // Apply in stock filter
      if (state.filters.inStockOnly) {
        filtered = filtered.filter(product => product.inStock);
      }

      // Apply sorting
      switch (state.sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'newest':
          // For demo purposes, we'll just reverse the order
          filtered.reverse();
          break;
      }

      state.filteredProducts = filtered;
      state.totalPages = Math.ceil(filtered.length / state.itemsPerPage);
    },
  },
});

export const {
  setProducts,
  setLoading,
  setError,
  setFilters,
  setSortBy,
  setSearchQuery,
  setCurrentPage,
  applyFiltersAndSort,
} = productSlice.actions;

export default productSlice.reducer;