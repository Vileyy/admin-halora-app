import { database } from "./firebase";
import { ref, get, set, push, remove, update } from "firebase/database";
import { Voucher, VoucherFormData, VoucherStats } from "../types/voucher";

export const voucherService = {
  // Fetch all vouchers
  async fetchVouchers(): Promise<Voucher[]> {
    try {
      const vouchersRef = ref(database, "vouchers");
      const snapshot = await get(vouchersRef);

      if (!snapshot.exists()) {
        return [];
      }

      const vouchersData = snapshot.val();
      const vouchers: Voucher[] = Object.entries(vouchersData).map(
        ([id, data]: [string, any]) => ({
          id,
          ...data,
          status: getVoucherStatus(data.startDate, data.endDate, data.status),
        })
      );

      return vouchers.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      throw error;
    }
  },

  // Add new voucher
  async addVoucher(voucherData: VoucherFormData): Promise<void> {
    try {
      const vouchersRef = ref(database, "vouchers");
      const newVoucherRef = push(vouchersRef);

      const now = Date.now();
      const voucher: Omit<Voucher, "id"> = {
        ...voucherData,
        startDate: voucherData.startDate.getTime(),
        endDate: voucherData.endDate.getTime(),
        usageCount: 0,
        status: "active",
        createdAt: now,
        updatedAt: now,
      };

      await set(newVoucherRef, voucher);
    } catch (error) {
      console.error("Error adding voucher:", error);
      throw error;
    }
  },

  // Delete voucher
  async deleteVoucher(id: string): Promise<void> {
    try {
      const voucherRef = ref(database, `vouchers/${id}`);
      await remove(voucherRef);
    } catch (error) {
      console.error("Error deleting voucher:", error);
      throw error;
    }
  },

  // Toggle voucher status
  async toggleVoucherStatus(id: string, currentStatus: string): Promise<void> {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const voucherRef = ref(database, `vouchers/${id}`);
      await update(voucherRef, {
        status: newStatus,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error("Error toggling voucher status:", error);
      throw error;
    }
  },
};

// Helper function to determine voucher status
function getVoucherStatus(
  startDate: number,
  endDate: number,
  currentStatus: string
): "active" | "inactive" | "expired" {
  const now = Date.now();

  if (endDate < now) {
    return "expired";
  }

  if (startDate > now) {
    return "inactive";
  }

  return currentStatus as "active" | "inactive" | "expired";
}

// Calculate voucher statistics
export function calculateVoucherStats(vouchers: Voucher[]): VoucherStats {
  return {
    totalVouchers: vouchers.length,
    activeVouchers: vouchers.filter((v) => v.status === "active").length,
    expiredVouchers: vouchers.filter((v) => v.status === "expired").length,
    totalUsage: vouchers.reduce((sum, v) => sum + v.usageCount, 0),
  };
}

// Filter vouchers by type
export function filterVouchersByType(
  vouchers: Voucher[],
  type: "shipping" | "product"
): Voucher[] {
  return vouchers.filter((voucher) => voucher.type === type);
}

// Format discount display
export function formatDiscountDisplay(voucher: Voucher): string {
  if (voucher.discountType === "percentage") {
    return `${voucher.discountValue}%`;
  } else {
    return `${voucher.discountValue.toLocaleString("vi-VN")}đ`;
  }
}

// Get voucher status color
export function getVoucherStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "#2ed573";
    case "inactive":
      return "#ffa502";
    case "expired":
      return "#ff4757";
    default:
      return "#666";
  }
}
