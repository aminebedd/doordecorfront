"use client"

import React, { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import type { OwnerAdjustment } from "@/lib/types"
import { getCurrentUser } from "@/services/auth.service"
import {
  createOwnerAdjustment,
  deleteOwnerAdjustment,
  getOwnerAdjustments,
} from "@/services/stats.service"

export default function AdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<OwnerAdjustment[]>([])
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const data = await getOwnerAdjustments()
      setAdjustments((data ?? []) as OwnerAdjustment[])
    } catch {
      setAdjustments([])
      toast.error("خطا في تحميل الخصومات")
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!amount || !reason) return

    setLoading(true)
    try {
      const user = await getCurrentUser()
      await createOwnerAdjustment({
        amount: Number(amount),
        reason,
        created_by: user?.id || null,
      })
      toast.success("تم اضافة الخصم بنجاح")
      setOpen(false)
      setAmount("")
      setReason("")
      await loadData()
    } catch {
      toast.error("خطا في اضافة الخصم")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("حذف هذا الخصم؟")) return

    try {
      await deleteOwnerAdjustment(id)
      toast.success("تم حذف الخصم")
      await loadData()
    } catch {
      toast.error("خطا في حذف الخصم")
    }
  }

  const totalDeductions = adjustments.reduce((sum, a) => sum + Number(a.amount), 0)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">الخصومات المالية</h1>
        <Button size="sm" className="gap-2" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          اضافة خصم
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">اجمالي الخصومات</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-destructive">-{totalDeductions.toLocaleString()} د.ج</p>
          <p className="mt-1 text-xs text-muted-foreground">
            يتم خصمها من صافي الايرادات (بعد استبعاد تكاليف التوصيل)
          </p>
        </CardContent>
      </Card>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المبلغ</TableHead>
              <TableHead>السبب</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>اجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adjustments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  لا توجد خصومات
                </TableCell>
              </TableRow>
            ) : (
              adjustments.map((adj) => (
                <TableRow key={adj.id}>
                  <TableCell className="font-medium text-destructive">-{Number(adj.amount).toLocaleString()} د.ج</TableCell>
                  <TableCell>{adj.reason}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(adj.created_at).toLocaleDateString("ar-DZ")}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(adj.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>اضافة خصم جديد</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>{"المبلغ (د.ج)"}</Label>
              <Input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                dir="ltr"
                placeholder="مثال: 50000"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>السبب</Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                placeholder="مثال: ايجار، صيانة، رواتب، مواد خام"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "جاري الحفظ..." : "اضافة الخصم"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
