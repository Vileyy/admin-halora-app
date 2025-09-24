import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { User } from "../../types/user";
import { Ionicons } from "@expo/vector-icons";

interface UserCardProps {
  user: User;
  onPress?: (user: User) => void;
  onStatusChange?: (
    user: User,
    newStatus: "active" | "inactive" | "banned"
  ) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onPress,
  onStatusChange,
}) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "#4CAF50";
      case "inactive":
        return "#FF9800";
      case "banned":
        return "#F44336";
      default:
        return "#4CAF50"; // Default to active
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
    return date.toLocaleDateString("vi-VN");
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
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(user)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                user.avatar ||
                user.photoURL ||
                "https://via.placeholder.com/50",
            }}
            style={styles.avatar}
            defaultSource={require("../../../assets/icon.png")}
          />
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(user.status) },
            ]}
          />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.displayName} numberOfLines={1}>
            {user.displayName || "Không có tên"}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {user.email}
          </Text>
          <View style={styles.roleContainer}>
            <Text style={styles.role}>{getRoleText(user.role)}</Text>
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
          </View>
        </View>

        <TouchableOpacity
          style={styles.moreButton}
          onPress={user.status === "banned" ? handleUnlockUser : handleLockUser}
        >
          <Ionicons
            name={user.status === "banned" ? "lock-open" : "lock-closed"}
            size={20}
            color={user.status === "banned" ? "#4CAF50" : "#F44336"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{getOrderCount()}</Text>
          <Text style={styles.statLabel}>Đơn hàng</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {getTotalSpent().toLocaleString("vi-VN")}đ
          </Text>
          <Text style={styles.statLabel}>Đã chi</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatDate(user.createdAt)}</Text>
          <Text style={styles.statLabel}>Tham gia</Text>
        </View>
      </View>

      {user.phone && (
        <View style={styles.contactInfo}>
          <Ionicons name="call" size={16} color="#666" />
          <Text style={styles.phone}>{user.phone}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
  },
  statusIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  role: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  moreButton: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E0E0E0",
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  phone: {
    fontSize: 14,
    color: "#666",
  },
});

export default UserCard;
