import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from "react-native";
import { Banner } from "../../types/banner";
import { EditIcon, TrashIcon } from "../common/icons";

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
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: banner.imageUrl }} style={styles.image} />
        <View style={styles.statusBadge}>
          <Text
            style={[
              styles.statusText,
              { color: banner.isActive ? "#00B894" : "#8F9BB3" },
            ]}
          >
            {banner.isActive ? "Hoạt động" : "Tạm dừng"}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {banner.title}
        </Text>
        {banner.linkUrl ? (
          <Text style={styles.linkUrl} numberOfLines={1}>
            Link: {banner.linkUrl}
          </Text>
        ) : (
          <Text style={styles.noLink}>Không có link</Text>
        )}
      </View>

      <View style={styles.actions}>
        <View style={styles.toggleContainer}>
          <Switch
            value={banner.isActive}
            onValueChange={handleToggleActive}
            trackColor={{ false: "#E4E6EA", true: "#6C5CE7" }}
            thumbColor={banner.isActive ? "#fff" : "#8F9BB3"}
          />
        </View>

        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit(banner)}
        >
          <EditIcon size={16} color="#6C5CE7" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <TrashIcon size={16} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    resizeMode: "cover",
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E3A59",
    marginBottom: 4,
  },
  linkUrl: {
    fontSize: 12,
    color: "#6C5CE7",
  },
  noLink: {
    fontSize: 12,
    color: "#8F9BB3",
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleContainer: {
    flex: 1,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: "#F7F9FC",
  },
  deleteButton: {
    backgroundColor: "#FFF5F5",
  },
});
