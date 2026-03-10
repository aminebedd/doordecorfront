export type UserRole = "employee" | "admin" | "customer"

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  role: UserRole
  created_at: string
}

export interface Category {
  id: string
  name: string
  name_ar: string | null
  image_url: string | null
  created_at: string
}

export interface OwnerAdjustment {
  id: string
  amount: number
  reason: string
  created_by: string | null
  created_at: string
}

export interface Product {
  id: string
  category_id: string | null
  name: string
  name_ar: string | null
  description: string | null
  description_ar: string | null
  base_price: number
  width: number
  height: number
  min_width: number
  max_width: number
  min_height: number
  max_height: number
  pricing_mode: "fixed" | "per_cm2"
  width_threshold: number
  price_below: number
  price_above: number
  is_available: boolean
  created_at: string
  categories?: Category
}

export interface Color {
  id: string
  name: string
  name_ar: string | null
  code: string
  secondary_code: string | null
  created_at: string
}

export interface Handle {
  id: string
  name: string
  name_ar: string | null
  image_url: string | null
  created_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  color_id: string | null
  handle_id: string | null
  image_url: string
  created_at: string
}

export interface DeliveryState {
  id: string
  name: string
  name_ar: string | null
  price: number
}

export interface Order {
  id: string
  order_code: string
  user_id: string | null
  customer_name: string
  email: string | null
  phone: string | null
  address: string | null
  state: string | null
  delivery_price: number
  order_status: "PENDING" | "IN_PRODUCTION" | "COMPLETED"
  total_price: number
  is_online: boolean
  created_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string | null
  quantity: number
  unit_price: number
  width: number | null
  height: number | null
  selected_color: string | null
  selected_handle: string | null
  created_at: string
  products?: Product
}

export interface CartItem {
  id: string
  productId: string
  productName: string
  productNameAr: string | null
  colorId: string
  colorName: string
  colorNameAr: string | null
  colorCode: string
  colorSecondaryCode: string | null
  handleId: string
  handleName: string
  handleNameAr: string | null
  handlePrice: number
  width: number
  height: number
  quantity: number
  unitPrice: number
  imageUrl: string | null
}

export interface Adjustment {
  id: string
  order_id: string
  deducted_amount: number
  final_price: number
  notes: string | null
  created_at: string
}

