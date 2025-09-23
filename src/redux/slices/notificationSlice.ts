import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Notification,
  CreateNotificationData,
  UpdateNotificationData,
} from "../../types/notification";
import { notificationService } from "../../services/notificationService";

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  selectedNotification: Notification | null;
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
  selectedNotification: null,
  unreadCount: 0,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const notifications = await notificationService.getAllNotifications();
      return notifications;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch notifications");
    }
  }
);

export const createNotification = createAsyncThunk(
  "notifications/createNotification",
  async (notificationData: CreateNotificationData, { rejectWithValue }) => {
    try {
      const id = await notificationService.createNotification(notificationData);
      return { id, ...notificationData, isRead: false };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create notification");
    }
  }
);

export const updateNotification = createAsyncThunk(
  "notifications/updateNotification",
  async (
    { id, data }: { id: string; data: UpdateNotificationData },
    { rejectWithValue }
  ) => {
    try {
      await notificationService.updateNotification(id, data);
      return { id, ...data };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update notification");
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (id: string, { rejectWithValue }) => {
    try {
      await notificationService.deleteNotification(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete notification");
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id: string, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to mark notification as read"
      );
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead();
      return true;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to mark all notifications as read"
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setSelectedNotification: (
      state,
      action: PayloadAction<Notification | null>
    ) => {
      state.selectedNotification = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create notification
      .addCase(createNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.loading = false;
        const now = new Date().toISOString();
        const newNotification = {
          ...action.payload,
          createdAt: now,
          updatedAt: now,
        };
        state.notifications.unshift(newNotification);
        state.unreadCount += 1;
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update notification
      .addCase(updateNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notifications.findIndex(
          (notification) => notification.id === action.payload.id
        );
        if (index !== -1) {
          state.notifications[index] = {
            ...state.notifications[index],
            ...action.payload,
          };
        }
        // Recalculate unread count
        state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete notification
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        const deletedNotification = state.notifications.find(
          (n) => n.id === action.payload
        );
        if (deletedNotification && !deletedNotification.isRead) {
          state.unreadCount -= 1;
        }
        state.notifications = state.notifications.filter(
          (notification) => notification.id !== action.payload
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Mark as read
      .addCase(markAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notifications.findIndex(
          (n) => n.id === action.payload
        );
        if (index !== -1 && !state.notifications[index].isRead) {
          state.notifications[index].isRead = true;
          state.unreadCount -= 1;
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Mark all as read
      .addCase(markAllAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.loading = false;
        state.notifications.forEach((notification) => {
          notification.isRead = true;
        });
        state.unreadCount = 0;
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedNotification, clearError } =
  notificationSlice.actions;
export default notificationSlice.reducer;
