import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Voucher, VoucherState, VoucherStats } from "../../types/voucher";
import {
  voucherService,
  calculateVoucherStats,
  filterVouchersByType,
} from "../../services/voucherService";

// Initial state
const initialState: VoucherState = {
  vouchers: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchVouchers = createAsyncThunk(
  "vouchers/fetchVouchers",
  async (_, { rejectWithValue }) => {
    try {
      const vouchers = await voucherService.fetchVouchers();
      return vouchers;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch vouchers");
    }
  }
);

export const addVoucher = createAsyncThunk(
  "vouchers/addVoucher",
  async (voucherData: any, { dispatch, rejectWithValue }) => {
    try {
      await voucherService.addVoucher(voucherData);
      dispatch(fetchVouchers());
      return;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add voucher");
    }
  }
);

export const deleteVoucher = createAsyncThunk(
  "vouchers/deleteVoucher",
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      await voucherService.deleteVoucher(id);
      dispatch(fetchVouchers());
      return;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete voucher");
    }
  }
);

export const toggleVoucherStatus = createAsyncThunk(
  "vouchers/toggleVoucherStatus",
  async (
    { id, currentStatus }: { id: string; currentStatus: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await voucherService.toggleVoucherStatus(id, currentStatus);
      dispatch(fetchVouchers());
      return;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to toggle voucher status"
      );
    }
  }
);

// Slice
const voucherSlice = createSlice({
  name: "vouchers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch vouchers
      .addCase(fetchVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers = action.payload;
        state.error = null;
      })
      .addCase(fetchVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add voucher
      .addCase(addVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addVoucher.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete voucher
      .addCase(deleteVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVoucher.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Toggle status
      .addCase(toggleVoucherStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleVoucherStatus.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(toggleVoucherStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { clearError } = voucherSlice.actions;

// Selectors
export const selectVouchers = (state: RootState): Voucher[] =>
  state.vouchers.vouchers;

export const selectVoucherLoading = (state: RootState): boolean =>
  state.vouchers.loading;

export const selectVoucherError = (state: RootState): string | null =>
  state.vouchers.error;

export const selectShippingVouchers = (state: RootState): Voucher[] => {
  const vouchers = selectVouchers(state);
  return filterVouchersByType(vouchers, "shipping");
};

export const selectProductVouchers = (state: RootState): Voucher[] => {
  const vouchers = selectVouchers(state);
  return filterVouchersByType(vouchers, "product");
};

export const selectVoucherStats = (state: RootState): VoucherStats => {
  const vouchers = selectVouchers(state);
  return calculateVoucherStats(vouchers);
};

export const selectShippingVoucherStats = (state: RootState): VoucherStats => {
  const vouchers = selectShippingVouchers(state);
  return calculateVoucherStats(vouchers);
};

export const selectProductVoucherStats = (state: RootState): VoucherStats => {
  const vouchers = selectProductVouchers(state);
  return calculateVoucherStats(vouchers);
};

export default voucherSlice.reducer;
