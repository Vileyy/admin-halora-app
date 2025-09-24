import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Order } from "../../types/order";

interface OrderDetailModalProps {
  visible: boolean;
  order: Order | null;
  onClose: () => void;
  onStatusUpdate?: (orderId: string, status: string) => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  visible,
  order,
  onClose,
  onStatusUpdate,
}) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  if (!order) return null;

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

  const getShippingMethodText = (method: string) => {
    switch (method) {
      case "standard":
        return "Giao hàng tiêu chuẩn";
      case "express":
        return "Giao hàng nhanh";
      default:
        return method;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTotalItems = () => {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  };

  const statusOptions = [
    {
      value: "pending",
      label: "Chờ xử lý",
      color: "#FF9800",
      icon: "time-outline",
    },
    {
      value: "processing",
      label: "Đang xử lý",
      color: "#2196F3",
      icon: "cog-outline",
    },
    {
      value: "shipped",
      label: "Đang giao hàng",
      color: "#9C27B0",
      icon: "car-outline",
    },
    {
      value: "delivered",
      label: "Đã giao hàng",
      color: "#4CAF50",
      icon: "checkmark-done-outline",
    },
    {
      value: "cancelled",
      label: "Đã hủy",
      color: "#F44336",
      icon: "close-circle-outline",
    },
  ];

  const handleStatusSelect = (newStatus: string) => {
    setShowStatusDropdown(false);
    onStatusUpdate?.(order.id, newStatus);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Chi tiết đơn hàng</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Order Info */}
          <View style={styles.section}>
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>#{order.id.slice(-8)}</Text>
                <Text style={styles.orderDate}>
                  {formatDate(order.createdAt)}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(order.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {getStatusText(order.status)}
                </Text>
              </View>
            </View>
          </View>

          {/* Customer Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={20} color="#666" />
              <Text style={styles.infoText}>
                {order.userInfo?.displayName || "Không có tên"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="mail" size={20} color="#666" />
              <Text style={styles.infoText}>
                {order.userInfo?.email || "N/A"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call" size={20} color="#666" />
              <Text style={styles.infoText}>
                {order.userInfo?.phone || "N/A"}
              </Text>
            </View>
            {order.userInfo?.address && (
              <View style={styles.infoRow}>
                <Ionicons name="location" size={20} color="#666" />
                <Text style={styles.infoText}>{order.userInfo.address}</Text>
              </View>
            )}
          </View>

          {/* Order Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Sản phẩm ({getTotalItems()} sản phẩm)
            </Text>
            {order.items.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.itemImage}
                  defaultSource={require("../../../assets/icon.png")}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemQuantity}>
                      Số lượng: {item.quantity}
                    </Text>
                    <Text style={styles.itemPrice}>
                      {item.price.toLocaleString("vi-VN")}đ
                    </Text>
                  </View>
                  {item.variant && (
                    <Text style={styles.itemVariant}>
                      Kích thước: {item.variant.size}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Payment & Shipping */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thanh toán & Giao hàng</Text>
            <View style={styles.infoRow}>
              <Ionicons name="card" size={20} color="#666" />
              <Text style={styles.infoText}>
                {getPaymentMethodText(order.paymentMethod)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="car" size={20} color="#666" />
              <Text style={styles.infoText}>
                {getShippingMethodText(order.shippingMethod)}
              </Text>
            </View>
            {order.appliedCoupon && (
              <View style={styles.infoRow}>
                <Ionicons name="pricetag" size={20} color="#4CAF50" />
                <Text style={[styles.infoText, { color: "#4CAF50" }]}>
                  Mã giảm giá: {order.appliedCoupon}
                </Text>
              </View>
            )}
          </View>

          {/* Order Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tổng kết đơn hàng</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tạm tính:</Text>
              <Text style={styles.summaryValue}>
                {order.itemsSubtotal.toLocaleString("vi-VN")}đ
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
              <Text style={styles.summaryValue}>
                {order.shippingCost.toLocaleString("vi-VN")}đ
              </Text>
            </View>
            {order.discountAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: "#4CAF50" }]}>
                  Giảm giá:
                </Text>
                <Text style={[styles.summaryValue, { color: "#4CAF50" }]}>
                  -{order.discountAmount.toLocaleString("vi-VN")}đ
                </Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Tổng cộng:</Text>
              <Text style={styles.totalValue}>
                {order.totalAmount.toLocaleString("vi-VN")}đ
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thao tác</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <View style={styles.dropdownButtonContent}>
                <Ionicons
                  name={
                    (statusOptions.find((opt) => opt.value === order.status)
                      ?.icon as any) || "help-outline"
                  }
                  size={20}
                  color={
                    statusOptions.find((opt) => opt.value === order.status)
                      ?.color || "#666"
                  }
                />
                <Text style={styles.dropdownButtonText}>
                  {statusOptions.find((opt) => opt.value === order.status)
                    ?.label || order.status}
                </Text>
              </View>
              <Ionicons
                name={showStatusDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>

            {showStatusDropdown && (
              <View style={styles.dropdownMenuInline}>
                <ScrollView
                  showsVerticalScrollIndicator={true}
                  style={{ maxHeight: 200 }}
                  nestedScrollEnabled={true}
                >
                  {statusOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.dropdownItem,
                        order.status === option.value &&
                          styles.dropdownItemActive,
                      ]}
                      onPress={() => handleStatusSelect(option.value)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={option.icon as any}
                        size={20}
                        color={option.color}
                      />
                      <Text
                        style={[
                          styles.dropdownItemText,
                          order.status === option.value &&
                            styles.dropdownItemTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {order.status === option.value && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={option.color}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Timeline */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lịch sử đơn hàng</Text>
            <View style={styles.timeline}>
              <View style={styles.timelineItem}>
                <View
                  style={[styles.timelineDot, { backgroundColor: "#4CAF50" }]}
                />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Đơn hàng được tạo</Text>
                  <Text style={styles.timelineDate}>
                    {formatDate(order.createdAt)}
                  </Text>
                </View>
              </View>
              {order.updatedAt !== order.createdAt && (
                <View style={styles.timelineItem}>
                  <View
                    style={[styles.timelineDot, { backgroundColor: "#2196F3" }]}
                  />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>Cập nhật lần cuối</Text>
                    <Text style={styles.timelineDate}>
                      {formatDate(order.updatedAt)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
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
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
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
  itemContainer: {
    flexDirection: "row",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  itemVariant: {
    fontSize: 12,
    color: "#666",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  timeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 12,
    color: "#666",
  },
  dropdownContainer: {
    position: "relative",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  dropdownButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    marginTop: 4,
    maxHeight: 250,
  },
  dropdownMenuInline: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 8,
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  dropdownItemActive: {
    backgroundColor: "#F8F9FA",
  },
  dropdownItemText: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
  },
  dropdownItemTextActive: {
    fontWeight: "600",
  },
});

export default OrderDetailModal;
