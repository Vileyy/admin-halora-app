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
  ActivityIndicator,
} from "react-native";
import { Brand, CreateBrandData, UpdateBrandData } from "../../types/brand";
import { pickAndUploadImage } from "../../services/cloudinary";
import { Ionicons } from "@expo/vector-icons";

interface BrandFormProps {
  brand?: Brand;
  onSubmit: (data: CreateBrandData | UpdateBrandData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function BrandForm({
  brand,
  onSubmit,
  onCancel,
  loading = false,
}: BrandFormProps) {
  const [name, setName] = useState(brand?.name || "");
  const [description, setDescription] = useState(brand?.description || "");
  const [logoUrl, setLogoUrl] = useState(brand?.logoUrl || "");
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async () => {
    try {
      setUploading(true);
      const result = await pickAndUploadImage("halora-brands");
      if (result) {
        setLogoUrl(result);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải lên logo");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên thương hiệu");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập mô tả thương hiệu");
      return;
    }

    if (!logoUrl.trim()) {
      Alert.alert("Lỗi", "Vui lòng chọn logo cho thương hiệu");
      return;
    }

    const formData = {
      name: name.trim(),
      description: description.trim(),
      logoUrl: logoUrl.trim(),
    };

    onSubmit(formData);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên thương hiệu</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="briefcase-outline"
                size={20}
                color="#6B7280"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nhập tên thương hiệu"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mô tả</Text>
            <View style={styles.textAreaWrapper}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#6B7280"
                style={styles.textAreaIcon}
              />
              <TextInput
                style={styles.textArea}
                value={description}
                onChangeText={setDescription}
                placeholder="Nhập mô tả thương hiệu"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Logo Upload */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Logo thương hiệu</Text>
            <TouchableOpacity
              style={styles.imageUpload}
              onPress={handleLogoUpload}
              disabled={uploading}
              activeOpacity={0.8}
            >
              {logoUrl ? (
                <>
                  <Image
                    source={{ uri: logoUrl }}
                    style={styles.previewImage}
                  />
                  <View style={styles.imageOverlay}>
                    <View style={styles.changeImageButton}>
                      <Ionicons name="camera" size={20} color="#FFFFFF" />
                      <Text style={styles.changeImageText}>Đổi logo</Text>
                    </View>
                  </View>
                </>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  {uploading ? (
                    <>
                      <ActivityIndicator size="large" color="#8B5CF6" />
                      <Text style={styles.uploadingText}>Đang tải lên...</Text>
                    </>
                  ) : (
                    <>
                      <View style={styles.uploadIconContainer}>
                        <Ionicons
                          name="cloud-upload-outline"
                          size={48}
                          color="#8B5CF6"
                        />
                      </View>
                      <Text style={styles.uploadText}>Chọn logo</Text>
                      <Text style={styles.uploadSubtext}>
                        Nhấn để chọn logo từ thiết bị
                      </Text>
                    </>
                  )}
                </View>
              )}
            </TouchableOpacity>
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
                  {brand ? "Cập nhật" : "Tạo mới"}
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
  textAreaWrapper: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
  },
  textAreaIcon: {
    marginBottom: 8,
  },
  textArea: {
    fontSize: 16,
    color: "#1F2937",
    minHeight: 100,
    textAlignVertical: "top",
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
    resizeMode: "contain",
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
    backgroundColor: "#8B5CF6",
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
    backgroundColor: "#F5F3FF",
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
    backgroundColor: "#8B5CF6",
    shadowColor: "#8B5CF6",
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
