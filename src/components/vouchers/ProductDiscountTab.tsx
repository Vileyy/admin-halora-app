import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Voucher } from "../../types/voucher";
import VoucherCard from "./VoucherCard";

interface ProductDiscountTabProps {
  vouchers: Voucher[];
  loading: boolean;
  onRefresh: () => void;
  onVoucherPress: (voucher: Voucher) => void;
  onToggleStatus: (voucher: Voucher) => void;
  onDeleteVoucher: (voucher: Voucher) => void;
  onAddVoucher: () => void;
}

const ProductDiscountTab: React.FC<ProductDiscountTabProps> = ({
  vouchers,
  loading,
  onRefresh,
  onVoucherPress,
  onToggleStatus,
  onDeleteVoucher,
  onAddVoucher,
}) => {
  const productVouchers = vouchers.filter((v) => v.type === "product");

  const renderStatsHeader = () => {
    const activeCount = productVouchers.filter(
      (v) => v.status === "active"
    ).length;
    const expiredCount = productVouchers.filter(
      (v) => v.status === "expired"
    ).length;
    const totalUsage = productVouchers.reduce(
      (sum, v) => sum + v.usageCount,
      0
    );

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Thống kê mã giảm giá sản phẩm</Text>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: "#f3e5f5" }]}>
            <Ionicons name="pricetag" size={24} color="#6c5ce7" />
            <Text style={styles.statValue}>{productVouchers.length}</Text>
            <Text style={styles.statLabel}>Tổng số</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#e8f5e8" }]}>
            <Ionicons name="checkmark-circle" size={24} color="#2ed573" />
            <Text style={styles.statValue}>{activeCount}</Text>
            <Text style={styles.statLabel}>Đang hoạt động</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#ffebee" }]}>
            <Ionicons name="time" size={24} color="#ff4757" />
            <Text style={styles.statValue}>{expiredCount}</Text>
            <Text style={styles.statLabel}>Hết hạn</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#e3f2fd" }]}>
            <Ionicons name="people" size={24} color="#1976d2" />
            <Text style={styles.statValue}>{totalUsage}</Text>
            <Text style={styles.statLabel}>Lượt dùng</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderVoucherCard = ({ item }: { item: Voucher }) => (
    <VoucherCard
      voucher={item}
      onPress={() => onVoucherPress(item)}
      onToggleStatus={() => onToggleStatus(item)}
      onDelete={() => onDeleteVoucher(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="pricetag-outline" size={64} color="#ccc" />
      </View>
      <Text style={styles.emptyTitle}>Chưa có mã giảm giá sản phẩm</Text>
      <Text style={styles.emptySubtitle}>
        Tạo mã giảm giá đầu tiên để thu hút khách hàng mua sắm
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={onAddVoucher}>
        <Ionicons name="add" size={20} color="white" />
        <Text style={styles.emptyButtonText}>Tạo mã giảm giá</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={productVouchers}
        renderItem={renderVoucherCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        ListHeaderComponent={renderStatsHeader}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        contentContainerStyle={[
          styles.listContent,
          productVouchers.length === 0 && styles.emptyListContent,
        ]}
      />

      {/* Floating Action Button */}
      {productVouchers.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={onAddVoucher}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  listContent: {
    paddingBottom: 80, // Space for FAB
  },
  emptyListContent: {
    flex: 1,
  },
  statsContainer: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6c5ce7",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#6c5ce7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  emptyButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6c5ce7",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#6c5ce7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default ProductDiscountTab;
