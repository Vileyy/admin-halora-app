import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Order } from "../../types/order";
import { Ionicons } from "@expo/vector-icons";

interface OrderCardProps {
  order: Order;
  onPress?: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
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
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng";
      case "vnpay":
        return "VNPay";
      case "zalopay":
        return "ZaloPay";
      default:
        return method;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTotalItems = () => {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(order)}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>#{order.id.slice(-8)}</Text>
          <Text style={styles.customerName}>
            {order.userInfo?.displayName || "Khách hàng"}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(order.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
        </View>
      </View>

      {/* Items Preview */}
      <View style={styles.itemsContainer}>
        {order.items.slice(0, 2).map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Image
              source={{ uri: item.image }}
              style={styles.itemImage}
              defaultSource={require("../../../assets/icon.png")}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemDetails}>
                {item.quantity}x {item.price.toLocaleString("vi-VN")}đ
              </Text>
            </View>
          </View>
        ))}
        {order.items.length > 2 && (
          <Text style={styles.moreItems}>
            +{order.items.length - 2} sản phẩm khác
          </Text>
        )}
      </View>

      {/* Order Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{formatDate(order.createdAt)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="card-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            {getPaymentMethodText(order.paymentMethod)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="cube-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{getTotalItems()} sản phẩm</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalAmount}>
            {order.totalAmount.toLocaleString("vi-VN")}đ
          </Text>
        </View>
        {order.appliedCoupon && (
          <View style={styles.couponContainer}>
            <Ionicons name="pricetag-outline" size={14} color="#4CAF50" />
            <Text style={styles.couponText}>{order.appliedCoupon}</Text>
          </View>
        )}
      </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  customerName: {
    fontSize: 14,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  itemDetails: {
    fontSize: 12,
    color: "#666",
  },
  moreItems: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginTop: 4,
  },
  detailsContainer: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  couponContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  couponText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
    marginLeft: 4,
  },
});

export default OrderCard;
