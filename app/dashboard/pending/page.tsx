"use client"

import { useEffect, useState } from "react"
import { Check, X, Eye, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { sendTicketToWhatsApp } from "@/lib/pdf-utils"
import type { Order } from "@/lib/types"
import {
  deleteOrder,
  deleteOrderItems,
  getOrders,
  updateOrderStatus,
} from "@/services/orders.service"

export default function PendingOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    try {
      const data = await getOrders({ status: "PENDING", includeItems: true })
      setOrders(data ?? [])
    } catch {
      setOrders([])
      toast.error("خطا في تحميل الطلبات")
    } finally {
      setLoading(false)
    }
  }

  async function handleAccept(order: Order, sendWhatsAppMessage: boolean) {
    setActionLoading(order.id)

    let orderCode = order.order_code
    if (!orderCode || !orderCode.startsWith("DD-")) {
      orderCode = `DD-${Date.now().toString(36).toUpperCase()}`
    }

    try {
      await updateOrderStatus(order.id, "IN_PRODUCTION", { order_code: orderCode })
      toast.success(`تم قبول الطلب ${orderCode} ونقله الى الانتاج`)
      setOrders((prev) => prev.filter((o) => o.id !== order.id))

      if (sendWhatsAppMessage) {
        const updatedOrder = { ...order, order_code: orderCode }
        sendTicketToWhatsApp(updatedOrder)
      }
    } catch {
      toast.error("خطا في قبول الطلب")
    } finally {
      setActionLoading(null)
    }
  }

  async function handleReject(orderId: string) {
    setActionLoading(orderId)

    try {
      await deleteOrderItems(orderId)
      await deleteOrder(orderId)
      toast.success("تم رفض وحذف الطلب نهائيا")
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
    } catch {
      toast.error("خطا في حذف الطلب")
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">الطلبات المعلقة</h1>
          <p className="text-sm text-muted-foreground">{orders.length} طلب بانتظار المراجعة</p>
        </div>
        <Badge variant="secondary" className="text-base">
          {orders.length}
        </Badge>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">لا توجد طلبات معلقة حاليا</CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{order.customer_name}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {order.phone} | {order.state}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-primary">{Number(order.total_price).toLocaleString()} د.ج</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString("ar-DZ")}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {order.order_items && order.order_items.length > 0 && (
                  <div className="mb-4 flex flex-col gap-2">
                    {order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-md bg-muted p-3 text-sm"
                      >
                        <div>
                          <span className="font-medium">
                            {item.product_name || item.products?.name_ar || item.products?.name || "منتج"}
                          </span>
                          <span className="mr-2 text-muted-foreground">x{item.quantity}</span>
                          {item.width && (
                            <span className="mr-2 text-xs text-muted-foreground">({item.width}x{item.height} سم)</span>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-0.5 text-xs text-muted-foreground">
                          {item.selected_color && <span>اللون: {item.selected_color}</span>}
                          {item.selected_handle && <span>المقبض: {item.selected_handle}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Eye className="h-4 w-4" />
                        تفاصيل كاملة
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>تفاصيل الطلب</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-3 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-muted-foreground">رقم الطلب:</span> {order.order_code}
                          </div>
                          <div>
                            <span className="text-muted-foreground">العميل:</span> {order.customer_name}
                          </div>
                          <div>
                            <span className="text-muted-foreground">الهاتف:</span> <span dir="ltr">{order.phone}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">الولاية:</span> {order.state}
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">العنوان:</span> {order.address}
                          </div>
                          <div>
                            <span className="text-muted-foreground">التوصيل:</span> {Number(order.delivery_price).toLocaleString()} د.ج
                          </div>
                          <div>
                            <span className="text-muted-foreground">الاجمالي:</span>{" "}
                            <span className="font-bold text-primary">{Number(order.total_price).toLocaleString()} د.ج</span>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <div className="flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 border-destructive bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          disabled={actionLoading === order.id}
                        >
                          <X className="h-4 w-4" />
                          رفض
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>تاكيد رفض الطلب</AlertDialogTitle>
                          <AlertDialogDescription>
                            سيتم حذف هذا الطلب نهائيا من قاعدة البيانات. لا يمكن التراجع عن هذا الاجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>الغاء</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleReject(order.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            نعم، رفض وحذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" className="gap-2" disabled={actionLoading === order.id}>
                          {actionLoading === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          قبول
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>اختيار طريقة القبول</AlertDialogTitle>
                          <AlertDialogDescription>
                            هل تريد إرسال رسالة واتساب مع تذكرة الإنتاج أم القبول بدون إرسال؟
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex gap-2">
                          <AlertDialogAction
                            onClick={() => handleAccept(order, true)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            أبعث رسالة واتساب
                          </AlertDialogAction>
                          <AlertDialogAction
                            onClick={() => handleAccept(order, false)}
                            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                          >
                            قبول بدون إرسال
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
