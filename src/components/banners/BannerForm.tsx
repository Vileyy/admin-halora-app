import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Switch,
  ActivityIndicator,
} from "react-native";
import { Banner, CreateBannerData, UpdateBannerData } from "../../types/banner";
import { pickAndUploadImage } from "../../services/cloudinary";
import { Ionicons } from "@expo/vector-icons";

interface BannerFormProps {
  banner?: Banner;
  onSubmit: (data: CreateBannerData | UpdateBannerData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function BannerForm({
  banner,
  onSubmit,
  onCancel,
  loading = false,
}: BannerFormProps) {
  const [title, setTitle] = useState(banner?.title || "");
  const [imageUrl, setImageUrl] = useState(banner?.imageUrl || "");
  const [linkUrl, setLinkUrl] = useState(banner?.linkUrl || "");
  const [isActive, setIsActive] = useState(banner?.isActive ?? true);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async () => {
    try {
      setUploading(true);
      const result = await pickAndUploadImage("halora-banners");
      if (result) {
        setImageUrl(result);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải lên hình ảnh");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tiêu đề banner");
      return;
    }

    if (!imageUrl.trim()) {
      Alert.alert("Lỗi", "Vui lòng chọn hình ảnh cho banner");
      return;
    }

    const formData = {
      title: title.trim(),
      imageUrl: imageUrl.trim(),
      linkUrl: linkUrl.trim(),
      isActive,
    };

    onSubmit(formData);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.form}>
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tiêu đề banner</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="text-outline"
                size={20}
                color="#6B7280"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Nhập tiêu đề banner"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Link Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Link (tùy chọn)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="link-outline"
                size={20}
                color="#6B7280"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={linkUrl}
                onChangeText={setLinkUrl}
                placeholder="Nhập link (không bắt buộc)"
                placeholderTextColor="#9CA3AF"
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Image Upload */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hình ảnh banner</Text>
            <TouchableOpacity
              style={styles.imageUpload}
              onPress={handleImageUpload}
              disabled={uploading}
              activeOpacity={0.8}
            >
              {imageUrl ? (
                <>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.previewImage}
                  />
                  <View style={styles.imageOverlay}>
                    <View style={styles.changeImageButton}>
                      <Ionicons name="camera" size={20} color="#FFFFFF" />
                      <Text style={styles.changeImageText}>Đổi ảnh</Text>
                    </View>
                  </View>
                </>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  {uploading ? (
                    <>
                      <ActivityIndicator size="large" color="#F59E0B" />
                      <Text style={styles.uploadingText}>Đang tải lên...</Text>
                    </>
                  ) : (
                    <>
                      <View style={styles.uploadIconContainer}>
                        <Ionicons
                          name="cloud-upload-outline"
                          size={48}
                          color="#F59E0B"
                        />
                      </View>
                      <Text style={styles.uploadText}>Chọn hình ảnh</Text>
                      <Text style={styles.uploadSubtext}>
                        Nhấn để chọn ảnh từ thiết bị
                      </Text>
                    </>
                  )}
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Active Status Switch */}
          <View style={styles.inputGroup}>
            <View style={styles.switchContainer}>
              <View style={styles.switchLabel}>
                <Ionicons name="power-outline" size={20} color="#6B7280" />
                <Text style={styles.label}>Trạng thái hoạt động</Text>
              </View>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: "#E5E7EB", true: "#F59E0B" }}
                thumbColor="#FFFFFF"
              />
            </View>
            <Text style={styles.switchDescription}>
              {isActive
                ? "Banner sẽ hiển thị trên ứng dụng"
                : "Banner sẽ bị ẩn khỏi ứng dụng"}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Ionicons name="close-outline" size={20} color="#6B7280" />
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              (loading || uploading) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading || uploading}
            activeOpacity={0.8}
          >
            {loading ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Đang xử lý...</Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-outline" size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>
                  {banner ? "Cập nhật" : "Tạo mới"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 20,
  },
  form: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1F2937",
  },
  imageUpload: {
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
    borderRadius: 16,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.8,
  },
  changeImageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F59E0B",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  changeImageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  uploadPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  uploadIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  uploadingText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 12,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  switchLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  switchDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  submitButton: {
    backgroundColor: "#F59E0B",
    shadowColor: "#F59E0B",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
