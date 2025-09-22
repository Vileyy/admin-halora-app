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
} from "react-native";
import { Brand, CreateBrandData, UpdateBrandData } from "../../types/brand";
import { pickAndUploadImage } from "../../services/cloudinary";

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
        <Text style={styles.title}>
          {brand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên thương hiệu *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nhập tên thương hiệu"
              placeholderTextColor="#8F9BB3"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mô tả *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Nhập mô tả thương hiệu"
              placeholderTextColor="#8F9BB3"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Logo *</Text>
            <TouchableOpacity
              style={styles.imageUpload}
              onPress={handleLogoUpload}
              disabled={uploading}
            >
              {logoUrl ? (
                <Image source={{ uri: logoUrl }} style={styles.previewImage} />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Text style={styles.uploadText}>
                    {uploading ? "Đang tải lên..." : "Chọn logo"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
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
              {loading ? "Đang xử lý..." : brand ? "Cập nhật" : "Tạo mới"}
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
  textArea: {
    height: 100,
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
    resizeMode: "contain",
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
