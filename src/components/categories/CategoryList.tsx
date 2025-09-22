import React from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Category } from "../../types/category";
import CategoryCard from "./CategoryCard";

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
      <Text style={styles.emptyText}>Chưa có danh mục nào</Text>
      <Text style={styles.emptySubtext}>Nhấn nút "+" để thêm danh mục mới</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
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
