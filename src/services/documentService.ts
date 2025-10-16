import {
  Document,
  DocumentUploadRequest,
  DocumentType,
  DocumentCategory,
} from "../types/document";
import { HaloraDatabaseService } from "./database";

export class DocumentService {
  private static readonly PIXELDRAIN_API_KEY =
    "59ab6725-fa94-4db3-98e3-b0ecb436deb9";
  private static readonly PIXELDRAIN_BASE_URL = "https://pixeldrain.com/api";
  private static readonly PIXELDRAIN_UPLOAD_URL =
    "https://pixeldrain.com/api/file";
  private static readonly PIXELDRAIN_DOWNLOAD_URL =
    "https://pixeldrain.com/api/file";

  // Upload file to Pixeldrain (Web version)
  static async uploadFile(file: File): Promise<{
    success: boolean;
    data?: { id: string; url: string };
    error?: string;
  }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(this.PIXELDRAIN_UPLOAD_URL, {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(this.PIXELDRAIN_API_KEY + ":")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          data: {
            id: result.id,
            url: `${this.PIXELDRAIN_DOWNLOAD_URL}/${result.id}`,
          },
        };
      } else {
        return {
          success: false,
          error: result.message || "Upload failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Upload file to Pixeldrain (React Native version)
  static async uploadFileRN(file: any): Promise<{
    success: boolean;
    data?: { id: string; url: string };
    error?: string;
  }> {
    try {
      // Validate file object
      if (!file) {
        return {
          success: false,
          error: "No file provided",
        };
      }

      if (!file.uri) {
        return {
          success: false,
          error: "File URI is missing",
        };
      }

      // Create FormData for React Native
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: file.type || "application/octet-stream",
        name: file.name,
      } as any);

      // Thêm tên file nếu có (optional)
      if (file.name) {
        formData.append("name", file.name);
      }

      // Format giống Next.js - dấu ":" ở ĐẦU
      const authHeader = `Basic ${btoa(`:${this.PIXELDRAIN_API_KEY}`)}`;

      const response = await fetch(this.PIXELDRAIN_UPLOAD_URL, {
        method: "POST",
        headers: {
          Authorization: authHeader,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Pixeldrain upload failed (${response.status}): ${
            response.statusText
          }${errorText ? ` - ${errorText}` : ""}`
        );
      }

      const result = await response.json();

      // Pixeldrain trả về { id: "xxx" }
      if (result.id) {
        return {
          success: true,
          data: {
            id: result.id,
            url: `${this.PIXELDRAIN_DOWNLOAD_URL}/${result.id}`,
          },
        };
      } else {
        return {
          success: false,
          error: result.message || result.error || "No file ID returned",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Upload document with metadata
  static async uploadDocument(uploadRequest: DocumentUploadRequest): Promise<{
    success: boolean;
    document?: Document;
    error?: string;
  }> {
    try {
      // Upload file to Pixeldrain
      const uploadResult = await this.uploadFileRN(uploadRequest.file);

      if (!uploadResult.success || !uploadResult.data) {
        return {
          success: false,
          error: uploadResult.error || "File upload failed",
        };
      }

      // Create document metadata
      const now = new Date().toISOString();
      const document: Document = {
        id: uploadResult.data.id,
        name: uploadRequest.name,
        type: uploadRequest.type,
        category: uploadRequest.category,
        description: uploadRequest.description,
        isActive: true,
        lastModified: now,
        mimeType: uploadRequest.file.type || "application/octet-stream",
        pixeldrainId: uploadResult.data.id,
        pixeldrainUrl: uploadResult.data.url,
        size: uploadRequest.file.size || 0,
        thumbnailUrl: `${this.PIXELDRAIN_BASE_URL}/file/${uploadResult.data.id}/thumbnail?width=128&height=128`,
        uploadedAt: now,
        uploadedBy: "current-user-id", // This should be replaced with actual user ID
      };

      // Save document metadata to database
      const dbResult = await HaloraDatabaseService.addDocument(document);

      if (dbResult.success) {
        return {
          success: true,
          document,
        };
      } else {
        return {
          success: false,
          error: dbResult.error || "Failed to save document metadata",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Get all documents
  static async getAllDocuments(): Promise<{
    success: boolean;
    data?: Document[];
    error?: string;
  }> {
    try {
      const result = await HaloraDatabaseService.getDocuments();
      if (result.success && result.data) {
        const documents: Document[] = Object.entries(result.data).map(
          ([id, doc]: [string, any]) => ({
            id,
            name: doc.name,
            type: doc.type,
            category: doc.category,
            description: doc.description,
            isActive: doc.isActive,
            lastModified: doc.lastModified,
            mimeType: doc.mimeType,
            pixeldrainId: doc.pixeldrainId,
            pixeldrainUrl: doc.pixeldrainUrl,
            size: doc.size,
            thumbnailUrl: doc.thumbnailUrl,
            uploadedAt: doc.uploadedAt,
            uploadedBy: doc.uploadedBy,
          })
        );
        return { success: true, data: documents };
      }
      return { success: true, data: [] };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Get documents by type
  static async getDocumentsByType(type: DocumentType): Promise<{
    success: boolean;
    data?: Document[];
    error?: string;
  }> {
    try {
      const result = await this.getAllDocuments();
      if (!result.success || !result.data) {
        return result;
      }

      const filteredDocuments = result.data.filter((doc) => doc.type === type);
      return { success: true, data: filteredDocuments };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Get documents by category
  static async getDocumentsByCategory(category: DocumentCategory): Promise<{
    success: boolean;
    data?: Document[];
    error?: string;
  }> {
    try {
      const result = await this.getAllDocuments();
      if (!result.success || !result.data) {
        return result;
      }

      const filteredDocuments = result.data.filter(
        (doc) => doc.category === category
      );
      return { success: true, data: filteredDocuments };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Update document metadata
  static async updateDocument(
    documentId: string,
    updates: Partial<Document>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData = {
        ...updates,
        lastModified: new Date().toISOString(),
      };

      const result = await HaloraDatabaseService.updateDocument(
        documentId,
        updateData
      );
      if (result.success) {
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Delete document
  static async deleteDocument(documentId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Delete from Pixeldrain first
      try {
        const deleteUrl = `${this.PIXELDRAIN_BASE_URL}/file/${documentId}`;
        const response = await fetch(deleteUrl, {
          method: "DELETE",
          headers: {
            Authorization: `Basic ${btoa(`:${this.PIXELDRAIN_API_KEY}`)}`,
          },
        });

        if (!response.ok) {
          // Continue anyway - file might already be deleted
        }
      } catch (pixeldrainError) {
        // Continue to delete from database even if Pixeldrain fails
      }

      // Delete from database
      const dbResult = await HaloraDatabaseService.deleteDocument(documentId);

      if (dbResult.success) {
        return { success: true };
      }

      return { success: false, error: dbResult.error };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Search documents
  static async searchDocuments(query: string): Promise<{
    success: boolean;
    data?: Document[];
    error?: string;
  }> {
    try {
      const result = await this.getAllDocuments();
      if (!result.success || !result.data) {
        return result;
      }

      const searchQuery = query.toLowerCase();
      const searchResults = result.data.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchQuery) ||
          (doc.description &&
            doc.description.toLowerCase().includes(searchQuery))
      );

      return { success: true, data: searchResults };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Get file info from Pixeldrain
  static async getFileInfo(fileId: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${this.PIXELDRAIN_BASE_URL}/file/${fileId}/info`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${btoa(`:${this.PIXELDRAIN_API_KEY}`)}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Failed to get file info: ${response.statusText}`,
        };
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Get document statistics
  static async getDocumentStats(): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const result = await this.getAllDocuments();
      if (!result.success || !result.data) {
        return result;
      }

      const documents = result.data;
      const totalDocuments = documents.length;

      const typeStats = documents.reduce((acc: any, doc) => {
        acc[doc.type] = (acc[doc.type] || 0) + 1;
        return acc;
      }, {});

      const categoryStats = documents.reduce((acc: any, doc) => {
        acc[doc.category] = (acc[doc.category] || 0) + 1;
        return acc;
      }, {});

      const totalSize = documents.reduce((total, doc) => total + doc.size, 0);

      return {
        success: true,
        data: {
          totalDocuments,
          typeStats,
          categoryStats,
          totalSize,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Format file size
  static formatFileSize(bytes: number | undefined | null): string {
    if (!bytes || bytes === 0 || isNaN(bytes)) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Get file icon based on mime type
  static getFileIcon(mimeType: string): string {
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
  }
}
