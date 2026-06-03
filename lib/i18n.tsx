"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// ─── Locale model ─────────────────────────────────────────────────────────────
export type Lang = "en" | "ar";

export const LANGS: { code: Lang; label: string; native: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", native: "English", dir: "ltr" },
  { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
];

export const DEFAULT_LANG: Lang = "en";
const STORAGE_KEY = "poh-lang";

export function dirFor(lang: Lang): "ltr" | "rtl" {
  return lang === "ar" ? "rtl" : "ltr";
}

interface I18nValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  toggle: () => void;
}

const I18nContext = createContext<I18nValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Restore saved preference on mount (English is the default for first visit).
  useEffect(() => {
    const saved = (typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY)) as Lang | null;
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);

  // Keep <html lang/dir> in sync so the whole document flips correctly.
  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = dirFor(lang);
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* storage may be unavailable; preference simply won't persist */
    }
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === "en" ? "ar" : "en");
  }, [lang, setLang]);

  return (
    <I18nContext.Provider value={{ lang, dir: dirFor(lang), setLang, toggle }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLang(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Safe fallback if a component renders outside the provider.
    return { lang: DEFAULT_LANG, dir: "ltr", setLang: () => {}, toggle: () => {} };
  }
  return ctx;
}

/**
 * Pick the right value for the active language from a {en, ar} pair.
 * Usage: const text = useT(); text({ en: "Give now", ar: "تبرّع الآن" })
 */
export function useT() {
  const { lang } = useLang();
  return useCallback(<T,>(pair: { en: T; ar: T }): T => pair[lang], [lang]);
}

/** Convenience type for colocated page dictionaries. */
export type Dict<T> = { en: T; ar: T };
