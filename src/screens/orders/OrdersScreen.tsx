import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { RootState, AppDispatch } from "../../redux/store";
import {
  fetchOrdersWithFilters,
  fetchOrderStats,
  setFilters,
  clearFilters,
  updateOrderStatus,
} from "../../redux/slices/orderSlice";
import { Order, OrderFilters } from "../../types/order";
import {
  OrderCard,
  OrderDetailModal,
  OrderSearchFilter,
} from "../../components/orders";

const OrdersScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, stats, filters, loading } = useSelector(
    (state: RootState) => state.orders
  );

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        dispatch(fetchOrdersWithFilters(filters)).unwrap(),
        dispatch(fetchOrderStats()).unwrap(),
      ]);
    } catch (error) {
      console.error("Error loading orders data:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleOrderPress = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleFiltersChange = (newFilters: OrderFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(fetchOrdersWithFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(
      fetchOrdersWithFilters({
        status: "all",
        paymentMethod: "all",
        searchTerm: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      })
    );
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    if (!selectedOrder) return;

    const statusText =
      {
        pending: "Chờ xử lý",
        processing: "Đang xử lý",
        shipped: "Đang giao hàng",
        delivered: "Đã giao hàng",
        cancelled: "Đã hủy",
      }[newStatus] || newStatus;

    Alert.alert(
      "Xác nhận thay đổi trạng thái",
      `Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng thành "${statusText}"?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: async () => {
            try {
              await dispatch(
                updateOrderStatus({
                  userId: selectedOrder.userId,
                  orderId: orderId,
                  status: newStatus as any,
                })
              ).unwrap();

              Alert.alert(
                "Thành công",
                `Đã cập nhật trạng thái đơn hàng thành "${statusText}"`,
                [
                  {
                    text: "OK",
                    onPress: () => {
                      setShowOrderDetail(false);
                      setSelectedOrder(null);
                    },
                  },
                ]
              );

              // Refresh data
              await loadData();
            } catch (error) {
              console.error("Error updating order status:", error);
              Alert.alert(
                "Lỗi",
                "Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.",
                [{ text: "Đóng" }]
              );
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#FF9800";
      case "processing":
        return "#2196F3";
      case "shipped":
        return "#9C27B0";
      case "delivered":
        return "#4CAF50";
      case "cancelled":
        return "#F44336";
      default:
        return "#666";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang giao";
      case "delivered":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const renderStatsCard = (
    title: string,
    value: number,
    color: string,
    icon: string
  ) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Ionicons name={icon as any} size={20} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Search and Filter */}
      <OrderSearchFilter
        onFiltersChange={handleFiltersChange}
        filters={filters}
        ordersCount={orders.length}
      />

      {/* Stats Overview */}
      {stats && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Tổng quan</Text>
          <View style={styles.statsGrid}>
            {renderStatsCard(
              "Tổng đơn hàng",
              stats.totalOrders,
              "#2196F3",
              "receipt-outline"
            )}
            {renderStatsCard(
              "Chờ xử lý",
              stats.pendingOrders,
              "#FF9800",
              "time-outline"
            )}
            {renderStatsCard(
              "Đang giao hàng",
              stats.shippingOrders,
              "#9C27B0",
              "car-outline"
            )}
            {renderStatsCard(
              "Đã giao hàng",
              stats.deliveredOrders,
              "#4CAF50",
              "checkmark-circle-outline"
            )}
          </View>

          {/* Revenue Stats */}
          <View style={styles.revenueContainer}>
            <View style={styles.revenueCard}>
              <View style={styles.revenueHeader}>
                <Ionicons name="trending-up" size={20} color="#4CAF50" />
                <Text style={styles.revenueTitle}>Doanh thu</Text>
              </View>
              <Text style={styles.revenueValue}>
                {stats.totalRevenue.toLocaleString("vi-VN")}đ
              </Text>
            </View>
            <View style={styles.revenueCard}>
              <View style={styles.revenueHeader}>
                <Ionicons name="calculator" size={20} color="#FF9800" />
                <Text style={styles.revenueTitle}>Giá trị TB</Text>
              </View>
              <Text style={styles.revenueValue}>
                {Math.round(stats.averageOrderValue).toLocaleString("vi-VN")}đ
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Quick Status Filters */}
      <View style={styles.quickFiltersContainer}>
        <Text style={styles.quickFiltersTitle}>Lọc nhanh</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[
            { status: "all", label: "Tất cả", color: "#666" },
            { status: "pending", label: "Chờ xử lý", color: "#FF9800" },
            { status: "processing", label: "Đang xử lý", color: "#2196F3" },
            { status: "shipped", label: "Đang giao hàng", color: "#9C27B0" },
            { status: "delivered", label: "Đã giao hàng", color: "#4CAF50" },
            { status: "cancelled", label: "Đã hủy", color: "#F44336" },
          ]}
          keyExtractor={(item) => item.status}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.quickFilterButton,
                {
                  backgroundColor:
                    filters.status === item.status ? item.color : "#F8F9FA",
                },
              ]}
              onPress={() =>
                handleFiltersChange({ ...filters, status: item.status })
              }
            >
              <Text
                style={[
                  styles.quickFilterText,
                  {
                    color:
                      filters.status === item.status ? "#FFFFFF" : item.color,
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.quickFilters}
        />
      </View>

      {/* Orders Header */}
      <View style={styles.ordersHeader}>
        <Text style={styles.ordersTitle}>Danh sách đơn hàng</Text>
        {(filters.status !== "all" ||
          filters.paymentMethod !== "all" ||
          filters.searchTerm) && (
          <TouchableOpacity onPress={handleClearFilters}>
            <Text style={styles.clearFiltersText}>Xóa bộ lọc</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý đơn hàng</Text>
        <TouchableOpacity onPress={handleRefresh} disabled={loading}>
          <Ionicons
            name="refresh"
            size={24}
            color={loading ? "#CCC" : "#007AFF"}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <OrderCard order={item} onPress={handleOrderPress} />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color="#CCC" />
            <Text style={styles.emptyTitle}>Không có đơn hàng</Text>
            <Text style={styles.emptySubtitle}>
              {filters.searchTerm ||
              filters.status !== "all" ||
              filters.paymentMethod !== "all"
                ? "Không tìm thấy đơn hàng phù hợp với bộ lọc"
                : "Chưa có đơn hàng nào trong hệ thống"}
            </Text>
          </View>
        }
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        visible={showOrderDetail}
        order={selectedOrder}
        onClose={() => {
          setShowOrderDetail(false);
          setSelectedOrder(null);
        }}
        onStatusUpdate={handleStatusUpdate}
      />
    </View>
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
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  revenueContainer: {
    flexDirection: "row",
    gap: 12,
  },
  revenueCard: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
  },
  revenueHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  revenueTitle: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
  },
  revenueValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  quickFiltersContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickFiltersTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  quickFilters: {
    paddingRight: 16,
  },
  quickFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  quickFilterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  ordersContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ordersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  ordersTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  clearFiltersText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});

export default OrdersScreen;
