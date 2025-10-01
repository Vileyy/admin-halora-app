import React from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Brand } from "../../types/brand";
import BrandCard from "./BrandCard";
import { Ionicons } from "@expo/vector-icons";

interface BrandListProps {
  brands: Brand[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (brand: Brand) => void;
  onDelete: (brandId: string) => void;
}

export default function BrandList({
  brands,
  loading,
  onRefresh,
  onEdit,
  onDelete,
}: BrandListProps) {
  const renderBrand = ({ item }: { item: Brand }) => (
    <BrandCard brand={item} onEdit={onEdit} onDelete={onDelete} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="briefcase-outline" size={64} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyText}>Chưa có thương hiệu nào</Text>
      <Text style={styles.emptySubtext}>
        Nhấn nút "+" ở góc trên để thêm thương hiệu mới
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={brands}
        renderItem={renderBrand}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={["#8B5CF6"]}
            tintColor="#8B5CF6"
          />
        }
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: "space-between",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
  },
});
