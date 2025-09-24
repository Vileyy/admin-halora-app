import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User, UserStats, UserFilters } from "../../types/user";
import { userService } from "../../services/userService";

interface UserState {
  users: User[];
  currentUser: User | null;
  userStats: UserStats | null;
  recentUsers: User[];
  topUsers: User[];
  loading: boolean;
  error: string | null;
  filters: UserFilters;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  userStats: null,
  recentUsers: [],
  topUsers: [],
  loading: false,
  error: null,
  filters: {
    sortBy: "createdAt",
    sortOrder: "desc",
  },
};

// Async thunks
export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async () => {
    const response = await userService.getAllUsers();
    return response;
  }
);

export const fetchUsersWithFilters = createAsyncThunk(
  "users/fetchUsersWithFilters",
  async (filters: UserFilters) => {
    const response = await userService.getUsersWithFilters(filters);
    return response;
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (uid: string) => {
    const response = await userService.getUserById(uid);
    return response;
  }
);

export const fetchUserStats = createAsyncThunk(
  "users/fetchUserStats",
  async () => {
    const response = await userService.getUserStats();
    return response;
  }
);

export const fetchRecentUsers = createAsyncThunk(
  "users/fetchRecentUsers",
  async (limit: number = 10) => {
    const response = await userService.getRecentUsers(limit);
    return response;
  }
);

export const fetchTopUsers = createAsyncThunk(
  "users/fetchTopUsers",
  async (limit: number = 10) => {
    const response = await userService.getTopUsersByOrders(limit);
    return response;
  }
);

export const lockUser = createAsyncThunk(
  "users/lockUser",
  async (uid: string) => {
    await userService.lockUser(uid);
    return uid;
  }
);

export const unlockUser = createAsyncThunk(
  "users/unlockUser",
  async (uid: string) => {
    await userService.unlockUser(uid);
    return uid;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<UserFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        sortBy: "createdAt",
        sortOrder: "desc",
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })

      // Fetch users with filters
      .addCase(fetchUsersWithFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersWithFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersWithFilters.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch users with filters";
      })

      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      })

      // Fetch user stats
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.userStats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user stats";
      })

      // Fetch recent users
      .addCase(fetchRecentUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.recentUsers = action.payload;
      })
      .addCase(fetchRecentUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch recent users";
      })

      // Fetch top users
      .addCase(fetchTopUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.topUsers = action.payload;
      })
      .addCase(fetchTopUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch top users";
      })

      // Lock user
      .addCase(lockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(lockUser.fulfilled, (state, action) => {
        state.loading = false;
        // Update user status in the users array
        const userIndex = state.users.findIndex(
          (user) => user.uid === action.payload
        );
        if (userIndex !== -1) {
          state.users[userIndex].status = "banned";
          state.users[userIndex].updatedAt = new Date().toISOString();
        }
        // Update current user if it's the same user
        if (state.currentUser && state.currentUser.uid === action.payload) {
          state.currentUser.status = "banned";
          state.currentUser.updatedAt = new Date().toISOString();
        }
      })
      .addCase(lockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to lock user";
      })

      // Unlock user
      .addCase(unlockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unlockUser.fulfilled, (state, action) => {
        state.loading = false;
        // Update user status in the users array
        const userIndex = state.users.findIndex(
          (user) => user.uid === action.payload
        );
        if (userIndex !== -1) {
          state.users[userIndex].status = "active";
          state.users[userIndex].updatedAt = new Date().toISOString();
        }
        // Update current user if it's the same user
        if (state.currentUser && state.currentUser.uid === action.payload) {
          state.currentUser.status = "active";
          state.currentUser.updatedAt = new Date().toISOString();
        }
      })
      .addCase(unlockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to unlock user";
      });
  },
});

export const { setFilters, clearFilters, clearError, setCurrentUser } =
  userSlice.actions;
export default userSlice.reducer;
