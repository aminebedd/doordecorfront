"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FileText,
  LogOut,
  BarChart3,
  Users,
  Palette,
  MapPin,
  FolderOpen,
  Home,
  ClipboardList,
  Factory,
  Store,
  Receipt,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Profile } from "@/lib/types"
import { logout } from "@/services/auth.service"

const employeeLinks = [
  { href: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/dashboard/pending", label: "الطلبات المعلقة", icon: ClipboardList },
  { href: "/dashboard/production", label: "قيد الانتاج", icon: Factory },
  { href: "/dashboard/in-store/new", label: "طلب من المحل", icon: Store },
]

const adminLinks = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/orders", label: "الطلبات", icon: FileText },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/categories", label: "الاقسام", icon: FolderOpen },
  { href: "/admin/colors-handles", label: "الالوان والمقابض", icon: Palette },
  { href: "/admin/delivery", label: "ولايات التوصيل", icon: MapPin },
  { href: "/admin/users", label: "المستخدمين", icon: Users },
  { href: "/admin/adjustments", label: "الخصومات", icon: Receipt },
  { href: "/admin/stats", label: "الاحصائيات", icon: BarChart3 },
]

export function DashboardNav({
  profile,
  section,
}: {
  profile: Profile
  section: "employee" | "admin"
}) {
  const pathname = usePathname()
  const router = useRouter()
  const links = section === "admin" ? adminLinks : employeeLinks

  async function handleLogout() {
    await logout()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-l border-border bg-card">
      <div className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Door & Decor" className="h-9 w-9 rounded-md object-contain" />
          <span className="text-xl font-bold text-primary">{"Door & Decor"}</span>
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">
          {section === "admin" ? "لوحة الادارة" : "لوحة الموظف"}
        </p>
      </div>

      <Separator />

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" &&
              link.href !== "/admin" &&
              pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <Separator />

      <div className="p-3">
        <div className="mb-3 rounded-md bg-muted p-3">
          <p className="text-sm font-medium text-foreground" suppressHydrationWarning>
            {profile.full_name || "المستخدم"}
          </p>
          <p className="text-xs text-muted-foreground" suppressHydrationWarning>
            {profile.role === "admin" ? "مدير" : "موظف"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-muted hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            الرجوع للموقع
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </div>
      </div>
    </aside>
  )
}
