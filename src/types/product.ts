export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  brand: string;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Filter {
  categories: string[];
  priceRange: [number, number];
  brands: string[];
  rating: number;
  inStockOnly: boolean;
}

export type SortBy = 'name' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  filters: Filter;
  sortBy: SortBy;
  searchQuery: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  isOpen: boolean;
}