import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchBrands, Brand } from "../../services/brandService";

interface BrandState {
  brands: Brand[];
  loading: boolean;
  error: string | null;
}

const initialState: BrandState = {
  brands: [],
  loading: false,
  error: null,
};

// Async thunk to fetch all brands
export const fetchAllBrands = createAsyncThunk(
  "brands/fetchAllBrands",
  async (_, { rejectWithValue }) => {
    try {
      const brands = await fetchBrands();
      return brands;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch brands");
    }
  }
);

const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch brands
      .addCase(fetchAllBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
        state.error = null;
      })
      .addCase(fetchAllBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = brandSlice.actions;
export default brandSlice.reducer;
