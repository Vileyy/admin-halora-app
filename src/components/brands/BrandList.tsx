import React from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Brand } from "../../types/brand";
import BrandCard from "./BrandCard";

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
      <Text style={styles.emptyText}>Chưa có thương hiệu nào</Text>
      <Text style={styles.emptySubtext}>
        Nhấn nút "+" để thêm thương hiệu mới
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={brands}
        renderItem={renderBrand}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={["#6C5CE7"]}
            tintColor="#6C5CE7"
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8F9BB3",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8F9BB3",
    textAlign: "center",
  },
});
