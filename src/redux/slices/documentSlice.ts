import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Document,
  DocumentUploadRequest,
  DocumentType,
  DocumentCategory,
  DocumentFilters,
} from "../../types/document";
import { DocumentService } from "../../services/documentService";

interface DocumentState {
  documents: Document[];
  loading: boolean;
  error: string | null;
  uploading: boolean;
  uploadProgress: number;
  filters: DocumentFilters;
}

const initialState: DocumentState = {
  documents: [],
  loading: false,
  error: null,
  uploading: false,
  uploadProgress: 0,
  filters: {},
};

// Async thunks
export const fetchDocuments = createAsyncThunk(
  "documents/fetchDocuments",
  async (_, { rejectWithValue }) => {
    try {
      const result = await DocumentService.getAllDocuments();
      if (result.success) {
        return result.data || [];
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const uploadDocument = createAsyncThunk(
  "documents/uploadDocument",
  async (uploadRequest: DocumentUploadRequest, { rejectWithValue }) => {
    try {
      const result = await DocumentService.uploadDocument(uploadRequest);
      if (result.success && result.document) {
        return result.document;
      } else {
        return rejectWithValue(result.error || "Upload failed");
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const updateDocument = createAsyncThunk(
  "documents/updateDocument",
  async (
    { id, updates }: { id: string; updates: Partial<Document> },
    { rejectWithValue }
  ) => {
    try {
      const result = await DocumentService.updateDocument(id, updates);
      if (result.success) {
        return { id, updates };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const deleteDocument = createAsyncThunk(
  "documents/deleteDocument",
  async (documentId: string, { rejectWithValue }) => {
    try {
      const result = await DocumentService.deleteDocument(documentId);
      if (result.success) {
        return documentId;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const searchDocuments = createAsyncThunk(
  "documents/searchDocuments",
  async (query: string, { rejectWithValue }) => {
    try {
      const result = await DocumentService.searchDocuments(query);
      if (result.success) {
        return result.data || [];
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const getDocumentsByType = createAsyncThunk(
  "documents/getDocumentsByType",
  async (type: DocumentType, { rejectWithValue }) => {
    try {
      const result = await DocumentService.getDocumentsByType(type);
      if (result.success) {
        return result.data || [];
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const getDocumentsByCategory = createAsyncThunk(
  "documents/getDocumentsByCategory",
  async (category: DocumentCategory, { rejectWithValue }) => {
    try {
      const result = await DocumentService.getDocumentsByCategory(category);
      if (result.success) {
        return result.data || [];
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<DocumentFilters>) => {
      state.filters = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearDocuments: (state) => {
      state.documents = [];
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    resetUploadProgress: (state) => {
      state.uploadProgress = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch documents
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Upload document
      .addCase(uploadDocument.pending, (state) => {
        state.uploading = true;
        state.uploadProgress = 0;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 100;
        state.documents.unshift(action.payload);
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 0;
        state.error = action.payload as string;
      })

      // Update document
      .addCase(updateDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.loading = false;
        const { id, updates } = action.payload;
        const documentIndex = state.documents.findIndex((doc) => doc.id === id);
        if (documentIndex !== -1) {
          state.documents[documentIndex] = {
            ...state.documents[documentIndex],
            ...updates,
          };
        }
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete document
      .addCase(deleteDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.loading = false;
        const documentId = action.payload;
        state.documents = state.documents.filter(
          (doc) => doc.id !== documentId
        );
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Search documents
      .addCase(searchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(searchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get documents by type
      .addCase(getDocumentsByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDocumentsByType.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(getDocumentsByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get documents by category
      .addCase(getDocumentsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDocumentsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(getDocumentsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  clearError,
  clearDocuments,
  setUploadProgress,
  resetUploadProgress,
} = documentSlice.actions;

export default documentSlice.reducer;
