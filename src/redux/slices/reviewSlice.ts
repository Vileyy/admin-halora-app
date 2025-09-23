import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Review, ReviewStats, ReviewFilters } from "../../types/review";
import { reviewService } from "../../services/reviewService";

interface ReviewState {
  reviews: Review[];
  filteredReviews: Review[];
  stats: ReviewStats | null;
  loading: boolean;
  error: string | null;
  selectedReview: Review | null;
  filters: ReviewFilters;
}

const initialState: ReviewState = {
  reviews: [],
  filteredReviews: [],
  stats: null,
  loading: false,
  error: null,
  selectedReview: null,
  filters: {},
};

// Async thunks
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (_, { rejectWithValue }) => {
    try {
      const reviews = await reviewService.getAllReviews();
      return reviews;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch reviews");
    }
  }
);

export const fetchReviewStats = createAsyncThunk(
  "reviews/fetchReviewStats",
  async (_, { rejectWithValue }) => {
    try {
      const stats = await reviewService.getReviewStats();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch review stats");
    }
  }
);

export const fetchReviewsByProduct = createAsyncThunk(
  "reviews/fetchReviewsByProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      const reviews = await reviewService.getReviewsByProductId(productId);
      return reviews;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch reviews by product"
      );
    }
  }
);

export const fetchReviewsByUser = createAsyncThunk(
  "reviews/fetchReviewsByUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const reviews = await reviewService.getReviewsByUserId(userId);
      return reviews;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch reviews by user"
      );
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (id: string, { rejectWithValue }) => {
    try {
      await reviewService.deleteReview(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete review");
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setSelectedReview: (state, action: PayloadAction<Review | null>) => {
      state.selectedReview = action.payload;
    },
    setFilters: (state, action: PayloadAction<ReviewFilters>) => {
      state.filters = action.payload;
      state.filteredReviews = reviewService.filterReviews(
        state.reviews,
        action.payload
      );
    },
    clearFilters: (state) => {
      state.filters = {};
      state.filteredReviews = state.reviews;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
        state.filteredReviews = reviewService.filterReviews(
          action.payload,
          state.filters
        );
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch review stats
      .addCase(fetchReviewStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchReviewStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch reviews by product
      .addCase(fetchReviewsByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredReviews = action.payload;
      })
      .addCase(fetchReviewsByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch reviews by user
      .addCase(fetchReviewsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredReviews = action.payload;
      })
      .addCase(fetchReviewsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(
          (review) => review.id !== action.payload
        );
        state.filteredReviews = state.filteredReviews.filter(
          (review) => review.id !== action.payload
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedReview, setFilters, clearFilters, clearError } =
  reviewSlice.actions;
export default reviewSlice.reducer;
