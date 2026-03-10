"use client"

import { useEffect, useState } from "react"
import { OrdersTable } from "@/components/orders-table"
import type { Order } from "@/lib/types"
import { getOrders } from "@/services/orders.service"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    getOrders({ status: "COMPLETED", includeItems: true })
      .then((data) => setOrders(data ?? []))
      .catch(() => setOrders([]))
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">الطلبات المكتملة</h1>
        <p className="text-sm text-muted-foreground">عرض جميع الطلبات التي تم اكمال انتاجها</p>
      </div>
      <OrdersTable orders={orders} allowStatusChange={false} />
    </div>
  )
}
