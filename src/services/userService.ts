import { database } from "./firebase";
import { ref, get, update } from "firebase/database";
import { User, UserStats, UserFilters } from "../types/user";

export const userService = {
  // Lấy tất cả users
  async getAllUsers(): Promise<User[]> {
    try {
      const usersRef = ref(database, "users");
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const usersData = snapshot.val();
        return Object.keys(usersData).map((uid) => ({
          uid,
          ...usersData[uid],
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Lấy user theo ID
  async getUserById(uid: string): Promise<User | null> {
    try {
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        return {
          uid,
          ...snapshot.val(),
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  // Lấy users với filters
  async getUsersWithFilters(filters: UserFilters): Promise<User[]> {
    try {
      const usersRef = ref(database, "users");
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        let usersData = snapshot.val();
        let users = Object.keys(usersData).map((uid) => ({
          uid,
          ...usersData[uid],
        }));

        // Apply filters
        if (filters.status) {
          users = users.filter((user) => user.status === filters.status);
        }

        if (filters.role) {
          users = users.filter((user) => user.role === filters.role);
        }

        if (filters.searchTerm) {
          const searchTerm = filters.searchTerm.toLowerCase();
          users = users.filter(
            (user) =>
              user.displayName?.toLowerCase().includes(searchTerm) ||
              user.email?.toLowerCase().includes(searchTerm) ||
              user.phone?.includes(searchTerm)
          );
        }

        // Apply sorting
        if (filters.sortBy) {
          users.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (filters.sortBy) {
              case "createdAt":
                aValue = new Date(a.createdAt).getTime();
                bValue = new Date(b.createdAt).getTime();
                break;
              case "displayName":
                aValue = a.displayName?.toLowerCase() || "";
                bValue = b.displayName?.toLowerCase() || "";
                break;
              case "totalOrders":
                aValue = a.orders ? Object.keys(a.orders).length : 0;
                bValue = b.orders ? Object.keys(b.orders).length : 0;
                break;
              default:
                return 0;
            }

            if (aValue < bValue) return filters.sortOrder === "asc" ? -1 : 1;
            if (aValue > bValue) return filters.sortOrder === "asc" ? 1 : -1;
            return 0;
          });
        }

        return users;
      }
      return [];
    } catch (error) {
      console.error("Error fetching users with filters:", error);
      throw error;
    }
  },

  // Lấy thống kê users
  async getUserStats(): Promise<UserStats> {
    try {
      const usersRef = ref(database, "users");
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const users = Object.keys(usersData).map((uid) => ({
          uid,
          ...usersData[uid],
        }));

        const totalUsers = users.length;
        const activeUsers = users.filter(
          (user) => user.status === "active" || !user.status
        ).length;

        // Count new users this month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const newUsersThisMonth = users.filter((user) => {
          const createdAt = new Date(user.createdAt);
          return (
            createdAt.getMonth() === currentMonth &&
            createdAt.getFullYear() === currentYear
          );
        }).length;

        // Calculate total orders and revenue
        let totalOrders = 0;
        let totalRevenue = 0;

        users.forEach((user) => {
          if (user.orders) {
            const userOrders = Object.values(user.orders);
            totalOrders += userOrders.length;
            totalRevenue += userOrders.reduce((sum, order) => {
              if (order.status === "delivered") {
                return sum + order.totalAmount;
              }
              return sum;
            }, 0);
          }
        });

        return {
          totalUsers,
          activeUsers,
          newUsersThisMonth,
          totalOrders,
          totalRevenue,
        };
      }

      return {
        totalUsers: 0,
        activeUsers: 0,
        newUsersThisMonth: 0,
        totalOrders: 0,
        totalRevenue: 0,
      };
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw error;
    }
  },

  // Lấy users mới nhất
  async getRecentUsers(limit: number = 10): Promise<User[]> {
    try {
      const usersRef = ref(database, "users");
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const users = Object.keys(usersData).map((uid) => ({
          uid,
          ...usersData[uid],
        }));

        // Sort by createdAt and get the most recent ones
        return users
          .sort((a, b) => {
            const aTime = new Date(a.createdAt).getTime();
            const bTime = new Date(b.createdAt).getTime();
            return bTime - aTime; // Newest first
          })
          .slice(0, limit);
      }
      return [];
    } catch (error) {
      console.error("Error fetching recent users:", error);
      throw error;
    }
  },

  // Lấy top users theo số đơn hàng
  async getTopUsersByOrders(limit: number = 10): Promise<User[]> {
    try {
      const usersRef = ref(database, "users");
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const users = Object.keys(usersData).map((uid) => {
          const user = {
            uid,
            ...usersData[uid],
          };

          // Count orders
          const orderCount = user.orders ? Object.keys(user.orders).length : 0;
          return {
            ...user,
            orderCount,
          };
        });

        // Sort by order count and return top users
        return users
          .sort((a, b) => (b as any).orderCount - (a as any).orderCount)
          .slice(0, limit);
      }
      return [];
    } catch (error) {
      console.error("Error fetching top users:", error);
      throw error;
    }
  },

  // Cập nhật trạng thái user
  async updateUserStatus(
    uid: string,
    status: "active" | "banned"
  ): Promise<void> {
    try {
      const userRef = ref(database, `users/${uid}`);
      const updates = {
        status: status,
        updatedAt: new Date().toISOString(),
      };

      await update(userRef, updates);
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  },

  // Khóa user
  async lockUser(uid: string): Promise<void> {
    return this.updateUserStatus(uid, "banned");
  },

  // Mở khóa user
  async unlockUser(uid: string): Promise<void> {
    return this.updateUserStatus(uid, "active");
  },
};
