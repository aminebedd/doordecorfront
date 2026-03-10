"use client"

import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import type { Order } from "@/lib/types"
import { updateOrderStatus } from "@/services/orders.service"

const statusMap: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  PENDING: { label: "قيد المعالجة", variant: "secondary" },
  IN_PRODUCTION: { label: "قيد الانتاج", variant: "default" },
  COMPLETED: { label: "مكتمل", variant: "outline" },
}

export function OrdersTable({
  orders,
  allowStatusChange = false,
}: {
  orders: Order[]
  allowStatusChange?: boolean
}) {
  const router = useRouter()

  async function onUpdateStatus(orderId: string, newStatus: string) {
    try {
      await updateOrderStatus(orderId, newStatus)
      toast.success("تم تحديث حالة الطلب")
      router.refresh()
    } catch {
      toast.error("خطأ في تحديث الحالة")
    }
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>رقم الطلب</TableHead>
            <TableHead>العميل</TableHead>
            <TableHead>الهاتف</TableHead>
            <TableHead>الولاية</TableHead>
            <TableHead>الاجمالي</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>اجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                لا توجد طلبات
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm" dir="ltr">
                  {order.order_code}
                </TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell dir="ltr">{order.phone}</TableCell>
                <TableCell>{order.state}</TableCell>
                <TableCell className="font-medium">
                  {order.total_price.toLocaleString()} د.ج
                </TableCell>
                <TableCell>
                  {allowStatusChange ? (
                    <Select
                      value={order.order_status}
                      onValueChange={(value) => onUpdateStatus(order.id, value)}
                    >
                      <SelectTrigger className="h-8 w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">قيد المعالجة</SelectItem>
                        <SelectItem value="IN_PRODUCTION">قيد الانتاج</SelectItem>
                        <SelectItem value="COMPLETED">مكتمل</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant={statusMap[order.order_status]?.variant || "secondary"}>
                      {statusMap[order.order_status]?.label || order.order_status}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString("ar-DZ")}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        تفاصيل
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>تفاصيل الطلب {order.order_code}</DialogTitle>
                      </DialogHeader>
                      <OrderDetails order={order} />
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="text-muted-foreground">العميل:</span>{" "}
          <span className="font-medium">{order.customer_name}</span>
        </div>
        <div>
          <span className="text-muted-foreground">الهاتف:</span>{" "}
          <span className="font-medium" dir="ltr">
            {order.phone}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">البريد:</span>{" "}
          <span className="font-medium" dir="ltr">
            {order.email || "-"}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">الولاية:</span>{" "}
          <span className="font-medium">{order.state || "-"}</span>
        </div>
      </div>
      <div>
        <span className="text-muted-foreground">العنوان:</span>{" "}
        <span className="font-medium">{order.address || "-"}</span>
      </div>

      {order.order_items && order.order_items.length > 0 && (
        <div>
          <h4 className="mb-2 font-semibold">المنتجات:</h4>
          <div className="flex flex-col gap-2">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-md bg-muted p-2">
                <div>
                  <p className="font-medium">
                    {item.product_name || item.products?.name_ar || item.products?.name || "منتج"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.selected_color && `اللون: ${item.selected_color}`}
                    {item.selected_handle && ` | المقبض: ${item.selected_handle}`}
                    {item.width && ` | ${item.width}x${item.height} سم`}
                  </p>
                </div>
                <div className="text-left">
                  <p className="font-medium">
                    {(item.unit_price * item.quantity).toLocaleString()} د.ج
                  </p>
                  <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between border-t border-border pt-2 font-bold">
        <span>التوصيل: {order.delivery_price.toLocaleString()} د.ج</span>
        <span className="text-primary">الاجمالي: {order.total_price.toLocaleString()} د.ج</span>
      </div>
    </div>
  )
}
