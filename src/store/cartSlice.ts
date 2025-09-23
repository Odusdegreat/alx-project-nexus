import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState, CartItem, Product } from '../types/product';

const initialState: CartState = {
  items: [],
  total: 0,
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
      
      cartSlice.caseReducers.calculateTotal(state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
      cartSlice.caseReducers.calculateTotal(state);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.product.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(0, action.payload.quantity);
        if (item.quantity === 0) {
          state.items = state.items.filter(item => item.product.id !== action.payload.id);
        }
      }
      cartSlice.caseReducers.calculateTotal(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    calculateTotal: (state) => {
      state.total = state.items.reduce(
        (total, item) => total + (item.product.price * item.quantity),
        0
      );
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;