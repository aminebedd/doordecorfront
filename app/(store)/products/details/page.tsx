"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCustomizer } from "@/components/product-customizer"
import type { Handle, Product } from "@/lib/types"
import {
  getColors,
  getHandles,
  getProductById,
  getProductHandles,
  getProductImages,
} from "@/services/catalog.service"

function ProductDetailPageContent() {
  const params = useSearchParams()
  const id = params.get("id")
  const [product, setProduct] = useState<Product | null>(null)
  const [colors, setColors] = useState<any[]>([])
  const [handles, setHandles] = useState<Handle[]>([])
  const [images, setImages] = useState<any[]>([])
  const [productHandleIds, setProductHandleIds] = useState<string[]>([])

  useEffect(() => {
    if (!id) return
    const productId = id
    async function load() {
      const [productData, colorsData, handlesData, imagesData, productHandles] = await Promise.all([
        getProductById(productId),
        getColors(),
        getHandles(),
        getProductImages(productId),
        getProductHandles(productId),
      ])

      setProduct(productData ?? null)
      setColors(colorsData ?? [])
      setHandles(handlesData ?? [])
      setImages(imagesData ?? [])
      setProductHandleIds((productHandles ?? []).map((item) => item.handle_id))
    }
    load().catch(() => {
      setProduct(null)
      setColors([])
      setHandles([])
      setImages([])
      setProductHandleIds([])
    })
  }, [id])

  const filteredHandles = useMemo(() => {
    if (productHandleIds.length === 0) return handles
    const assigned = new Set(productHandleIds)
    return handles.filter((handle) => assigned.has(handle.id))
  }, [handles, productHandleIds])

  if (!id || !product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-muted-foreground">
        المنتج غير موجود
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 lg:py-6">
      <ProductCustomizer product={product} colors={colors ?? []} handles={filteredHandles} images={images ?? []} />
    </div>
  )
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-8 text-center text-muted-foreground">Loading...</div>}>
      <ProductDetailPageContent />
    </Suspense>
  )
}
