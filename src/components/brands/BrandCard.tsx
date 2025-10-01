import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Brand } from "../../types/brand";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

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
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={() => onEdit(brand)}
    >
      <View style={styles.card}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image source={{ uri: brand.logoUrl }} style={styles.logo} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={styles.gradient}
          />
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {brand.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {brand.description}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={(e) => {
              e.stopPropagation();
              onEdit(brand);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={18} color="#8B5CF6" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
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
  logoContainer: {
    width: "100%",
    height: 140,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  logo: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  content: {
    padding: 12,
    paddingBottom: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
    minHeight: 32,
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: "#F5F3FF",
    borderColor: "#E9D5FF",
  },
  deleteButton: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FEE2E2",
  },
});
