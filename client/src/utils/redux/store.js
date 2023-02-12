// Imports
import { configureStore } from '@reduxjs/toolkit';
import storeSlice from './slices/storeSlice';

// Global store initialized with reducers
const store = configureStore({
  reducer: {
    storeReducer: storeSlice,
    // If necessary add more reducers..
  }
})

// Export store
export default store;

