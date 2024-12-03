import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProductCreationState {
  loading: boolean;
  error: string | null;
}

const initialState: ProductCreationState = {
  loading: false,
  error: null,
};

const BASE_URL = "http://localhost:5000";

export const createProduct = createAsyncThunk<void, FormData, { rejectValue: string }>(
  'productCreation/createProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await axios.post(`${BASE_URL}/api/products/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data.message || "Product created successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to create product");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

const productCreationSlice = createSlice({
  name: 'productCreation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createProduct.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "An unexpected error occurred";
      });
  },
});

export default productCreationSlice.reducer;
