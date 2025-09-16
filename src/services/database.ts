import {
  ref,
  set,
  get,
  push,
  update,
  remove,
  onValue,
  off,
  query,
  orderByChild,
  equalTo,
  limitToLast,
  startAt,
  endAt,
} from "firebase/database";
import { database } from "./firebase";

// Database service class
export class DatabaseService {
  // Write data to a specific path
  static async writeData(path: string, data: any) {
    try {
      const dataRef = ref(database, path);
      await set(dataRef, data);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Read data from a specific path
  static async readData(path: string) {
    try {
      const dataRef = ref(database, path);
      const snapshot = await get(dataRef);

      if (snapshot.exists()) {
        return {
          success: true,
          data: snapshot.val(),
        };
      } else {
        return {
          success: true,
          data: null,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Push data to a list (generates unique key)
  static async pushData(path: string, data: any) {
    try {
      const dataRef = ref(database, path);
      const newRef = push(dataRef, data);
      return {
        success: true,
        key: newRef.key,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Update specific fields
  static async updateData(path: string, updates: any) {
    try {
      const dataRef = ref(database, path);
      await update(dataRef, updates);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Delete data
  static async deleteData(path: string) {
    try {
      const dataRef = ref(database, path);
      await remove(dataRef);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Listen to real-time changes
  static listenToData(
    path: string,
    callback: (data: any) => void,
    errorCallback?: (error: any) => void
  ) {
    const dataRef = ref(database, path);

    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.val());
        } else {
          callback(null);
        }
      },
      (error) => {
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );

    return unsubscribe;
  }

  // Query data with filters
  static async queryData(
    path: string,
    orderBy?: string,
    equalToValue?: any,
    limit?: number
  ) {
    try {
      let dataRef: any = ref(database, path);

      if (orderBy) {
        dataRef = query(dataRef, orderByChild(orderBy));
      }

      if (equalToValue !== undefined) {
        dataRef = query(dataRef, equalTo(equalToValue));
      }

      if (limit) {
        dataRef = query(dataRef, limitToLast(limit));
      }

      const snapshot = await get(dataRef);

      if (snapshot.exists()) {
        return {
          success: true,
          data: snapshot.val(),
        };
      } else {
        return {
          success: true,
          data: null,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Search data with range
  static async searchData(
    path: string,
    orderBy: string,
    startValue: any,
    endValue: any
  ) {
    try {
      const dataRef = ref(database, path);
      const searchQuery = query(
        dataRef,
        orderByChild(orderBy),
        startAt(startValue),
        endAt(endValue)
      );

      const snapshot = await get(searchQuery);

      if (snapshot.exists()) {
        return {
          success: true,
          data: snapshot.val(),
        };
      } else {
        return {
          success: true,
          data: null,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Specific services for Halora app
export class HaloraDatabaseService {
  // Products
  static async getProducts() {
    return DatabaseService.readData("products");
  }

  static async addProduct(product: any) {
    return DatabaseService.pushData("products", {
      ...product,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  static async updateProduct(productId: string, updates: any) {
    return DatabaseService.updateData(`products/${productId}`, {
      ...updates,
      updatedAt: Date.now(),
    });
  }

  static async deleteProduct(productId: string) {
    return DatabaseService.deleteData(`products/${productId}`);
  }

  // Orders
  static async getOrders() {
    return DatabaseService.readData("orders");
  }

  static async addOrder(order: any) {
    return DatabaseService.pushData("orders", {
      ...order,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  static async updateOrder(orderId: string, updates: any) {
    return DatabaseService.updateData(`orders/${orderId}`, {
      ...updates,
      updatedAt: Date.now(),
    });
  }

  // Users
  static async getUsers() {
    return DatabaseService.readData("users");
  }

  static async addUser(user: any) {
    return DatabaseService.writeData(`users/${user.uid}`, {
      ...user,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  static async updateUser(userId: string, updates: any) {
    return DatabaseService.updateData(`users/${userId}`, {
      ...updates,
      updatedAt: Date.now(),
    });
  }

  // Vouchers
  static async getVouchers() {
    return DatabaseService.readData("vouchers");
  }

  static async addVoucher(voucher: any) {
    return DatabaseService.pushData("vouchers", {
      ...voucher,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  static async updateVoucher(voucherId: string, updates: any) {
    return DatabaseService.updateData(`vouchers/${voucherId}`, {
      ...updates,
      updatedAt: Date.now(),
    });
  }

  static async deleteVoucher(voucherId: string) {
    return DatabaseService.deleteData(`vouchers/${voucherId}`);
  }
}
