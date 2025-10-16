export enum DocumentType {
  CERTIFICATE = "certificate",
  INSPECTION_CERTIFICATE = "inspection_certificate",
  OTHER = "other",
}

export enum DocumentCategory {
  PRODUCT_CERTIFICATE = "product_certificate",
  INSPECTION_REPORT = "inspection_report",
  QUALITY_ASSURANCE = "quality_assurance",
  SAFETY_CERTIFICATE = "safety_certificate",
  COMPLIANCE_DOCUMENT = "compliance_document",
  OTHER = "other",
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  description?: string;
  isActive: boolean;
  lastModified: string;
  mimeType: string;
  pixeldrainId: string;
  pixeldrainUrl: string;
  size: number;
  thumbnailUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface DocumentUploadRequest {
  file: File | any; // File for web, any for React Native
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  description?: string;
}

export interface DocumentState {
  documents: Document[];
  loading: boolean;
  error: string | null;
  uploading: boolean;
  uploadProgress: number;
}

export interface DocumentFilters {
  type?: DocumentType;
  category?: DocumentCategory;
  searchQuery?: string;
}
