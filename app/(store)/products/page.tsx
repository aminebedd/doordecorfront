"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { CategoryFilter } from "@/components/category-filter"
import { useTranslation } from "@/lib/i18n/client"
import type { Category, Product, ProductImage } from "@/lib/types"
import { getCategories, getProductImages, getProducts } from "@/services/catalog.service"

function ProductsPageContent() {
  const params = useSearchParams()
  const categoryId = params.get("category") || undefined
  const { t, locale } = useTranslation()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [images, setImages] = useState<ProductImage[]>([])

  useEffect(() => {
    async function load() {
      const [categoriesData, allImages] = await Promise.all([getCategories(), getProductImages()])
      setCategories(categoriesData ?? [])
      setImages(allImages ?? [])
    }
    load().catch(() => {
      setCategories([])
      setImages([])
    })
  }, [])

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts({
        categoryId,
        isAvailable: true,
      })
      setProducts(data ?? [])
    }
    loadProducts().catch(() => setProducts([]))
  }, [categoryId])

  const imageMap = useMemo(() => {
    const map: Record<string, ProductImage> = {}
    for (const img of images) {
      if (!map[img.product_id]) {
        map[img.product_id] = img
      }
    }
    return map
  }, [images])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-foreground">{t("products.title")}</h1>

      <CategoryFilter categories={categories} activeCategory={categoryId} locale={locale} />

      {products.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} image={imageMap[product.id] || null} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center text-muted-foreground">{t("products.empty")}</div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8 text-center text-muted-foreground">Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  )
}
