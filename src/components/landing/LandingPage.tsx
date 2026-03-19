/**
 * F017 - Demo-first Homepage (i18n F019)
 *
 * Replaces the F011 marketing landing page with a demo-first homepage
 * that shows real brand data immediately. Users see value in 3 seconds
 * without clicking anything: top 5 best brands, top 5 worst brands,
 * a search bar, and scan CTA.
 */

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getAllAnalyzedBrands, searchBrands, getBrandGrade, getPetEmoji } from "@/lib/brands";
import type { AnalyzedBrand } from "@/lib/brands/types";
import type { Grade } from "@/lib/analyzer/types";
import { GRADE_COLORS, GRADE_TEXT_COLORS } from "@/lib/grade";
import { useTranslation } from "@/lib/i18n";

interface LandingPageProps {
  onStartScan: () => void;
  onViewHistory: () => void;
}

function MiniGradeBadge({ grade }: { grade: Grade }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${GRADE_COLORS[grade]}`}
      data-testid="mini-grade-badge"
    >
      {grade}
    </span>
  );
}

function BrandListItem({ brand }: { brand: AnalyzedBrand }) {
  return (
    <Link
      href={`/brand/${brand.slug}`}
      className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-3 transition-colors hover:border-neutral-600 hover:bg-neutral-800/50"
    >
      <MiniGradeBadge grade={brand.analysis.grade} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-neutral-100">
          {brand.brand} — {brand.product}
        </p>
        <p className="truncate text-xs text-neutral-500">
          {brand.brandCn} {brand.productCn} · {getPetEmoji(brand.petType)}
        </p>
      </div>
      <span className={`text-sm font-bold ${GRADE_TEXT_COLORS[brand.analysis.grade]}`}>
        {brand.analysis.score}
      </span>
    </Link>
  );
}

export function LandingPage({ onStartScan, onViewHistory }: LandingPageProps) {
  const [query, setQuery] = useState("");
  const { t } = useTranslation("landing");
  const { t: tc } = useTranslation("common");

  const allAnalyzed = useMemo(() => getAllAnalyzedBrands(), []);

  const bestBrands = useMemo(() => {
    return [...allAnalyzed]
      .sort((a, b) => b.analysis.score - a.analysis.score)
      .slice(0, 5);
  }, [allAnalyzed]);

  const worstBrands = useMemo(() => {
    return [...allAnalyzed]
      .sort((a, b) => a.analysis.score - b.analysis.score)
      .slice(0, 5);
  }, [allAnalyzed]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchBrands(query);
  }, [query]);

  const showSearch = query.trim().length > 0;

  const trustItems = [
    { stat: t("trustIngredients"), label: t("trustIngredientsLabel") },
    { stat: t("trustGrades"), label: t("trustGradesLabel") },
    { stat: t("trustLanguages"), label: t("trustLanguagesLabel") },
    { stat: t("trustFree"), label: t("trustFreeLabel") },
  ];

  return (
    <div className="mx-auto max-w-md px-4">
      {/* Compact Hero */}
      <section className="pt-12 pb-6 text-center">
        <h1 className="text-4xl font-black tracking-tight">
          Toxic<span className="text-red-500">Paw</span>
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          {t("tagline")}
        </p>
      </section>

      {/* Search Bar */}
      <section className="pb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className="w-full rounded-2xl border border-neutral-700 bg-neutral-900 px-5 py-4 pl-12 text-base text-neutral-100 placeholder-neutral-500 outline-none transition-colors focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
            data-testid="brand-search-input"
          />
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Search Results */}
        {showSearch && (
          <div className="mt-3" data-testid="brand-search-results">
            {searchResults.length === 0 ? (
              <p className="py-6 text-center text-sm text-neutral-500">
                {t("noResults", { query })}
              </p>
            ) : (
              <ul className="space-y-2">
                {searchResults.map((brand) => {
                  const grade = getBrandGrade(brand);
                  return (
                    <li key={brand.slug}>
                      <Link
                        href={`/brand/${brand.slug}`}
                        className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-3 transition-colors hover:border-neutral-600 hover:bg-neutral-800/50"
                      >
                        <MiniGradeBadge grade={grade} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-neutral-100">
                            {brand.brand} — {brand.product}
                          </p>
                          <p className="truncate text-xs text-neutral-500">
                            {brand.brandCn} {brand.productCn} · {getPetEmoji(brand.petType)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </section>

      {/* Scan CTA (above the brand lists) */}
      <section className="pb-8 text-center">
        <button
          onClick={onStartScan}
          className="rounded-full bg-red-500 px-10 py-3.5 text-base font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-400 hover:shadow-red-500/35 active:scale-[0.97]"
          type="button"
          data-testid="hero-scan-button"
        >
          {t("scanButton")}
        </button>
        <button
          onClick={onViewHistory}
          className="mt-3 block w-full text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-300"
          type="button"
          data-testid="history-button"
        >
          {t("viewHistory")}
        </button>
      </section>

      {/* Worst-Rated Brands (fear hook — shown first) */}
      <section className="pb-8" data-testid="worst-brands">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-100">
            {t("worstRated")}
          </h2>
          <Link
            href="/ranking"
            className="text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-300"
            data-testid="view-full-ranking"
          >
            {t("viewFullRanking")}
          </Link>
        </div>
        <div className="space-y-2">
          {worstBrands.map((brand) => (
            <BrandListItem key={brand.slug} brand={brand} />
          ))}
        </div>
      </section>

      {/* Best-Rated Brands */}
      <section className="pb-8" data-testid="best-brands">
        <h2 className="mb-3 text-lg font-bold text-neutral-100">
          {t("topRated")}
        </h2>
        <div className="space-y-2">
          {bestBrands.map((brand) => (
            <BrandListItem key={brand.slug} brand={brand} />
          ))}
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-10">
        <div className="grid grid-cols-2 gap-3">
          {trustItems.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-center"
            >
              <p className="text-2xl font-bold text-red-400">{item.stat}</p>
              <p className="mt-1.5 text-xs font-medium text-neutral-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{t("readyToScan")}</h2>
        <p className="mt-3 text-sm text-neutral-500">
          {t("readyToScanDesc")}
        </p>
        <button
          onClick={onStartScan}
          className="mt-8 rounded-full bg-red-500 px-12 py-4 text-lg font-bold text-white shadow-xl shadow-red-500/25 transition-all hover:bg-red-400 active:scale-[0.97]"
          type="button"
          data-testid="bottom-scan-button"
        >
          {t("scanLabelNow")}
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800/50 py-10 text-center text-xs text-neutral-600">
        <p className="font-medium">
          {t("footer")}
        </p>
        <p className="mt-1.5">
          {t("disclaimer")}
        </p>
      </footer>
    </div>
  );
}
