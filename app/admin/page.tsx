"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, DollarSign, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { getAdminOverviewStats } from "@/services/stats.service"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    completed_orders: 0,
    products_count: 0,
    users_count: 0,
    net_revenue: 0,
  })

  useEffect(() => {
    getAdminOverviewStats()
      .then((data) =>
        setStats({
          completed_orders: data.completed_orders,
          products_count: data.products_count,
          users_count: data.users_count,
          net_revenue: data.net_revenue,
        }),
      )
      .catch(() =>
        setStats({
          completed_orders: 0,
          products_count: 0,
          users_count: 0,
          net_revenue: 0,
        }),
      )
  }, [])

  const cards = [
    {
      label: "الطلبات المكتملة",
      value: stats.completed_orders,
      icon: CheckCircle2,
      href: "/admin/orders",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "صافي الايرادات",
      value: `${stats.net_revenue.toLocaleString()} د.ج`,
      icon: DollarSign,
      href: "/admin/stats",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "المنتجات",
      value: stats.products_count,
      icon: Package,
      href: "/admin/products",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "المستخدمين",
      value: stats.users_count,
      icon: Users,
      href: "/admin/users",
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">لوحة الادارة</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                <div className={`rounded-lg p-2 ${card.bg}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
