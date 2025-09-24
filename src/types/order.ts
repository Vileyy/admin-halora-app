export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  description: string;
  variant?: {
    size: string;
    price: number;
  };
}

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  itemsSubtotal: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  status: "pending" | "processing" | "shipping" | "delivered" | "cancelled";
  paymentMethod: "cod" | "vnpay" | "zalopay";
  shippingMethod: "standard" | "express";
  appliedCoupon?: string;
  userId: string;
  userInfo?: {
    displayName: string;
    email: string;
    phone: string;
    address: string;
  };
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  shippingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface OrderFilters {
  status?: string;
  paymentMethod?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
  sortBy?: "createdAt" | "totalAmount" | "status";
  sortOrder?: "asc" | "desc";
}
