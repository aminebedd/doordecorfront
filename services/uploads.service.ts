import { httpClient } from "@/services/http/client"

export async function uploadImage(file: File, folder: string, oldUrl?: string) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("folder", folder)
  if (oldUrl) formData.append("old_url", oldUrl)
  return httpClient.post<{ url: string }>("/uploads/images", formData)
}

export async function deleteUploadedImage(url: string) {
  return httpClient.delete<{ success: boolean }>(
    `/uploads/images/by-url?url=${encodeURIComponent(url)}`,
  )
}
