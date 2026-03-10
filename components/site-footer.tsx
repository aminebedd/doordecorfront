"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/lib/i18n/client"

export function SiteFooter() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Image src="/images/logo.png" alt="Door & Decor" width={36} height={36} className="h-9 w-9 rounded-md object-contain" />
              <h3 className="text-lg font-bold text-primary">{"Door"}<span className="text-[hsl(var(--accent-foreground))]">{"&"}</span>{"Decor"}</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("footer.description")}
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              {t("footer.quickLinks")}
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">
                {t("nav.products")}
              </Link>
              <Link href="/track" className="text-sm text-muted-foreground hover:text-foreground">
                {t("nav.track")}
              </Link>
            </nav>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              {t("footer.contact")}
            </h4>
            <p className="text-sm text-muted-foreground">
              {t("footer.emailLabel")} info@doordecor.dz
            </p>
            <p className="text-sm text-muted-foreground">{t("footer.phoneLabel")} 0555-123456</p>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          {"Door & Decor"} &copy; {new Date().getFullYear()} - {t("footer.rights")}
        </div>
      </div>
    </footer>
  )
}
