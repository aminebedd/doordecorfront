"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, ArrowLeft, ShoppingCart } from "lucide-react"
import { getCart, subscribe, clearCart } from "@/lib/cart"
import { toast } from "sonner"
import { useTranslation } from "@/lib/i18n/client"
import type { CartItem, DeliveryState } from "@/lib/types"
import { getDeliveryStates } from "@/services/catalog.service"
import { createOrder, createOrderItems } from "@/services/orders.service"

export default function CheckoutPage() {
  const router = useRouter()
  const { t, locale } = useTranslation()
  const isAr = locale === "ar"
  const BackArrow = isAr ? ArrowRight : ArrowLeft
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    setCart(getCart())
    return subscribe(() => setCart(getCart()))
  }, [])

  const cartTotal = cart.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

  const [states, setStates] = useState<DeliveryState[]>([])
  const [customerName, setCustomerName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getDeliveryStates()
      .then((data) => setStates(data ?? []))
      .catch(() => setStates([]))
  }, [])

  const deliveryState = states.find((s) => s.id === selectedState)
  const deliveryPrice = deliveryState ? Number(deliveryState.price) : 0
  const grandTotal = cartTotal + deliveryPrice
  const currency = t("products.currency")

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault()

    if (cart.length === 0) {
      toast.error(t("checkout.emptyCart"))
      return
    }
    if (!customerName.trim()) {
      toast.error(t("checkout.errorName"))
      return
    }
    if (!phone.trim() || phone.trim().length < 10) {
      toast.error(t("checkout.errorPhone"))
      return
    }

    setLoading(true)

    try {
      const orderCode = `DD-${Date.now().toString(36).toUpperCase()}`
      const currentCart = getCart()
      if (currentCart.length === 0) {
        toast.error(t("checkout.emptyCart"))
        setLoading(false)
        return
      }

      const stateName = deliveryState ? deliveryState.name_ar || deliveryState.name || "" : null

      const order = await createOrder({
        order_code: orderCode,
        user_id: null,
        customer_name: customerName.trim(),
        email: email.trim() || null,
        phone: phone.trim(),
        address: address.trim() || null,
        state: stateName,
        total_price: grandTotal,
        delivery_price: deliveryPrice,
        order_status: "PENDING",
        is_online: true,
      })

      const orderItems = currentCart.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productNameAr || item.productName,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        width: item.width,
        height: item.height,
        selected_color: item.colorNameAr || item.colorName,
        selected_handle: item.handleNameAr || item.handleName,
      }))

      await createOrderItems(order.id, orderItems)

      clearCart()
      toast.success(t("checkout.success"))
      router.push(`/order-success?code=${orderCode}`)
    } catch {
      toast.error(t("checkout.errorCreate"))
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShoppingCart className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-foreground">{t("checkout.emptyCart")}</h1>
        <p className="mt-2 text-muted-foreground">{t("checkout.addFirst")}</p>
        <Link href="/products" className="mt-6">
          <Button>{t("cart.browseProducts")}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/cart">
          <Button variant="ghost" size="sm" className="gap-1">
            <BackArrow className="h-4 w-4" />
            {t("checkout.backToCart")}
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">{t("checkout.title")}</h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("checkout.deliveryInfo")}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>{t("checkout.fullName")}</Label>
                  <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>{t("checkout.phone")}</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    dir="ltr"
                    placeholder="0555123456"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label>{t("checkout.email")}</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" />
              </div>

              <div className="flex flex-col gap-2">
                <Label>
                  {t("checkout.state")} ({isAr ? "اختياري" : "optional"})
                </Label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("checkout.selectState")} />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {isAr ? s.name_ar || s.name : s.name || s.name_ar} - {Number(s.price).toLocaleString()}{" "}
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>
                  {t("checkout.address")} ({isAr ? "اختياري" : "optional"})
                </Label>
                <Textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  placeholder={
                    isAr
                      ? "مثال: حي..., شارع..., رقم المنزل..."
                      : "Example: district, street, house number..."
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>{t("checkout.orderSummary")}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {isAr ? item.productNameAr || item.productName : item.productName || item.productNameAr}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isAr ? item.colorNameAr || item.colorName : item.colorName || item.colorNameAr} -{" "}
                      {item.width}x{item.height} {t("products.cm")} - x{item.quantity}
                    </span>
                  </div>
                  <span className="shrink-0 font-medium text-foreground">
                    {(item.unitPrice * item.quantity).toLocaleString()} {currency}
                  </span>
                </div>
              ))}

              <Separator />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("checkout.products")}</span>
                <span className="font-medium">
                  {cartTotal.toLocaleString()} {currency}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("checkout.delivery")}</span>
                <span className="font-medium">
                  {selectedState
                    ? `${deliveryPrice.toLocaleString()} ${currency}`
                    : isAr
                      ? "0 (اختياري)"
                      : "0 (optional)"}
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-lg font-bold">
                <span className="text-foreground">{t("checkout.grandTotal")}</span>
                <span className="text-primary">
                  {grandTotal.toLocaleString()} {currency}
                </span>
              </div>

              <Button type="submit" className="mt-2 w-full" size="lg" disabled={loading}>
                {loading ? t("checkout.processing") : t("checkout.placeOrder")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
