import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { database } from "../../services/firebase";
import {
  ref,
  get,
  set,
  push,
  remove,
  serverTimestamp,
} from "firebase/database";
import { InventoryItem, InventoryState } from "../../types/inventory";

const initialState: InventoryState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk to fetch all inventory items
export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",
  async (_, { rejectWithValue }) => {
    try {
      const inventoryRef = ref(database, "inventory");
      const snapshot = await get(inventoryRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const items: InventoryItem[] = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
        return items;
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch inventory");
    }
  }
);

// Async thunk to add new inventory item
export const addInventory = createAsyncThunk(
  "inventory/addInventory",
  async (
    inventoryData: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">,
    { rejectWithValue }
  ) => {
    try {
      const inventoryRef = ref(database, "inventory");
      const newInventoryRef = push(inventoryRef);

      const timestamp = new Date().toISOString();
      const newInventory: InventoryItem = {
        ...inventoryData,
        id: newInventoryRef.key!,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await set(newInventoryRef, newInventory);
      return newInventory;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add inventory item");
    }
  }
);

// Async thunk to update inventory item
export const updateInventory = createAsyncThunk(
  "inventory/updateInventory",
  async (
    { id, data }: { id: string; data: Partial<InventoryItem> },
    { rejectWithValue }
  ) => {
    try {
      const inventoryRef = ref(database, `inventory/${id}`);
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      await set(inventoryRef, updateData);
      return { id, data: updateData };
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to update inventory item"
      );
    }
  }
);

// Async thunk to delete inventory item
export const deleteInventory = createAsyncThunk(
  "inventory/deleteInventory",
  async (id: string, { rejectWithValue }) => {
    try {
      const inventoryRef = ref(database, `inventory/${id}`);
      await remove(inventoryRef);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to delete inventory item"
      );
    }
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch inventory
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add inventory
      .addCase(addInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(addInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update inventory
      .addCase(updateInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInventory.fulfilled, (state, action) => {
        state.loading = false;
        const { id, data } = action.payload;
        const index = state.items.findIndex((item) => item.id === id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...data };
        }
        state.error = null;
      })
      .addCase(updateInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete inventory
      .addCase(deleteInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setLoading } = inventorySlice.actions;
export default inventorySlice.reducer;
