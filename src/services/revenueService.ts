import { ref, get, onValue, off } from "firebase/database";
import { database } from "./firebase";
import { RevenueRecord, RevenueStats, DailyRevenue } from "../types/revenue";

class RevenueService {
  private revenueRef = ref(database, "revenue");

  // Fetch all revenue records
  async fetchRevenueRecords(): Promise<RevenueRecord[]> {
    try {
      const snapshot = await get(this.revenueRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching revenue records:", error);
      throw error;
    }
  }

  // Subscribe to real-time revenue updates
  subscribeToRevenueUpdates(callback: (records: RevenueRecord[]) => void) {
    const handleData = (snapshot: any) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const records = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        callback(records);
      } else {
        callback([]);
      }
    };

    onValue(this.revenueRef, handleData);
    return () => off(this.revenueRef, "value", handleData);
  }

  // Calculate revenue statistics
  calculateStats(records: RevenueRecord[]): RevenueStats {
    const totalRevenue = records.reduce(
      (sum, record) => sum + record.totalPrice,
      0
    );
    const uniqueOrders = new Set(records.map((record) => record.orderId));
    const totalOrders = uniqueOrders.size;
    const totalProductsSold = records.reduce(
      (sum, record) => sum + record.quantity,
      0
    );

    return {
      totalRevenue,
      totalOrders,
      totalProductsSold,
    };
  }

  // Calculate daily revenue for a specific month/year
  calculateDailyRevenue(
    records: RevenueRecord[],
    month: number,
    year: number
  ): DailyRevenue[] {
    const filteredRecords = records.filter((record) => {
      // Handle both string format "2025-08" and number format
      let recordMonth: number;
      let recordYear: number;

      if (typeof record.month === "string") {
        const [yearStr, monthStr] = record.month.split("-");
        recordMonth = parseInt(monthStr);
        recordYear = parseInt(yearStr);
      } else {
        recordMonth = record.month;
        recordYear =
          typeof record.year === "string" ? parseInt(record.year) : record.year;
      }

      return recordMonth === month && recordYear === year;
    });

    const dailyData: {
      [day: number]: { revenue: number; orders: Set<string> };
    } = {};

    filteredRecords.forEach((record) => {
      const date = new Date(record.completedAt);
      const day = date.getDate();

      if (!dailyData[day]) {
        dailyData[day] = { revenue: 0, orders: new Set() };
      }

      dailyData[day].revenue += record.totalPrice;
      dailyData[day].orders.add(record.orderId);
    });

    // Get number of days in the month
    const daysInMonth = new Date(year, month, 0).getDate();
    const result: DailyRevenue[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      result.push({
        day,
        revenue: dailyData[day]?.revenue || 0,
        orders: dailyData[day]?.orders.size || 0,
      });
    }

    return result;
  }

  // Filter records by criteria
  filterRecords(
    records: RevenueRecord[],
    filter: { month?: number; year?: number; category?: string }
  ): RevenueRecord[] {
    return records.filter((record) => {
      // Handle month filtering with both string and number formats
      if (filter.month) {
        let recordMonth: number;
        if (typeof record.month === "string") {
          const [, monthStr] = record.month.split("-");
          recordMonth = parseInt(monthStr);
        } else {
          recordMonth = record.month;
        }
        if (recordMonth !== filter.month) return false;
      }

      // Handle year filtering with both string and number formats
      if (filter.year) {
        let recordYear: number;
        if (typeof record.month === "string") {
          const [yearStr] = record.month.split("-");
          recordYear = parseInt(yearStr);
        } else {
          recordYear =
            typeof record.year === "string"
              ? parseInt(record.year)
              : record.year;
        }
        if (recordYear !== filter.year) return false;
      }

      if (filter.category && record.productCategory !== filter.category)
        return false;
      return true;
    });
  }

  // Get unique categories from records
  getUniqueCategories(records: RevenueRecord[]): string[] {
    const categories = new Set(records.map((record) => record.productCategory));
    return Array.from(categories).sort();
  }

  // Get available months/years from records
  getAvailablePeriods(
    records: RevenueRecord[]
  ): { month: number; year: number }[] {
    const periods = new Set(
      records.map((record) => {
        if (typeof record.month === "string") {
          // Format: "2025-08" -> "2025-8"
          const [yearStr, monthStr] = record.month.split("-");
          return `${yearStr}-${parseInt(monthStr)}`;
        } else {
          // Format: year: 2025, month: 8 -> "2025-8"
          const year =
            typeof record.year === "string"
              ? record.year
              : record.year.toString();
          return `${year}-${record.month}`;
        }
      })
    );
    return Array.from(periods)
      .map((period) => {
        const [year, month] = period.split("-").map(Number);
        return { year, month };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });
  }

  // Calculate product revenue statistics
  calculateProductStats(records: RevenueRecord[]) {
    const productMap = new Map();

    records.forEach((record) => {
      const key = record.productName;
      if (!productMap.has(key)) {
        productMap.set(key, {
          productName: record.productName,
          productImage: record.productImage,
          productCategory: record.productCategory,
          totalRevenue: 0,
          totalQuantity: 0,
          totalOrders: new Set(),
        });
      }

      const product = productMap.get(key);
      product.totalRevenue += record.totalPrice;
      product.totalQuantity += record.quantity;
      product.totalOrders.add(record.orderId);
    });

    return Array.from(productMap.values())
      .map((product) => ({
        ...product,
        totalOrders: product.totalOrders.size,
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  // Calculate category revenue statistics
  calculateCategoryStats(records: RevenueRecord[]) {
    const categoryMap = new Map();

    records.forEach((record) => {
      const key = record.productCategory;
      if (!categoryMap.has(key)) {
        categoryMap.set(key, {
          categoryName: record.productCategory,
          totalRevenue: 0,
          totalQuantity: 0,
          totalOrders: new Set(),
          productCount: new Set(),
        });
      }

      const category = categoryMap.get(key);
      category.totalRevenue += record.totalPrice;
      category.totalQuantity += record.quantity;
      category.totalOrders.add(record.orderId);
      category.productCount.add(record.productName);
    });

    return Array.from(categoryMap.values())
      .map((category) => ({
        ...category,
        totalOrders: category.totalOrders.size,
        productCount: category.productCount.size,
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  }
}

export default new RevenueService();
