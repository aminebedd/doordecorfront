"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ShoppingCart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { subscribe, getCart } from "@/lib/cart"
import { useTranslation } from "@/lib/i18n/client"
import type { Profile } from "@/lib/types"
import { getCurrentUser, logout } from "@/services/auth.service"

export function SiteHeader() {
  const router = useRouter()
  const { t, locale, switchLocale } = useTranslation()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Use state + effect for cart count to avoid hydration mismatch (cookies are client-only)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Initial read
    setCartCount(getCart().reduce((sum, i) => sum + i.quantity, 0))
    // Subscribe to changes
    const unsub = subscribe(() => {
      setCartCount(getCart().reduce((sum, i) => sum + i.quantity, 0))
    })
    return unsub
  }, [])

  useEffect(() => {
    async function loadUser() {
      const user = await getCurrentUser()
      setProfile(user)
      setIsLoggedIn(!!user)
    }
    loadUser().catch(() => {
      setProfile(null)
      setIsLoggedIn(false)
    })
  }, [])

  async function handleLogout() {
    await logout()
    setIsLoggedIn(false)
    setProfile(null)
    router.push("/")
    router.refresh()
  }

  const dashboardLink = profile?.role === "admin" ? "/admin" : "/dashboard"

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Door & Decor"
            width={40}
            height={40}
            className="h-10 w-10 rounded-md object-contain"
          />
          <span className="text-lg font-bold tracking-tight text-primary">
            {"Door"}<span className="text-[hsl(var(--accent-foreground))]">{"&"}</span>{"Decor"}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground">
            {t("nav.home")}
          </Link>
          <Link href="/products" className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground">
            {t("nav.products")}
          </Link>
          <Link href="/track" className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground">
            {t("nav.track")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {/* Cart Icon */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
              <span className="sr-only">{t("nav.cart")}</span>
            </Button>
          </Link>

          {isLoggedIn &&
            profile &&
            ["admin", "employee"].includes(profile.role) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">{t("nav.account")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {profile.full_name || t("nav.user")}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(dashboardLink)}>
                    <LayoutDashboard className={`h-4 w-4 ${locale === "ar" ? "ml-2" : "mr-2"}`} />
                    {t("nav.dashboard")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className={`h-4 w-4 ${locale === "ar" ? "ml-2" : "mr-2"}`} />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

          <Button
            variant="ghost"
            size="sm"
            className="px-2 text-xs font-bold"
            onClick={() => switchLocale(locale === "ar" ? "fr" : "ar")}
          >
            {t("lang.switch")}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-2">
            <Link href="/" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
              {t("nav.home")}
            </Link>
            <Link href="/products" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
              {t("nav.products")}
            </Link>
            <Link href="/track" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
              {t("nav.track")}
            </Link>
            <Link href="/cart" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
              {t("nav.cart")} {cartCount > 0 && `(${cartCount})`}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
