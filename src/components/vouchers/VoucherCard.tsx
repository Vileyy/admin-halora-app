import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Voucher } from "../../types/voucher";
import {
  formatDiscountDisplay,
  getVoucherStatusColor,
} from "../../services/voucherService";

interface VoucherCardProps {
  voucher: Voucher;
  onPress: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

const { width } = Dimensions.get("window");
const cardWidth = width - 32; // Full width with margins

const VoucherCard: React.FC<VoucherCardProps> = ({
  voucher,
  onPress,
  onToggleStatus,
  onDelete,
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "inactive":
        return "Tạm dừng";
      case "expired":
        return "Hết hạn";
      default:
        return status;
    }
  };

  const isExpired = voucher.status === "expired";
  const isActive = voucher.status === "active";

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { width: cardWidth },
        isExpired && styles.expiredCard,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={voucher.type === "shipping" ? "car" : "pricetag"}
              size={20}
              color={voucher.type === "shipping" ? "#00B894" : "#6c5ce7"}
            />
          </View>
          <View style={styles.codeContainer}>
            <Text style={styles.code}>{voucher.code}</Text>
            <Text style={styles.title} numberOfLines={1}>
              {voucher.title}
            </Text>
          </View>
        </View>
        <View style={styles.rightHeader}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getVoucherStatusColor(voucher.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusText(voucher.status)}
            </Text>
          </View>
        </View>
      </View>

      {/* Discount Info */}
      <View style={styles.discountSection}>
        <View style={styles.discountContainer}>
          <Text style={styles.discountLabel}>Giảm giá</Text>
          <Text
            style={[
              styles.discountValue,
              { color: voucher.type === "shipping" ? "#00B894" : "#6c5ce7" },
            ]}
          >
            {formatDiscountDisplay(voucher)}
          </Text>
        </View>
        <View style={styles.minOrderContainer}>
          <Text style={styles.minOrderLabel}>Đơn tối thiểu</Text>
          <Text style={styles.minOrderValue}>
            {voucher.minOrder.toLocaleString("vi-VN")}đ
          </Text>
        </View>
      </View>

      {/* Usage Progress */}
      <View style={styles.usageSection}>
        <View style={styles.usageHeader}>
          <Text style={styles.usageLabel}>Đã sử dụng</Text>
          <Text style={styles.usageText}>
            {voucher.usageCount}/{voucher.usageLimit}
          </Text>
        </View>
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(
                  (voucher.usageCount / voucher.usageLimit) * 100,
                  100
                )}%`,
                backgroundColor:
                  voucher.type === "shipping" ? "#00B894" : "#6c5ce7",
              },
            ]}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.dateText}>HSD: {formatDate(voucher.endDate)}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={onToggleStatus}
            style={[
              styles.actionButton,
              { backgroundColor: isActive ? "#ffa502" : "#2ed573" },
            ]}
            disabled={isExpired}
          >
            <Ionicons
              name={isActive ? "pause" : "play"}
              size={14}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDelete}
            style={[styles.actionButton, styles.deleteButton]}
          >
            <Ionicons name="trash-outline" size={14} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  expiredCard: {
    opacity: 0.6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  codeContainer: {
    flex: 1,
  },
  code: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    color: "#666",
  },
  rightHeader: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: "white",
    fontWeight: "600",
  },
  discountSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  discountContainer: {
    alignItems: "center",
  },
  discountLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  discountValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  minOrderContainer: {
    alignItems: "center",
  },
  minOrderLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  minOrderValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  usageSection: {
    marginBottom: 16,
  },
  usageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  usageLabel: {
    fontSize: 12,
    color: "#666",
  },
  usageText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  progressContainer: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "#ff4757",
  },
});

export default VoucherCard;
