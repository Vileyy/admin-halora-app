export interface ProductVariant {
  id: string;
  size: string; // hoặc dung tích như "50ml", "100g"
  price: number;
  stock: number;
  sku?: string; // mã sản phẩm
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  imageUrl: string;
  variants: ProductVariant[];
  isFlashDeal?: boolean;
  flashDealEndTime?: number;
  createdAt: number;
  updatedAt: number;
}

export interface ProductFormData {
  title: string;
  description: string;
  category: string;
  brand: string;
  imageUrl: string;
  variants: Omit<ProductVariant, "id">[];
  isFlashDeal?: boolean;
  flashDealEndTime?: number;
}

export interface ProductState {
  products: Product[];
  flashDeals: Product[];
  newProducts: Product[];
  loading: boolean;
  error: string | null;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}
