// app/i18n/i18n.ts
import en from "./en.json";
import mr from "./mr.json";

type LocaleKey = "en" | "mr";

const translations: Record<LocaleKey, Record<string, string>> = {
  en,
  mr,
};

let currentLocale: LocaleKey = "en";

/**
 * Set the active locale
 */
export function setLocale(locale: LocaleKey) {
  if (locale === "mr" || locale === "en") {
    currentLocale = locale;
  } else {
    currentLocale = "en";
  }
}

/**
 * Get the active locale
 */
export function getLocale(): LocaleKey {
  return currentLocale;
}

/**
 * Translate helper
 * - returns translations[locale][key] or falls back to english or the key itself
 */
export function t(key: string): string {
  const localized = translations[currentLocale]?.[key];
  if (localized && localized.length) return localized;
  const fallback = translations["en"]?.[key];
  if (fallback && fallback.length) return fallback;
  return key;
}

export default { t, setLocale, getLocale, translations };
