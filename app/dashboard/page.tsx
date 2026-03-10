"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, Factory, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { getEmployeeOverviewStats } from "@/services/stats.service"

export default function EmployeeDashboardPage() {
  const [stats, setStats] = useState({
    pending_orders: 0,
    in_production_orders: 0,
    completed_orders: 0,
  })

  useEffect(() => {
    getEmployeeOverviewStats()
      .then((data) => {
        setStats({
          pending_orders: data.pending_orders,
          in_production_orders: data.in_production_orders,
          completed_orders: data.completed_orders,
        })
      })
      .catch(() => {
        setStats({
          pending_orders: 0,
          in_production_orders: 0,
          completed_orders: 0,
        })
      })
  }, [])

  const cards = [
    {
      title: "طلبات معلقة",
      count: stats.pending_orders,
      icon: ClipboardList,
      href: "/dashboard/pending",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "قيد الانتاج",
      count: stats.in_production_orders,
      icon: Factory,
      href: "/dashboard/production",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "مكتملة",
      count: stats.completed_orders,
      icon: CheckCircle2,
      href: "#",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">لوحة تحكم الموظف</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <div className={`rounded-lg p-2 ${card.bg}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className={`text-3xl font-bold ${card.color}`}>{card.count}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
