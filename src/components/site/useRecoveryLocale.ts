"use client";
import { useEffect, useState } from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  normalizeLocale,
  negotiateLocale,
  type Locale,
} from "@/lib/locale";

export function useRecoveryLocale() {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  useEffect(() => {
    const selected = document.cookie
      .split("; ")
      .find((value) => value.startsWith(`${LOCALE_COOKIE}=`))
      ?.split("=")[1];
    setLocale(
      normalizeLocale(document.documentElement.lang) ??
        negotiateLocale(navigator.language, selected),
    );
  }, []);
  return locale;
}
