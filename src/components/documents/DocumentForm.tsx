import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import {
  DocumentType,
  DocumentCategory,
  DocumentUploadRequest,
} from "../../types/document";
import { DocumentService } from "../../services/documentService";

interface DocumentFormProps {
  onSubmit: (uploadRequest: DocumentUploadRequest) => void;
  loading?: boolean;
  uploadProgress?: number;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
  onSubmit,
  loading = false,
  uploadProgress = 0,
}) => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [name, setName] = useState("");
  const [documentType, setDocumentType] = useState<DocumentType>(
    DocumentType.OTHER
  );
  const [documentCategory, setDocumentCategory] = useState<DocumentCategory>(
    DocumentCategory.OTHER
  );
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        // Convert DocumentPicker result to File-like object
        const fileObject = {
          name: file.name || "unknown",
          size: file.size || 0,
          type: file.mimeType || "application/octet-stream",
          uri: file.uri,
        } as any;

        setSelectedFile(fileObject);

        if (!name) {
          setName(file.name || "");
        }
        setError("");
      }
    } catch (error) {
      console.error("Error picking document:", error);
      setError("Có lỗi xảy ra khi chọn file");
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      setError("Vui lòng chọn file để upload");
      return;
    }

    if (!name.trim()) {
      setError("Vui lòng nhập tên tài liệu");
      return;
    }

    const maxSize = 10 * 1024 * 1024 * 1024; // 10GB
    if (selectedFile.size > maxSize) {
      setError("File quá lớn. Kích thước tối đa là 10GB");
      return;
    }

    setError("");

    const uploadRequest: DocumentUploadRequest = {
      file: selectedFile,
      name: name.trim(),
      type: documentType,
      category: documentCategory,
      description: description.trim() || undefined,
    };

    onSubmit(uploadRequest);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) {
      return "📄";
    } else if (mimeType.includes("word") || mimeType.includes("document")) {
      return "📝";
    } else if (mimeType.includes("sheet") || mimeType.includes("excel")) {
      return "📊";
    } else if (mimeType.includes("image")) {
      return "🖼️";
    } else if (
      mimeType.includes("zip") ||
      mimeType.includes("rar") ||
      mimeType.includes("7z")
    ) {
      return "📦";
    } else {
      return "📄";
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* File Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chọn File</Text>
        <TouchableOpacity
          style={styles.fileSelector}
          onPress={handleFileSelect}
          disabled={loading}
        >
          {selectedFile ? (
            <View style={styles.selectedFile}>
              <Text style={styles.fileIcon}>
                {getFileIcon(selectedFile.type)}
              </Text>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {selectedFile.name}
                </Text>
                <Text style={styles.fileSize}>
                  {formatFileSize(selectedFile.size)}
                </Text>
              </View>
              {!loading && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => setSelectedFile(null)}
                >
                  <Ionicons name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.filePlaceholder}>
              <Ionicons name="cloud-upload-outline" size={48} color="#8E8E93" />
              <Text style={styles.placeholderText}>
                {loading ? "Đang upload..." : "Chọn file để upload"}
              </Text>
              <Text style={styles.placeholderSubtext}>
                Hỗ trợ: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, ZIP, RAR, 7Z (Max:
                10GB)
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Progress Bar */}
        {loading && uploadProgress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${uploadProgress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>
              Đang tải lên... {uploadProgress}%
            </Text>
          </View>
        )}
      </View>

      {/* Form Fields */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông Tin Tài Liệu</Text>

        {/* Document Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tên Tài Liệu *</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Nhập tên tài liệu"
            editable={!loading}
          />
        </View>

        {/* Document Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Loại Tài Liệu</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={documentType}
              onValueChange={(value) => setDocumentType(value)}
              enabled={!loading}
              style={styles.picker}
            >
              <Picker.Item label="Chứng chỉ" value={DocumentType.CERTIFICATE} />
              <Picker.Item
                label="Kiểm định"
                value={DocumentType.INSPECTION_CERTIFICATE}
              />
              <Picker.Item label="Khác" value={DocumentType.OTHER} />
            </Picker>
          </View>
        </View>

        {/* Document Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Danh Mục</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={documentCategory}
              onValueChange={(value) => setDocumentCategory(value)}
              enabled={!loading}
              style={styles.picker}
            >
              <Picker.Item
                label="Chứng chỉ sản phẩm"
                value={DocumentCategory.PRODUCT_CERTIFICATE}
              />
              <Picker.Item
                label="Báo cáo kiểm định"
                value={DocumentCategory.INSPECTION_REPORT}
              />
              <Picker.Item
                label="Đảm bảo chất lượng"
                value={DocumentCategory.QUALITY_ASSURANCE}
              />
              <Picker.Item
                label="Giấy kiểm định an toàn mỹ phẩm"
                value={DocumentCategory.SAFETY_CERTIFICATE}
              />
              <Picker.Item
                label="Tuân thủ và chính sách"
                value={DocumentCategory.COMPLIANCE_DOCUMENT}
              />
              <Picker.Item label="Khác" value={DocumentCategory.OTHER} />
            </Picker>
          </View>
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mô Tả</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Mô tả tài liệu (tùy chọn)"
            multiline
            numberOfLines={3}
            editable={!loading}
          />
        </View>
      </View>

      {/* Error Message */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          (!selectedFile || !name.trim() || loading) &&
            styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!selectedFile || !name.trim() || loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>Upload Tài Liệu</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  fileSelector: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#8E8E93",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  selectedFile: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  fileIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 14,
    color: "#8E8E93",
  },
  removeButton: {
    padding: 4,
  },
  filePlaceholder: {
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#8E8E93",
    marginTop: 12,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 16,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E5EA",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF99CC",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1C1C1E",
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
  },
  errorContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    backgroundColor: "#FFEBEE",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FF3B30",
  },
  errorText: {
    fontSize: 14,
    color: "#FF3B30",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF99CC",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  submitButtonDisabled: {
    backgroundColor: "#E5E5EA",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
  },
});
