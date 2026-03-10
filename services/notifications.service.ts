import type { Order } from "@/lib/types"
import { httpClient } from "@/services/http/client"

export async function sendOrderTicketNotification(order: Order) {
  return httpClient.post<{ success: boolean; waLink?: string }>(
    "/notifications/whatsapp/ticket",
    order,
  )
}
