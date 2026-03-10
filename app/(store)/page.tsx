"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Shield, Truck, Palette, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { isRTL } from "@/lib/i18n/settings"
import { useTranslation } from "@/lib/i18n/client"
import type { Category, Product, ProductImage } from "@/lib/types"
import { getCategories, getProductImages, getProducts } from "@/services/catalog.service"

export default function HomePage() {
  const { t, locale } = useTranslation()
  const rtl = isRTL(locale)
  const ArrowIcon = rtl ? ArrowLeft : ArrowRight
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<ProductImage[]>([])

  useEffect(() => {
    async function load() {
      const [productsData, categoriesData] = await Promise.all([
        getProducts({ isAvailable: true, limit: 6 }),
        getCategories(),
      ])
      setProducts(productsData ?? [])
      setCategories(categoriesData ?? [])

      const imagesData = await getProductImages()
      setImages(imagesData ?? [])
    }
    load().catch(() => {
      setProducts([])
      setCategories([])
      setImages([])
    })
  }, [])

  const imageMap = useMemo(() => {
    const map: Record<string, ProductImage | null> = {}
    const ids = new Set(products.map((p) => p.id))
    for (const img of images) {
      if (!ids.has(img.product_id)) continue
      if (!map[img.product_id]) map[img.product_id] = img
    }
    return map
  }, [images, products])

  return (
    <div>
      <section className="relative overflow-hidden bg-primary">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-20 md:flex-row md:py-28">
          <div className={`flex-1 text-center ${rtl ? "md:text-right" : "md:text-left"}`}>
            <h1 className="text-balance text-4xl font-bold leading-tight text-primary-foreground md:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-primary-foreground/80">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link href="/products">
                <Button size="lg" variant="secondary" className="gap-2 font-semibold">
                  {t("hero.cta")}
                  <ArrowIcon className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative aspect-[5/9] w-full max-w-sm overflow-hidden rounded-lg">
            <Image src="/images/hero-door.jpg" alt={t("hero.imageAlt")} fill className="object-cover" priority />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3">
          {[
            { icon: Palette, title: t("feature.customization"), desc: t("feature.customizationDesc") },
            { icon: Truck, title: t("feature.delivery"), desc: t("feature.deliveryDesc") },
            { icon: Shield, title: t("feature.quality"), desc: t("feature.qualityDesc") },
          ].map((feature) => (
            <Card key={feature.title} className="border-0 bg-transparent shadow-none">
              <CardContent className="flex items-start gap-4 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-8 text-center text-2xl font-bold text-foreground">{t("section.categories")}</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/products?category=${cat.id}`}>
                  <Card className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-md">
                    {cat.image_url ? (
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={cat.image_url || "/placeholder.svg"}
                          alt={locale === "ar" ? cat.name_ar || cat.name || "" : cat.name || cat.name_ar || ""}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <h3 className={`absolute bottom-3 ${rtl ? "right-3" : "left-3"} font-semibold text-white`}>
                          {locale === "ar" ? cat.name_ar || cat.name : cat.name || cat.name_ar}
                        </h3>
                      </div>
                    ) : (
                      <CardContent className="flex flex-col items-center gap-3 p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <FolderOpen className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground">
                          {locale === "ar" ? cat.name_ar || cat.name : cat.name || cat.name_ar}
                        </h3>
                      </CardContent>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="bg-muted/50 py-14">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">{t("section.featured")}</h2>
              <Link href="/products">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  {t("section.viewAll")}
                  <ArrowIcon className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} image={imageMap[product.id] || null} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
