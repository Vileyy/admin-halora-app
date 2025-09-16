# Hướng dẫn Module Quản lý Sản phẩm - Halora Cosmetics

## 📋 Tổng quan

Module quản lý sản phẩm được xây dựng hoàn chỉnh với các tính năng:

- ✅ Quản lý sản phẩm với variants (dung tích, giá, tồn kho)
- ✅ Flash Deals và sản phẩm mới
- ✅ Upload ảnh qua Cloudinary
- ✅ Redux state management
- ✅ Firebase Realtime Database
- ✅ UI/UX hiện đại với màu chủ đạo #FF99CC

## 🏗️ Cấu trúc Module

```
src/
├── types/
│   └── product.ts                 # Types cho sản phẩm và variants
├── redux/
│   └── slices/
│       └── productSlice.ts        # Redux slice quản lý state
├── services/
│   └── productService.ts          # Service Firebase cho sản phẩm
├── components/
│   └── products/
│       ├── ProductCard.tsx        # Card hiển thị sản phẩm
│       ├── ProductList.tsx        # Danh sách sản phẩm
│       ├── FloatingActionButton.tsx # Nút thêm sản phẩm
│       └── index.ts
└── screens/
    └── products/
        ├── ProductsScreen.tsx     # Màn hình chính với Top Tabs
        ├── ProductDetailScreen.tsx # Chi tiết sản phẩm
        └── ProductFormScreen.tsx  # Form thêm/sửa sản phẩm
```

## 🚀 Cách sử dụng

### 1. Cấu hình Redux Store

Đã cập nhật `src/redux/store.ts` để bao gồm productSlice:

```typescript
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
  },
});
```

### 2. Sử dụng trong Component

```typescript
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../redux/slices/productSlice";

const MyComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, flashDeals, newProducts, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  // Fetch products
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Add product
  const handleAddProduct = async (productData) => {
    await dispatch(addProduct(productData));
  };

  // Update product
  const handleUpdateProduct = async (id, updates) => {
    await dispatch(updateProduct({ id, updates }));
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    await dispatch(deleteProduct(id));
  };
};
```

### 3. Sử dụng ProductService

```typescript
import { ProductService } from "../services/productService";

// Get all products
const result = await ProductService.getAllProducts();

// Get flash deals
const flashDeals = await ProductService.getFlashDeals();

// Get new products
const newProducts = await ProductService.getNewProducts(20);

// Search products
const searchResults = await ProductService.searchProducts("kem dưỡng");

// Get products by category
const skincareProducts = await ProductService.getProductsByCategory("Skincare");

// Get low stock products
const lowStockProducts = await ProductService.getLowStockProducts(10);
```

## 📱 Màn hình và Tính năng

### 1. ProductsScreen (Màn hình chính)

- **Top Tab Navigation** với 2 tab:
  - Flash Deal: Hiển thị sản phẩm Flash Deal
  - Sản phẩm mới: Hiển thị sản phẩm mới (30 ngày gần nhất)
- **ProductCard**: Card sản phẩm với ảnh, tên, giá, tồn kho
- **FloatingActionButton**: Nút thêm sản phẩm mới
- **Pull-to-refresh**: Kéo để làm mới dữ liệu

### 2. ProductDetailScreen (Chi tiết sản phẩm)

- Hiển thị ảnh lớn sản phẩm
- Thông tin chi tiết: tên, mô tả, thương hiệu, danh mục
- Danh sách variants với giá và tồn kho
- Nút chỉnh sửa và xóa sản phẩm
- Badge Flash Deal nếu có

### 3. ProductFormScreen (Form thêm/sửa)

- Upload ảnh qua Cloudinary
- Form thông tin cơ bản: tên, mô tả, danh mục, thương hiệu
- Quản lý variants: thêm, sửa, xóa các loại sản phẩm
- Cấu hình Flash Deal
- Validation đầy đủ

## 🎨 UI/UX Features

### Màu sắc chủ đạo

- Primary: #FF99CC (Hồng Halora)
- Background: #f8f9fa
- Text: #333, #666, #888
- Success: #4ECDC4
- Error: #FF6B6B

### Components

- **ProductCard**: Card bo góc, shadow nhẹ, responsive
- **ProductList**: FlatList 2 cột, pull-to-refresh
- **FloatingActionButton**: FAB với shadow, màu chủ đạo
- **Form**: Input validation, modal picker, image upload

## 🔧 Cấu hình Database

### Cấu trúc Firebase Realtime Database

```json
{
  "products": {
    "productId1": {
      "title": "Kem dưỡng ẩm Halora",
      "description": "Kem dưỡng ẩm cho da khô",
      "category": "Skincare",
      "brand": "Halora",
      "imageUrl": "https://res.cloudinary.com/...",
      "variants": [
        {
          "id": "variant1",
          "size": "50ml",
          "price": 200000,
          "stock": 100,
          "sku": "HAL-SK-001-50ML"
        }
      ],
      "isFlashDeal": false,
      "flashDealEndTime": null,
      "createdAt": 1703123456789,
      "updatedAt": 1703123456789
    }
  }
}
```

## 📦 Dependencies đã cài đặt

```json
{
  "firebase": "^12.2.1",
  "cloudinary": "^1.41.0",
  "@react-native-async-storage/async-storage": "^1.21.0",
  "@expo/vector-icons": "^14.0.0",
  "expo-image-picker": "^15.0.0"
}
```

## 🚀 Cách chạy

1. **Cài đặt dependencies**:

   ```bash
   npm install
   ```

2. **Cấu hình biến môi trường**:
   Tạo file `.env` với các biến Firebase và Cloudinary (đã có sẵn)

3. **Chạy ứng dụng**:
   ```bash
   npm start
   ```

## 🔄 Redux Actions

### Available Actions

- `fetchProducts()`: Lấy tất cả sản phẩm
- `addProduct(productData)`: Thêm sản phẩm mới
- `updateProduct({id, updates})`: Cập nhật sản phẩm
- `deleteProduct(productId)`: Xóa sản phẩm
- `setFilters(filters)`: Đặt bộ lọc
- `clearError()`: Xóa lỗi
- `clearProducts()`: Xóa danh sách sản phẩm

### State Structure

```typescript
interface ProductState {
  products: Product[]; // Tất cả sản phẩm
  flashDeals: Product[]; // Sản phẩm Flash Deal
  newProducts: Product[]; // Sản phẩm mới
  loading: boolean; // Trạng thái loading
  error: string | null; // Lỗi nếu có
  filters: ProductFilters; // Bộ lọc hiện tại
}
```

## 🎯 Tính năng nổi bật

1. **Real-time sync**: Đồng bộ dữ liệu với Firebase Realtime Database
2. **Image upload**: Upload ảnh qua Cloudinary với optimization
3. **Variant management**: Quản lý nhiều loại sản phẩm (dung tích, giá, tồn kho)
4. **Flash Deals**: Hệ thống Flash Deal với thời gian kết thúc
5. **Search & Filter**: Tìm kiếm và lọc sản phẩm
6. **Responsive UI**: Giao diện responsive cho mobile
7. **Error handling**: Xử lý lỗi đầy đủ
8. **Loading states**: Trạng thái loading cho UX tốt

## 🔮 Mở rộng trong tương lai

- [ ] Barcode scanner cho SKU
- [ ] Inventory alerts khi hết hàng
- [ ] Bulk operations (xóa nhiều, cập nhật hàng loạt)
- [ ] Export/Import sản phẩm
- [ ] Analytics và báo cáo
- [ ] Offline support với sync
- [ ] Push notifications cho Flash Deals

---

**Module quản lý sản phẩm đã sẵn sàng sử dụng! 🎉**
