import type {
  Category,
  Color,
  DeliveryState,
  Handle,
  Product,
  ProductImage,
} from "@/lib/types"
import { httpClient, withQuery } from "@/services/http/client"

export interface ProductListParams {
  categoryId?: string
  isAvailable?: boolean
  limit?: number
  search?: string
}

export async function getCategories() {
  return httpClient.get<Category[]>("/catalog/categories")
}

export async function createCategory(payload: Pick<Category, "name" | "name_ar">) {
  return httpClient.post<Category>("/catalog/categories", payload)
}

export async function updateCategory(
  id: string,
  payload: Partial<Pick<Category, "name" | "name_ar" | "image_url">>,
) {
  return httpClient.patch<Category>(`/catalog/categories/${id}`, payload)
}

export async function deleteCategory(id: string) {
  return httpClient.delete<{ success: boolean }>(`/catalog/categories/${id}`)
}

export async function getProducts(params: ProductListParams = {}) {
  return httpClient.get<Product[]>(
    withQuery("/catalog/products", {
      category_id: params.categoryId,
      is_available: params.isAvailable,
      limit: params.limit,
      search: params.search,
    }),
  )
}

export async function getProductById(id: string) {
  return httpClient.get<Product & { categories?: Category | null }>(`/catalog/products/${id}`)
}

export async function createProduct(payload: Record<string, unknown>) {
  return httpClient.post<Product>("/catalog/products", payload)
}

export async function updateProduct(id: string, payload: Record<string, unknown>) {
  return httpClient.patch<Product>(`/catalog/products/${id}`, payload)
}

export async function deleteProduct(id: string) {
  return httpClient.delete<{ success: boolean }>(`/catalog/products/${id}`)
}

export async function getColors() {
  return httpClient.get<Color[]>("/catalog/colors")
}

export async function createColor(payload: Pick<Color, "name" | "name_ar" | "code" | "secondary_code">) {
  return httpClient.post<Color>("/catalog/colors", payload)
}

export async function deleteColor(id: string) {
  return httpClient.delete<{ success: boolean }>(`/catalog/colors/${id}`)
}

export async function getHandles() {
  return httpClient.get<Handle[]>("/catalog/handles")
}

export async function createHandle(payload: Pick<Handle, "name" | "name_ar" | "image_url">) {
  return httpClient.post<Handle>("/catalog/handles", payload)
}

export async function deleteHandle(id: string) {
  return httpClient.delete<{ success: boolean }>(`/catalog/handles/${id}`)
}

export async function getDeliveryStates() {
  return httpClient.get<DeliveryState[]>("/catalog/delivery-states")
}

export async function createDeliveryState(
  payload: Pick<DeliveryState, "name" | "name_ar" | "price">,
) {
  return httpClient.post<DeliveryState>("/catalog/delivery-states", payload)
}

export async function deleteDeliveryState(id: string) {
  return httpClient.delete<{ success: boolean }>(`/catalog/delivery-states/${id}`)
}

export async function getProductImages(productId?: string) {
  return httpClient.get<ProductImage[]>(
    withQuery("/catalog/product-images", { product_id: productId }),
  )
}

export async function createProductImage(payload: {
  product_id: string
  color_id?: string | null
  handle_id?: string | null
  image_url: string
}) {
  return httpClient.post<ProductImage>("/catalog/product-images", payload)
}

export async function deleteProductImage(id: string) {
  return httpClient.delete<{ success: boolean }>(`/catalog/product-images/${id}`)
}

export async function getProductHandles(productId?: string) {
  return httpClient.get<Array<{ product_id: string; handle_id: string }>>(
    withQuery("/catalog/product-handles", { product_id: productId }),
  )
}

export async function setProductHandles(productId: string, handleIds: string[]) {
  return httpClient.put<{ success: boolean }>(`/catalog/products/${productId}/handles`, {
    handle_ids: handleIds,
  })
}
