"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import type { Profile } from "@/lib/types"
import { getCurrentUser } from "@/services/auth.service"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser()
      if (!user) {
        router.replace("/auth/login")
        return
      }
      if (!["employee", "admin"].includes(user.role)) {
        router.replace("/")
        return
      }
      setProfile(user)
    }
    load().catch(() => router.replace("/auth/login"))
  }, [router])

  if (!profile) {
    return <div className="p-6 text-sm text-muted-foreground">جار التحقق...</div>
  }

  return (
    <div className="flex min-h-screen">
      <DashboardNav profile={profile} section="employee" />
      <main className="flex-1 overflow-auto bg-background p-6">{children}</main>
    </div>
  )
}
