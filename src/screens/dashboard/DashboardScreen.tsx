import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
  DatabaseIcon,
  TagIcon,
  GridIcon,
  FolderIcon,
  DocumentIcon,
  UsersIcon,
  ChartIcon,
  CameraIcon,
  NotificationIcon,
  StarIcon,
  BoxIcon,
  PlusIcon,
  EnvelopeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "../../components/common/icons";

const { width } = Dimensions.get("window");

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  hasSubmenu?: boolean;
  submenu?: SubMenuItem[];
  color?: string;
}

interface SubMenuItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
}

export default function DashboardScreen() {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const navigation = useNavigation();

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleNavigation = (menuId: string, submenuId?: string) => {
    switch (menuId) {
      case "vouchers":
        if (submenuId) {
          console.log("Navigate to voucher submenu:", submenuId);
          // TODO: Navigate to specific voucher screen
        } else {
          console.log("Navigate to vouchers main screen");
          // TODO: Create vouchers main screen
        }
        break;
      case "categories":
        (navigation as any).navigate("Categories");
        break;
      case "brands":
        console.log("Navigate to brands management");
        // TODO: Create brands screen
        break;
      case "revenue":
        console.log("Navigate to revenue management");
        // TODO: Create revenue screen
        break;
      case "banners":
        console.log("Navigate to banner management");
        // TODO: Create banners screen
        break;
      case "notifications":
        console.log("Navigate to notifications management");
        // TODO: Create notifications screen
        break;
      case "reviews":
        console.log("Navigate to reviews management");
        // TODO: Create reviews screen
        break;
      case "warehouse":
        (navigation as any).navigate("Inventory");
        break;
      default:
        console.log("Navigate to:", menuId, submenuId || "");
        break;
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: "vouchers",
      title: "Quản lý voucher",
      icon: <TagIcon size={24} color="#fff" />,
      color: "#00B894",
      hasSubmenu: true,
      submenu: [
        { id: "shipping-vouchers", title: "Voucher phí vận chuyển" },
        { id: "discount-vouchers", title: "Mã giảm giá sản phẩm" },
      ],
    },
    {
      id: "categories",
      title: "Quản lý danh mục",
      icon: <GridIcon size={24} color="#fff" />,
      color: "#FDCB6E",
    },
    {
      id: "brands",
      title: "Quản lý thương hiệu",
      icon: <FolderIcon size={24} color="#fff" />,
      color: "#E84393",
    },
    {
      id: "revenue",
      title: "Quản lý doanh thu",
      icon: <ChartIcon size={24} color="#fff" />,
      color: "#A29BFE",
    },
    {
      id: "banners",
      title: "Quản lý banner",
      icon: <CameraIcon size={24} color="#fff" />,
      color: "#FD79A8",
    },
    {
      id: "notifications",
      title: "Quản lý thông báo",
      icon: <NotificationIcon size={24} color="#fff" />,
      color: "#FFA500",
    },
    {
      id: "reviews",
      title: "Quản lý đánh giá",
      icon: <StarIcon size={24} color="#fff" />,
      color: "#2D3436",
    },
    {
      id: "warehouse",
      title: "Quản lý kho",
      icon: <BoxIcon size={24} color="#fff" />,
      color: "#636E72",
    },
  ];

  const renderMenuItem = (item: MenuItem) => {
    const isExpanded = expandedMenus.includes(item.id);

    return (
      <View key={item.id} style={styles.menuItemContainer}>
        <TouchableOpacity
          style={[
            styles.menuItem,
            { backgroundColor: item.color || "#6C5CE7" },
          ]}
          onPress={() =>
            item.hasSubmenu ? toggleMenu(item.id) : handleNavigation(item.id)
          }
          activeOpacity={0.8}
        >
          <View style={styles.menuItemContent}>
            <View style={styles.iconContainer}>{item.icon}</View>
            <View style={styles.textContainer}>
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            {item.hasSubmenu && (
              <View style={styles.chevronContainer}>
                {isExpanded ? (
                  <ChevronDownIcon size={18} color="rgba(255,255,255,0.8)" />
                ) : (
                  <ChevronRightIcon size={18} color="rgba(255,255,255,0.8)" />
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>

        {item.hasSubmenu && isExpanded && item.submenu && (
          <View style={styles.submenu}>
            {item.submenu.map((subItem, index) => (
              <TouchableOpacity
                key={subItem.id}
                style={[
                  styles.submenuItem,
                  index === item.submenu!.length - 1 && styles.submenuItemLast,
                ]}
                onPress={() => handleNavigation(item.id, subItem.id)}
                activeOpacity={0.7}
              >
                <View style={styles.submenuItemContent}>
                  {subItem.icon && (
                    <View style={styles.submenuIcon}>{subItem.icon}</View>
                  )}
                  <Text style={styles.submenuText}>{subItem.title}</Text>
                </View>
                <ChevronRightIcon size={14} color="#8F9BB3" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header with gradient background */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>D</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>Xin chào! 👋</Text>
              <Text style={styles.userName}>Doãn Quốc Hiếu</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.messageButton}>
              <EnvelopeIcon size={22} color="#6C5CE7" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickCreateButton}>
              <PlusIcon size={18} color="#fff" />
              <Text style={styles.quickCreateText}>Tạo mới</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Bảng điều khiển</Text>
          <Text style={styles.sectionSubtitle}>
            Quản lý toàn bộ hệ thống của bạn
          </Text>
        </View>

        <View style={styles.menuGrid}>{menuItems.map(renderMenuItem)}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#6C5CE7",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6C5CE7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#6C5CE7",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: "#8F9BB3",
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E3A59",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F7F9FC",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B6B",
  },
  quickCreateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6C5CE7",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 22,
    shadowColor: "#6C5CE7",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  quickCreateText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2E3A59",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#8F9BB3",
  },
  menuGrid: {
    paddingHorizontal: 24,
  },
  menuItemContainer: {
    marginBottom: 16,
  },
  menuItem: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
  },
  chevronContainer: {
    padding: 4,
  },
  submenu: {
    backgroundColor: "#fff",
    marginTop: 4,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  submenuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F4",
  },
  submenuItemLast: {
    borderBottomWidth: 0,
  },
  submenuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  submenuIcon: {
    marginRight: 12,
  },
  submenuText: {
    fontSize: 15,
    color: "#2E3A59",
    fontWeight: "500",
    flex: 1,
  },
});
