import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  RevenueState,
  RevenueRecord,
  RevenueFilter,
} from "../../types/revenue";
import revenueService from "../../services/revenueService";

const initialState: RevenueState = {
  records: [],
  stats: {
    totalRevenue: 0,
    totalOrders: 0,
    totalProductsSold: 0,
  },
  dailyRevenue: [],
  productStats: [],
  categoryStats: [],
  loading: false,
  error: null,
  filter: {
    month: 9, // Set to September to match the data
    year: 2025,
  },
};

// Async thunks
export const fetchRevenueRecords = createAsyncThunk(
  "revenue/fetchRecords",
  async (_, { rejectWithValue }) => {
    try {
      const records = await revenueService.fetchRevenueRecords();
      return records;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch revenue records"
      );
    }
  }
);

export const subscribeToRevenueUpdates = createAsyncThunk(
  "revenue/subscribeToUpdates",
  async (_, { dispatch }) => {
    const unsubscribe = revenueService.subscribeToRevenueUpdates((records) => {
      dispatch(updateRecords(records));
    });
    return unsubscribe;
  }
);

const revenueSlice = createSlice({
  name: "revenue",
  initialState,
  reducers: {
    updateRecords: (state, action: PayloadAction<RevenueRecord[]>) => {
      state.records = action.payload;
      state.stats = revenueService.calculateStats(action.payload);

      // Calculate product and category stats
      const filteredRecords = revenueService.filterRecords(
        action.payload,
        state.filter
      );
      state.productStats =
        revenueService.calculateProductStats(filteredRecords);
      state.categoryStats =
        revenueService.calculateCategoryStats(filteredRecords);

      // Update daily revenue based on current filter
      const { month, year } = state.filter;
      if (month && year) {
        state.dailyRevenue = revenueService.calculateDailyRevenue(
          action.payload,
          month,
          year
        );
      }
    },
    setFilter: (state, action: PayloadAction<RevenueFilter>) => {
      state.filter = { ...state.filter, ...action.payload };

      // Recalculate all stats with new filter
      const filteredRecords = revenueService.filterRecords(
        state.records,
        state.filter
      );
      state.productStats =
        revenueService.calculateProductStats(filteredRecords);
      state.categoryStats =
        revenueService.calculateCategoryStats(filteredRecords);

      // Recalculate daily revenue with new filter
      const { month, year } = state.filter;
      if (month && year) {
        state.dailyRevenue = revenueService.calculateDailyRevenue(
          state.records,
          month,
          year
        );
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFilter: (state) => {
      state.filter = {
        month: 9, // Set to September to match the data
        year: 2025,
      };

      // Recalculate all stats with reset filter
      const filteredRecords = revenueService.filterRecords(
        state.records,
        state.filter
      );
      state.productStats =
        revenueService.calculateProductStats(filteredRecords);
      state.categoryStats =
        revenueService.calculateCategoryStats(filteredRecords);

      // Recalculate daily revenue with reset filter
      const { month, year } = state.filter;
      if (month && year) {
        state.dailyRevenue = revenueService.calculateDailyRevenue(
          state.records,
          month,
          year
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch revenue records
      .addCase(fetchRevenueRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
        state.stats = revenueService.calculateStats(action.payload);

        // Calculate product and category stats
        const filteredRecords = revenueService.filterRecords(
          action.payload,
          state.filter
        );
        state.productStats =
          revenueService.calculateProductStats(filteredRecords);
        state.categoryStats =
          revenueService.calculateCategoryStats(filteredRecords);

        // Calculate daily revenue for current month/year
        const { month, year } = state.filter;
        if (month && year) {
          state.dailyRevenue = revenueService.calculateDailyRevenue(
            action.payload,
            month,
            year
          );
        }
      })
      .addCase(fetchRevenueRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateRecords, setFilter, clearError, resetFilter } =
  revenueSlice.actions;

// Selectors
export const selectRevenueRecords = (state: { revenue: RevenueState }) =>
  state.revenue.records;
export const selectRevenueStats = (state: { revenue: RevenueState }) =>
  state.revenue.stats;
export const selectDailyRevenue = (state: { revenue: RevenueState }) =>
  state.revenue.dailyRevenue;
export const selectRevenueLoading = (state: { revenue: RevenueState }) =>
  state.revenue.loading;
export const selectRevenueError = (state: { revenue: RevenueState }) =>
  state.revenue.error;
export const selectRevenueFilter = (state: { revenue: RevenueState }) =>
  state.revenue.filter;

export const selectFilteredRecords = (state: { revenue: RevenueState }) => {
  const { records, filter } = state.revenue;
  return revenueService.filterRecords(records, filter);
};

export const selectUniqueCategories = (state: { revenue: RevenueState }) => {
  return revenueService.getUniqueCategories(state.revenue.records);
};

export const selectAvailablePeriods = (state: { revenue: RevenueState }) => {
  return revenueService.getAvailablePeriods(state.revenue.records);
};

export const selectProductStats = (state: { revenue: RevenueState }) =>
  state.revenue.productStats;
export const selectCategoryStats = (state: { revenue: RevenueState }) =>
  state.revenue.categoryStats;

export default revenueSlice.reducer;
