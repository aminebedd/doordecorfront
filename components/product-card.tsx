import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product, ProductImage } from "@/lib/types"
import type { Locale } from "@/lib/i18n/settings"

export function ProductCard({
  product,
  image,
  locale = "ar",
}: {
  product: Product & { categories?: { name_ar: string | null; name: string } }
  image?: ProductImage | null
  locale?: Locale
}) {
  const isAr = locale === "ar"
  const productName = isAr ? (product.name_ar || product.name) : (product.name || product.name_ar)
  const productDesc = isAr ? (product.description_ar || product.description) : (product.description || product.description_ar)
  const categoryName = product.categories ? (isAr ? (product.categories.name_ar || product.categories.name) : (product.categories.name || product.categories.name_ar)) : null
  const currency = isAr ? "د.ج" : "DA"
  const orLabel = isAr ? "او" : "ou"
  return (
    <Link href={`/products/details?id=${product.id}`}>
      <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-md">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {image?.image_url ? (
            <Image
              src={image.image_url || "/placeholder.svg"}
              alt={productName || "اسم المنتج"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <svg
                className="h-16 w-16 opacity-20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <rect x="4" y="2" width="16" height="20" rx="1" />
                <circle cx="16" cy="12" r="1.5" />
                <line x1="4" y1="6" x2="20" y2="6" />
              </svg>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                {productName}
              </h3>
              {categoryName && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  {categoryName}
                </Badge>
              )}
            </div>
            <div className="flex flex-col items-end text-left">
              <span className="font-bold text-primary">
                {Number(product.price_below).toLocaleString()} {currency}
              </span>
              {Number(product.price_below) !== Number(product.price_above) && (
                <span className="text-xs text-muted-foreground">
                  {orLabel} {Number(product.price_above).toLocaleString()} {currency}
                </span>
              )}
            </div>
          </div>
          {productDesc && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {productDesc}
            </p>
          )}
          <div className="mt-3 flex gap-2 text-xs text-muted-foreground">
            <span>
              {product.width} x {product.height} {isAr ? "سم" : "cm"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
