import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import inventoryReducer from "./slices/inventorySlice";
import brandReducer from "./slices/brandSlice";
import categoryReducer from "./slices/categorySlice";
import bannerReducer from "./slices/bannerSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    inventory: inventoryReducer,
    brands: brandReducer,
    categories: categoryReducer,
    banners: bannerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
