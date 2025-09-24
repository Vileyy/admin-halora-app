import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { RootState, AppDispatch } from "../../redux/store";
import {
  fetchUsersWithFilters,
  fetchUserStats,
  setFilters,
  clearFilters,
  lockUser,
  unlockUser,
} from "../../redux/slices/userSlice";
import { User, UserFilters } from "../../types/user";
import { UserList, UserDetailModal } from "../../components/users";

const UsersScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, userStats, loading, filters } = useSelector(
    (state: RootState) => state.users
  );
  const [showStats, setShowStats] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);

  useEffect(() => {
    dispatch(fetchUsersWithFilters(filters));
    dispatch(fetchUserStats());
  }, [dispatch, filters]);

  const handleRefresh = () => {
    dispatch(fetchUsersWithFilters(filters));
    dispatch(fetchUserStats());
  };

  const handleUserPress = (user: User) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const handleStatusChange = async (
    user: User,
    newStatus: "active" | "inactive" | "banned"
  ) => {
    try {
      if (newStatus === "banned") {
        await dispatch(lockUser(user.uid)).unwrap();
        Alert.alert("Thành công", `Đã khóa tài khoản của ${user.displayName}`, [
          {
            text: "OK",
            onPress: () => {
              setShowUserDetail(false);
              setSelectedUser(null);
            },
          },
        ]);
      } else if (newStatus === "active") {
        await dispatch(unlockUser(user.uid)).unwrap();
        Alert.alert(
          "Thành công",
          `Đã mở khóa tài khoản của ${user.displayName}`,
          [
            {
              text: "OK",
              onPress: () => {
                setShowUserDetail(false);
                setSelectedUser(null);
              },
            },
          ]
        );
      }

      // Refresh user stats after status change
      dispatch(fetchUserStats());
    } catch (error) {
      console.error("Error changing user status:", error);
      Alert.alert(
        "Lỗi",
        "Không thể thay đổi trạng thái người dùng. Vui lòng thử lại.",
        [{ text: "Đóng" }]
      );
    }
  };

  const handleFiltersChange = (newFilters: UserFilters) => {
    dispatch(setFilters(newFilters));
  };

  const renderStatsModal = () => (
    <Modal
      visible={showStats}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Thống kê người dùng</Text>
          <TouchableOpacity onPress={() => setShowStats(false)}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="people" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.statValue}>{userStats?.totalUsers || 0}</Text>
            <Text style={styles.statLabel}>Tổng người dùng</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#2196F3" />
            </View>
            <Text style={styles.statValue}>{userStats?.activeUsers || 0}</Text>
            <Text style={styles.statLabel}>Đang hoạt động</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="person-add" size={24} color="#FF9800" />
            </View>
            <Text style={styles.statValue}>
              {userStats?.newUsersThisMonth || 0}
            </Text>
            <Text style={styles.statLabel}>Mới tháng này</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="bag" size={24} color="#9C27B0" />
            </View>
            <Text style={styles.statValue}>{userStats?.totalOrders || 0}</Text>
            <Text style={styles.statLabel}>Tổng đơn hàng</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="cash" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.statValue}>
              {(userStats?.totalRevenue || 0).toLocaleString("vi-VN")}đ
            </Text>
            <Text style={styles.statLabel}>Tổng doanh thu</Text>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quản lý người dùng</Text>
        <TouchableOpacity
          style={styles.statsButton}
          onPress={() => setShowStats(true)}
        >
          <Ionicons name="stats-chart" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <UserList
        users={users}
        loading={loading}
        onRefresh={handleRefresh}
        onUserPress={handleUserPress}
        onStatusChange={handleStatusChange}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {renderStatsModal()}

      <UserDetailModal
        visible={showUserDetail}
        user={selectedUser}
        onClose={() => {
          setShowUserDetail(false);
          setSelectedUser(null);
        }}
        onStatusChange={handleStatusChange}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  statsButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  statsContainer: {
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});

export default UsersScreen;
