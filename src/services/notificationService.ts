import { database } from "./firebase";
import { ref, get, push, update, remove } from "firebase/database";
import {
  Notification,
  CreateNotificationData,
  UpdateNotificationData,
} from "../types/notification";

const NOTIFICATIONS_REF = "notifications";

export const notificationService = {
  // Lấy tất cả notifications
  async getAllNotifications(): Promise<Notification[]> {
    try {
      const notificationsRef = ref(database, NOTIFICATIONS_REF);
      const snapshot = await get(notificationsRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // Lấy notification theo ID
  async getNotificationById(id: string): Promise<Notification | null> {
    try {
      const notificationRef = ref(database, `${NOTIFICATIONS_REF}/${id}`);
      const snapshot = await get(notificationRef);

      if (snapshot.exists()) {
        return {
          id,
          ...snapshot.val(),
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching notification:", error);
      throw error;
    }
  },

  // Tạo notification mới
  async createNotification(
    notificationData: CreateNotificationData
  ): Promise<string> {
    try {
      const notificationsRef = ref(database, NOTIFICATIONS_REF);
      const now = new Date().toISOString();
      const newNotificationRef = await push(notificationsRef, {
        ...notificationData,
        isRead: false,
        createdAt: now,
        updatedAt: now,
      });

      return newNotificationRef.key!;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },

  // Cập nhật notification
  async updateNotification(
    id: string,
    notificationData: UpdateNotificationData
  ): Promise<void> {
    try {
      const notificationRef = ref(database, `${NOTIFICATIONS_REF}/${id}`);
      await update(notificationRef, {
        ...notificationData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating notification:", error);
      throw error;
    }
  },

  // Xóa notification
  async deleteNotification(id: string): Promise<void> {
    try {
      const notificationRef = ref(database, `${NOTIFICATIONS_REF}/${id}`);
      await remove(notificationRef);
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  // Đánh dấu notification là đã đọc
  async markAsRead(id: string): Promise<void> {
    try {
      const notificationRef = ref(database, `${NOTIFICATIONS_REF}/${id}`);
      await update(notificationRef, {
        isRead: true,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  // Đánh dấu tất cả notifications là đã đọc
  async markAllAsRead(): Promise<void> {
    try {
      const notifications = await this.getAllNotifications();
      const unreadNotifications = notifications.filter((n) => !n.isRead);

      const updatePromises = unreadNotifications.map((notification) =>
        this.markAsRead(notification.id)
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },
};
