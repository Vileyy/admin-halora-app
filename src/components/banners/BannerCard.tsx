import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Banner } from "../../types/banner";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

interface BannerCardProps {
  banner: Banner;
  onEdit: (banner: Banner) => void;
  onDelete: (bannerId: string) => void;
  onToggleActive: (bannerId: string, isActive: boolean) => void;
}

export default function BannerCard({
  banner,
  onEdit,
  onDelete,
  onToggleActive,
}: BannerCardProps) {
  const handleDelete = () => {
    Alert.alert(
      "Xóa banner",
      `Bạn có chắc chắn muốn xóa banner "${banner.title}"?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => onDelete(banner.id),
        },
      ]
    );
  };

  const handleToggleActive = (value: boolean) => {
    onToggleActive(banner.id, value);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={() => onEdit(banner)}
    >
      <View style={styles.card}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: banner.imageUrl }} style={styles.image} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.gradient}
          />
          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              banner.isActive ? styles.statusActive : styles.statusInactive,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: banner.isActive ? "#10B981" : "#9CA3AF" },
              ]}
            />
            <Text style={styles.statusText}>
              {banner.isActive ? "Hoạt động" : "Tạm dừng"}
            </Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {banner.title}
          </Text>
          {banner.linkUrl ? (
            <View style={styles.linkContainer}>
              <Ionicons name="link-outline" size={12} color="#F59E0B" />
              <Text style={styles.linkUrl} numberOfLines={1}>
                Link
              </Text>
            </View>
          ) : (
            <Text style={styles.noLink}>Không có link</Text>
          )}
        </View>

        {/* Action Section */}
        <View style={styles.actions}>
          <View style={styles.toggleContainer}>
            <Switch
              value={banner.isActive}
              onValueChange={handleToggleActive}
              trackColor={{ false: "#E5E7EB", true: "#F59E0B" }}
              thumbColor="#FFFFFF"
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={(e) => {
                e.stopPropagation();
                onEdit(banner);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={16} color="#F59E0B" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    width: "100%",
    height: 120,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusActive: {
    backgroundColor: "rgba(236, 253, 245, 0.95)",
  },
  statusInactive: {
    backgroundColor: "rgba(243, 244, 246, 0.95)",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
  },
  content: {
    padding: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 6,
    minHeight: 36,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  linkUrl: {
    fontSize: 12,
    color: "#F59E0B",
    fontWeight: "500",
  },
  noLink: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 12,
    justifyContent: "space-between",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 6,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: "#FEF3C7",
    borderColor: "#FDE68A",
  },
  deleteButton: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FEE2E2",
  },
});
