import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import {
  fetchBanners,
  deleteBanner,
  updateBanner,
  clearError,
} from "../../redux/slices/bannerSlice";
import { Banner } from "../../types/banner";
import { BannerList } from "../../components/banners";
import { Ionicons } from "@expo/vector-icons";

export default function BannersScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { banners, loading, error } = useSelector(
    (state: RootState) => state.banners
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert("Lỗi", error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchBanners());
    setRefreshing(false);
  };

  const handleEdit = (banner: Banner) => {
    (navigation as any).navigate("EditBanner", { banner });
  };

  const handleDelete = async (bannerId: string) => {
    try {
      await dispatch(deleteBanner(bannerId)).unwrap();
      Alert.alert("Thành công", "Banner đã được xóa");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xóa banner");
    }
  };

  const handleToggleActive = async (bannerId: string, isActive: boolean) => {
    try {
      await dispatch(
        updateBanner({
          id: bannerId,
          data: { isActive },
        })
      ).unwrap();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái banner");
    }
  };

  const handleAddBanner = () => {
    (navigation as any).navigate("AddBanner");
  };

  const activeBanners = banners.filter((banner) => banner.isActive).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.title}>Banners quảng cáo</Text>
            <View style={styles.bannerCount}>
              <Ionicons name="images-outline" size={14} color="#6B7280" />
              <Text style={styles.subtitle}>
                {activeBanners}/{banners.length} đang hoạt động
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddBanner}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <BannerList
          banners={banners}
          loading={loading}
          onRefresh={handleRefresh}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  bannerCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F59E0B",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F59E0B",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  content: {
    flex: 1,
  },
});
