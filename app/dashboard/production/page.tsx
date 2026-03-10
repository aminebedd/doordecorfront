"use client"

import React, { useCallback, useEffect, useState } from "react"
import { Search, CheckCircle2, Loader2, Factory } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import type { Order } from "@/lib/types"
import { getOrders, updateOrderStatus } from "@/services/orders.service"

export default function ProductionOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchCode, setSearchCode] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const loadOrders = useCallback(async (code?: string) => {
    setLoading(true)
    try {
      const data = await getOrders({
        status: "IN_PRODUCTION",
        orderCode: code?.trim() || undefined,
        includeItems: true,
      })
      setOrders(data ?? [])
    } catch {
      setOrders([])
      toast.error("خطا في تحميل الطلبات")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    loadOrders(searchCode)
  }

  async function handleComplete(orderId: string) {
    setActionLoading(orderId)

    try {
      await updateOrderStatus(orderId, "COMPLETED")
      toast.success("تم اكمال الطلب بنجاح")
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
    } catch {
      toast.error("خطا في اكمال الطلب")
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">الطلبات قيد الانتاج</h1>
        <p className="text-sm text-muted-foreground">ادارة الطلبات المقبولة والتي هي في مرحلة التصنيع</p>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <Input
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          placeholder="بحث برقم الطلب (مثلا DD-...)"
          dir="ltr"
          className="max-w-sm"
        />
        <Button type="submit" variant="outline" className="gap-2 bg-transparent">
          <Search className="h-4 w-4" />
          بحث
        </Button>
        {searchCode && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setSearchCode("")
              loadOrders()
            }}
          >
            مسح
          </Button>
        )}
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {searchCode ? "لم يتم العثور على طلبات بهذا الرقم" : "لا توجد طلبات قيد الانتاج حاليا"}
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">{orders.length} طلب قيد الانتاج</p>
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2">
                      <Factory className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{order.order_code}</CardTitle>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {order.customer_name} | {order.state}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">قيد الانتاج</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {order.order_items && order.order_items.length > 0 && (
                  <div className="mb-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-right">
                          <th className="pb-2 font-medium text-muted-foreground">المنتج</th>
                          <th className="pb-2 font-medium text-muted-foreground">الكمية</th>
                          <th className="pb-2 font-medium text-muted-foreground">الابعاد</th>
                          <th className="pb-2 font-medium text-muted-foreground">اللون</th>
                          <th className="pb-2 font-medium text-muted-foreground">المقبض</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.order_items.map((item) => (
                          <tr key={item.id} className="border-b border-border/50">
                            <td className="py-2 font-medium">
                              {item.product_name || item.products?.name_ar || item.products?.name || "منتج"}
                            </td>
                            <td className="py-2">{item.quantity}</td>
                            <td className="py-2">{item.width && item.height ? `${item.width}x${item.height} سم` : "-"}</td>
                            <td className="py-2">{item.selected_color || "-"}</td>
                            <td className="py-2">{item.selected_handle || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <div className="flex gap-2" />

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                        disabled={actionLoading === order.id}
                      >
                        {actionLoading === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        تم الانتاج
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>تاكيد اكتمال الانتاج</AlertDialogTitle>
                        <AlertDialogDescription>
                          سيتم نقل الطلب {order.order_code} الى حالة مكتمل. تاكد من انتهاء التصنيع قبل المتابعة.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>الغاء</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleComplete(order.id)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          نعم، تم الانتاج
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
