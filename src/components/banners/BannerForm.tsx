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
} from "react-native";
import { Banner, CreateBannerData, UpdateBannerData } from "../../types/banner";
import { pickAndUploadImage } from "../../services/cloudinary";

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
        <Text style={styles.title}>
          {banner ? "Chỉnh sửa banner" : "Thêm banner mới"}
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tiêu đề banner *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Nhập tiêu đề banner"
              placeholderTextColor="#8F9BB3"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Link (tùy chọn)</Text>
            <TextInput
              style={styles.input}
              value={linkUrl}
              onChangeText={setLinkUrl}
              placeholder="Nhập link (không bắt buộc)"
              placeholderTextColor="#8F9BB3"
              keyboardType="url"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hình ảnh *</Text>
            <TouchableOpacity
              style={styles.imageUpload}
              onPress={handleImageUpload}
              disabled={uploading}
            >
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.previewImage} />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Text style={styles.uploadText}>
                    {uploading ? "Đang tải lên..." : "Chọn hình ảnh"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Trạng thái hoạt động</Text>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: "#E4E6EA", true: "#6C5CE7" }}
                thumbColor={isActive ? "#fff" : "#8F9BB3"}
              />
            </View>
            <Text style={styles.switchDescription}>
              {isActive
                ? "Banner sẽ hiển thị trên ứng dụng"
                : "Banner sẽ bị ẩn"}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={loading || uploading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Đang xử lý..." : banner ? "Cập nhật" : "Tạo mới"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2E3A59",
    marginBottom: 24,
    textAlign: "center",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E3A59",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E4E6EA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2E3A59",
    backgroundColor: "#F7F9FC",
  },
  imageUpload: {
    borderWidth: 2,
    borderColor: "#E4E6EA",
    borderStyle: "dashed",
    borderRadius: 12,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  uploadPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    fontSize: 14,
    color: "#8F9BB3",
    textAlign: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  switchDescription: {
    fontSize: 12,
    color: "#8F9BB3",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F7F9FC",
    borderWidth: 1,
    borderColor: "#E4E6EA",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8F9BB3",
  },
  submitButton: {
    backgroundColor: "#6C5CE7",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
