import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

// Upload image to Cloudinary
export async function uploadImage(
  file: Buffer | string,
  folder: string = "kumarie/products"
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: "image" as const,
      transformation: [
        { width: 1200, height: 1200, crop: "limit" },
        { quality: "auto:good" },
        { format: "webp" },
      ],
    };

    if (typeof file === "string") {
      // Base64 or URL
      cloudinary.uploader.upload(file, uploadOptions, (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        });
      });
    } else {
      // Buffer
      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error || !result) {
            reject(error || new Error("Upload failed"));
            return;
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
          });
        })
        .end(file);
    }
  });
}

// Delete image from Cloudinary
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

// Generate optimized URL
export function getOptimizedUrl(
  publicId: string,
  width?: number,
  height?: number
): string {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: "fill",
    quality: "auto",
    format: "webp",
    secure: true,
  });
}
