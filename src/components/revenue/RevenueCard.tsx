import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface RevenueCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: string[];
  onPress?: () => void;
}

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 16px margin on each side, 16px gap between cards

const RevenueCard: React.FC<RevenueCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  colors,
  onPress,
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      if (
        title.toLowerCase().includes("doanh thu") ||
        title.toLowerCase().includes("revenue")
      ) {
        return `${val.toLocaleString("vi-VN")}đ`;
      }
      return val.toLocaleString("vi-VN");
    }
    return val;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient colors={colors} style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name={icon} size={24} color="white" />
            <Text style={styles.title}>{title}</Text>
          </View>

          <View style={styles.valueContainer}>
            <Text style={styles.value}>{formatValue(value)}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: 120,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 8,
    flex: 1,
  },
  valueContainer: {
    flex: 1,
    justifyContent: "center",
  },
  value: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 10,
  },
});

export default RevenueCard;
