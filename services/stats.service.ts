import type { OwnerAdjustment, Order } from "@/lib/types"
import { ApiError, httpClient } from "@/services/http/client"
import { getProfiles } from "@/services/users.service"

export interface AdminOverviewStats {
  completed_orders: number
  products_count: number
  users_count: number
  gross_revenue: number
  delivery_cost: number
  total_adjustments: number
  net_revenue: number
}

export interface EmployeeOverviewStats {
  pending_orders: number
  in_production_orders: number
  completed_orders: number
}

export interface AdminDetailedStats {
  orders: Array<Pick<Order, "total_price" | "delivery_price" | "order_status" | "is_online" | "created_at">>
  owner_adjustments: Array<Pick<OwnerAdjustment, "amount" | "reason" | "created_at">>
  products_count: number
  category_counts: Record<string, number>
}

export async function getAdminOverviewStats() {
  try {
    return await httpClient.get<AdminOverviewStats>("/stats/admin-overview")
  } catch (firstError) {
    try {
      return await httpClient.get<AdminOverviewStats>("/stats/admin-overview/")
    } catch (secondError) {
      const blockingError = secondError instanceof ApiError ? secondError : firstError
      if (blockingError instanceof ApiError && (blockingError.status === 401 || blockingError.status === 403)) {
        throw blockingError
      }

      const [detailedStats, profiles] = await Promise.all([
        getAdminDetailedStats().catch(() => null),
        getProfiles().catch(() => null),
      ])

      if (!detailedStats) throw blockingError

      const completedOrders = (detailedStats.orders ?? []).filter((o) => o.order_status === "COMPLETED")
      const grossRevenue = completedOrders.reduce((sum, o) => sum + Number(o.total_price || 0), 0)
      const deliveryCost = completedOrders.reduce((sum, o) => sum + Number(o.delivery_price || 0), 0)
      const totalAdjustments = (detailedStats.owner_adjustments ?? []).reduce(
        (sum, adj) => sum + Number(adj.amount || 0),
        0,
      )
      const netRevenue = grossRevenue - deliveryCost - totalAdjustments

      return {
        completed_orders: completedOrders.length,
        products_count: Number(detailedStats.products_count || 0),
        users_count: Array.isArray(profiles) ? profiles.length : 0,
        gross_revenue: grossRevenue,
        delivery_cost: deliveryCost,
        total_adjustments: totalAdjustments,
        net_revenue: netRevenue,
      }
    }
  }
}

export async function getEmployeeOverviewStats() {
  return httpClient.get<EmployeeOverviewStats>("/stats/employee-overview")
}

export async function getAdminDetailedStats() {
  return httpClient.get<AdminDetailedStats>("/stats/admin")
}

export async function getOwnerAdjustments() {
  return httpClient.get<Array<Pick<OwnerAdjustment, "id" | "amount" | "reason" | "created_at">>>(
    "/finance/owner-adjustments",
  )
}

export async function createOwnerAdjustment(payload: {
  amount: number
  reason: string
  created_by?: string | null
}) {
  return httpClient.post<OwnerAdjustment>("/finance/owner-adjustments", payload)
}

export async function deleteOwnerAdjustment(id: string) {
  return httpClient.delete<{ success: boolean }>(`/finance/owner-adjustments/${id}`)
}
