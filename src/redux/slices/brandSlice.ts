import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Brand, CreateBrandData, UpdateBrandData } from "../../types/brand";
import { brandService } from "../../services/brandService";

interface BrandState {
  brands: Brand[];
  loading: boolean;
  error: string | null;
  selectedBrand: Brand | null;
}

const initialState: BrandState = {
  brands: [],
  loading: false,
  error: null,
  selectedBrand: null,
};

// Async thunks
export const fetchBrands = createAsyncThunk(
  "brands/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      const brands = await brandService.getAllBrands();
      return brands;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch brands");
    }
  }
);

export const createBrand = createAsyncThunk(
  "brands/createBrand",
  async (brandData: CreateBrandData, { rejectWithValue }) => {
    try {
      const id = await brandService.createBrand(brandData);
      return { id, ...brandData };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create brand");
    }
  }
);

export const updateBrand = createAsyncThunk(
  "brands/updateBrand",
  async (
    { id, data }: { id: string; data: UpdateBrandData },
    { rejectWithValue }
  ) => {
    try {
      await brandService.updateBrand(id, data);
      return { id, ...data };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update brand");
    }
  }
);

export const deleteBrand = createAsyncThunk(
  "brands/deleteBrand",
  async (id: string, { rejectWithValue }) => {
    try {
      await brandService.deleteBrand(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete brand");
    }
  }
);

const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    setSelectedBrand: (state, action: PayloadAction<Brand | null>) => {
      state.selectedBrand = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch brands
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create brand
      .addCase(createBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands.push(action.payload);
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update brand
      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.brands.findIndex(
          (brand) => brand.id === action.payload.id
        );
        if (index !== -1) {
          state.brands[index] = {
            ...state.brands[index],
            ...action.payload,
          };
        }
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete brand
      .addCase(deleteBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = state.brands.filter(
          (brand) => brand.id !== action.payload
        );
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedBrand, clearError } = brandSlice.actions;
export default brandSlice.reducer;
