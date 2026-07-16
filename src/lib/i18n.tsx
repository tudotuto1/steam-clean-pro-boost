import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { fr, type TKey } from "./locales/fr";
import { en } from "./locales/en";

export type Lang = "fr" | "en";

const DICTS: Record<Lang, Record<string, string>> = { fr, en };
const COOKIE = "lang";
const DEFAULT_LANG: Lang = "fr";

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
}

const I18nContext = createContext<I18nValue | undefined>(undefined);

function readCookieLang(): Lang | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)lang=(fr|en)/);
  return m ? (m[1] as Lang) : null;
}

export function LanguageProvider({
  children,
  initialLang = DEFAULT_LANG,
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  // Persistence + SSR safety: server and the first client render both use
  // `initialLang` (default 'fr'), so there is no hydration mismatch. The saved
  // language is applied right after mount.
  useEffect(() => {
    const saved = readCookieLang();
    if (saved && saved !== lang) setLangState(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep <html lang> in sync with the active language.
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof document !== "undefined") {
      document.cookie = `${COOKIE}=${l}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, []);

  const t = useCallback(
    (key: TKey) => DICTS[lang][key] ?? DICTS.fr[key] ?? key,
    [lang],
  );

  const value = useMemo<I18nValue>(
    () => ({ lang, setLang, t }),
    [lang, setLang, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within a LanguageProvider");
  return ctx;
}

/** Convenience hook returning just the translate function. */
export function useT(): (key: TKey) => string {
  return useI18n().t;
}

/** Format an ISO date in the active language (fr-CA / en-CA). */
export function formatDate(iso: string, lang: Lang): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const locale = lang === "fr" ? "fr-CA" : "en-CA";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/**
 * Format a cents amount: "74,99 $ CAD" in FR, "$74.99 CAD" in EN.
 */
export function formatAmount(
  cents: number | null,
  currency: string | null,
  lang: Lang,
): string {
  const value = (cents ?? 0) / 100;
  const cur = (currency ?? "cad").toUpperCase();
  if (lang === "fr") {
    const n = value.toLocaleString("fr-CA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${n} $ ${cur}`;
  }
  const n = value.toLocaleString("en-CA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `$${n} ${cur}`;
}
