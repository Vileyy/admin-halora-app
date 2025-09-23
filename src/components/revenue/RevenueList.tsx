import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RevenueRecord } from "../../types/revenue";

interface RevenueListProps {
  data: RevenueRecord[];
  loading: boolean;
  onRefresh: () => void;
  onItemPress?: (item: RevenueRecord) => void;
}

const RevenueList: React.FC<RevenueListProps> = ({
  data,
  loading,
  onRefresh,
  onItemPress,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString("vi-VN")}đ`;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      FlashDeals: "#ff4757",
      new_product: "#2ed573",
      best_seller: "#ffa502",
      featured: "#3742fa",
      sale: "#ff6b6b",
    };
    return colors[category] || "#666";
  };

  const renderItem = ({ item }: { item: RevenueRecord }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onItemPress?.(item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.productImage }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.productName}
          </Text>

          <View style={styles.categoryContainer}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(item.productCategory) },
              ]}
            >
              <Text style={styles.categoryText}>{item.productCategory}</Text>
            </View>
          </View>

          <View style={styles.quantityPriceRow}>
            <Text style={styles.quantity}>SL: {item.quantity}</Text>
            <Text style={styles.unitPrice}>
              {formatCurrency(item.unitPrice)}
            </Text>
          </View>
        </View>

        {/* Order Info */}
        <View style={styles.orderInfo}>
          <Text style={styles.totalPrice}>
            {formatCurrency(item.totalPrice)}
          </Text>

          <Text style={styles.customerName} numberOfLines={1}>
            {item.userInfo.displayName || "Khách hàng"}
          </Text>

          <Text style={styles.orderId} numberOfLines={1}>
            #{item.orderId.slice(-8)}
          </Text>

          <Text style={styles.date}>{formatDate(item.completedAt)}</Text>
        </View>

        {/* Arrow Icon */}
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Không có dữ liệu doanh thu</Text>
      <Text style={styles.emptySubtext}>
        Hãy kiểm tra lại bộ lọc hoặc thử lại sau
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chi tiết doanh thu</Text>
        <Text style={styles.count}>({data.length} đơn hàng)</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={data.length === 0 ? styles.emptyList : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    margin: 16,
    marginBottom: 32, // Extra bottom margin for scroll
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  count: {
    fontSize: 14,
    color: "#666",
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f8f9fa",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  categoryContainer: {
    marginBottom: 6,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    color: "white",
    fontWeight: "500",
  },
  quantityPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantity: {
    fontSize: 12,
    color: "#666",
  },
  unitPrice: {
    fontSize: 12,
    color: "#666",
  },
  orderInfo: {
    alignItems: "flex-end",
    minWidth: 100,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2ed573",
    marginBottom: 4,
  },
  customerName: {
    fontSize: 12,
    color: "#333",
    marginBottom: 2,
    textAlign: "right",
  },
  orderId: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
  },
  date: {
    fontSize: 10,
    color: "#999",
  },
  arrowContainer: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default RevenueList;
