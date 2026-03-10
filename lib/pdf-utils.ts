"use client"

import type { Order } from "@/lib/types"
import { toast } from "sonner"
import { sendOrderTicketNotification } from "@/services/notifications.service"

export async function sendTicketToWhatsApp(order: Order): Promise<boolean> {
  try {
    const data = await sendOrderTicketNotification(order)
    if (!data?.waLink) {
      toast.error("لم يتم إنشاء رابط واتساب")
      return false
    }

    window.open(data.waLink, "_self")
    return true
  } catch {
    toast.error("حدث خطأ")
    return false
  }
}
