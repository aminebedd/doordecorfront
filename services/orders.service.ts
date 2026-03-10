import type { Order, OrderItem } from "@/lib/types"
import { httpClient, withQuery } from "@/services/http/client"

export interface OrdersQuery {
  status?: string
  orderCode?: string
  includeItems?: boolean
}

export interface CreateOrderPayload {
  order_code: string
  user_id?: string | null
  customer_name: string
  email?: string | null
  phone?: string | null
  address?: string | null
  state?: string | null
  delivery_price: number
  order_status: string
  total_price: number
  is_online: boolean
}

export async function getOrders(query: OrdersQuery = {}) {
  return httpClient.get<Order[]>(
    withQuery("/orders", {
      status: query.status,
      order_code: query.orderCode,
      include_items: query.includeItems,
    }),
  )
}

export async function getOrderById(id: string) {
  return httpClient.get<Order>(`/orders/${id}`)
}

export async function getOrderByCode(orderCode: string) {
  return httpClient.get<Order>(withQuery("/orders/by-code", { order_code: orderCode }))
}

export async function createOrder(payload: CreateOrderPayload) {
  return httpClient.post<Order>("/orders", payload)
}

export async function createOrderItems(orderId: string, items: Array<Record<string, unknown>>) {
  return httpClient.post<OrderItem[]>(`/orders/${orderId}/items`, { items })
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  extra: Record<string, unknown> = {},
) {
  return httpClient.patch<Order>(`/orders/${orderId}/status`, {
    order_status: status,
    ...extra,
  })
}

export async function deleteOrder(orderId: string) {
  return httpClient.delete<{ success: boolean }>(`/orders/${orderId}`)
}

export async function deleteOrderItems(orderId: string) {
  return httpClient.delete<{ success: boolean }>(`/orders/${orderId}/items`)
}
