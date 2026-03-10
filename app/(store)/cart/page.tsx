"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  getCart,
  subscribe,
  removeFromCart,
  updateQuantity,
} from "@/lib/cart"
import { useTranslation } from "@/lib/i18n/client"
import type { CartItem } from "@/lib/types"

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const { t, locale } = useTranslation()
  const isAr = locale === "ar"
  const BackArrow = isAr ? ArrowLeft : ArrowRight

  useEffect(() => {
    setCart(getCart())
    return subscribe(() => setCart(getCart()))
  }, [])

  const total = cart.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShoppingCart className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-foreground">
          {t("cart.empty")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("cart.emptyDesc")}
        </p>
        <Link href="/products" className="mt-6">
          <Button className="gap-2">
            <BackArrow className="h-4 w-4" />
            {t("cart.browseProducts")}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-foreground">{t("cart.title")}</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {cart.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex gap-4 p-4">
                {/* Item Image */}
                <div className="relative h-28 w-[62px] shrink-0 overflow-hidden rounded-lg bg-muted">
                  {item.imageUrl ? (
                    <Image
  src={item.imageUrl || "/placeholder.svg"}
  alt={(isAr ? item.productNameAr : item.productName) || "Product image"}
  fill
  className="object-cover"
  sizes="80px"
/>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-muted-foreground/40" />
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex flex-1 flex-col gap-1">
                  <h3 className="font-semibold text-foreground">
                    {isAr ? (item.productNameAr || item.productName) : (item.productName || item.productNameAr)}
                  </h3>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span
                        className="inline-block h-3 w-3 rounded-full border border-border"
                        style={item.colorSecondaryCode ? { background: `linear-gradient(135deg, ${item.colorCode} 50%, ${item.colorSecondaryCode} 50%)` } : { backgroundColor: item.colorCode }}
                      />
                      {isAr ? (item.colorNameAr || item.colorName) : (item.colorName || item.colorNameAr)}
                    </span>
                    <span>{isAr ? (item.handleNameAr || item.handleName) : (item.handleName || item.handleNameAr)}</span>
                    <span>
                      {item.width}x{item.height} {t("products.cm")}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary">
                        {(item.unitPrice * item.quantity).toLocaleString()} {t("products.currency")}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="flex flex-col gap-4 p-6">
              <h2 className="text-lg font-bold text-foreground">{t("cart.orderSummary")}</h2>
              <Separator />
              <div className="flex flex-col gap-2">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {isAr ? (item.productNameAr || item.productName) : (item.productName || item.productNameAr)} x{item.quantity}
                    </span>
                    <span className="font-medium text-foreground">
                      {(item.unitPrice * item.quantity).toLocaleString()} {t("products.currency")}
                    </span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex items-center justify-between text-lg font-bold">
                <span className="text-foreground">{t("cart.total")}</span>
                <span className="text-primary">
                  {total.toLocaleString()} {t("products.currency")}
                </span>
              </div>
              <Link href="/checkout" className="mt-2">
                <Button className="w-full" size="lg">
                  {t("cart.checkout")}
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  {t("cart.continueShopping")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
