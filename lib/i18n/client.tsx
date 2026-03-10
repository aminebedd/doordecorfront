"use client"

import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react"
import { defaultLocale, isRTL, LOCALE_COOKIE, locales, type Locale } from "./settings"
import ar from "./translations/ar"
import fr from "./translations/fr"

type TranslationDictionary = {
  [K in keyof typeof ar]: string
}

const dictionaries: Record<Locale, TranslationDictionary> = { ar, fr }

type TranslationKey = keyof typeof ar

interface I18nContextValue {
  locale: Locale
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
  switchLocale: (newLocale: Locale) => void
}

const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  t: (key) => key,
  switchLocale: () => {},
})

export function LocaleProvider({
  locale,
  children,
}: {
  locale?: Locale
  children: React.ReactNode
}) {
  const [currentLocale, setCurrentLocale] = useState<Locale>(locale ?? defaultLocale)

  useEffect(() => {
    if (typeof document === "undefined") return

    const cookieLocale = document.cookie
      .split("; ")
      .find((part) => part.startsWith(`${LOCALE_COOKIE}=`))
      ?.split("=")[1]
    const storageLocale = window.localStorage.getItem(LOCALE_COOKIE)
    const candidate = storageLocale || cookieLocale

    if (candidate && locales.includes(candidate as Locale)) {
      setCurrentLocale(candidate as Locale)
    }
  }, [])

  useEffect(() => {
    if (typeof document === "undefined") return
    document.documentElement.lang = currentLocale
    document.documentElement.dir = isRTL(currentLocale) ? "rtl" : "ltr"
  }, [currentLocale])

  const dict = useMemo(() => dictionaries[currentLocale], [currentLocale])

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      let value: string = dict[key] || key
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          value = value.replace(`{${k}}`, String(v))
        }
      }
      return value
    },
    [dict],
  )

  const switchLocale = useCallback((newLocale: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${newLocale};path=/;max-age=${365 * 24 * 60 * 60}`
    window.localStorage.setItem(LOCALE_COOKIE, newLocale)
    setCurrentLocale(newLocale)
  }, [])

  return (
    <I18nContext.Provider value={{ locale: currentLocale, t, switchLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  return useContext(I18nContext)
}
