import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store/index';

interface Product {
  _id: string;
  productname: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
}

interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
};

const BASE_URL = "http://localhost:5000";

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await axios.get(`${BASE_URL}/api/products/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to load products");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

interface FormData {
  productname: string;
  createdDate: string;
  stock?: string;  // made stock optional
}

export const fetchFilteredProducts = createAsyncThunk<Product[], FormData, { rejectValue: string }>(
  'products/fetchFilteredProducts',
  async (filters, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token found. Please log in.");

      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      }

      if (!filters.stock) {
        // If stock is not provided, do not include it in the URLSearchParams
        params.delete('stock');
      }

      const response = await axios.get(`${BASE_URL}/api/products/filter?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Filtered products API response:", response.data); 
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to load products");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload ?? "An unexpected error occurred";
      })
      .addCase(fetchFilteredProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.items = action.payload;
        console.log("Filtered products state:", state.items); 
      })
      .addCase(fetchFilteredProducts.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload ?? "An unexpected error occurred";
      });
  },
});

export const selectProducts = (state: RootState) => state.products;

export default productSlice.reducer;
