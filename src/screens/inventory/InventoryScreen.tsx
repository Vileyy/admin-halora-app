import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import {
  fetchInventory,
  deleteInventory,
  clearError,
} from "../../redux/slices/inventorySlice";
import { fetchBrands } from "../../redux/slices/brandSlice";
import { InventoryCard } from "../../components/inventory/InventoryCard";
import { InventoryItem } from "../../types/inventory";
import { Ionicons } from "@expo/vector-icons";
import { productStockService } from "../../services/productStockService";

export default function InventoryScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.inventory
  );

  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "available" | "low" | "out"
  >("all");
  const [productStockStats, setProductStockStats] = useState<{
    totalProducts: number;
    outOfStock: number;
    lowStock: number;
    inStock: number;
    productsWithStock?: Array<{
      inventoryId: string;
      productName: string;
      totalStock: number;
      variants: Array<{
        size: string;
        stockQty: number;
      }>;
    }>;
  } | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    dispatch(fetchInventory());
    dispatch(fetchBrands());
    loadProductStockStats();
  }, [dispatch]);

  const loadProductStockStats = async () => {
    try {
      setLoadingStats(true);
      const stats = await productStockService.getStockStatsFromProducts();
      setProductStockStats({
        totalProducts: stats.totalProducts,
        outOfStock: stats.outOfStock,
        lowStock: stats.lowStock,
        inStock: stats.inStock,
        productsWithStock: stats.productsWithStock,
      });
    } catch (error) {
      console.error("Error loading product stock stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Lỗi", error, [
        {
          text: "OK",
          onPress: () => dispatch(clearError()),
        },
      ]);
    }
  }, [error, dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchInventory()),
      dispatch(fetchBrands()),
      loadProductStockStats(),
    ]);
    setRefreshing(false);
  };

  const handleAddInventory = () => {
    (navigation as any).navigate("AddInventory");
  };

  const handleEditInventory = (id: string) => {
    (navigation as any).navigate("EditInventory", { id });
  };

  const handleDeleteInventory = async (id: string) => {
    try {
      await dispatch(deleteInventory(id)).unwrap();
      Alert.alert("Thành công", "Đã xóa sản phẩm khỏi kho");
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể xóa sản phẩm");
    }
  };

  const renderInventoryItem = ({ item }: { item: InventoryItem }) => (
    <InventoryCard
      item={item}
      onEdit={handleEditInventory}
      onDelete={handleDeleteInventory}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>Chưa có sản phẩm nào trong kho</Text>
      <Text style={styles.emptyStateSubtitle}>
        Nhấn nút "+" để thêm sản phẩm mới vào kho
      </Text>
    </View>
  );

  const getItemStockStatus = (item: InventoryItem) => {
    // Sử dụng thống kê từ products nếu có
    if (productStockStats) {
      // Tìm sản phẩm trong danh sách products
      const productStock = productStockStats.productsWithStock?.find(
        (p: any) => p.inventoryId === item.id
      );
      if (productStock) {
        if (productStock.totalStock === 0) return "out";
        if (productStock.totalStock <= 5) return "low";
        return "available";
      }
    }

    // Fallback về logic cũ nếu không có dữ liệu từ products
    const totalStock = item.variants.reduce(
      (total, variant) => total + variant.stockQty,
      0
    );
    if (totalStock === 0) return "out";
    if (totalStock <= 5) return "low";
    return "available";
  };

  const getFilteredItems = () => {
    let filteredItems = [...items]; // Create a copy of the array

    // Filter by status if not "all"
    if (filterStatus !== "all") {
      filteredItems = filteredItems.filter(
        (item) => getItemStockStatus(item) === filterStatus
      );
    }

    // Sort by creation date (newest first)
    return filteredItems.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const getStockStats = () => {
    // Sử dụng thống kê từ products nếu có
    if (productStockStats) {
      return {
        totalProducts: productStockStats.totalProducts,
        outOfStock: productStockStats.outOfStock,
        lowStock: productStockStats.lowStock,
        inStock: productStockStats.inStock,
      };
    }

    // Fallback về logic cũ
    const totalProducts = items.length;
    const outOfStock = items.filter(
      (item) => getItemStockStatus(item) === "out"
    ).length;
    const lowStock = items.filter(
      (item) => getItemStockStatus(item) === "low"
    ).length;
    const inStock = items.filter(
      (item) => getItemStockStatus(item) === "available"
    ).length;

    return { totalProducts, outOfStock, lowStock, inStock };
  };

  const renderHeader = () => {
    const stats = getStockStats();
    return (
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Quản lý kho hàng</Text>
            <Text style={styles.subtitle}>
              Tổng cộng {stats.totalProducts} sản phẩm trong kho
            </Text>
          </View>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleAddInventory}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.filterTitle}>Lọc theo trạng thái:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterStatus === "all" && styles.activeFilterButton,
              ]}
              onPress={() => setFilterStatus("all")}
            >
              <View
                style={[
                  styles.filterIndicator,
                  { backgroundColor: "#8F9BB3" },
                  filterStatus === "all" && styles.activeIndicator,
                ]}
              />
              <Text
                style={[
                  styles.filterText,
                  filterStatus === "all" && styles.activeFilterText,
                ]}
              >
                Tất cả
              </Text>
              <Text
                style={[
                  styles.filterCount,
                  filterStatus === "all" && styles.activeFilterCount,
                ]}
              >
                {stats.totalProducts}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                filterStatus === "available" && styles.activeFilterButton,
              ]}
              onPress={() => setFilterStatus("available")}
            >
              <View
                style={[
                  styles.filterIndicator,
                  { backgroundColor: "#34C759" },
                  filterStatus === "available" && styles.activeIndicator,
                ]}
              />
              <Text
                style={[
                  styles.filterText,
                  filterStatus === "available" && styles.activeFilterText,
                ]}
              >
                Còn hàng
              </Text>
              <Text
                style={[
                  styles.filterCount,
                  filterStatus === "available" && styles.activeFilterCount,
                ]}
              >
                {stats.inStock}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                filterStatus === "low" && styles.activeFilterButton,
              ]}
              onPress={() => setFilterStatus("low")}
            >
              <View
                style={[
                  styles.filterIndicator,
                  { backgroundColor: "#FF9500" },
                  filterStatus === "low" && styles.activeIndicator,
                ]}
              />
              <Text
                style={[
                  styles.filterText,
                  filterStatus === "low" && styles.activeFilterText,
                ]}
              >
                Sắp hết
              </Text>
              <Text
                style={[
                  styles.filterCount,
                  filterStatus === "low" && styles.activeFilterCount,
                ]}
              >
                {stats.lowStock}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                filterStatus === "out" && styles.activeFilterButton,
              ]}
              onPress={() => setFilterStatus("out")}
            >
              <View
                style={[
                  styles.filterIndicator,
                  { backgroundColor: "#FF6B6B" },
                  filterStatus === "out" && styles.activeIndicator,
                ]}
              />
              <Text
                style={[
                  styles.filterText,
                  filterStatus === "out" && styles.activeFilterText,
                ]}
              >
                Hết hàng
              </Text>
              <Text
                style={[
                  styles.filterCount,
                  filterStatus === "out" && styles.activeFilterCount,
                ]}
              >
                {stats.outOfStock}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  };

  if (loading && items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF99CC" />
          <Text style={styles.loadingText}>Đang tải dữ liệu kho...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <FlatList
        data={getFilteredItems()}
        renderItem={renderInventoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#FF99CC"]}
            tintColor="#FF99CC"
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#FF99CC",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2E3A59",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#8F9BB3",
    marginBottom: 16,
  },
  headerButton: {
    backgroundColor: "#FF99CC",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF99CC",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  stockSource: {
    fontSize: 12,
    color: "#6C5CE7",
    fontStyle: "italic",
  },
  statsContainer: {
    marginTop: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E3A59",
    marginBottom: 12,
  },
  filterScrollContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E4E9F2",
    minWidth: 100,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeFilterButton: {
    backgroundColor: "#FF99CC",
    borderColor: "#FF99CC",
    shadowColor: "#FF99CC",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  activeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E3A59",
    marginRight: 6,
  },
  activeFilterText: {
    color: "#fff",
    fontWeight: "700",
  },
  filterCount: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8F9BB3",
    backgroundColor: "#E4E9F2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#D1D9E6",
  },
  activeFilterCount: {
    color: "#FF99CC",
    backgroundColor: "#fff",
  },
  listContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#8F9BB3",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E3A59",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#8F9BB3",
    textAlign: "center",
    lineHeight: 24,
  },
});
