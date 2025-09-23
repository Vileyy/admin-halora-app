import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Notification } from "../../types/notification";
import { EditIcon, TrashIcon } from "../common/icons";

interface NotificationCardProps {
  notification: Notification;
  onEdit: (notification: Notification) => void;
  onDelete: (notificationId: string) => void;
  onMarkAsRead: (notificationId: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onEdit,
  onDelete,
  onMarkAsRead,
}) => {
  const handleDelete = () => {
    Alert.alert(
      "Xóa thông báo",
      `Bạn có chắc chắn muốn xóa thông báo "${notification.title}"?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => onDelete(notification.id),
        },
      ]
    );
  };

  const handleMarkAsRead = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, !notification.isRead && styles.unreadContainer]}
      onPress={handleMarkAsRead}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[styles.title, !notification.isRead && styles.unreadTitle]}
            numberOfLines={2}
          >
            {notification.title}
          </Text>
          {notification.important && (
            <View style={styles.importantBadge}>
              <Text style={styles.importantText}>Quan trọng</Text>
            </View>
          )}
        </View>

        <Text style={styles.contentText} numberOfLines={3}>
          {notification.content}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.dateText}>
            {formatDate(notification.createdAt)}
          </Text>
          {!notification.isRead && <View style={styles.unreadDot} />}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit(notification)}
        >
          <EditIcon size={16} color="#6C5CE7" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <TrashIcon size={16} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadContainer: {
    borderLeftWidth: 4,
    borderLeftColor: "#6C5CE7",
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E3A59",
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: "700",
  },
  importantBadge: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  importantText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
  },
  contentText: {
    fontSize: 14,
    color: "#8F9BB3",
    lineHeight: 20,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 12,
    color: "#8F9BB3",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6C5CE7",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#F7F9FC",
  },
  deleteButton: {
    backgroundColor: "#FFF5F5",
  },
});

export default NotificationCard;
