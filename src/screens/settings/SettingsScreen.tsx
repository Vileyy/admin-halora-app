import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/types";
import { AuthService } from "../../services/auth";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

interface SettingItem {
  id: string;
  title: string;
  icon: string;
  iconFamily: "Ionicons" | "MaterialIcons" | "FontAwesome5";
  color: string;
  onPress: () => void;
  badge?: string;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const currentUser = AuthService.getCurrentUser();

  const handleLogout = async () => {
    setLogoutModalVisible(false);

    const result = await AuthService.signOut();

    if (result.success) {
      // Navigate to login screen
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      });
    } else {
      Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại!");
    }
  };

  const settingSections: SettingSection[] = [
    {
      title: "Quản lý nội dung",
      items: [
        {
          id: "categories",
          title: "Danh mục sản phẩm",
          icon: "grid",
          iconFamily: "Ionicons",
          color: "#10B981",
          onPress: () => navigation.navigate("Categories"),
        },
        {
          id: "brands",
          title: "Thương hiệu",
          icon: "storefront",
          iconFamily: "MaterialIcons",
          color: "#8B5CF6",
          onPress: () => navigation.navigate("Brands"),
        },
        {
          id: "banners",
          title: "Banners quảng cáo",
          icon: "images",
          iconFamily: "Ionicons",
          color: "#F59E0B",
          onPress: () => navigation.navigate("Banners"),
        },
        {
          id: "vouchers",
          title: "Mã giảm giá",
          icon: "ticket-alt",
          iconFamily: "FontAwesome5",
          color: "#EF4444",
          onPress: () => navigation.navigate("Vouchers"),
        },
      ],
    },
    {
      title: "Tương tác",
      items: [
        {
          id: "notifications",
          title: "Thông báo",
          icon: "notifications",
          iconFamily: "Ionicons",
          color: "#3B82F6",
          onPress: () => navigation.navigate("Notifications"),
        },
        {
          id: "reviews",
          title: "Đánh giá sản phẩm",
          icon: "star",
          iconFamily: "Ionicons",
          color: "#F59E0B",
          onPress: () => navigation.navigate("Reviews"),
        },
      ],
    },
    {
      title: "Báo cáo",
      items: [
        {
          id: "revenue",
          title: "Doanh thu",
          icon: "trending-up",
          iconFamily: "Ionicons",
          color: "#10B981",
          onPress: () => navigation.navigate("Revenue"),
        },
      ],
    },
    {
      title: "Tài khoản",
      items: [
        {
          id: "profile",
          title: "Thông tin cá nhân",
          icon: "person",
          iconFamily: "Ionicons",
          color: "#6366F1",
          onPress: () => {
            Alert.alert("Thông tin", "Chức năng đang phát triển");
          },
        },
        {
          id: "security",
          title: "Bảo mật",
          icon: "shield-checkmark",
          iconFamily: "Ionicons",
          color: "#10B981",
          onPress: () => {
            Alert.alert("Bảo mật", "Chức năng đang phát triển");
          },
        },
      ],
    },
  ];

  const renderIcon = (
    iconName: string,
    iconFamily: "Ionicons" | "MaterialIcons" | "FontAwesome5",
    color: string,
    size: number = 24
  ) => {
    switch (iconFamily) {
      case "Ionicons":
        return <Ionicons name={iconName as any} size={size} color={color} />;
      case "MaterialIcons":
        return (
          <MaterialIcons name={iconName as any} size={size} color={color} />
        );
      case "FontAwesome5":
        return (
          <FontAwesome5 name={iconName as any} size={size} color={color} />
        );
      default:
        return <Ionicons name="help" size={size} color={color} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {currentUser?.displayName?.[0]?.toUpperCase() || "A"}
                </Text>
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {currentUser?.displayName || "Admin"}
              </Text>
              <Text style={styles.userEmail}>
                {currentUser?.email || "admin@halora.com"}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingItem,
                    itemIndex === section.items.length - 1 &&
                      styles.settingItemLast,
                  ]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingItemLeft}>
                    <View
                      style={[
                        styles.settingIcon,
                        { backgroundColor: `${item.color}15` },
                      ]}
                    >
                      {renderIcon(item.icon, item.iconFamily, item.color, 22)}
                    </View>
                    <Text style={styles.settingItemTitle}>{item.title}</Text>
                  </View>
                  <View style={styles.settingItemRight}>
                    {item.badge && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#9CA3AF"
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin ứng dụng</Text>
          <View style={styles.sectionContent}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Phiên bản</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={[styles.infoItem, styles.settingItemLast]}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>2024.10.01</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setLogoutModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 Halora Admin. Tất cả quyền được bảo lưu.
          </Text>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <View style={styles.modalIcon}>
                <Ionicons name="log-out-outline" size={32} color="#EF4444" />
              </View>
            </View>
            <Text style={styles.modalTitle}>Xác nhận đăng xuất</Text>
            <Text style={styles.modalMessage}>
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleLogout}
              >
                <Text style={styles.modalButtonTextConfirm}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    flex: 1,
  },
  settingItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
  },
  infoValue: {
    fontSize: 16,
    color: "#6B7280",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "#FEE2E2",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
    marginLeft: 8,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  modalIconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonCancel: {
    backgroundColor: "#F3F4F6",
  },
  modalButtonConfirm: {
    backgroundColor: "#EF4444",
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
