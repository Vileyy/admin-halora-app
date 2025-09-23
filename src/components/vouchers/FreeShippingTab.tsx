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

interface FreeShippingTabProps {
  vouchers: Voucher[];
  loading: boolean;
  onRefresh: () => void;
  onVoucherPress: (voucher: Voucher) => void;
  onToggleStatus: (voucher: Voucher) => void;
  onDeleteVoucher: (voucher: Voucher) => void;
  onAddVoucher: () => void;
}

const FreeShippingTab: React.FC<FreeShippingTabProps> = ({
  vouchers,
  loading,
  onRefresh,
  onVoucherPress,
  onToggleStatus,
  onDeleteVoucher,
  onAddVoucher,
}) => {
  const shippingVouchers = vouchers.filter((v) => v.type === "shipping");

  const renderStatsHeader = () => {
    const activeCount = shippingVouchers.filter(
      (v) => v.status === "active"
    ).length;
    const expiredCount = shippingVouchers.filter(
      (v) => v.status === "expired"
    ).length;
    const totalUsage = shippingVouchers.reduce(
      (sum, v) => sum + v.usageCount,
      0
    );

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>
          Thống kê voucher miễn phí vận chuyển
        </Text>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: "#e8f5e8" }]}>
            <Ionicons name="car" size={24} color="#00B894" />
            <Text style={styles.statValue}>{shippingVouchers.length}</Text>
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
        <Ionicons name="car-outline" size={64} color="#ccc" />
      </View>
      <Text style={styles.emptyTitle}>Chưa có voucher miễn phí vận chuyển</Text>
      <Text style={styles.emptySubtitle}>
        Tạo voucher đầu tiên để hỗ trợ khách hàng tiết kiệm phí vận chuyển
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={onAddVoucher}>
        <Ionicons name="add" size={20} color="white" />
        <Text style={styles.emptyButtonText}>Tạo voucher vận chuyển</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={shippingVouchers}
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
          shippingVouchers.length === 0 && styles.emptyListContent,
        ]}
      />

      {/* Floating Action Button */}
      {shippingVouchers.length > 0 && (
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
    backgroundColor: "#00B894",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#00B894",
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
    backgroundColor: "#00B894",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#00B894",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default FreeShippingTab;
