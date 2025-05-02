import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slice/productSlice';
import authReducer from './slice/authSlice'; 

export const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authReducer, 
  },
  devTools:true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
