import { database } from "./firebase";
import { ref, get, update } from "firebase/database";
import { Order, OrderStats, OrderFilters } from "../types/order";

export const orderService = {
  // Lấy tất cả đơn hàng từ tất cả users
  async getAllOrders(): Promise<Order[]> {
    try {
      const usersRef = ref(database, "users");
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const allOrders: Order[] = [];

        // Lặp qua tất cả users để lấy orders
        Object.keys(usersData).forEach((userId) => {
          const user = usersData[userId];
          if (user.orders) {
            Object.keys(user.orders).forEach((orderId) => {
              const order = user.orders[orderId];
              allOrders.push({
                ...order,
                userId,
                userInfo: {
                  displayName: user.displayName || "Không có tên",
                  email: user.email || "",
                  phone: user.phone || "",
                  address: user.address || "",
                },
              });
            });
          }
        });

        // Sắp xếp theo thời gian tạo mới nhất
        return allOrders.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return [];
    } catch (error) {
      console.error("Error fetching all orders:", error);
      throw error;
    }
  },

  // Lấy đơn hàng với filters
  async getOrdersWithFilters(filters: OrderFilters): Promise<Order[]> {
    try {
      const allOrders = await this.getAllOrders();
      let filteredOrders = [...allOrders];

      // Filter by status
      if (filters.status && filters.status !== "all") {
        filteredOrders = filteredOrders.filter(
          (order) => order.status === filters.status
        );
      }

      // Filter by payment method
      if (filters.paymentMethod && filters.paymentMethod !== "all") {
        filteredOrders = filteredOrders.filter(
          (order) => order.paymentMethod === filters.paymentMethod
        );
      }

      // Filter by date range
      if (filters.dateRange) {
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        filteredOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= startDate && orderDate <= endDate;
        });
      }

      // Filter by search term
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        filteredOrders = filteredOrders.filter((order) => {
          return (
            order.id.toLowerCase().includes(searchTerm) ||
            order.userInfo?.displayName.toLowerCase().includes(searchTerm) ||
            order.userInfo?.email.toLowerCase().includes(searchTerm) ||
            order.items.some((item) =>
              item.name.toLowerCase().includes(searchTerm)
            )
          );
        });
      }

      // Sort orders
      if (filters.sortBy) {
        filteredOrders.sort((a, b) => {
          let aValue: any;
          let bValue: any;

          switch (filters.sortBy) {
            case "createdAt":
              aValue = new Date(a.createdAt).getTime();
              bValue = new Date(b.createdAt).getTime();
              break;
            case "totalAmount":
              aValue = a.totalAmount;
              bValue = b.totalAmount;
              break;
            case "status":
              aValue = a.status;
              bValue = b.status;
              break;
            default:
              return 0;
          }

          if (filters.sortOrder === "asc") {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      }

      return filteredOrders;
    } catch (error) {
      console.error("Error fetching orders with filters:", error);
      throw error;
    }
  },

  // Lấy thống kê đơn hàng
  async getOrderStats(): Promise<OrderStats> {
    try {
      const allOrders = await this.getAllOrders();

      const stats: OrderStats = {
        totalOrders: allOrders.length,
        pendingOrders: allOrders.filter((order) => order.status === "pending")
          .length,
        confirmedOrders: allOrders.filter(
          (order) => order.status === "confirmed"
        ).length,
        shippingOrders: allOrders.filter((order) => order.status === "shipping")
          .length,
        deliveredOrders: allOrders.filter(
          (order) => order.status === "delivered"
        ).length,
        cancelledOrders: allOrders.filter(
          (order) => order.status === "cancelled"
        ).length,
        totalRevenue: allOrders
          .filter((order) => order.status === "delivered")
          .reduce((total, order) => total + order.totalAmount, 0),
        averageOrderValue: 0,
      };

      // Tính giá trị đơn hàng trung bình
      if (stats.totalOrders > 0) {
        const totalValue = allOrders.reduce(
          (total, order) => total + order.totalAmount,
          0
        );
        stats.averageOrderValue = totalValue / stats.totalOrders;
      }

      return stats;
    } catch (error) {
      console.error("Error fetching order stats:", error);
      throw error;
    }
  },

  // Lấy đơn hàng gần đây
  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    try {
      const allOrders = await this.getAllOrders();
      return allOrders.slice(0, limit);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      throw error;
    }
  },

  // Lấy đơn hàng theo user ID
  async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.orders) {
          const orders: Order[] = Object.keys(userData.orders).map(
            (orderId) => ({
              ...userData.orders[orderId],
              userId,
              userInfo: {
                displayName: userData.displayName || "Không có tên",
                email: userData.email || "",
                phone: userData.phone || "",
                address: userData.address || "",
              },
            })
          );

          return orders.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
      }
      return [];
    } catch (error) {
      console.error("Error fetching orders by user ID:", error);
      throw error;
    }
  },

  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(
    userId: string,
    orderId: string,
    status: "pending" | "processing" | "shipping" | "delivered" | "cancelled"
  ): Promise<void> {
    try {
      const orderRef = ref(database, `users/${userId}/orders/${orderId}`);
      const updates = {
        status: status,
        updatedAt: new Date().toISOString(),
      };

      await update(orderRef, updates);
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },
};
