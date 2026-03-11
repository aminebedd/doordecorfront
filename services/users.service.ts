import type { Profile } from "@/lib/types"
import { httpClient, withQuery } from "@/services/http/client"

export interface CreateEmployeePayload {
  email: string
  password: string
  full_name: string
  phone?: string
  role: "admin" | "employee"
}

export interface EmployeeContact {
  email: string | null
  phone: string | null
}

export async function getProfiles(params: { roles?: string[] } = {}) {
  return httpClient.get<Profile[]>(
    withQuery("/users", {
      roles: params.roles?.join(","),
    }),
  )
}

export async function getEmployeeContact() {
  return httpClient.get<EmployeeContact>("/users/employee-contact")
}

export async function updateUserRole(userId: string, role: string) {
  return httpClient.patch<Profile>(`/users/${userId}/role`, { role })
}

export async function createEmployee(payload: CreateEmployeePayload) {
  return httpClient.post<{ success: boolean; userId: string }>("/users/employees", payload)
}
