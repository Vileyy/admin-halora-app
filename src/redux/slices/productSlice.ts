import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductFormData, ProductFilters } from "../../types/product";
import { HaloraDatabaseService } from "../../services/database";

interface ProductState {
  products: Product[];
  flashDeals: Product[];
  newProducts: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
}

const initialState: ProductState = {
  products: [],
  flashDeals: [],
  newProducts: [],
  loading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const result = await HaloraDatabaseService.getProducts();
      if (result.success) {
        const products: Product[] = result.data
          ? Object.entries(result.data).map(([id, product]: [string, any]) => ({
              id,
              title: product.name,
              description: product.description,
              category:
                product.category === "FlashDeals"
                  ? "Flash Deal"
                  : product.category === "new_product"
                  ? "Sản phẩm mới"
                  : product.category,
              brand: product.brand || "Unknown",
              imageUrl: product.image,
              variants:
                product.variants?.map((variant: any, index: number) => ({
                  id: `${id}_variant_${index}`,
                  size: variant.size,
                  price: variant.price,
                  stock: variant.stockQty || variant.stock || 0,
                  sku: variant.sku,
                })) || [],
              isFlashDeal: product.category === "FlashDeals",
              flashDealEndTime: product.flashDealEndTime,
              createdAt: product.createdAt || Date.now(),
              updatedAt: product.updatedAt || Date.now(),
            }))
          : [];

        // Phân loại sản phẩm
        const flashDeals = products.filter((p) => p.isFlashDeal);
        const newProducts = products
          .filter((p) => p.category === "Sản phẩm mới")
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 20); // Lấy 20 sản phẩm mới nhất

        return { products, flashDeals, newProducts };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData: ProductFormData, { rejectWithValue }) => {
    try {
      // Transform data to match database structure
      const dbProductData = {
        name: productData.title,
        description: productData.description,
        category: productData.isFlashDeal ? "FlashDeals" : "new_product",
        brand: productData.brand,
        image: productData.imageUrl,
        variants: productData.variants.map((variant, index) => ({
          size: variant.size,
          price: variant.price,
          stockQty: variant.stock,
          sku: variant.sku,
        })),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const result = await HaloraDatabaseService.addProduct(dbProductData);
      if (result.success) {
        return {
          id: result.key,
          ...productData,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (
    { id, updates }: { id: string; updates: Partial<ProductFormData> },
    { rejectWithValue }
  ) => {
    try {
      // Transform updates to match database structure
      const dbUpdates: any = {};
      if (updates.title) dbUpdates.name = updates.title;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.category) dbUpdates.category = updates.category;
      if (updates.brand) dbUpdates.brand = updates.brand;
      if (updates.imageUrl) dbUpdates.image = updates.imageUrl;
      if (updates.variants) {
        dbUpdates.variants = updates.variants.map((variant) => ({
          size: variant.size,
          price: variant.price,
          stockQty: variant.stock,
          sku: variant.sku,
        }));
      }
      if (updates.isFlashDeal !== undefined) {
        dbUpdates.category = updates.isFlashDeal ? "FlashDeals" : "new_product";
      }
      dbUpdates.updatedAt = Date.now();

      const result = await HaloraDatabaseService.updateProduct(id, dbUpdates);
      if (result.success) {
        return { id, updates };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      const result = await HaloraDatabaseService.deleteProduct(productId);
      if (result.success) {
        return productId;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearProducts: (state) => {
      state.products = [];
      state.flashDeals = [];
      state.newProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.flashDeals = action.payload.flashDeals;
        state.newProducts = action.payload.newProducts;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        const newProduct = action.payload as Product;
        state.products.push(newProduct);

        // Cập nhật flash deals hoặc new products
        if (newProduct.isFlashDeal) {
          state.flashDeals.push(newProduct);
        } else {
          state.newProducts.unshift(newProduct);
          // Giữ chỉ 20 sản phẩm mới nhất
          if (state.newProducts.length > 20) {
            state.newProducts = state.newProducts.slice(0, 20);
          }
        }
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const { id, updates } = action.payload;

        // Cập nhật trong danh sách chính
        const productIndex = state.products.findIndex((p) => p.id === id);
        if (productIndex !== -1) {
          state.products[productIndex] = {
            ...state.products[productIndex],
            ...updates,
          };
        }

        // Cập nhật trong flash deals
        const flashDealIndex = state.flashDeals.findIndex((p) => p.id === id);
        if (flashDealIndex !== -1) {
          state.flashDeals[flashDealIndex] = {
            ...state.flashDeals[flashDealIndex],
            ...updates,
          };
        }

        // Cập nhật trong new products
        const newProductIndex = state.newProducts.findIndex((p) => p.id === id);
        if (newProductIndex !== -1) {
          state.newProducts[newProductIndex] = {
            ...state.newProducts[newProductIndex],
            ...updates,
          };
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        const productId = action.payload;

        // Xóa khỏi tất cả danh sách
        state.products = state.products.filter((p) => p.id !== productId);
        state.flashDeals = state.flashDeals.filter((p) => p.id !== productId);
        state.newProducts = state.newProducts.filter((p) => p.id !== productId);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearError, clearProducts } = productSlice.actions;
export default productSlice.reducer;
