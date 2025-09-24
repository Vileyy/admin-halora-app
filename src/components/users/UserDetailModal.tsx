import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { User } from "../../types/user";

interface UserDetailModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
  onStatusChange?: (
    user: User,
    newStatus: "active" | "inactive" | "banned"
  ) => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  visible,
  user,
  onClose,
  onStatusChange,
}) => {
  if (!user) return null;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "#4CAF50";
      case "inactive":
        return "#FF9800";
      case "banned":
        return "#F44336";
      default:
        return "#4CAF50";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "inactive":
        return "Không hoạt động";
      case "banned":
        return "Bị cấm";
      default:
        return "Hoạt động";
    }
  };

  const getRoleText = (role?: string) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "user":
        return "Người dùng";
      default:
        return "Người dùng";
    }
  };

  const formatDate = (dateString: string | number) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderCount = () => {
    return user.orders ? Object.keys(user.orders).length : 0;
  };

  const getTotalSpent = () => {
    if (!user.orders) return 0;

    return Object.values(user.orders).reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalAmount;
      }
      return total;
    }, 0);
  };

  const getDeliveredOrders = () => {
    if (!user.orders) return 0;

    return Object.values(user.orders).filter(
      (order) => order.status === "delivered"
    ).length;
  };

  const handleLockUser = () => {
    if (!onStatusChange) return;

    Alert.alert(
      "Khóa tài khoản",
      `Bạn có chắc chắn muốn khóa tài khoản của ${user.displayName}?`,
      [
        { text: "Hủy", style: "cancel" },
        { text: "Khóa", onPress: () => onStatusChange(user, "banned") },
      ]
    );
  };

  const handleUnlockUser = () => {
    if (!onStatusChange) return;

    Alert.alert(
      "Mở khóa tài khoản",
      `Bạn có chắc chắn muốn mở khóa tài khoản của ${user.displayName}?`,
      [
        { text: "Hủy", style: "cancel" },
        { text: "Mở khóa", onPress: () => onStatusChange(user, "active") },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Chi tiết người dùng</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* User Info */}
          <View style={styles.section}>
            <View style={styles.userHeader}>
              <Image
                source={{
                  uri:
                    user.avatar ||
                    user.photoURL ||
                    "https://via.placeholder.com/80",
                }}
                style={styles.avatar}
                defaultSource={require("../../../assets/icon.png")}
              />
              <View style={styles.userInfo}>
                <Text style={styles.displayName}>
                  {user.displayName || "Không có tên"}
                </Text>
                <Text style={styles.email}>{user.email}</Text>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(user.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {getStatusText(user.status)}
                    </Text>
                  </View>
                  <Text style={styles.role}>{getRoleText(user.role)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Contact Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
            <View style={styles.infoRow}>
              <Ionicons name="mail" size={20} color="#666" />
              <Text style={styles.infoText}>{user.email}</Text>
            </View>
            {user.phone && (
              <View style={styles.infoRow}>
                <Ionicons name="call" size={20} color="#666" />
                <Text style={styles.infoText}>{user.phone}</Text>
              </View>
            )}
            {user.dateOfBirth && (
              <View style={styles.infoRow}>
                <Ionicons name="calendar" size={20} color="#666" />
                <Text style={styles.infoText}>{user.dateOfBirth}</Text>
              </View>
            )}
            {user.gender && (
              <View style={styles.infoRow}>
                <Ionicons name="person" size={20} color="#666" />
                <Text style={styles.infoText}>
                  {user.gender === "male" ? "Nam" : "Nữ"}
                </Text>
              </View>
            )}
          </View>

          {/* Address */}
          {user.address && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Địa chỉ</Text>
              <View style={styles.infoRow}>
                <Ionicons name="location" size={20} color="#666" />
                <Text style={styles.infoText}>{user.address}</Text>
              </View>
            </View>
          )}

          {/* Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thống kê</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{getOrderCount()}</Text>
                <Text style={styles.statLabel}>Tổng đơn hàng</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{getDeliveredOrders()}</Text>
                <Text style={styles.statLabel}>Đã giao</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {getTotalSpent().toLocaleString("vi-VN")}đ
                </Text>
                <Text style={styles.statLabel}>Tổng chi tiêu</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {user.cart ? user.cart.length : 0}
                </Text>
                <Text style={styles.statLabel}>Giỏ hàng</Text>
              </View>
            </View>
          </View>

          {/* Account Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color="#666" />
              <Text style={styles.infoText}>
                Tham gia: {formatDate(user.createdAt)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="refresh" size={20} color="#666" />
              <Text style={styles.infoText}>
                Cập nhật: {formatDate(user.updatedAt)}
              </Text>
            </View>
            {user.provider && (
              <View style={styles.infoRow}>
                <Ionicons name="logo-google" size={20} color="#666" />
                <Text style={styles.infoText}>
                  Đăng nhập qua: {user.provider}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          <View style={styles.actionRow}>
            {user.status === "banned" ? (
              <TouchableOpacity
                style={styles.unlockButton}
                onPress={handleUnlockUser}
              >
                <Ionicons name="lock-open" size={20} color="#4CAF50" />
                <Text style={styles.unlockButtonText}>Mở khóa tài khoản</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.lockButton}
                onPress={handleLockUser}
              >
                <Ionicons name="lock-closed" size={20} color="#F44336" />
                <Text style={styles.lockButtonText}>Khóa tài khoản</Text>
              </TouchableOpacity>
            )}
{/* 
            <TouchableOpacity
              style={styles.unlockButton}
              onPress={handleUnlockUser}
            >
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.unlockButtonText}>Mở khóa</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5F5F5",
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  role: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#1A1A1A",
    flex: 1,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  actions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  lockButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#FFEBEE",
    borderWidth: 1,
    borderColor: "#F44336",
    gap: 8,
  },
  lockButtonText: {
    fontSize: 16,
    color: "#F44336",
    fontWeight: "600",
  },
  unlockButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#E8F5E8",
    borderWidth: 1,
    borderColor: "#4CAF50",
    gap: 8,
  },
  unlockButtonText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "600",
  },
});

export default UserDetailModal;
