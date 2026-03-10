import imageCompression from "browser-image-compression"
import { deleteUploadedImage, uploadImage as uploadImageRequest } from "@/services/uploads.service"

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
])

async function compressImage(file: File): Promise<File> {
  // Skip compression for non-image files or very small files (< 100KB)
  if (!file.type.startsWith("image/") || file.size < 100 * 1024) {
    return file
  }

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 1,               // Target max 1MB
      useWebWorker: true,          // Offload to web worker
      preserveExif: false,         // Strip metadata to save space
      fileType: file.type as string,
      // No maxWidthOrHeight — keeps original dimensions
    })
    return compressed
  } catch (err) {
    console.error("Compression failed, using original:", err)
    return file
  }
}

function isValidUploadFile(file: File) {
  return ALLOWED_MIME_TYPES.has(file.type) && file.size <= MAX_UPLOAD_SIZE_BYTES
}

export async function uploadImage(file: File, folder: string, oldUrl?: string): Promise<string | null> {
  if (!isValidUploadFile(file)) {
    console.error("Invalid image file type or size")
    return null
  }

  // Compress before upload
  const compressed = await compressImage(file)
  if (!isValidUploadFile(compressed)) {
    console.error("Compressed image is too large or unsupported")
    return null
  }

  try {
    const data = await uploadImageRequest(compressed, folder, oldUrl)
    if (!data?.url) {
      console.error("Upload error: Missing uploaded image URL")
      return null
    }

    return data.url as string
  } catch (error) {
    console.error("Upload request failed:", error)
    return null
  }
}

export async function deleteImage(url: string): Promise<void> {
  if (!url) return
  try {
    await deleteUploadedImage(url)
  } catch (error) {
    console.error("Delete request failed:", error)
  }
}
