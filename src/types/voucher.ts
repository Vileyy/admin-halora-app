export interface Voucher {
  id: string;
  code: string;
  title: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  type: "shipping" | "product";
  minOrder: number;
  startDate: number; // timestamp
  endDate: number; // timestamp
  usageLimit: number;
  usageCount: number;
  status: "active" | "inactive" | "expired";
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
}

export interface VoucherFormData {
  code: string;
  title: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  type: "shipping" | "product";
  minOrder: number;
  startDate: Date;
  endDate: Date;
  usageLimit: number;
}

export interface VoucherState {
  vouchers: Voucher[];
  loading: boolean;
  error: string | null;
}

export interface VoucherStats {
  totalVouchers: number;
  activeVouchers: number;
  expiredVouchers: number;
  totalUsage: number;
}
