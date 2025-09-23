import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RevenueCard, RevenueChart } from "./index";
import { RevenueStats, DailyRevenue, RevenueRecord } from "../../types/revenue";

interface OverviewTabProps {
  stats: RevenueStats;
  dailyRevenue: DailyRevenue[];
  filteredRecords: RevenueRecord[];
  loading: boolean;
  filter: { month?: number; year?: number };
  onRefresh: () => void;
  onItemPress: (item: RevenueRecord) => void;
  getMonthName: (month: number) => string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  dailyRevenue,
  filteredRecords,
  loading,
  filter,
  onRefresh,
  onItemPress,
  getMonthName,
}) => {
  // Create data structure for FlatList
  const listData = [
    { type: "statsRow1", id: "stats1" },
    { type: "statsRow2", id: "stats2" },
    ...(filter.month && filter.year ? [{ type: "chart", id: "chart" }] : []),
    ...filteredRecords.map((record, index) => ({
      type: "listItem",
      id: record.id,
      data: record,
      index,
    })),
  ];

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case "statsRow1":
        return (
          <View style={styles.statsContainer}>
            <RevenueCard
              title="Tổng doanh thu"
              value={stats.totalRevenue}
              subtitle="Tất cả thời gian"
              icon="cash-outline"
              colors={["#667eea", "#764ba2"]}
            />
            <RevenueCard
              title="Tổng đơn hàng"
              value={stats.totalOrders}
              subtitle="Đơn hoàn thành"
              icon="receipt-outline"
              colors={["#f093fb", "#f5576c"]}
            />
          </View>
        );

      case "statsRow2":
        return (
          <View style={styles.statsContainer}>
            <RevenueCard
              title="Sản phẩm bán"
              value={stats.totalProductsSold}
              subtitle="Tổng số lượng"
              icon="cube-outline"
              colors={["#4facfe", "#00f2fe"]}
            />
            <RevenueCard
              title="TB/Đơn hàng"
              value={
                stats.totalOrders > 0
                  ? Math.round(stats.totalRevenue / stats.totalOrders)
                  : 0
              }
              subtitle="Giá trị trung bình"
              icon="trending-up-outline"
              colors={["#43e97b", "#38f9d7"]}
            />
          </View>
        );

      case "chart":
        return (
          <RevenueChart
            data={dailyRevenue}
            title={`Doanh thu ${getMonthName(filter.month!)} ${filter.year}`}
          />
        );

      case "listItem":
        return renderRevenueItem(item.data, item.index);

      default:
        return null;
    }
  };

  const renderRevenueItem = (item: RevenueRecord, index: number) => {
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

    if (index === 0) {
      return (
        <View style={styles.listHeaderContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              Chi tiết doanh thu ({filteredRecords.length} đơn hàng)
            </Text>
          </View>
          <RevenueItemContent
            item={item}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            getCategoryColor={getCategoryColor}
            onItemPress={onItemPress}
          />
        </View>
      );
    }

    return (
      <RevenueItemContent
        item={item}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
        getCategoryColor={getCategoryColor}
        onItemPress={onItemPress}
      />
    );
  };

  return (
    <FlatList
      style={styles.container}
      data={listData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.contentContainer}
    />
  );
};

// Component for rendering individual revenue items
const RevenueItemContent: React.FC<{
  item: RevenueRecord;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
  getCategoryColor: (category: string) => string;
  onItemPress: (item: RevenueRecord) => void;
}> = ({ item, formatDate, formatCurrency, getCategoryColor, onItemPress }) => {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onItemPress(item)}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    paddingBottom: 32,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  listHeaderContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    margin: 16,
    marginTop: 0,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemContainer: {
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
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
});

export default OverviewTab;
