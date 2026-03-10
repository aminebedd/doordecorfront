export const defaultLocale = "ar" as const
export const locales = ["ar", "fr"] as const
export type Locale = (typeof locales)[number]
export const LOCALE_COOKIE = "NEXT_LOCALE"

export function isRTL(locale: Locale): boolean {
  return locale === "ar"
}
