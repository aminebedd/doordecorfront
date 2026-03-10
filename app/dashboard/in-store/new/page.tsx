"use client"

import React, { useEffect, useState, useMemo, useCallback } from "react"
import Image from "next/image"
import {
  Store,
  Loader2,
  Plus,
  Minus,
  Check,
  Printer,
  FileText,
  Trash2,
  Pencil,
  ShoppingCart,
  X,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { printInStoreInvoice, isLightColor } from "@/lib/print-utils"
import { sendTicketToWhatsApp } from "@/lib/pdf-utils"
import type { Category, Product, Color, Handle, ProductImage, Order } from "@/lib/types"
import {
  getCategories,
  getColors,
  getHandles,
  getProductHandles,
  getProductImages,
  getProducts,
} from "@/services/catalog.service"
import { createOrder, createOrderItems, getOrderById } from "@/services/orders.service"

const FALLBACK_MIN_W = 60
const FALLBACK_MAX_W = 200
const FALLBACK_MIN_H = 180
const FALLBACK_MAX_H = 280

interface OrderLine {
  id: string
  product: Product
  color: Color
  handle: Handle
  width: number
  height: number
  quantity: number
  unitPrice: number
  lineTotal: number
  imageUrl: string | null
}

export default function NewInStoreOrderPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [allHandles, setAllHandles] = useState<Handle[]>([])
  const [productHandleMap, setProductHandleMap] = useState<Record<string, string[]>>({})
  const [productImages, setProductImages] = useState<ProductImage[]>([])
  const [dbLoading, setDbLoading] = useState(true)

  const [categoryId, setCategoryId] = useState("")
  const [productId, setProductId] = useState("")
  const [selectedColor, setSelectedColor] = useState<Color | null>(null)
  const [selectedHandle, setSelectedHandle] = useState<Handle | null>(null)
  const [width, setWidth] = useState(90)
  const [height, setHeight] = useState(210)
  const [quantity, setQuantity] = useState(1)

  const [orderLines, setOrderLines] = useState<OrderLine[]>([])
  const [editingLineId, setEditingLineId] = useState<string | null>(null)
  const [showProductForm, setShowProductForm] = useState(true)

  const [customerName, setCustomerName] = useState("")
  const [phone, setPhone] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [catRes, prodRes, colRes, hndRes, imgRes, phRes] = await Promise.all([
          getCategories(),
          getProducts({ isAvailable: true }),
          getColors(),
          getHandles(),
          getProductImages(),
          getProductHandles(),
        ])

        setCategories(catRes ?? [])
        setAllProducts(prodRes ?? [])
        setColors(colRes ?? [])
        setAllHandles(hndRes ?? [])
        setProductImages(imgRes ?? [])

        const phMap: Record<string, string[]> = {}
        for (const row of phRes ?? []) {
          if (!phMap[row.product_id]) phMap[row.product_id] = []
          phMap[row.product_id].push(row.handle_id)
        }
        setProductHandleMap(phMap)
      } catch {
        setCategories([])
        setAllProducts([])
        setColors([])
        setAllHandles([])
        setProductImages([])
        setProductHandleMap({})
        toast.error("خطا في تحميل البيانات")
      } finally {
        setDbLoading(false)
      }
    }
    load().catch(() => setDbLoading(false))
  }, [])

  const filteredProducts = useMemo(() => {
    if (!categoryId) return allProducts
    return allProducts.filter((p) => p.category_id === categoryId)
  }, [categoryId, allProducts])

  const selectedProduct = useMemo(
    () => allProducts.find((p) => p.id === productId) ?? null,
    [productId, allProducts],
  )

  const handles = useMemo(() => {
    if (!productId) return allHandles
    const assigned = productHandleMap[productId]
    if (!assigned || assigned.length === 0) return allHandles
    return allHandles.filter((h) => assigned.includes(h.id))
  }, [productId, allHandles, productHandleMap])

  const MIN_W = selectedProduct ? Number(selectedProduct.min_width) || FALLBACK_MIN_W : FALLBACK_MIN_W
  const MAX_W = selectedProduct ? Number(selectedProduct.max_width) || FALLBACK_MAX_W : FALLBACK_MAX_W
  const MIN_H = selectedProduct ? Number(selectedProduct.min_height) || FALLBACK_MIN_H : FALLBACK_MIN_H
  const MAX_H = selectedProduct ? Number(selectedProduct.max_height) || FALLBACK_MAX_H : FALLBACK_MAX_H

  const currentImages = useMemo(
    () => productImages.filter((img) => img.product_id === productId),
    [productId, productImages],
  )

  const availableColors = useMemo(() => {
    if (currentImages.length === 0) return colors
    const colorIds = new Set(currentImages.map((img) => img.color_id))
    return colors.filter((c) => colorIds.has(c.id))
  }, [currentImages, colors])

  const currentImage = useMemo(() => {
    if (!selectedColor) return currentImages[0]?.image_url ?? null

    if (selectedHandle) {
      const exact = currentImages.find(
        (img) => img.color_id === selectedColor.id && img.handle_id === selectedHandle.id,
      )
      if (exact) return exact.image_url
    }

    const colorOnly = currentImages.find(
      (img) => img.color_id === selectedColor.id && !img.handle_id,
    )
    if (colorOnly) return colorOnly.image_url

    const anyColor = currentImages.find((img) => img.color_id === selectedColor.id)
    if (anyColor) return anyColor.image_url

    return currentImages[0]?.image_url ?? null
  }, [selectedColor, selectedHandle, currentImages])

  useEffect(() => {
    if (selectedProduct) {
      setWidth(selectedProduct.width || 90)
      setHeight(selectedProduct.height || 210)
      setSelectedColor(null)
      setSelectedHandle(handles[0] ?? null)
      setQuantity(1)
    }
  }, [productId, selectedProduct, handles])

  useEffect(() => {
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0])
    }
  }, [availableColors, selectedColor])

  const threshold = selectedProduct ? Number(selectedProduct.width_threshold) || 85 : 85
  const unitPrice = selectedProduct
    ? width <= threshold
      ? Math.round(Number(selectedProduct.price_below))
      : Math.round(Number(selectedProduct.price_above))
    : 0
  const lineTotal = unitPrice * quantity
  const orderTotal = useMemo(() => orderLines.reduce((sum, l) => sum + l.lineTotal, 0), [orderLines])

  const resetProductForm = useCallback(() => {
    setCategoryId("")
    setProductId("")
    setSelectedColor(null)
    setSelectedHandle(null)
    setWidth(90)
    setHeight(210)
    setQuantity(1)
    setEditingLineId(null)
  }, [])

  const addProductLine = useCallback(() => {
    if (!selectedProduct) return toast.error("يرجى اختيار المنتج")
    if (!selectedColor) return toast.error("يرجى اختيار اللون")
    if (!selectedHandle) return toast.error("يرجى اختيار المقبض")

    const newLine: OrderLine = {
      id: editingLineId ?? crypto.randomUUID(),
      product: selectedProduct,
      color: selectedColor,
      handle: selectedHandle,
      width,
      height,
      quantity,
      unitPrice,
      lineTotal,
      imageUrl: currentImage,
    }

    if (editingLineId) {
      setOrderLines((prev) => prev.map((l) => (l.id === editingLineId ? newLine : l)))
      toast.success("تم تعديل المنتج")
    } else {
      setOrderLines((prev) => [...prev, newLine])
      toast.success("تم اضافة المنتج الى الطلب")
    }

    resetProductForm()
    setShowProductForm(false)
  }, [
    selectedProduct,
    selectedColor,
    selectedHandle,
    width,
    height,
    quantity,
    unitPrice,
    lineTotal,
    currentImage,
    editingLineId,
    resetProductForm,
  ])

  const editLine = useCallback((line: OrderLine) => {
    setCategoryId(line.product.category_id || "")
    setProductId(line.product.id)
    setTimeout(() => {
      setSelectedColor(line.color)
      setSelectedHandle(line.handle)
      setWidth(line.width)
      setHeight(line.height)
      setQuantity(line.quantity)
    }, 50)
    setEditingLineId(line.id)
    setShowProductForm(true)
  }, [])

  const removeLine = useCallback(
    (lineId: string) => {
      setOrderLines((prev) => prev.filter((l) => l.id !== lineId))
      if (editingLineId === lineId) {
        resetProductForm()
        setShowProductForm(false)
      }
      toast.success("تم ازالة المنتج")
    },
    [editingLineId, resetProductForm],
  )

  const handleSubmit = useCallback(async () => {
    if (!customerName.trim()) return toast.error("يرجى ادخال اسم العميل")
    if (!phone.trim()) return toast.error("يرجى ادخال رقم الهاتف")
    if (orderLines.length === 0) return toast.error("يرجى اضافة منتج واحد على الاقل")

    setSubmitting(true)

    try {
      const orderCode = `DD-S-${Date.now().toString(36).toUpperCase()}`
      const order = await createOrder({
        order_code: orderCode,
        customer_name: customerName.trim(),
        phone: phone.trim(),
        total_price: orderTotal,
        delivery_price: 0,
        order_status: "IN_PRODUCTION",
        is_online: false,
        user_id: null,
        email: null,
        address: null,
        state: null,
      })

      const items = orderLines.map((line) => ({
        order_id: order.id,
        product_id: line.product.id,
        product_name: line.product.name_ar || line.product.name,
        quantity: line.quantity,
        unit_price: line.unitPrice,
        width: line.width,
        height: line.height,
        selected_color: line.color.name_ar || line.color.name,
        selected_handle: line.handle.name_ar || line.handle.name,
      }))

      await createOrderItems(order.id, items)

      const fullOrder = await getOrderById(order.id).catch(() => null)
      setCreatedOrder((fullOrder as Order | null) ?? order)
      toast.success("تم انشاء الطلب بنجاح")
    } catch {
      toast.error("خطا في انشاء الطلب")
    } finally {
      setSubmitting(false)
    }
  }, [customerName, phone, orderLines, orderTotal])

  if (createdOrder) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent className="flex flex-col items-center gap-6 py-12">
            <div className="rounded-full bg-emerald-100 p-4">
              <Check className="h-10 w-10 text-emerald-600" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">{"تم انشاء الطلب بنجاح"}</h1>
              <p className="mt-2 text-lg font-semibold text-primary">{createdOrder.order_code}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {"الطلب الان في مرحلة الانتاج"} - {createdOrder.order_items?.length || 0} {"منتج"}
              </p>
            </div>
            <Separator />
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" className="gap-2 bg-transparent" onClick={() => printInStoreInvoice(createdOrder)}>
                <FileText className="h-4 w-4" />{"طباعة فاتورة العميل"}
              </Button>

              <Button
                variant="outline"
                className="gap-2 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                onClick={() => sendTicketToWhatsApp(createdOrder)}
              >
                <MessageCircle className="h-4 w-4" />{"إرسال للواتساب"}
              </Button>
            </div>
            <Button
              className="mt-4 gap-2"
              onClick={() => {
                setCreatedOrder(null)
                setCustomerName("")
                setPhone("")
                setOrderLines([])
                resetProductForm()
                setShowProductForm(true)
              }}
            >
              <Plus className="h-4 w-4" />{"انشاء طلب جديد"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (dbLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Store className="h-6 w-6" />{"طلب جديد من المحل"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {"انشاء طلب لعميل حضر مباشرة الى المحل - يمكنك اضافة عدة منتجات في طلب واحد"}
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{"معلومات العميل"}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>{"الاسم الكامل"}</Label>
                <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="اسم العميل" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{"رقم الهاتف"}</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0XX XXX XXXX" dir="ltr" />
              </div>
            </CardContent>
          </Card>

          {orderLines.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShoppingCart className="h-4 w-4" />{"المنتجات في الطلب"} ({orderLines.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {orderLines.map((line, idx) => (
                  <div key={line.id} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                    <div className="relative h-20 w-[44px] shrink-0 overflow-hidden rounded-md bg-muted">
                      {line.imageUrl ? (
                        <Image src={line.imageUrl || "/placeholder.svg"} alt="" fill className="object-cover" sizes="48px" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Store className="h-5 w-5 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{idx + 1}</span>
                        <p className="truncate text-sm font-semibold text-foreground">{line.product.name_ar || line.product.name}</p>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span
                            className="inline-block h-3 w-3 rounded-full border"
                            style={
                              line.color.secondary_code
                                ? { background: `linear-gradient(135deg, ${line.color.code} 50%, ${line.color.secondary_code} 50%)` }
                                : { backgroundColor: line.color.code }
                            }
                          />
                          {line.color.name_ar || line.color.name}
                        </span>
                        <span>{line.handle.name_ar || line.handle.name}</span>
                        <span dir="ltr">{line.width}x{line.height} {"سم"}</span>
                        <span>x{line.quantity}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-sm font-bold text-primary">{line.lineTotal.toLocaleString()} {"د.ج"}</span>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => editLine(line)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeLine(line.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {showProductForm ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{editingLineId ? "تعديل المنتج" : "اضافة منتج"}</span>
                  {orderLines.length > 0 && !editingLineId && (
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => { setShowProductForm(false); resetProductForm() }}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label>{"القسم"}</Label>
                    <Select value={categoryId || "all"} onValueChange={(v) => { setCategoryId(v === "all" ? "" : v); setProductId("") }}>
                      <SelectTrigger><SelectValue placeholder="كل الاقسام" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{"كل الاقسام"}</SelectItem>
                        {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name_ar || c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>{"المنتج"}</Label>
                    <Select value={productId} onValueChange={setProductId}>
                      <SelectTrigger><SelectValue placeholder="اختر المنتج" /></SelectTrigger>
                      <SelectContent>
                        {filteredProducts.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name_ar || p.name} - {Number(p.price_below).toLocaleString()}/{Number(p.price_above).toLocaleString()} {"د.ج"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedProduct && (
                  <>
                    {currentImage && (
                      <div className="relative mx-auto aspect-[5/9] w-full max-w-[200px] overflow-hidden rounded-lg bg-muted">
                        <Image src={currentImage || "/placeholder.svg"} alt="" fill className="object-contain" sizes="200px" />
                      </div>
                    )}
                    <div>
                      <Label className="mb-2 block text-sm font-semibold">{"اللون: "}<span className="font-normal text-muted-foreground">{selectedColor?.name_ar || selectedColor?.name || "لم يتم الاختيار"}</span></Label>
                      <div className="flex flex-wrap gap-2">
                        {availableColors.map((color) => {
                          const sel = selectedColor?.id === color.id
                          return (
                            <button
                              type="button"
                              key={color.id}
                              onClick={() => setSelectedColor(color)}
                              className={`group relative h-10 w-10 overflow-hidden rounded-full border-2 transition-all ${sel ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50"}`}
                              style={
                                color.secondary_code
                                  ? { background: `linear-gradient(135deg, ${color.code} 50%, ${color.secondary_code} 50%)` }
                                  : { backgroundColor: color.code }
                              }
                              title={color.name_ar || color.name}
                            >
                              {sel && <Check className={`absolute inset-0 m-auto h-4 w-4 ${isLightColor(color.code) ? "text-foreground" : "text-primary-foreground"}`} />}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block text-sm font-semibold">{"المقبض"}</Label>
                      <div className="flex flex-col gap-2">
                        {handles.map((handle) => {
                          const sel = selectedHandle?.id === handle.id
                          return (
                            <button
                              type="button"
                              key={handle.id}
                              onClick={() => setSelectedHandle(handle)}
                              className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-sm transition-all ${sel ? "border-primary bg-primary/5 text-foreground" : "border-border bg-card text-foreground hover:border-primary/50"}`}
                            >
                              {handle.image_url && (
                                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                                  <Image src={handle.image_url || "/placeholder.svg"} alt="" fill className="object-cover" sizes="40px" />
                                </div>
                              )}
                              <span className="flex-1 text-right font-medium">{handle.name_ar || handle.name}</span>
                              {sel && <Check className="h-4 w-4 shrink-0 text-primary" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block text-sm font-semibold">{"الابعاد (سم)"}</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs text-muted-foreground">{`العرض (${MIN_W}-${MAX_W})`}</Label>
                          <Input type="number" value={width} onChange={(e) => setWidth(Math.max(MIN_W, Math.min(MAX_W, Number(e.target.value))))} min={MIN_W} max={MAX_W} dir="ltr" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs text-muted-foreground">{`الارتفاع (${MIN_H}-${MAX_H})`}</Label>
                          <Input type="number" value={height} onChange={(e) => setHeight(Math.max(MIN_H, Math.min(MAX_H, Number(e.target.value))))} min={MIN_H} max={MAX_H} dir="ltr" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block text-sm font-semibold">{"الكمية"}</Label>
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" className="bg-transparent" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                        <Button variant="outline" size="icon" className="bg-transparent" onClick={() => setQuantity(quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{"سعر الوحدة"}</span>
                        <span className="font-medium">{unitPrice.toLocaleString()} {"د.ج"}</span>
                      </div>
                      {quantity > 1 && (
                        <div className="mt-1 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{"الكمية"}</span>
                          <span className="font-medium">x{quantity}</span>
                        </div>
                      )}
                      <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-base font-bold">
                        <span>{"اجمالي هذا المنتج"}</span>
                        <span className="text-primary">{lineTotal.toLocaleString()} {"د.ج"}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 gap-2" onClick={addProductLine}>
                        {editingLineId ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {editingLineId ? "حفظ التعديل" : "اضافة الى الطلب"}
                      </Button>
                      {editingLineId && (
                        <Button variant="outline" className="bg-transparent" onClick={() => { resetProductForm(); setShowProductForm(orderLines.length === 0) }}>
                          {"الغاء"}
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Button
              variant="outline"
              className="gap-2 border-2 border-dashed bg-transparent py-8 text-muted-foreground hover:text-foreground"
              onClick={() => {
                resetProductForm()
                setShowProductForm(true)
              }}
            >
              <Plus className="h-5 w-5" />{"اضافة منتج اخر"}
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{"ملخص الطلب"}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {orderLines.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-6 text-center text-muted-foreground">
                  <ShoppingCart className="h-10 w-10 opacity-20" />
                  <p className="text-sm">{"لم يتم اضافة منتجات بعد"}</p>
                </div>
              ) : (
                <>
                  {orderLines.map((line, i) => (
                    <div key={line.id} className="flex items-center justify-between text-sm">
                      <span className="truncate text-muted-foreground">{i + 1}. {line.product.name_ar || line.product.name} (x{line.quantity})</span>
                      <span className="shrink-0 font-medium">{line.lineTotal.toLocaleString()} {"د.ج"}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>{"الاجمالي"}</span>
                    <span className="text-primary">{orderTotal.toLocaleString()} {"د.ج"}</span>
                  </div>
                </>
              )}
              <Button
                size="lg"
                className="mt-2 w-full gap-2"
                onClick={handleSubmit}
                disabled={submitting || !customerName || !phone || orderLines.length === 0}
              >
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Printer className="h-5 w-5" />}
                {submitting ? "جاري الانشاء..." : `انشاء الطلب (${orderLines.length} منتج)`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
