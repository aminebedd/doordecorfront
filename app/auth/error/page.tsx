"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function AuthErrorPageContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-xl">حدث خطا</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            {error
              ? `كود الخطا: ${error}`
              : "حدث خطا غير محدد. يرجى المحاولة مرة اخرى."}
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/auth/login">
              <Button className="w-full">العودة لتسجيل الدخول</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full bg-transparent">
                الرئيسية
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background px-4 text-muted-foreground">Loading...</div>}>
      <AuthErrorPageContent />
    </Suspense>
  )
}
