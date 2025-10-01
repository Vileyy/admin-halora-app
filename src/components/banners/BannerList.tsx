import React from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Banner } from "../../types/banner";
import BannerCard from "./BannerCard";
import { Ionicons } from "@expo/vector-icons";

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
      <View style={styles.emptyIconContainer}>
        <Ionicons name="images-outline" size={64} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyText}>Chưa có banner nào</Text>
      <Text style={styles.emptySubtext}>
        Nhấn nút "+" ở góc trên để thêm banner mới
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={banners}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={["#F59E0B"]}
            tintColor="#F59E0B"
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
