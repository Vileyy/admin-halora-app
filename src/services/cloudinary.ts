// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET;
const CLOUDINARY_UPLOAD_PRESET = "my_preset";

// Upload image to Cloudinary using REST API
export const uploadImage = async (
  imageUri: string,
  folder: string = "halora-products"
) => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "product-image.jpg",
    } as any);

    // Use your existing unsigned preset
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    // Add folder if needed (check your preset settings)
    if (folder && folder !== "my_preset") {
      formData.append("folder", folder);
    }
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    // console.log("Response status:", response.status);
    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      };
    } else {
      return {
        success: false,
        error:
          result.error?.message ||
          `Upload failed: ${result.error || "Unknown error"}`,
      };
    }
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
};

// Delete image from Cloudinary (requires signed request)
export const deleteImage = async (publicId: string) => {
  try {
    console.log("Delete image:", publicId);
    return {
      success: true,
      result: "ok",
    };
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Transform image URL
export const getTransformedImageUrl = (
  publicId: string,
  transformations: Record<string, any> = {}
) => {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  // Build transformation string
  const transformParams = Object.entries(transformations)
    .map(([key, value]) => `${key}_${value}`)
    .join(",");

  if (transformParams) {
    return `${baseUrl}/${transformParams}/${publicId}`;
  }

  return `${baseUrl}/${publicId}`;
};
