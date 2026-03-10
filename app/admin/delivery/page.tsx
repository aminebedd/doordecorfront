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
import { toast } from "sonner"
import type { DeliveryState } from "@/lib/types"
import {
  createDeliveryState,
  deleteDeliveryState,
  getDeliveryStates,
} from "@/services/catalog.service"

export default function DeliveryStatesPage() {
  const [states, setStates] = useState<DeliveryState[]>([])
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [nameAr, setNameAr] = useState("")
  const [price, setPrice] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const data = await getDeliveryStates()
      setStates(data ?? [])
    } catch {
      setStates([])
      toast.error("خطا في تحميل الولايات")
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()

    try {
      await createDeliveryState({
        name,
        name_ar: nameAr || null,
        price: Number(price),
      })
      toast.success("تم اضافة الولاية")
      setOpen(false)
      setName("")
      setNameAr("")
      setPrice("")
      await loadData()
    } catch {
      toast.error("خطا في اضافة الولاية")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("حذف هذه الولاية؟")) return

    try {
      await deleteDeliveryState(id)
      toast.success("تم الحذف")
      await loadData()
    } catch {
      toast.error("خطا في حذف الولاية")
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">ولايات التوصيل</h1>
        <Button size="sm" className="gap-2" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          اضافة ولاية
        </Button>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>سعر التوصيل</TableHead>
              <TableHead>اجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {states.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                  لا توجد ولايات مضافة
                </TableCell>
              </TableRow>
            ) : (
              states.map((state) => (
                <TableRow key={state.id}>
                  <TableCell>
                    {state.name_ar || state.name}
                    {state.name_ar && <span className="mr-2 text-xs text-muted-foreground">({state.name})</span>}
                  </TableCell>
                  <TableCell className="font-medium">{Number(state.price).toLocaleString()} د.ج</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(state.id)}
                    >
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
            <DialogTitle>اضافة ولاية جديدة</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>الاسم (Français)</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required dir="ltr" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>الاسم (عربي)</Label>
              <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>سعر التوصيل (د.ج)</Label>
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required dir="ltr" />
            </div>
            <Button type="submit">اضافة الولاية</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
