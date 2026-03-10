"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { uploadImage, deleteImage } from "@/lib/upload"
import { toast } from "sonner"
import type { Product, Category, Color, Handle, ProductImage } from "@/lib/types"
import {
  createProduct,
  createProductImage,
  deleteProduct,
  deleteProductImage as removeProductImage,
  getCategories,
  getColors,
  getHandles,
  getProductHandles,
  getProductImages,
  getProducts,
  setProductHandles,
  updateProduct,
} from "@/services/catalog.service"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [handles, setHandles] = useState<Handle[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)

  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageProduct, setImageProduct] = useState<Product | null>(null)
  const [productImages, setProductImages] = useState<ProductImage[]>([])
  const [uploadColorId, setUploadColorId] = useState("")
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState("")
  const [nameAr, setNameAr] = useState("")
  const [desc, setDesc] = useState("")
  const [descAr, setDescAr] = useState("")
  const [widthThreshold, setWidthThreshold] = useState("85")
  const [priceBelow, setPriceBelow] = useState("")
  const [priceAbove, setPriceAbove] = useState("")
  const [width, setWidth] = useState("80")
  const [height, setHeight] = useState("200")
  const [catId, setCatId] = useState("")
  const [available, setAvailable] = useState(true)
  const [selectedHandleIds, setSelectedHandleIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadData()
  }, [])

  const categoriesById = useMemo(() => {
    const map: Record<string, Category> = {}
    for (const category of categories) {
      map[category.id] = category
    }
    return map
  }, [categories])

  async function loadData() {
    try {
      const [prods, cats, cols, hnds] = await Promise.all([
        getProducts(),
        getCategories(),
        getColors(),
        getHandles(),
      ])
      setProducts(prods ?? [])
      setCategories(cats ?? [])
      setColors(cols ?? [])
      setHandles(hnds ?? [])
    } catch {
      setProducts([])
      setCategories([])
      setColors([])
      setHandles([])
      toast.error("خطا في تحميل البيانات")
    }
  }

  function openCreate() {
    setEditing(null)
    setName("")
    setNameAr("")
    setDesc("")
    setDescAr("")
    setWidthThreshold("85")
    setPriceBelow("")
    setPriceAbove("")
    setWidth("80")
    setHeight("200")
    setCatId("")
    setAvailable(true)
    setSelectedHandleIds(new Set())
    setOpen(true)
  }

  async function openEdit(product: Product) {
    setEditing(product)
    setName(product.name)
    setNameAr(product.name_ar || "")
    setDesc(product.description || "")
    setDescAr(product.description_ar || "")
    setWidthThreshold(String(product.width_threshold ?? 85))
    setPriceBelow(String(product.price_below ?? 0))
    setPriceAbove(String(product.price_above ?? 0))
    setWidth(String(product.width))
    setHeight(String(product.height))
    setCatId(product.category_id || "")
    setAvailable(product.is_available)

    try {
      const productHandles = await getProductHandles(product.id)
      setSelectedHandleIds(new Set((productHandles ?? []).map((r) => r.handle_id)))
    } catch {
      setSelectedHandleIds(new Set())
    }

    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const payload = {
      name,
      name_ar: nameAr || null,
      description: desc || null,
      description_ar: descAr || null,
      width_threshold: Number(widthThreshold),
      price_below: Number(priceBelow),
      price_above: Number(priceAbove),
      width: Number(width),
      height: Number(height),
      min_width: 40,
      max_width: 160,
      min_height: 40,
      max_height: 280,
      category_id: catId || null,
      is_available: available,
    }

    try {
      let productId = editing?.id

      if (editing) {
        await updateProduct(editing.id, payload)
      } else {
        const created = await createProduct(payload)
        productId = created?.id
      }

      if (!productId) {
        toast.error("خطا في حفظ المنتج")
        setLoading(false)
        return
      }

      await setProductHandles(productId, Array.from(selectedHandleIds))

      toast.success(editing ? "تم تحديث المنتج" : "تم اضافة المنتج")
      setOpen(false)
      await loadData()
    } catch {
      toast.error(editing ? "خطا في تحديث المنتج" : "خطا في اضافة المنتج")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل انت متاكد من حذف هذا المنتج؟")) return

    try {
      const imgs = await getProductImages(id)
      for (const img of imgs ?? []) {
        await deleteImage(img.image_url)
        await removeProductImage(img.id)
      }

      await deleteProduct(id)
      toast.success("تم حذف المنتج")
      await loadData()
    } catch {
      toast.error("خطا في حذف المنتج")
    }
  }

  async function openImageManager(product: Product) {
    setImageProduct(product)
    setUploadColorId("")

    try {
      const data = await getProductImages(product.id)
      setProductImages(data ?? [])
    } catch {
      setProductImages([])
      toast.error("خطا في تحميل الصور")
    }

    setImageDialogOpen(true)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0] || !imageProduct || !uploadColorId) {
      toast.error("يرجى اختيار اللون اولا")
      return
    }

    setUploading(true)
    const file = e.target.files[0]

    try {
      const url = await uploadImage(file, `products/${imageProduct.id}`)
      if (!url) {
        toast.error("خطا في رفع الصورة")
        return
      }

      await createProductImage({
        product_id: imageProduct.id,
        color_id: uploadColorId,
        handle_id: null,
        image_url: url,
      })

      const data = await getProductImages(imageProduct.id)
      setProductImages(data ?? [])
      toast.success("تم رفع الصورة بنجاح")
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch {
      toast.error("خطا في حفظ الصورة")
    } finally {
      setUploading(false)
    }
  }

  async function handleDeleteProductImage(img: ProductImage) {
    if (!confirm("حذف هذه الصورة؟")) return

    try {
      await deleteImage(img.image_url)
      await removeProductImage(img.id)
      setProductImages((prev) => prev.filter((i) => i.id !== img.id))
      toast.success("تم حذف الصورة")
    } catch {
      toast.error("خطا في حذف الصورة")
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">ادارة المنتجات</h1>
        <Button size="sm" className="gap-2" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          اضافة منتج
        </Button>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المنتج</TableHead>
              <TableHead>القسم</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>الابعاد</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>اجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const category = product.category_id ? categoriesById[product.category_id] : null
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.name_ar || product.name}</p>
                      {product.name_ar && <p className="text-xs text-muted-foreground">{product.name}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{category?.name_ar || category?.name || "-"}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <span>
                        {"عرض <= " + Number(product.width_threshold) + ": "}
                        <strong>{Number(product.price_below).toLocaleString()} {"د.ج"}</strong>
                      </span>
                      <span>
                        {"عرض > " + Number(product.width_threshold) + ": "}
                        <strong>{Number(product.price_above).toLocaleString()} {"د.ج"}</strong>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{product.width} x {product.height} سم</TableCell>
                  <TableCell>
                    <Badge variant={product.is_available ? "default" : "secondary"}>
                      {product.is_available ? "متاح" : "غير متاح"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openImageManager(product)} title="ادارة الصور">
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل المنتج" : "اضافة منتج جديد"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>{"الاسم (Français)"}</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required dir="ltr" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>{"الاسم (عربي)"}</Label>
                <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>{"الوصف (عربي)"}</Label>
              <Textarea value={descAr} onChange={(e) => setDescAr(e.target.value)} />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label>{"حد العرض (سم)"}</Label>
                <Input type="number" value={widthThreshold} onChange={(e) => setWidthThreshold(e.target.value)} required dir="ltr" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>{"السعر عند عرض <= الحد (د.ج)"}</Label>
                <Input type="number" value={priceBelow} onChange={(e) => setPriceBelow(e.target.value)} required dir="ltr" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>{"السعر عند عرض > الحد (د.ج)"}</Label>
                <Input type="number" value={priceAbove} onChange={(e) => setPriceAbove(e.target.value)} required dir="ltr" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>{"العرض الافتراضي (سم)"}</Label>
                <Input type="number" value={width} onChange={(e) => setWidth(e.target.value)} dir="ltr" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>{"الارتفاع الافتراضي (سم)"}</Label>
                <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} dir="ltr" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>{"المقابض المتاحة لهذا المنتج"}</Label>
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-3 sm:grid-cols-3">
                {handles.length === 0 ? (
                  <p className="col-span-full text-sm text-muted-foreground">{"لا توجد مقابض"}</p>
                ) : (
                  handles.map((h) => {
                    const checked = selectedHandleIds.has(h.id)
                    return (
                      <label key={h.id} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) => {
                            setSelectedHandleIds((prev) => {
                              const next = new Set(prev)
                              if (v) next.add(h.id)
                              else next.delete(h.id)
                              return next
                            })
                          }}
                        />
                        <span className="text-sm">{h.name_ar || h.name}</span>
                      </label>
                    )
                  })
                )}
              </div>
              {selectedHandleIds.size > 0 && (
                <p className="text-xs text-muted-foreground">{selectedHandleIds.size + " مقبض محدد"}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>القسم</Label>
              <Select
                value={catId || "none"}
                onValueChange={(value) => setCatId(value === "none" ? "" : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر القسم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون قسم</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name_ar || cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={available} onCheckedChange={setAvailable} />
              <Label>متاح للبيع</Label>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "جاري الحفظ..." : editing ? "تحديث المنتج" : "اضافة المنتج"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>صور المنتج: {imageProduct?.name_ar || imageProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-dashed border-border p-4">
              <p className="mb-3 text-sm font-medium">رفع صورة جديدة</p>
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">{"اللون (مطوب)"}</Label>
                  <Select value={uploadColorId} onValueChange={setUploadColorId}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="اختر اللون" />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          <span className="flex items-center gap-2">
                            <span
                              className="inline-block h-3 w-3 shrink-0 rounded-full border border-border"
                              style={
                                c.secondary_code
                                  ? { background: `linear-gradient(135deg, ${c.code} 50%, ${c.secondary_code} 50%)` }
                                  : { backgroundColor: c.code }
                              }
                            />
                            {c.name_ar || c.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="product-image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 bg-transparent"
                    disabled={uploading || !uploadColorId}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    {uploading ? "جاري الرفع..." : "اختر صورة"}
                  </Button>
                </div>
              </div>
            </div>

            {productImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {productImages.map((img) => {
                  const color = colors.find((c) => c.id === img.color_id)
                  return (
                    <div key={img.id} className="group relative overflow-hidden rounded-lg border border-border">
                      <div className="relative aspect-[5/9]">
                        <Image src={img.image_url || "/placeholder.svg"} alt="" fill className="object-contain" sizes="200px" />
                      </div>
                      <div className="flex items-center justify-between p-2">
                        {color && (
                          <div className="flex items-center gap-1.5">
                            <span
                              className="inline-block h-3 w-3 shrink-0 rounded-full border border-border"
                              style={
                                color.secondary_code
                                  ? { background: `linear-gradient(135deg, ${color.code} 50%, ${color.secondary_code} 50%)` }
                                  : { backgroundColor: color.code }
                              }
                            />
                            <span className="text-xs text-muted-foreground">{color.name_ar || color.name}</span>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => handleDeleteProductImage(img)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">لا توجد صور لهذا المنتج</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
