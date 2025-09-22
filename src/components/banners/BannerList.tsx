import React from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Banner } from "../../types/banner";
import BannerCard from "./BannerCard";

interface BannerListProps {
  banners: Banner[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (banner: Banner) => void;
  onDelete: (bannerId: string) => void;
  onToggleActive: (bannerId: string, isActive: boolean) => void;
}

export default function BannerList({
  banners,
  loading,
  onRefresh,
  onEdit,
  onDelete,
  onToggleActive,
}: BannerListProps) {
  const renderBanner = ({ item }: { item: Banner }) => (
    <BannerCard
      banner={item}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleActive={onToggleActive}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Chưa có banner nào</Text>
      <Text style={styles.emptySubtext}>Nhấn nút "+" để thêm banner mới</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={banners}
        renderItem={renderBanner}
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
