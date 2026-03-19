"use client";

import { useLocale, useSetLocale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const locale = useLocale();
  const setLocale = useSetLocale();

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "en" ? "zh" : "en")}
      className="fixed top-4 right-4 z-50 rounded-full border border-neutral-700 bg-neutral-900/80 px-3 py-1.5 text-xs font-semibold text-neutral-300 backdrop-blur-sm transition-colors hover:border-neutral-500 hover:text-neutral-100"
      aria-label={
        locale === "en" ? "Switch to Chinese" : "Switch to English"
      }
      data-testid="language-switcher"
    >
      {locale === "en" ? "中文" : "EN"}
    </button>
  );
}
