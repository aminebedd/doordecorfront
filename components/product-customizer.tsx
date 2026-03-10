"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Check, Minus, Plus, ShoppingCart, X } from "lucide-react"
import { addToCart } from "@/lib/cart"
import { toast } from "sonner"
import { useTranslation } from "@/lib/i18n/client"
import type { Product, Color, Handle, ProductImage } from "@/lib/types"

export function ProductCustomizer({
  product,
  colors,
  handles,
  images,
}: {
  product: Product
  colors: Color[]
  handles: Handle[]
  images: ProductImage[]
}) {
  const { t, locale } = useTranslation()
  const isAr = locale === "ar"
  const MIN_WIDTH = Number(product.min_width) || 60
  const MAX_WIDTH = Number(product.max_width) || 200
  const MIN_HEIGHT = Number(product.min_height) || 180
  const MAX_HEIGHT = Number(product.max_height) || 280
  // Filter colors to only those that have images for THIS product
  const availableColors = useMemo(() => {
    if (images.length === 0) return colors
    const colorIdsWithImages = new Set(images.map((img) => img.color_id))
    return colors.filter((c) => colorIdsWithImages.has(c.id))
  }, [colors, images])

  const initialColor = availableColors[0] || null
  const freeHandle = handles[0] || null

  const [selectedColor, setSelectedColor] = useState<Color | null>(initialColor)
  const [selectedHandle, setSelectedHandle] = useState<Handle | null>(freeHandle)
  const [width, setWidth] = useState(product.width || 90)
  const [height, setHeight] = useState(product.height || 210)
  const [quantity, setQuantity] = useState(1)
  const [lightboxHandle, setLightboxHandle] = useState<Handle | null>(null)
  const [showImageLightbox, setShowImageLightbox] = useState(false)

  // Dynamic image based on selected door color only (handle does NOT affect image)
  const currentImage = useMemo(() => {
    if (!selectedColor) return images[0]?.image_url || null
    // 1. Color-only match (handle_id is null) — preferred
    const colorOnly = images.find(
      (img) => img.color_id === selectedColor.id && !img.handle_id,
    )
    if (colorOnly) return colorOnly.image_url
    // 2. Any image with this color
    const anyColor = images.find((img) => img.color_id === selectedColor.id)
    if (anyColor) return anyColor.image_url
    // 3. Fallback
    return images[0]?.image_url || null
  }, [selectedColor, images])

  // Price: two fixed tiers based on width threshold only
  const threshold = Number(product.width_threshold) || 85
  const unitPrice = width <= threshold
    ? Math.round(Number(product.price_below))
    : Math.round(Number(product.price_above))
  const totalPrice = unitPrice * quantity

  function handleAddToCart() {
    if (!selectedColor) {
      toast.error(t("customizer.selectColor"))
      return
    }
    if (!selectedHandle) {
      toast.error(t("customizer.selectHandle"))
      return
    }
    if (width < MIN_WIDTH || width > MAX_WIDTH) {
      toast.error(t("customizer.widthError", { min: MIN_WIDTH, max: MAX_WIDTH }))
      return
    }
    if (height < MIN_HEIGHT || height > MAX_HEIGHT) {
      toast.error(t("customizer.heightError", { min: MIN_HEIGHT, max: MAX_HEIGHT }))
      return
    }

    addToCart({
      id: `${product.id}-${selectedColor.id}-${selectedHandle.id}-${width}-${height}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productNameAr: product.name_ar,
      colorId: selectedColor.id,
      colorName: selectedColor.name,
      colorNameAr: selectedColor.name_ar,
  colorCode: selectedColor.code,
  colorSecondaryCode: selectedColor.secondary_code || null,
  handleId: selectedHandle.id,
      handleName: selectedHandle.name,
      handleNameAr: selectedHandle.name_ar,
      handlePrice: 0,
      width,
      height,
      quantity,
      unitPrice,
      imageUrl: currentImage,
    })
    toast.success(t("customizer.addedToCart"))
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Image Section – natural aspect ratio, click to enlarge */}
      <div className="flex flex-col gap-3 lg:sticky lg:top-4 lg:self-start">
        <button
          type="button"
          onClick={() => currentImage && setShowImageLightbox(true)}
          className="relative w-full overflow-hidden rounded-xl border border-border bg-muted"
          aria-label={t("customizer.enlargeImage")}
        >
          {currentImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage}
                alt={product.name_ar || product.name}
                className="w-full max-h-[45vh] object-contain lg:max-h-[50vh]"
              />
              <div className="absolute bottom-2 left-2 rounded-full bg-background/80 p-1.5 shadow-md backdrop-blur-sm">
                <svg className="h-4 w-4 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M11 8v6" /><path d="M8 11h6" />
                </svg>
              </div>
            </>
          ) : (
            <div className="flex h-[45vh] items-center justify-center text-muted-foreground lg:h-[50vh]">
              <svg className="h-20 w-20 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                <rect x="4" y="2" width="16" height="20" rx="1" />
                <circle cx="16" cy="12" r="1.5" />
              </svg>
            </div>
          )}
        </button>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img) => {
              const imgColor = availableColors.find((c) => c.id === img.color_id)
              const isActive = selectedColor?.id === img.color_id
              return (
                <button
                  type="button"
                  key={img.id}
                  onClick={() => { if (imgColor) setSelectedColor(imgColor) }}
                  className={`relative h-16 w-[36px] shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                    isActive ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50"
                  }`}
                >
                  <Image src={img.image_url || "/placeholder.svg"} alt={imgColor?.name_ar || ""} fill className="object-cover" sizes="56px" />
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="flex flex-col gap-6">
        {/* Product Info */}
        <div>
          {product.categories && (
            <Badge variant="secondary" className="mb-2">
              {isAr
                ? ((product.categories as { name_ar: string | null; name: string }).name_ar || (product.categories as { name_ar: string | null; name: string }).name)
                : ((product.categories as { name_ar: string | null; name: string }).name || (product.categories as { name_ar: string | null; name: string }).name_ar)}
            </Badge>
          )}
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            {isAr ? (product.name_ar || product.name) : (product.name || product.name_ar)}
          </h1>
          {(product.description_ar || product.description) && (
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {isAr ? (product.description_ar || product.description) : (product.description || product.description_ar)}
            </p>
          )}
          <p className="mt-3 text-2xl font-bold text-primary">
            {unitPrice.toLocaleString()} {t("products.currency")}
          </p>
        </div>

        <Separator />

        {/* Color Selection */}
        <div>
          <Label className="mb-3 block text-sm font-semibold">
            {t("customizer.color")}{" "}
            <span className="font-normal text-muted-foreground">
              {selectedColor
                ? (isAr ? (selectedColor.name_ar || selectedColor.name) : (selectedColor.name || selectedColor.name_ar))
                : t("customizer.noColorSelected")}
            </span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => {
              const isSelected = selectedColor?.id === color.id
              return (
                <button
                  type="button"
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  className={`group relative h-10 w-10 rounded-full border-2 transition-all overflow-hidden ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border hover:border-primary/50"
                  }`}
                  style={
                    color.secondary_code
                      ? { background: `linear-gradient(135deg, ${color.code} 50%, ${color.secondary_code} 50%)` }
                      : { backgroundColor: color.code }
                  }
                  title={isAr ? (color.name_ar ?? color.name ?? undefined) : (color.name ?? color.name_ar ?? undefined)}
                >
                  {isSelected && (
                    <Check
                      className={`absolute inset-0 m-auto h-4 w-4 ${
                        isLightColor(color.code)
                          ? "text-foreground"
                          : "text-primary-foreground"
                      }`}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Handle Selection – Image Card Grid */}
        <div>
          <Label className="mb-3 block text-sm font-semibold">{t("customizer.handle")}</Label>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {handles.map((handle) => {
              const isSelected = selectedHandle?.id === handle.id
              return (
                <div key={handle.id} className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedHandle(handle)}
                    className={`relative flex h-20 w-full items-center justify-center overflow-hidden rounded-lg border-2 bg-muted transition-all ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {handle.image_url ? (
                      <Image
                        src={handle.image_url}
                        alt={handle.name_ar || handle.name}
                        fill
                        className="object-contain p-1"
                        sizes="100px"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">{t("customizer.noImage")}</span>
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </button>
                  <span className="text-center text-xs font-medium leading-tight text-foreground">
                    {isAr ? (handle.name_ar || handle.name) : (handle.name || handle.name_ar)}
                  </span>
                  {handle.image_url && (
                    <button
                      type="button"
                      onClick={() => setLightboxHandle(handle)}
                      className="text-xs text-primary underline-offset-2 hover:underline"
                    >
                      {t("customizer.viewImage")}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <Label className="mb-3 block text-sm font-semibold">
            {t("customizer.dimensions")}
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">
                {t("customizer.width") + " (" + MIN_WIDTH + "-" + MAX_WIDTH + ")"}
              </Label>
              <Input
                type="number"
                value={width}
                onChange={(e) =>
                  setWidth(
                    Math.max(
                      MIN_WIDTH,
                      Math.min(MAX_WIDTH, Number(e.target.value)),
                    ),
                  )
                }
                min={MIN_WIDTH}
                max={MAX_WIDTH}
                dir="ltr"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">
                {t("customizer.height") + " (" + MIN_HEIGHT + "-" + MAX_HEIGHT + ")"}
              </Label>
              <Input
                type="number"
                value={height}
                onChange={(e) =>
                  setHeight(
                    Math.max(
                      MIN_HEIGHT,
                      Math.min(MAX_HEIGHT, Number(e.target.value)),
                    ),
                  )
                }
                min={MIN_HEIGHT}
                max={MAX_HEIGHT}
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <Label className="mb-3 block text-sm font-semibold">{t("customizer.quantity")}</Label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="bg-transparent"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center text-lg font-semibold">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="bg-transparent"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Price Summary */}
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{t("customizer.doorPrice")}{width <= threshold ? ` (\u2264 ${threshold} ${t("products.cm")})` : ` (> ${threshold} ${t("products.cm")})`}</span>
            <span>{unitPrice.toLocaleString()} {t("products.currency")}</span>
          </div>
          {quantity > 1 && (
            <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
              <span>{t("customizer.qty")}</span>
              <span>x{quantity}</span>
            </div>
          )}
          <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-lg font-bold text-foreground">
            <span>{t("customizer.total")}</span>
            <span className="text-primary">
              {totalPrice.toLocaleString()} {t("products.currency")}
            </span>
          </div>
        </div>

        <Button
          size="lg"
          onClick={handleAddToCart}
          className="gap-2 text-base"
          disabled={!product.is_available}
        >
          <ShoppingCart className="h-5 w-5" />
          {product.is_available ? t("customizer.addToCart") : t("customizer.unavailable")}
        </Button>
      </div>

      {/* Product Image Lightbox */}
      {showImageLightbox && currentImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowImageLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label={product.name_ar || product.name}
        >
          <div
            className="relative max-h-[90vh] max-w-3xl overflow-hidden rounded-xl bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowImageLightbox(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-1.5 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-background"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">{t("customizer.close")}</span>
            </button>
            <div className="relative" style={{ width: "min(90vw, 450px)", aspectRatio: "5/9" }}>
              <Image
                src={currentImage}
                alt={
  isAr
    ? (product.name_ar ?? product.name ?? "product image")
    : (product.name ?? product.name_ar ?? "product image")
}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 90vw, 700px"
              />
            </div>
          </div>
        </div>
      )}

      {/* Handle Image Lightbox */}
      {lightboxHandle && lightboxHandle.image_url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setLightboxHandle(null)}
          role="dialog"
          aria-modal="true"
        aria-label={
  isAr
    ? (lightboxHandle.name_ar ?? lightboxHandle.name ?? undefined)
    : (lightboxHandle.name ?? lightboxHandle.name_ar ?? undefined)
}>
          <div
            className="relative max-h-[85vh] max-w-lg overflow-hidden rounded-xl bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxHandle(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-1.5 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-background"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">{t("customizer.close")}</span>
            </button>
            <div className="relative aspect-square w-full max-w-lg">
              <Image
                src={lightboxHandle.image_url}
              alt={
  isAr
    ? (lightboxHandle.name_ar ?? lightboxHandle.name ?? "handle image")
    : (lightboxHandle.name ?? lightboxHandle.name_ar ?? "handle image")
}fill
                className="object-contain p-4"
                sizes="(max-width: 512px) 100vw, 512px"
              />
            </div>
            <div className="border-t border-border px-4 py-3 text-center">
              <p className="font-semibold text-foreground">{isAr ? (lightboxHandle.name_ar || lightboxHandle.name) : (lightboxHandle.name || lightboxHandle.name_ar)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function isLightColor(hex: string): boolean {
  const clean = hex.replace("#", "")
  const r = Number.parseInt(clean.slice(0, 2), 16)
  const g = Number.parseInt(clean.slice(2, 4), 16)
  const b = Number.parseInt(clean.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 186
}
