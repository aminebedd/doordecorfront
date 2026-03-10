"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n/client"

function OrderSuccessPageContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  const { t } = useTranslation()

  return (
    <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-20">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl">{t("orderSuccess.title")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {code && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">{t("orderSuccess.orderNumber")}</p>
              <p className="mt-1 text-lg font-bold text-foreground" dir="ltr">
                {code}
              </p>
            </div>
          )}
          <p className="text-sm text-muted-foreground">{t("orderSuccess.message")}</p>
          <div className="flex flex-col gap-2">
            <Link href="/products">
              <Button className="w-full">{t("orderSuccess.continueShopping")}</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full bg-transparent">
                {t("orderSuccess.backHome")}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">Loading...</div>}>
      <OrderSuccessPageContent />
    </Suspense>
  )
}
