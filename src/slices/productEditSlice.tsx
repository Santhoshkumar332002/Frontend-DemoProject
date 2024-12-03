import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store/index';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface ProductEditState {
  loading: boolean;
  error: string | null;
}

const initialState: ProductEditState = {
  loading: false,
  error: null,
};

const BASE_URL = "http://localhost:5000";

export const editProduct = createAsyncThunk<void, { id: string, formData: FormData }, { rejectValue: string }>(
  'productEdit/editProduct',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await axios.put(`${BASE_URL}/api/products/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data.message || "Product updated successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to update product");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

const productEditSlice = createSlice({
  name: 'productEdit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(editProduct.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "An unexpected error occurred";
      });
  },
});

export const selectProductEdit = (state: RootState) => state.productEdit;

export default productEditSlice.reducer;
