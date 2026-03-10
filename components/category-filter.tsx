"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/client"
import type { Category } from "@/lib/types"
import type { Locale } from "@/lib/i18n/settings"

export function CategoryFilter({
  categories,
  activeCategory,
  locale: localeProp,
}: {
  categories: Category[]
  activeCategory?: string
  locale?: Locale
}) {
  const { t, locale: ctxLocale } = useTranslation()
  const locale = localeProp || ctxLocale
  const isAr = locale === "ar"

  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/products">
        <Button variant={!activeCategory ? "default" : "outline"} size="sm">
          {t("products.all")}
        </Button>
      </Link>
      {categories.map((cat) => (
        <Link key={cat.id} href={`/products?category=${cat.id}`}>
          <Button
            variant={activeCategory === cat.id ? "default" : "outline"}
            size="sm"
          >
            {isAr ? (cat.name_ar || cat.name) : (cat.name || cat.name_ar)}
          </Button>
        </Link>
      ))}
    </div>
  )
}
