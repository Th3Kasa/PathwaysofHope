"use client";

import { useLang, LANGS, type Lang } from "@/lib/i18n";

/**
 * Compact EN / ع segmented control. Lives top-right in the nav and adapts
 * to the transparent (over-hero) and scrolled (solid) header states.
 */
export function LanguageToggle({ scrolled = false }: { scrolled?: boolean }) {
  const { lang, setLang } = useLang();

  const trackBorder = scrolled ? "#d6d3d1" : "rgba(255,255,255,0.45)";
  const idleText = scrolled ? "#6b7280" : "rgba(255,255,255,0.85)";

  return (
    <div
      className="inline-flex items-center rounded-full p-0.5 border"
      style={{ borderColor: trackBorder }}
      role="group"
      aria-label="Select language"
    >
      {LANGS.map((l) => {
        const active = lang === l.code;
        return (
          <button
            key={l.code}
            onClick={() => setLang(l.code as Lang)}
            aria-pressed={active}
            lang={l.code}
            className="px-2.5 py-1 text-xs font-semibold rounded-full transition-colors duration-200"
            style={{
              background: active ? "#6366f1" : "transparent",
              color: active ? "#ffffff" : idleText,
            }}
            title={l.label}
          >
            {l.code === "ar" ? "ع" : "EN"}
          </button>
        );
      })}
    </div>
  );
}
