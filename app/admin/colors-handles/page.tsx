"use client"

import React, { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Plus, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import type { Color, Handle } from "@/lib/types"
import { ColorCircle } from "@/components/color-circle"
import {
  createColor,
  createHandle,
  deleteColor as removeColor,
  deleteHandle as removeHandle,
  getColors,
  getHandles,
} from "@/services/catalog.service"

export default function ColorsHandlesPage() {
  const [colors, setColors] = useState<Color[]>([])
  const [handles, setHandles] = useState<Handle[]>([])
  const [colorDialogOpen, setColorDialogOpen] = useState(false)
  const [handleDialogOpen, setHandleDialogOpen] = useState(false)

  const [colorName, setColorName] = useState("")
  const [colorNameAr, setColorNameAr] = useState("")
  const [colorCode, setColorCode] = useState("#000000")
  const [secondaryCode, setSecondaryCode] = useState("")
  const [hasDualColor, setHasDualColor] = useState(false)

  const [handleName, setHandleName] = useState("")
  const [handleNameAr, setHandleNameAr] = useState("")
  const [handleImageFile, setHandleImageFile] = useState<File | null>(null)
  const [handleImagePreview, setHandleImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const handleFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [c, h] = await Promise.all([getColors(), getHandles()])
      setColors(c ?? [])
      setHandles(h ?? [])
    } catch {
      setColors([])
      setHandles([])
      toast.error("خطا في تحميل البيانات")
    }
  }

  async function addColor(e: React.FormEvent) {
    e.preventDefault()

    try {
      await createColor({
        name: colorName,
        name_ar: colorNameAr || null,
        code: colorCode,
        secondary_code: hasDualColor && secondaryCode ? secondaryCode : null,
      })
      toast.success("تم اضافة اللون")
      setColorDialogOpen(false)
      setColorName("")
      setColorNameAr("")
      setColorCode("#000000")
      setSecondaryCode("")
      setHasDualColor(false)
      await loadData()
    } catch {
      toast.error("خطا في اضافة اللون")
    }
  }

  async function handleDeleteColor(id: string) {
    if (!confirm("حذف هذا اللون؟")) return

    try {
      await removeColor(id)
      toast.success("تم الحذف")
      await loadData()
    } catch {
      toast.error("خطا في حذف اللون")
    }
  }

  async function addHandle(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    try {
      let imageUrl: string | null = null
      if (handleImageFile) {
        imageUrl = await uploadImage(handleImageFile, "handles")
        if (!imageUrl) {
          toast.error("خطا في رفع صورة المقبض")
          return
        }
      }

      await createHandle({
        name: handleName,
        name_ar: handleNameAr || null,
        image_url: imageUrl,
      })

      toast.success("تم اضافة المقبض")
      setHandleDialogOpen(false)
      setHandleName("")
      setHandleNameAr("")
      setHandleImageFile(null)
      setHandleImagePreview(null)
      await loadData()
    } catch {
      toast.error("خطا في اضافة المقبض")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteHandle(handle: Handle) {
    if (!confirm("حذف هذا المقبض؟")) return

    try {
      if (handle.image_url) {
        await deleteImage(handle.image_url)
      }
      await removeHandle(handle.id)
      toast.success("تم الحذف")
      await loadData()
    } catch {
      toast.error("خطا في حذف المقبض")
    }
  }

  function onHandleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setHandleImageFile(file)
    setHandleImagePreview(URL.createObjectURL(file))
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">الالوان والمقابض</h1>

      <Tabs defaultValue="colors">
        <TabsList>
          <TabsTrigger value="colors">الالوان</TabsTrigger>
          <TabsTrigger value="handles">المقابض</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="mt-4">
          <div className="mb-4 flex justify-end">
            <Button size="sm" className="gap-2" onClick={() => setColorDialogOpen(true)}>
              <Plus className="h-4 w-4" /> اضافة لون
            </Button>
          </div>
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اللون</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>الكود</TableHead>
                  <TableHead>اجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {colors.map((color) => (
                  <TableRow key={color.id}>
                    <TableCell>
                      <ColorCircle code={color.code} secondaryCode={color.secondary_code} />
                    </TableCell>
                    <TableCell>
                      {color.name_ar || color.name}
                      {color.name_ar && <span className="mr-2 text-xs text-muted-foreground">({color.name})</span>}
                    </TableCell>
                    <TableCell className="font-mono text-sm" dir="ltr">
                      {color.code}
                      {color.secondary_code ? ` / ${color.secondary_code}` : ""}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteColor(color.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="handles" className="mt-4">
          <div className="mb-4 flex justify-end">
            <Button
              size="sm"
              className="gap-2"
              onClick={() => {
                setHandleDialogOpen(true)
                setHandleName("")
                setHandleNameAr("")
                setHandleImageFile(null)
                setHandleImagePreview(null)
              }}
            >
              <Plus className="h-4 w-4" /> اضافة مقبض
            </Button>
          </div>
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الصورة</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>اجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {handles.map((handle) => (
                  <TableRow key={handle.id}>
                    <TableCell>
                      {handle.image_url ? (
                        <div className="relative h-10 w-10 overflow-hidden rounded-md border border-border bg-muted">
                          <Image src={handle.image_url || "/placeholder.svg"} alt="" fill className="object-cover" sizes="40px" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">-</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {handle.name_ar || handle.name}
                      {handle.name_ar && <span className="mr-2 text-xs text-muted-foreground">({handle.name})</span>}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteHandle(handle)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={colorDialogOpen} onOpenChange={setColorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>اضافة لون جديد</DialogTitle>
          </DialogHeader>
          <form onSubmit={addColor} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>{"الاسم (Français)"}</Label>
              <Input value={colorName} onChange={(e) => setColorName(e.target.value)} required dir="ltr" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{"الاسم (عربي)"}</Label>
              <Input value={colorNameAr} onChange={(e) => setColorNameAr(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{"اللون الاساسي"}</Label>
              <div className="flex gap-2">
                <Input type="color" value={colorCode} onChange={(e) => setColorCode(e.target.value)} className="h-10 w-16 p-1" />
                <Input value={colorCode} onChange={(e) => setColorCode(e.target.value)} dir="ltr" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="dual-color"
                checked={hasDualColor}
                onChange={(e) => {
                  setHasDualColor(e.target.checked)
                  if (!e.target.checked) setSecondaryCode("")
                }}
                className="h-4 w-4 rounded border-border"
              />
              <Label htmlFor="dual-color" className="cursor-pointer text-sm">
                {"لون ثنائي (لونين)"}
              </Label>
            </div>

            {hasDualColor && (
              <div className="flex flex-col gap-2">
                <Label>{"اللون الثانوي"}</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={secondaryCode || "#ffffff"}
                    onChange={(e) => setSecondaryCode(e.target.value)}
                    className="h-10 w-16 p-1"
                  />
                  <Input value={secondaryCode} onChange={(e) => setSecondaryCode(e.target.value)} dir="ltr" />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Label className="text-sm text-muted-foreground">{"معاينة:"}</Label>
              <ColorCircle code={colorCode} secondaryCode={hasDualColor ? secondaryCode : null} size={40} />
            </div>

            <Button type="submit">اضافة اللون</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={handleDialogOpen} onOpenChange={setHandleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>اضافة مقبض جديد</DialogTitle>
          </DialogHeader>
          <form onSubmit={addHandle} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>{"الاسم (Français)"}</Label>
              <Input value={handleName} onChange={(e) => setHandleName(e.target.value)} required dir="ltr" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{"الاسم (عربي)"}</Label>
              <Input value={handleNameAr} onChange={(e) => setHandleNameAr(e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>{"صورة المقبض (اختياري)"}</Label>
              <div className="flex items-center gap-3">
                <input
                  ref={handleFileRef}
                  type="file"
                  accept="image/*"
                  onChange={onHandleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 bg-transparent"
                  onClick={() => handleFileRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  {handleImageFile ? "تغيير الصورة" : "اختر صورة"}
                </Button>
                {handleImagePreview && (
                  <div className="relative h-12 w-12 overflow-hidden rounded-md border border-border">
                    <Image src={handleImagePreview || "/placeholder.svg"} alt="معاينة" fill className="object-cover" sizes="48px" />
                  </div>
                )}
              </div>
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? "جاري الاضافة..." : "اضافة المقبض"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
