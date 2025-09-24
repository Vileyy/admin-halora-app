export interface AddressData {
  detailAddress: string;
  district: {
    code: number;
    codename: string;
    division_type: string;
    name: string;
    province_code: number;
  };
  province: {
    code: number;
    codename: string;
    division_type: string;
    name: string;
    phone_code: number;
  };
  ward: {
    code: number;
    codename: string;
    district_code: number;
    division_type: string;
    name: string;
  };
}

export interface CartItem {
  category: string;
  description: string;
  id: string;
  image: string;
  name: string;
  price: string;
  quantity: number;
  selected: boolean;
  variant?: {
    price: number;
    size: string;
  };
}

export interface OrderItem {
  category: string;
  description: string;
  id: string;
  image: string;
  name: string;
  price: string;
  quantity: number;
  variant?: {
    price: number;
    size: string;
  };
}

export interface Order {
  id: string;
  createdAt: string;
  discountAmount: number;
  items: OrderItem[];
  itemsSubtotal: number;
  paymentMethod: "cod" | "vnpay" | "zalopay";
  shippingCost: number;
  shippingMethod: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  totalAmount: number;
  updatedAt: string;
  appliedCoupon?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  avatar?: string;
  photoURL?: string;
  phone?: string;
  gender?: "male" | "female";
  dateOfBirth?: string;
  address?: string;
  addressData?: AddressData;
  provider?: string;
  role?: "admin" | "user";
  status?: "active" | "inactive" | "banned";
  createdAt: string | number;
  updatedAt: string;
  cart?: CartItem[];
  orders?: { [key: string]: Order };
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface UserFilters {
  status?: "active" | "inactive" | "banned";
  role?: "admin" | "user";
  searchTerm?: string;
  sortBy?: "createdAt" | "displayName" | "totalOrders";
  sortOrder?: "asc" | "desc";
}
