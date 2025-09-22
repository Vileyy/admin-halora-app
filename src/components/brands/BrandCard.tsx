import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Brand } from "../../types/brand";
import { EditIcon, TrashIcon } from "../common/icons";

interface BrandCardProps {
  brand: Brand;
  onEdit: (brand: Brand) => void;
  onDelete: (brandId: string) => void;
}

export default function BrandCard({ brand, onEdit, onDelete }: BrandCardProps) {
  const handleDelete = () => {
    Alert.alert(
      "Xóa thương hiệu",
      `Bạn có chắc chắn muốn xóa thương hiệu "${brand.name}"?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => onDelete(brand.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: brand.logoUrl }} style={styles.logo} />
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {brand.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {brand.description}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit(brand)}
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
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: "#F7F9FC",
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E3A59",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: "#8F9BB3",
    lineHeight: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#F7F9FC",
  },
  deleteButton: {
    backgroundColor: "#FFF5F5",
  },
});
