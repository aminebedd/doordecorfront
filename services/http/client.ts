export class ApiError extends Error {
  status: number
  details: unknown

  constructor(message: string, status: number, details: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | object | null
  retryAuth?: boolean
}

function getBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:8000/api"
  const sanitized = raw.endsWith("/") ? raw.slice(0, -1) : raw

  if (typeof window === "undefined") return sanitized

  // Prevent localhost/127.0.0.1 cookie-site mismatch in local development.
  try {
    const parsed = new URL(sanitized)
    const currentHost = window.location.hostname
    const localHosts = new Set(["localhost", "127.0.0.1"])

    if (localHosts.has(currentHost) && localHosts.has(parsed.hostname) && parsed.hostname !== currentHost) {
      parsed.hostname = currentHost
      return parsed.toString().replace(/\/$/, "")
    }

    return parsed.toString().replace(/\/$/, "")
  } catch {
    return sanitized
  }
}

function buildUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${getBaseUrl()}${normalizedPath}`
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return response.json()
  }
  return response.text()
}

function findFirstMessage(value: unknown): string | null {
  if (typeof value === "string") return value
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findFirstMessage(item)
      if (found) return found
    }
    return null
  }
  if (typeof value === "object" && value) {
    for (const nested of Object.values(value as Record<string, unknown>)) {
      const found = findFirstMessage(nested)
      if (found) return found
    }
  }
  return null
}

function extractErrorMessage(payload: unknown, status: number): string {
  if (typeof payload === "object" && payload) {
    if ("error" in payload) {
      return findFirstMessage((payload as { error?: unknown }).error) || `Request failed with status ${status}`
    }
    if ("message" in payload) {
      return findFirstMessage((payload as { message?: unknown }).message) || `Request failed with status ${status}`
    }
    const nested = findFirstMessage(payload)
    if (nested) return nested
  }
  if (typeof payload === "string" && payload.trim()) return payload
  return `Request failed with status ${status}`
}

function shouldAttemptRefresh(path: string) {
  const cleanPath = path.toLowerCase()
  return !cleanPath.includes("/auth/login") &&
    !cleanPath.includes("/auth/logout") &&
    !cleanPath.includes("/auth/refresh")
}

let refreshPromise: Promise<boolean> | null = null

async function refreshSession() {
  if (refreshPromise) return refreshPromise
  refreshPromise = (async () => {
    try {
      const response = await fetch(buildUrl("/auth/refresh"), {
        method: "POST",
        credentials: "include",
      })
      return response.ok
    } catch {
      return false
    } finally {
      refreshPromise = null
    }
  })()
  return refreshPromise
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers || {})
  let body: BodyInit | undefined

  if (options.body === null || typeof options.body === "undefined") {
    body = undefined
  } else if (
    options.body instanceof FormData ||
    options.body instanceof Blob ||
    typeof options.body === "string"
  ) {
    body = options.body
  } else {
    headers.set("Content-Type", "application/json")
    body = JSON.stringify(options.body)
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
    body,
    credentials: "include",
  })

  const canRetryAuth = options.retryAuth ?? true
  if (response.status === 401 && canRetryAuth && shouldAttemptRefresh(path)) {
    const refreshed = await refreshSession()
    if (refreshed) {
      return request<T>(path, { ...options, retryAuth: false })
    }
  }

  const payload = await parseResponse(response)
  if (!response.ok) {
    const message = extractErrorMessage(payload, response.status)
    throw new ApiError(message, response.status, payload)
  }

  return payload as T
}

export const httpClient = {
  get: <T>(path: string, options: RequestOptions = {}) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: RequestOptions["body"], options: RequestOptions = {}) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: RequestOptions["body"], options: RequestOptions = {}) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: RequestOptions["body"], options: RequestOptions = {}) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options: RequestOptions = {}) =>
    request<T>(path, { ...options, method: "DELETE" }),
}

export function withQuery(
  path: string,
  query: Record<string, string | number | boolean | null | undefined>,
) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value === null || typeof value === "undefined" || value === "") continue
    params.set(key, String(value))
  }
  const qs = params.toString()
  return qs ? `${path}?${qs}` : path
}
