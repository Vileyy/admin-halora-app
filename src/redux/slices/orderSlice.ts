import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { orderService } from "../../services/orderService";
import { Order, OrderStats, OrderFilters } from "../../types/order";

interface OrderState {
  orders: Order[];
  recentOrders: Order[];
  stats: OrderStats | null;
  filters: OrderFilters;
  loading: boolean;
  error: string | null;
  currentOrder: Order | null;
}

const initialState: OrderState = {
  orders: [],
  recentOrders: [],
  stats: null,
  filters: {
    status: "all",
    paymentMethod: "all",
    searchTerm: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  loading: false,
  error: null,
  currentOrder: null,
};

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async () => {
    const response = await orderService.getAllOrders();
    return response;
  }
);

export const fetchOrdersWithFilters = createAsyncThunk(
  "orders/fetchOrdersWithFilters",
  async (filters: OrderFilters) => {
    const response = await orderService.getOrdersWithFilters(filters);
    return response;
  }
);

export const fetchOrderStats = createAsyncThunk(
  "orders/fetchOrderStats",
  async () => {
    const response = await orderService.getOrderStats();
    return response;
  }
);

export const fetchRecentOrders = createAsyncThunk(
  "orders/fetchRecentOrders",
  async (limit: number = 10) => {
    const response = await orderService.getRecentOrders(limit);
    return response;
  }
);

export const fetchOrdersByUserId = createAsyncThunk(
  "orders/fetchOrdersByUserId",
  async (userId: string) => {
    const response = await orderService.getOrdersByUserId(userId);
    return response;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({
    userId,
    orderId,
    status,
  }: {
    userId: string;
    orderId: string;
    status: "pending" | "processing" | "shipping" | "delivered" | "cancelled";
  }) => {
    await orderService.updateOrderStatus(userId, orderId, status);
    return { orderId, status };
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<OrderFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: "all",
        paymentMethod: "all",
        searchTerm: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch orders";
      })

      // Fetch orders with filters
      .addCase(fetchOrdersWithFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersWithFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersWithFilters.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch orders with filters";
      })

      // Fetch order stats
      .addCase(fetchOrderStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchOrderStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch order stats";
      })

      // Fetch recent orders
      .addCase(fetchRecentOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.recentOrders = action.payload;
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch recent orders";
      })

      // Fetch orders by user ID
      .addCase(fetchOrdersByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch orders by user ID";
      })

      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update order status in the orders array
        const orderIndex = state.orders.findIndex(
          (order) => order.id === action.payload.orderId
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex].status = action.payload.status;
          state.orders[orderIndex].updatedAt = new Date().toISOString();
        }
        // Update current order if it's the same order
        if (
          state.currentOrder &&
          state.currentOrder.id === action.payload.orderId
        ) {
          state.currentOrder.status = action.payload.status;
          state.currentOrder.updatedAt = new Date().toISOString();
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update order status";
      });
  },
});

export const { setFilters, clearFilters, clearError, setCurrentOrder } =
  orderSlice.actions;
export default orderSlice.reducer;
