"use client"

import React, { useEffect, useState } from "react"
import { Plus } from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import type { Profile } from "@/lib/types"
import { createEmployee, getProfiles, updateUserRole } from "@/services/users.service"

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newName, setNewName] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newRole, setNewRole] = useState<string>("employee")

  useEffect(() => {
    loadProfiles()
  }, [])

  async function loadProfiles() {
    try {
      const data = await getProfiles({ roles: ["admin", "employee"] })
      setProfiles(data ?? [])
    } catch {
      setProfiles([])
      toast.error("خطا في تحميل المستخدمين")
    }
  }

  async function handleUpdateRole(userId: string, role: string) {
    try {
      await updateUserRole(userId, role)
      toast.success("تم تحديث دور المستخدم")
      loadProfiles()
    } catch {
      toast.error("خطا في تحديث الدور")
    }
  }

  async function handleCreateEmployee(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await createEmployee({
        email: newEmail,
        password: newPassword,
        full_name: newName,
        phone: newPhone || undefined,
        role: newRole as "admin" | "employee",
      })

      toast.success("تم انشاء الحساب بنجاح")
      setDialogOpen(false)
      setNewEmail("")
      setNewPassword("")
      setNewName("")
      setNewPhone("")
      setNewRole("employee")
      loadProfiles()
    } catch (error) {
      const message = error instanceof Error ? error.message : "حدث خطا"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">ادارة المستخدمين</h1>
        <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          اضافة موظف
        </Button>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>الهاتف</TableHead>
              <TableHead>الدور</TableHead>
              <TableHead>تاريخ التسجيل</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  لا يوجد مستخدمين
                </TableCell>
              </TableRow>
            ) : (
              profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.full_name || "بدون اسم"}</TableCell>
                  <TableCell dir="ltr">{profile.phone || "-"}</TableCell>
                  <TableCell>
                    <Select
                      value={profile.role}
                      onValueChange={(val) => handleUpdateRole(profile.id, val)}
                    >
                      <SelectTrigger className="h-8 w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">موظف</SelectItem>
                        <SelectItem value="admin">مدير</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(profile.created_at).toLocaleDateString("ar-DZ")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>اضافة موظف جديد</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateEmployee} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>الاسم الكامل</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label>البريد الالكتروني</Label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                dir="ltr"
                placeholder="employee@doordecor.dz"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>كلمة المرور</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                dir="ltr"
                placeholder="6 احرف على الاقل"
                minLength={6}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>رقم الهاتف</Label>
              <Input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} dir="ltr" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>الدور</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">موظف</SelectItem>
                  <SelectItem value="admin">مدير</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "جاري الانشاء..." : "انشاء الحساب"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
