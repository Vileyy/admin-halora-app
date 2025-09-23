import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Notification } from "../../types/notification";
import NotificationCard from "./NotificationCard";

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (notification: Notification) => void;
  onDelete: (notificationId: string) => void;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  unreadCount: number;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  loading,
  onRefresh,
  onEdit,
  onDelete,
  onMarkAsRead,
  onMarkAllAsRead,
  unreadCount,
}) => {
  const renderNotification = ({ item }: { item: Notification }) => (
    <NotificationCard
      notification={item}
      onEdit={onEdit}
      onDelete={onDelete}
      onMarkAsRead={onMarkAsRead}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Chưa có thông báo nào</Text>
      <Text style={styles.emptySubtext}>
        Nhấn nút "+" để thêm thông báo mới
      </Text>
    </View>
  );

  const renderHeader = () => {
    if (unreadCount > 0) {
      return (
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            {unreadCount} thông báo chưa đọc
          </Text>
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={onMarkAllAsRead}
          >
            <Text style={styles.markAllText}>Đánh dấu tất cả đã đọc</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={["#6C5CE7"]}
            tintColor="#6C5CE7"
          />
        }
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={renderHeader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  headerContainer: {
    backgroundColor: "#F7F9FC",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6C5CE7",
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#6C5CE7",
    borderRadius: 16,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8F9BB3",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8F9BB3",
    textAlign: "center",
  },
});

export default NotificationList;
