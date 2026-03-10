"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAdminDetailedStats, type AdminDetailedStats } from "@/services/stats.service"

const initialStats: AdminDetailedStats = {
  orders: [],
  owner_adjustments: [],
  products_count: 0,
  category_counts: {},
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<AdminDetailedStats>(initialStats)

  useEffect(() => {
    getAdminDetailedStats()
      .then((data) => setStats(data))
      .catch(() => setStats(initialStats))
  }, [])

  const metrics = useMemo(() => {
    const allOrders = stats.orders ?? []
    const completedOrders = allOrders.filter((o) => o.order_status === "COMPLETED")
    const onlineOrders = allOrders.filter((o) => o.is_online)
    const offlineOrders = allOrders.filter((o) => !o.is_online)

    const grossTotal = completedOrders.reduce((sum, o) => sum + Number(o.total_price || 0), 0)
    const totalDeliveryCost = completedOrders.reduce((sum, o) => sum + Number(o.delivery_price || 0), 0)
    const revenueAfterDelivery = grossTotal - totalDeliveryCost

    const adjustments = stats.owner_adjustments ?? []
    const totalAdjustments = adjustments.reduce((sum, a) => sum + Number(a.amount || 0), 0)
    const netRevenue = revenueAfterDelivery - totalAdjustments

    return {
      allOrders,
      completedOrders,
      onlineOrders,
      offlineOrders,
      grossTotal,
      totalDeliveryCost,
      adjustments,
      totalAdjustments,
      netRevenue,
    }
  }, [stats])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">الاحصائيات</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">اجمالي المبيعات (شامل التوصيل)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{metrics.grossTotal.toLocaleString()} د.ج</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">تكاليف التوصيل (مستبعدة)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-muted-foreground">-{metrics.totalDeliveryCost.toLocaleString()} د.ج</p>
            <p className="mt-1 text-xs text-muted-foreground">شركة توصيل خارجية</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">الخصومات (ايجار، صيانة...)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">-{metrics.totalAdjustments.toLocaleString()} د.ج</p>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary">صافي الايرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{metrics.netRevenue.toLocaleString()} د.ج</p>
            <p className="mt-1 text-xs text-muted-foreground">المبيعات - التوصيل - الخصومات</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>تفصيل الطلبات</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">اجمالي الطلبات</span>
              <span className="font-bold">{metrics.allOrders.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">طلبات اونلاين</span>
              <Badge variant="default">{metrics.onlineOrders.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">طلبات يدوية</span>
              <Badge variant="secondary">{metrics.offlineOrders.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">مكتملة</span>
              <Badge variant="outline">{metrics.completedOrders.length}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>المنتجات حسب القسم</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">اجمالي المنتجات</span>
              <span className="font-bold">{stats.products_count || 0}</span>
            </div>
            {Object.entries(stats.category_counts || {}).map(([catName, count]) => (
              <div key={catName} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{catName}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {metrics.adjustments.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>اخر الخصومات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {metrics.adjustments.slice(0, 5).map((adj) => (
                <div key={adj.created_at} className="flex items-center justify-between rounded-md border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{adj.reason}</p>
                    <p className="text-xs text-muted-foreground">{new Date(adj.created_at).toLocaleDateString("ar-DZ")}</p>
                  </div>
                  <p className="font-semibold text-destructive">-{Number(adj.amount).toLocaleString()} د.ج</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
