import { ApiError, httpClient } from "@/services/http/client"
import type { Profile } from "@/lib/types"

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthSession {
  user: Profile
}

export async function login(payload: LoginPayload) {
  return httpClient.post<AuthSession>("/auth/login", payload)
}

export async function logout() {
  return httpClient.post<{ success: boolean }>("/auth/logout")
}

export async function getCurrentUser() {
  try {
    return await httpClient.get<Profile>("/auth/me")
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) return null
    throw error
  }
}

export async function getCurrentRole() {
  try {
    const response = await httpClient.get<{ role: string }>("/auth/me/role")
    return response.role
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) return null
    throw error
  }
}
