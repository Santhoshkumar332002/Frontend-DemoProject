// src/slices/productDeleteSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {  RootState } from '../store/index';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface ProductDeleteState {
  loading: boolean;
  error: string | null;
}

const initialState: ProductDeleteState = {
  loading: false,
  error: null,
};

const BASE_URL = "http://localhost:5000";

export const deleteProduct = createAsyncThunk<void, string, { rejectValue: string }>(
  'productDelete/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token found. Please log in.");

      await axios.delete(`${BASE_URL}/api/products/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Show a toast notification
      toast.success("Product deleted successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete product");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

const productDeleteSlice = createSlice({
  name: 'productDelete',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "An unexpected error occurred";
      });
  },
});

export const selectProductDelete = (state: RootState) => state.productDelete;

export default productDeleteSlice.reducer;
