import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Document, DocumentType, DocumentCategory } from "../../types/document";
import { DocumentService } from "../../services/documentService";

interface DocumentCardProps {
  document: Document;
  onPress?: (document: Document) => void;
  onEdit?: (document: Document) => void;
  onDelete?: (document: Document) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onPress,
  onEdit,
  onDelete,
}) => {
  const getTypeLabel = (type: DocumentType): string => {
    switch (type) {
      case DocumentType.CERTIFICATE:
        return "Chứng chỉ";
      case DocumentType.INSPECTION_CERTIFICATE:
        return "Kiểm định";
      case DocumentType.OTHER:
        return "Khác";
      default:
        return "Khác";
    }
  };

  const getCategoryLabel = (category: DocumentCategory): string => {
    switch (category) {
      case DocumentCategory.PRODUCT_CERTIFICATE:
        return "Chứng chỉ sản phẩm";
      case DocumentCategory.INSPECTION_REPORT:
        return "Báo cáo kiểm định";
      case DocumentCategory.QUALITY_ASSURANCE:
        return "Đảm bảo chất lượng";
      case DocumentCategory.SAFETY_CERTIFICATE:
        return "Giấy kiểm định an toàn mỹ phẩm";
      case DocumentCategory.COMPLIANCE_DOCUMENT:
        return "Tuân thủ và chính sách";
      case DocumentCategory.OTHER:
        return "Khác";
      default:
        return "Khác";
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "Không xác định";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Không xác định";
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Không xác định";
    }
  };

  const handleDownload = async () => {
    try {
      const supported = await Linking.canOpenURL(document.pixeldrainUrl);
      if (supported) {
        await Linking.openURL(document.pixeldrainUrl);
      } else {
        Alert.alert("Lỗi", "Không thể mở file này");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi mở file");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa tài liệu "${document.name}"?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => onDelete?.(document),
        },
      ]
    );
  };

  // Check if file is an image
  const isImage = document.mimeType.startsWith("image/");
  const isPDF = document.mimeType.includes("pdf");

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(document)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {isImage ? (
            <Image
              source={{ uri: document.pixeldrainUrl }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          ) : isPDF ? (
            <Image
              source={{ uri: document.thumbnailUrl }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.fileIcon}>
              {DocumentService.getFileIcon(document.mimeType)}
            </Text>
          )}
        </View>
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {document.name}
          </Text>
          <View style={styles.metaContainer}>
            <Text style={styles.fileSize}>
              {DocumentService.formatFileSize(document.size || 0)}
            </Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.date}>{formatDate(document.uploadedAt)}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDownload}
          >
            <Ionicons name="download-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
          {onEdit && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(document)}
            >
              <Ionicons name="create-outline" size={20} color="#FF9500" />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.tagsContainer}>
        <View style={[styles.tag, styles.typeTag]}>
          <Text style={styles.tagText}>{getTypeLabel(document.type)}</Text>
        </View>
        <View style={[styles.tag, styles.categoryTag]}>
          <Text style={styles.tagText}>
            {getCategoryLabel(document.category)}
          </Text>
        </View>
      </View>

      {document.description && (
        <Text style={styles.description} numberOfLines={2}>
          {document.description}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  fileIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  fileName: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileSize: {
    fontSize: 12,
    color: "#8E8E93",
  },
  separator: {
    fontSize: 12,
    color: "#8E8E93",
    marginHorizontal: 4,
  },
  date: {
    fontSize: 12,
    color: "#8E8E93",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: "row",
    marginTop: 12,
    flexWrap: "wrap",
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  typeTag: {
    backgroundColor: "#E3F2FD",
  },
  categoryTag: {
    backgroundColor: "#F3E5F5",
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  description: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 8,
    lineHeight: 20,
  },
});
