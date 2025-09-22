import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Banner, CreateBannerData, UpdateBannerData } from "../../types/banner";
import { bannerService } from "../../services/bannerService";

interface BannerState {
  banners: Banner[];
  loading: boolean;
  error: string | null;
  selectedBanner: Banner | null;
}

const initialState: BannerState = {
  banners: [],
  loading: false,
  error: null,
  selectedBanner: null,
};

// Async thunks
export const fetchBanners = createAsyncThunk(
  "banners/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const banners = await bannerService.getAllBanners();
      return banners;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch banners");
    }
  }
);

export const createBanner = createAsyncThunk(
  "banners/createBanner",
  async (bannerData: CreateBannerData, { rejectWithValue }) => {
    try {
      const id = await bannerService.createBanner(bannerData);
      return { id, ...bannerData };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create banner");
    }
  }
);

export const updateBanner = createAsyncThunk(
  "banners/updateBanner",
  async (
    { id, data }: { id: string; data: UpdateBannerData },
    { rejectWithValue }
  ) => {
    try {
      await bannerService.updateBanner(id, data);
      return { id, ...data };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update banner");
    }
  }
);

export const deleteBanner = createAsyncThunk(
  "banners/deleteBanner",
  async (id: string, { rejectWithValue }) => {
    try {
      await bannerService.deleteBanner(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete banner");
    }
  }
);

const bannerSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {
    setSelectedBanner: (state, action: PayloadAction<Banner | null>) => {
      state.selectedBanner = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch banners
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create banner
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners.push(action.payload);
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update banner
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.banners.findIndex(
          (banner) => banner.id === action.payload.id
        );
        if (index !== -1) {
          state.banners[index] = {
            ...state.banners[index],
            ...action.payload,
          };
        }
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete banner
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.filter(
          (banner) => banner.id !== action.payload
        );
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedBanner, clearError } = bannerSlice.actions;
export default bannerSlice.reducer;
