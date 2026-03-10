import React from "react"
import type { Metadata, Viewport } from "next"
import { Toaster } from "@/components/ui/sonner"
import { defaultLocale, isRTL } from "@/lib/i18n/settings"
import { LocaleProvider } from "@/lib/i18n/client"

import "./globals.css"

export const metadata: Metadata = {
  title: "Door & Decor - Premium Modern Doors",
  description:
    "Shop premium modern doors with custom colors, handles, and dimensions. Ready-made and custom doors for your home.",
}

export const viewport: Viewport = {
  themeColor: "#5C3A1E",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = defaultLocale
  const rtl = isRTL(defaultLocale)

  return (
    <html lang={locale} dir={rtl ? "rtl" : "ltr"}>
      <body className="font-sans antialiased">
        <LocaleProvider locale={locale}>
          {children}
        </LocaleProvider>
        <Toaster />
      </body>
    </html>
  )
}
