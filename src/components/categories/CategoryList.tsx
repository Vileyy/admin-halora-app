import React from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Category } from "../../types/category";
import CategoryCard from "./CategoryCard";
import { Ionicons } from "@expo/vector-icons";

interface CategoryListProps {
  categories: Category[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

export default function CategoryList({
  categories,
  loading,
  onRefresh,
  onEdit,
  onDelete,
}: CategoryListProps) {
  const renderCategory = ({ item }: { item: Category }) => (
    <CategoryCard category={item} onEdit={onEdit} onDelete={onDelete} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="grid-outline" size={64} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyText}>Chưa có danh mục nào</Text>
      <Text style={styles.emptySubtext}>
        Nhấn nút "+" ở góc trên để thêm danh mục mới
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={["#10B981"]}
            tintColor="#10B981"
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
