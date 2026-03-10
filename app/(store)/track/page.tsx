"use client"

import React, { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/lib/i18n/client"
import type { Order } from "@/lib/types"
import { getOrderByCode } from "@/services/orders.service"

export default function TrackOrderPage() {
  const { t, locale } = useTranslation()
  const isAr = locale === "ar"
  const currency = t("products.currency")
  const cm = t("products.cm")

  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
    PENDING: { label: t("track.statusPending"), variant: "secondary" },
    IN_PRODUCTION: { label: t("track.statusProduction"), variant: "default" },
    COMPLETED: { label: t("track.statusCompleted"), variant: "outline" },
  }

  const [code, setCode] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSearched(true)

    try {
      const data = await getOrderByCode(code.trim())
      setOrder(data)
    } catch {
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-center text-3xl font-bold text-foreground">{t("track.title")}</h1>
      <p className="mb-8 text-center text-muted-foreground">{t("track.subtitle")}</p>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="DD-XXXXXXX"
          dir="ltr"
          className="flex-1"
          required
        />
        <Button type="submit" disabled={loading} className="gap-2">
          <Search className="h-4 w-4" />
          {loading ? t("track.searching") : t("track.search")}
        </Button>
      </form>

      {searched && !loading && (
        <div className="mt-8">
          {order ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {t("track.order")} {order.order_code}
                  </CardTitle>
                  <Badge variant={statusMap[order.order_status]?.variant || "secondary"}>
                    {statusMap[order.order_status]?.label || order.order_status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t("track.customer")}</span>{" "}
                    <span className="font-medium">{order.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t("track.state")}</span>{" "}
                    <span className="font-medium">{order.state || "-"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t("track.deliveryFee")}</span>{" "}
                    <span className="font-medium">
                      {order.delivery_price.toLocaleString()} {currency}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t("track.date")}</span>{" "}
                    <span className="font-medium">
                      {new Date(order.created_at).toLocaleDateString(isAr ? "ar-DZ" : "fr-DZ")}
                    </span>
                  </div>
                </div>

                {order.order_items && order.order_items.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">{t("track.products")}</h4>
                    <div className="flex flex-col gap-2">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-md bg-muted p-3">
                          <div className="text-sm">
                            <span className="font-medium">
                              {item.selected_color || ""}{" "}
                              {item.selected_handle ? `| ${item.selected_handle}` : ""}
                            </span>
                            {item.width && (
                              <span className={`text-xs text-muted-foreground ${isAr ? "mr-2" : "ml-2"}`}>
                                {item.width}x{item.height} {cm}
                              </span>
                            )}
                          </div>
                          <div className="text-sm font-medium">
                            {(item.unit_price * item.quantity).toLocaleString()} {currency}
                            <span className={`text-xs text-muted-foreground ${isAr ? "mr-1" : "ml-1"}`}>
                              x{item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between border-t border-border pt-3 text-lg font-bold">
                  <span>{t("track.total")}</span>
                  <span className="text-primary">
                    {order.total_price.toLocaleString()} {currency}
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">{t("track.notFound")}</CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
