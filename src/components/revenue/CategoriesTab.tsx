import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { CategoryStats } from "../../types/revenue";

interface CategoriesTabProps {
  categoryStats: CategoryStats[];
  loading: boolean;
}

const { width: screenWidth } = Dimensions.get("window");

const CategoriesTab: React.FC<CategoriesTabProps> = ({
  categoryStats,
  loading,
}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải dữ liệu danh mục...</Text>
      </View>
    );
  }

  if (categoryStats.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có dữ liệu danh mục</Text>
      </View>
    );
  }

  // Prepare bar chart data (revenue by category)
  const revenueChartData = {
    labels: categoryStats.map((category) =>
      category.categoryName.length > 8
        ? category.categoryName.substring(0, 8) + "..."
        : category.categoryName
    ),
    datasets: [
      {
        data: categoryStats.map((category) => category.totalRevenue / 1000), // Convert to thousands
      },
    ],
  };

  // Prepare pie chart data (quantity distribution)
  const quantityPieData = categoryStats.map((category, index) => ({
    name: category.categoryName,
    quantity: category.totalQuantity,
    color: [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E9",
    ][index % 10],
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  }));

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    formatYLabel: (value: string) => `${parseFloat(value)}k`,
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

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      FlashDeals: "⚡",
      new_product: "🆕",
      best_seller: "🔥",
      featured: "⭐",
      sale: "💥",
    };
    return icons[category] || "📦";
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Revenue Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Doanh thu theo Danh mục</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={revenueChartData}
            width={Math.max(screenWidth - 32, categoryStats.length * 80)}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero={true}
            showBarTops={false}
            showValuesOnTopOfBars={false}
            withInnerLines={true}
            segments={4}
            yAxisLabel=""
            yAxisSuffix=""
          />
        </ScrollView>
        <Text style={styles.chartSubtitle}>Đơn vị: nghìn đồng</Text>
      </View>

      {/* Quantity Pie Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Phân bố Số lượng theo Danh mục</Text>
        <PieChart
          data={quantityPieData}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          accessor="quantity"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 10]}
          absolute
        />
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Tổng danh mục</Text>
          <Text style={styles.summaryValue}>{categoryStats.length}</Text>
          <Text style={styles.summarySubtitle}>Danh mục có bán hàng</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Danh mục bán chạy</Text>
          <Text style={styles.summaryValue}>
            {categoryStats.length > 0 ? categoryStats[0].categoryName : "N/A"}
          </Text>
          <Text style={styles.summarySubtitle}>Doanh thu cao nhất</Text>
        </View>
      </View>

      {/* Category List */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>
          Chi tiết danh mục ({categoryStats.length} danh mục)
        </Text>

        {categoryStats.map((category, index) => (
          <View key={index} style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryTitleContainer}>
                <Text style={styles.categoryIcon}>
                  {getCategoryIcon(category.categoryName)}
                </Text>
                <View style={styles.categoryNameContainer}>
                  <Text style={styles.categoryName}>
                    {category.categoryName}
                  </Text>
                  <View
                    style={[
                      styles.categoryBadge,
                      {
                        backgroundColor: getCategoryColor(
                          category.categoryName
                        ),
                      },
                    ]}
                  >
                    <Text style={styles.categoryBadgeText}>#{index + 1}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.categoryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {formatCurrency(category.totalRevenue)}
                </Text>
                <Text style={styles.statLabel}>Doanh thu</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {category.totalQuantity.toLocaleString("vi-VN")}
                </Text>
                <Text style={styles.statLabel}>Số lượng</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {category.totalOrders.toLocaleString("vi-VN")}
                </Text>
                <Text style={styles.statLabel}>Đơn hàng</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {category.productCount.toLocaleString("vi-VN")}
                </Text>
                <Text style={styles.statLabel}>Sản phẩm</Text>
              </View>
            </View>

            {/* Progress bar for revenue percentage */}
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>Tỷ lệ doanh thu</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(
                        (category.totalRevenue /
                          (categoryStats[0]?.totalRevenue || 1)) *
                          100,
                        100
                      )}%`,
                      backgroundColor: getCategoryColor(category.categoryName),
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressPercentage}>
                {Math.round(
                  (category.totalRevenue /
                    (categoryStats[0]?.totalRevenue || 1)) *
                    100
                )}
                %
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartSubtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  summaryTitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    textAlign: "center",
  },
  summarySubtitle: {
    fontSize: 10,
    color: "#999",
    textAlign: "center",
  },
  listContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    margin: 16,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  categoryItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryHeader: {
    marginBottom: 12,
  },
  categoryTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryNameContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
  categoryStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: "#666",
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 10,
    color: "#666",
    textAlign: "right",
  },
});

export default CategoriesTab;
