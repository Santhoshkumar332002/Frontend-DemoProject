import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productsReducer from "../slices/productSlice"
import productCreationReducer from "../slices/productCreationSlice"
import productDeleteReducer from "../slices/productDeleteSlice"
import productEditReducer from "../slices/productEditSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    productCreation: productCreationReducer,
    productDelete: productDeleteReducer,
    productEdit: productEditReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
