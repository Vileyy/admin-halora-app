import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator,
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
import { InventoryCard } from "../../components/inventory/InventoryCard";
import { FloatingActionButton } from "../../components/products/FloatingActionButton";
import { InventoryItem } from "../../types/inventory";

export default function InventoryScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.inventory
  );

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

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
    await dispatch(fetchInventory());
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

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Quản lý kho hàng</Text>
      <Text style={styles.subtitle}>
        Tổng cộng {items.length} sản phẩm trong kho
      </Text>
    </View>
  );

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
        data={items}
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
      <FloatingActionButton onPress={handleAddInventory} />
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
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2E3A59",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#8F9BB3",
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
