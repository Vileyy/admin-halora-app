import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { DailyRevenue } from "../../types/revenue";

interface RevenueChartProps {
  data: DailyRevenue[];
  title?: string;
}

const { width: screenWidth } = Dimensions.get("window");

const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  title = "Doanh thu theo ngày",
}) => {
  // Prepare chart data
  const chartData = {
    labels: data.slice(0, 15).map((item) => item.day.toString()), // Show first 15 days to avoid crowding
    datasets: [
      {
        data: data.slice(0, 15).map((item) => item.revenue / 1000), // Convert to thousands for better display
      },
    ],
  };

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
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#36a2eb",
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: "#e3e3e3",
      strokeDasharray: "0",
    },
    formatYLabel: (value: string) => `${parseFloat(value)}k`,
    formatXLabel: (value: string) => `${value}`,
  };

  const hasData = data.some((item) => item.revenue > 0);

  if (!hasData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Không có dữ liệu doanh thu</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          data={chartData}
          width={Math.max(screenWidth - 32, data.length * 30)} // Ensure minimum width
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero={true}
          showBarTops={false}
          showValuesOnTopOfBars={false}
          withInnerLines={true}
          segments={4}
        />
      </ScrollView>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#36a2eb" }]} />
          <Text style={styles.legendText}>Doanh thu (nghìn đồng)</Text>
        </View>
      </View>

      {/* Summary statistics */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Tổng doanh thu</Text>
          <Text style={styles.summaryValue}>
            {data
              .reduce((sum, item) => sum + item.revenue, 0)
              .toLocaleString("vi-VN")}
            đ
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Trung bình/ngày</Text>
          <Text style={styles.summaryValue}>
            {Math.round(
              data.reduce((sum, item) => sum + item.revenue, 0) / data.length
            ).toLocaleString("vi-VN")}
            đ
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  title: {
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
  noDataContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e3e3e3",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
});

export default RevenueChart;
