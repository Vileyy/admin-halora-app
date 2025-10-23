import React from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Product } from "../../types/product";
import { ProductCard } from "./ProductCard";
import { Ionicons } from "@expo/vector-icons";

interface ProductListProps {
  products: Product[];
  onProductPress: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (product: Product) => void;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  searchQuery?: string;
  totalCount?: number;
}

const { width } = Dimensions.get("window");

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onProductPress,
  onEditProduct,
  onDeleteProduct,
  loading = false,
  refreshing = false,
  onRefresh,
  onLoadMore,
  hasMore = false,
  searchQuery,
  totalCount,
}) => {
  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <ProductCard
      product={item}
      onPress={onProductPress}
      onEdit={onEditProduct}
      onDelete={onDeleteProduct}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="cube-outline" size={64} color="#c7c7cc" />
      </View>
      <Text style={styles.emptyTitle}>
        {searchQuery ? "Không tìm thấy sản phẩm" : "Chưa có sản phẩm"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? `Không có sản phẩm nào phù hợp với "${searchQuery}"`
          : "Hãy thêm sản phẩm đầu tiên của bạn"}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading || !hasMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#FF99CC" />
        <Text style={styles.footerText}>Đang tải thêm...</Text>
      </View>
    );
  };

  const renderHeader = () => {
    if (!totalCount && products.length === 0) return null;
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Sản phẩm</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>
              {totalCount || products.length}
            </Text>
          </View>
        </View>
        {searchQuery && (
          <Text style={styles.searchResultText}>
            Kết quả tìm kiếm cho: "{searchQuery}"
          </Text>
        )}
      </View>
    );
  };

  if (loading && products.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF99CC" />
        <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
        <Text style={styles.loadingSubtext}>Vui lòng chờ trong giây lát</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[
        styles.container,
        products.length === 0 && styles.emptyContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF99CC", "#FF6B9D"]}
            tintColor="#FF99CC"
            progressBackgroundColor="#fff"
            title="Kéo để làm mới"
            titleColor="#666"
          />
        ) : undefined
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.3}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      ListHeaderComponent={renderHeader}
      ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      getItemLayout={(data, index) => ({
        length: (width - 48) / 2 + 16, // card height + margin
        offset: ((width - 48) / 2 + 16) * Math.floor(index / 2),
        index,
      })}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  emptyContainerStyle: {
    flex: 1,
    justifyContent: "center",
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 0,
    marginBottom: 12,
  },
  itemSeparator: {
    height: 4,
  },
  headerContainer: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: 0.5,
  },
  headerBadge: {
    backgroundColor: "#FF99CC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#FF99CC",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  headerBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  searchResultText: {
    fontSize: 14,
    color: "#8e8e93",
    fontStyle: "italic",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    marginBottom: 24,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#8e8e93",
    textAlign: "center",
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "center",
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#8e8e93",
    textAlign: "center",
  },
  footerLoader: {
    paddingVertical: 24,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: "#8e8e93",
    fontWeight: "500",
  },
});
