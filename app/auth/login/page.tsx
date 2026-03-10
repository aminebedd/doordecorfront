"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Lock, ArrowRight, ArrowLeft } from "lucide-react"
import { useTranslation } from "@/lib/i18n/client"
import { getCurrentUser, login, logout } from "@/services/auth.service"

export default function LoginPage() {
  const router = useRouter()
  const { t, locale } = useTranslation()
  const isAr = locale === "ar"
  const BackArrow = isAr ? ArrowRight : ArrowLeft
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await login({ email, password })

      // Verify the cookie-backed session is immediately readable before redirect.
      let profile = await getCurrentUser()
      if (!profile) {
        await new Promise((resolve) => setTimeout(resolve, 120))
        profile = await getCurrentUser()
      }

      if (!profile || !["admin", "employee"].includes(profile.role)) {
        await logout().catch(() => undefined)
        setError(t("login.unauthorized"))
        setLoading(false)
        return
      }

      toast.success(t("login.success"))
      if (profile.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
      router.refresh()
    } catch {
      setError(t("login.error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-4 inline-flex items-center gap-2">
            <img src="/images/logo.png" alt="Door & Decor" className="h-12 w-12 rounded-md object-contain" />
            <span className="text-2xl font-bold text-primary">{"Door & Decor"}</span>
          </Link>
        </div>

        <Card className="border-border">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">{t("login.title")}</CardTitle>
            <CardDescription>{t("login.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {error && <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">{t("login.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@doordecor.dz"
                  dir="ltr"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">{t("login.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  dir="ltr"
                  required
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? t("login.loading") : t("login.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <BackArrow className="h-4 w-4" />
            {t("login.backToStore")}
          </Link>
        </div>
      </div>
    </div>
  )
}
