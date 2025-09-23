export interface UserInfo {
  displayName: string;
  email?: string;
  uid?: string;
}

export interface RevenueRecord {
  id: string;
  completedAt: string; // ISO date string
  month: number | string; // Can be "2025-08" or 8
  year: number | string; // Can be "2025" or 2025
  orderId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productCategory: string;
  userInfo: UserInfo;
}

export interface RevenueStats {
  totalRevenue: number;
  totalOrders: number;
  totalProductsSold: number;
}

export interface DailyRevenue {
  day: number;
  revenue: number;
  orders: number;
}

export interface RevenueFilter {
  month?: number;
  year?: number;
  category?: string;
}

export interface ProductStats {
  productName: string;
  productImage: string;
  productCategory: string;
  totalRevenue: number;
  totalQuantity: number;
  totalOrders: number;
}

export interface CategoryStats {
  categoryName: string;
  totalRevenue: number;
  totalQuantity: number;
  totalOrders: number;
  productCount: number;
}

export interface RevenueState {
  records: RevenueRecord[];
  stats: RevenueStats;
  dailyRevenue: DailyRevenue[];
  productStats: ProductStats[];
  categoryStats: CategoryStats[];
  loading: boolean;
  error: string | null;
  filter: RevenueFilter;
}
