// Imports
import { createSlice } from '@reduxjs/toolkit';

// Initial user's state to track
const initialState = {
  products: [],
  cart: [],
  cartOpen: false,
  categories: [],
  currentCategory: ''
}

// Slice instantiation
// reducers, actions, name, and initial state passed into slice
export const storeSlice = createSlice({
  name: 'StoreState',
  initialState,
  reducers: {
      UPDATE_PRODUCTS: (state, action) => {
        return {
          ...state,
          products: [...action.payload],
        };
      },
  
      UPDATE_CATEGORIES: (state, action) => {
        return {
          ...state,
          categories: [...action.payload]
        };
      },

      UPDATE_CURRENT_CATEGORY: (state, action) => {
        return {
          ...state,
          currentCategory: action.payload
        };
      },

      ADD_TO_CART: (state, action) => {
        return {
          ...state,
          cartOpen: true,
          cart: [...state.cart, action.payload]
        };
      },

      ADD_MULTIPLE_TO_CART: (state, action) => {
        return {
          ...state,
          cart: [...state.cart, ...action.payload.products],
        };

      },

      REMOVE_FROM_CART: (state, action) => {
        let newState = state.cart.filter(cartItem => {
          return cartItem._id !== action.payload._id;
        });
  
        return {
          ...state,
          cartOpen: newState.length > 0,
          cart: newState
        };
      }, 
      
      UPDATE_CART_QUANTITY: (state, action) => {
        state.cart = state.cart.map(cartItem => {
          if(action.payload._id === cartItem._id) {
            cartItem.purchaseQuantity = action.payload.purchaseQuantity;
          }
          return cartItem;
        })
        state.cartOpen = true;
      },
  
      CLEAR_CART: (state) => {
        return {
          ...state,
          cartOpen: false,
          cart: []
        };
      },

      TOGGLE_CART: (state) => {
        return {
          ...state,
          cartOpen: !state.cartOpen
        };
      } 

  }
});

// Export actions
export const { 
  UPDATE_PRODUCTS, 
  UPDATE_CATEGORIES, 
  UPDATE_CURRENT_CATEGORY, 
  ADD_TO_CART,
  ADD_MULTIPLE_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART,
  TOGGLE_CART
 } = storeSlice.actions;

// Export reducer
export default storeSlice.reducer;