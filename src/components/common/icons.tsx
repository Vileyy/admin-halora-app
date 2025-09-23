import React from "react";
import { View, Text } from "react-native";

interface IconProps {
  size?: number;
  color?: string;
}

interface StarIconProps extends IconProps {
  filled?: boolean;
}

export const DatabaseIcon = ({ size = 24, color = "#666" }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>📊</Text>
  </View>
);

export const TagIcon = ({ size = 24, color = "#666" }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>🏷️</Text>
  </View>
);

export const GridIcon = ({ size = 24, color = "#666" }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>⊞</Text>
  </View>
);

export const FolderIcon = ({ size = 24, color = "#666" }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>📁</Text>
  </View>
);

export const DocumentIcon = ({ size = 24, color = "#666" }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>📄</Text>
  </View>
);

export const UsersIcon = ({ size = 24, color = "#666" }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>👥</Text>
  </View>
);

export const ChartIcon = ({ size = 24, color = "#666" }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>📈</Text>
  </View>
);

export const CameraIcon = ({ size = 24, color = "#666" }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>📷</Text>
  </View>
);

export const NotificationIcon = ({ size = 24, color = "#666" }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>🔔</Text>
  </View>
);

export const StarIcon = ({
  size = 24,
  color = "#666",
  filled = true,
}: StarIconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>{filled ? "★" : "☆"}</Text>
  </View>
);

export const UserIcon = ({ size = 24, color = "#666" }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>👤</Text>
  </View>
);

export const BoxIcon = ({ size = 24, color = "#666" }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>📦</Text>
  </View>
);

export const PlusIcon = ({ size = 24, color = "#fff" }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color, fontWeight: "bold" }}>+</Text>
  </View>
);

export const EnvelopeIcon = ({ size = 24, color = "#666" }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>✉️</Text>
  </View>
);

export const ChevronDownIcon = ({ size = 16, color = "#666" }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>▼</Text>
  </View>
);

export const ChevronRightIcon = ({ size = 16, color = "#666" }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>▶</Text>
  </View>
);

export const SettingsIcon = ({ size = 24, color = "#666" }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>⚙️</Text>
  </View>
);

export const ShoppingCartIcon = ({ size = 24, color = "#666" }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>🛒</Text>
  </View>
);

export const ArrowLeftIcon = ({ size = 24, color = "#666" }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>←</Text>
  </View>
);

export const EditIcon = ({ size = 24, color = "#666" }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>✏️</Text>
  </View>
);

export const TrashIcon = ({ size = 24, color = "#666" }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>🗑️</Text>
  </View>
);
