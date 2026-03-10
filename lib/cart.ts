'use client';

import type { CartItem } from "@/lib/types"

const STORAGE_KEY = "doordecor_cart"
const COOKIE_KEY = "doordecor_cart" // legacy, for migration

let listeners: Array<() => void> = []
let cachedItems: CartItem[] | null = null

// Stable empty array for SSR - must be the same reference every call
const EMPTY_CART: CartItem[] = []

/** Migrate old cookie cart to localStorage (one-time) */
function migrateFromCookie() {
  if (typeof document === "undefined") return
  try {
    const match = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${COOKIE_KEY}=`))
    if (!match) return
    const data = JSON.parse(decodeURIComponent(match.split("=").slice(1).join("=")))
    if (Array.isArray(data) && data.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
    // Clear old cookie
    document.cookie = `${COOKIE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  } catch { /* ignore */ }
}

function readFromStorage(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART
  try {
    migrateFromCookie()
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch { /* storage full, very unlikely with 5MB */ }
}

function notify() {
  cachedItems = null
  for (const fn of listeners) fn()
}

export function getCart(): CartItem[] {
  if (typeof document === "undefined") return EMPTY_CART
  if (cachedItems !== null) return cachedItems
  cachedItems = readFromStorage()
  return cachedItems
}

// Stable server snapshot for useSyncExternalStore (must return same reference)
export function getServerCart(): CartItem[] {
  return EMPTY_CART
}

export function subscribe(fn: () => void): () => void {
  listeners.push(fn)
  return () => {
    listeners = listeners.filter((l) => l !== fn)
  }
}

export function addToCart(item: CartItem) {
  const items = [...readFromStorage(), item]
  writeToStorage(items)
  notify()
}

export function removeFromCart(id: string) {
  const items = readFromStorage().filter((i) => i.id !== id)
  writeToStorage(items)
  notify()
}

export function updateQuantity(id: string, quantity: number) {
  const items = readFromStorage().map((i) =>
    i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i,
  )
  writeToStorage(items)
  notify()
}

export function clearCart() {
  writeToStorage([])
  notify()
}

export function getCartCount(): number {
  return getCart().reduce((sum, i) => sum + i.quantity, 0)
}

export function getCartTotal(): number {
  return getCart().reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
}
