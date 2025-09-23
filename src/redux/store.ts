import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import inventoryReducer from "./slices/inventorySlice";
import brandReducer from "./slices/brandSlice";
import categoryReducer from "./slices/categorySlice";
import bannerReducer from "./slices/bannerSlice";
import notificationReducer from "./slices/notificationSlice";
import reviewReducer from "./slices/reviewSlice";
import revenueReducer from "./slices/revenueSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    inventory: inventoryReducer,
    brands: brandReducer,
    categories: categoryReducer,
    banners: bannerReducer,
    notifications: notificationReducer,
    reviews: reviewReducer,
    revenue: revenueReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
