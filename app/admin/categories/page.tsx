"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Plus, Trash2, Pencil, ImageIcon } from "lucide-react"
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
import { uploadImage, deleteImage } from "@/lib/upload"
import { toast } from "sonner"
import type { Category } from "@/lib/types"
import {
  createCategory,
  deleteCategory as removeCategory,
  getCategories,
  updateCategory,
} from "@/services/catalog.service"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [name, setName] = useState("")
  const [nameAr, setNameAr] = useState("")
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const data = await getCategories()
      setCategories(data ?? [])
    } catch {
      setCategories([])
      toast.error("خطا في تحميل الاقسام")
    }
  }

  function openCreate() {
    setEditing(null)
    setName("")
    setNameAr("")
    setOpen(true)
  }

  function openEdit(cat: Category) {
    setEditing(cat)
    setName(cat.name)
    setNameAr(cat.name_ar || "")
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = { name, name_ar: nameAr || null }

    try {
      if (editing) {
        await updateCategory(editing.id, payload)
        toast.success("تم تحديث القسم")
      } else {
        await createCategory(payload)
        toast.success("تم اضافة القسم")
      }
      setOpen(false)
      await loadData()
    } catch {
      toast.error(editing ? "خطا في التحديث" : "خطا في الاضافة")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("حذف هذا القسم؟")) return

    try {
      const cat = categories.find((c) => c.id === id)
      if (cat?.image_url) {
        await deleteImage(cat.image_url)
      }
      await removeCategory(id)
      toast.success("تم الحذف")
      await loadData()
    } catch {
      toast.error("خطا في حذف القسم")
    }
  }

  async function handleImageUpload(catId: string, e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return

    setUploading(true)
    const file = e.target.files[0]
    const cat = categories.find((c) => c.id === catId)

    try {
      const url = await uploadImage(file, "categories", cat?.image_url || undefined)
      if (!url) {
        toast.error("خطا في رفع الصورة")
        return
      }

      await updateCategory(catId, { image_url: url })
      toast.success("تم رفع صورة القسم")
      await loadData()
    } catch {
      toast.error("خطا في حفظ الصورة")
    } finally {
      setUploading(false)
    }
  }

  async function removeImage(catId: string) {
    const cat = categories.find((c) => c.id === catId)
    if (!cat?.image_url) return
    if (!confirm("حذف صورة القسم؟")) return

    try {
      await deleteImage(cat.image_url)
      await updateCategory(catId, { image_url: null })
      toast.success("تم حذف الصورة")
      await loadData()
    } catch {
      toast.error("خطا في حذف الصورة")
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">ادارة الاقسام</h1>
        <Button size="sm" className="gap-2" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          اضافة قسم
        </Button>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الصورة</TableHead>
              <TableHead>{"الاسم (Français)"}</TableHead>
              <TableHead>{"الاسم (عربي)"}</TableHead>
              <TableHead>اجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  لا توجد اقسام
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {cat.image_url ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded-md border border-border">
                          <Image
                            src={cat.image_url || "/placeholder.svg"}
                            alt={cat.name_ar || cat.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-dashed border-border bg-muted">
                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}

                      <div className="flex flex-col gap-1">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(cat.id, e)}
                            disabled={uploading}
                          />
                          <span className="text-xs text-primary hover:underline">
                            {cat.image_url ? "تغيير" : "رفع صورة"}
                          </span>
                        </label>
                        {cat.image_url && (
                          <button
                            type="button"
                            className="text-start text-xs text-destructive hover:underline"
                            onClick={() => removeImage(cat.id)}
                          >
                            حذف الصورة
                          </button>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell dir="ltr">{cat.name}</TableCell>
                  <TableCell>{cat.name_ar || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
            <DialogTitle>{editing ? "تعديل القسم" : "اضافة قسم جديد"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>{"الاسم (Français)"}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required dir="ltr" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{"الاسم (عربي)"}</Label>
              <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
            </div>
            <Button type="submit">{editing ? "تحديث القسم" : "اضافة القسم"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
