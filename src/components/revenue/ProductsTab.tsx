import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { ProductStats } from "../../types/revenue";

interface ProductsTabProps {
  productStats: ProductStats[];
  loading: boolean;
}

const { width: screenWidth } = Dimensions.get("window");

const ProductsTab: React.FC<ProductsTabProps> = ({ productStats, loading }) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải dữ liệu sản phẩm...</Text>
      </View>
    );
  }

  if (productStats.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có dữ liệu sản phẩm</Text>
      </View>
    );
  }

  // Top 15 products for charts (more data from Firebase)
  const top15Products = productStats.slice(0, 15);

  // Function to shorten product names intelligently
  const shortenProductName = (name: string, maxLength: number = 10): string => {
    if (name.length <= maxLength) return name;

    // Try to find a good breaking point
    const words = name.split(" ");
    if (words.length > 1) {
      // Take first word and add part of second word if space allows
      let result = words[0];
      if (result.length < maxLength - 3) {
        const remainingSpace = maxLength - result.length - 1;
        if (words[1] && words[1].length <= remainingSpace) {
          result += " " + words[1];
        } else if (words[1]) {
          result += " " + words[1].substring(0, remainingSpace - 3) + "...";
        }
      } else if (result.length > maxLength) {
        result = result.substring(0, maxLength - 3) + "...";
      }
      return result;
    }

    // Single word, just truncate
    return name.substring(0, maxLength - 3) + "...";
  };

  // Prepare bar chart data (revenue) - reduce to 8 products for better spacing
  const top8ForChart = top15Products.slice(0, 8);
  const revenueChartData = {
    labels: top8ForChart.map((product) =>
      shortenProductName(product.productName, 12)
    ),
    datasets: [
      {
        data: top8ForChart.map((product) => product.totalRevenue / 1000), // Convert to thousands
      },
    ],
  };

  // Prepare pie chart data (quantity) - top 8 for better visibility
  const top8ForPie = top15Products.slice(0, 8);
  const quantityPieData = top8ForPie.map((product, index) => ({
    name: shortenProductName(product.productName, 14), // Slightly longer for pie chart
    quantity: product.totalQuantity,
    color: [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
    ][index % 8],
    legendFontColor: "#7F7F7F",
    legendFontSize: 11,
  }));

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Revenue Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Top 8 Sản phẩm theo Doanh thu</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={revenueChartData}
            width={Math.max(screenWidth - 32, top8ForChart.length * 60)} // Increase spacing
            height={250} // Increase height for better label visibility
            chartConfig={{
              ...chartConfig,
              barPercentage: 0.5, // Make bars narrower for more spacing
            }}
            style={styles.chart}
            fromZero={true}
            showBarTops={false}
            showValuesOnTopOfBars={true} // Show values on bars
            withInnerLines={true}
            segments={4}
            yAxisLabel=""
            yAxisSuffix="k"
          />
        </ScrollView>
        <Text style={styles.chartSubtitle}>Đơn vị: nghìn đồng</Text>
      </View>

      {/* Quantity Pie Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Top 8 Sản phẩm theo Số lượng</Text>
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

      {/* Product List */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>
          Chi tiết sản phẩm ({productStats.length} sản phẩm)
        </Text>

        {productStats.map((product, index) => (
          <View key={index} style={styles.productItem}>
            <View style={styles.rankContainer}>
              <Text style={styles.rankText}>#{index + 1}</Text>
            </View>

            <View style={styles.productImageContainer}>
              <Image
                source={{ uri: product.productImage }}
                style={styles.productImage}
                resizeMode="cover"
              />
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {product.productName}
              </Text>

              <View style={styles.categoryContainer}>
                <View
                  style={[
                    styles.categoryBadge,
                    {
                      backgroundColor: getCategoryColor(
                        product.productCategory
                      ),
                    },
                  ]}
                >
                  <Text style={styles.categoryText}>
                    {product.productCategory}
                  </Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <Text style={styles.statLabel}>Doanh thu:</Text>
                <Text style={styles.revenueValue}>
                  {formatCurrency(product.totalRevenue)}
                </Text>
              </View>

              <View style={styles.statsRow}>
                <Text style={styles.statLabel}>Số lượng:</Text>
                <Text style={styles.quantityValue}>
                  {product.totalQuantity.toLocaleString("vi-VN")}
                </Text>
              </View>

              <View style={styles.statsRow}>
                <Text style={styles.statLabel}>Đơn hàng:</Text>
                <Text style={styles.orderValue}>
                  {product.totalOrders.toLocaleString("vi-VN")}
                </Text>
              </View>
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
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rankContainer: {
    width: 30,
    alignItems: "center",
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
  },
  productImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f8f9fa",
    marginRight: 12,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productInfo: {
    flex: 1,
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
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  revenueValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2ed573",
  },
  quantityValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#007AFF",
  },
  orderValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ff6b6b",
  },
});

export default ProductsTab;
