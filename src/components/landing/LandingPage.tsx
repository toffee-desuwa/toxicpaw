/**
 * F017 - Demo-first Homepage
 *
 * Replaces the F011 marketing landing page with a demo-first homepage
 * that shows real brand data immediately. Users see value in 3 seconds
 * without clicking anything: top 5 best brands, top 5 worst brands,
 * a search bar, and scan CTA.
 */

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getAllAnalyzedBrands, searchBrands } from "@/lib/brands";
import { analyzeIngredients } from "@/lib/analyzer";
import type { AnalyzedBrand, BrandEntry } from "@/lib/brands/types";
import type { Grade } from "@/lib/analyzer/types";
import type { ParsedIngredient } from "@/lib/ocr/types";

const GRADE_COLORS: Record<Grade, string> = {
  A: "bg-emerald-500",
  B: "bg-lime-500",
  C: "bg-amber-500",
  D: "bg-orange-500",
  F: "bg-red-600",
};

const GRADE_TEXT_COLORS: Record<Grade, string> = {
  A: "text-emerald-400",
  B: "text-lime-400",
  C: "text-amber-400",
  D: "text-orange-400",
  F: "text-red-400",
};

interface LandingPageProps {
  onStartScan: () => void;
  onViewHistory: () => void;
}

function getGradeForBrand(brand: BrandEntry): Grade {
  const parsed: ParsedIngredient[] = brand.ingredients.map((name, i) => ({
    original: name,
    normalized: name.toLowerCase().trim(),
    position: i,
  }));
  return analyzeIngredients(parsed).grade;
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
          {brand.brandCn} {brand.productCn} · {brand.petType === "cat" ? "🐱" : "🐶"}
        </p>
      </div>
      <span className={`text-sm font-bold ${GRADE_TEXT_COLORS[brand.analysis.grade]}`}>
        {brand.analysis.score}
      </span>
    </Link>
  );
}

const trustItems = [
  { stat: "500+", label: "Ingredients in database" },
  { stat: "A-F", label: "Clear safety grades" },
  { stat: "2", label: "Languages supported" },
  { stat: "Free", label: "Open source & free" },
];

export function LandingPage({ onStartScan, onViewHistory }: LandingPageProps) {
  const [query, setQuery] = useState("");

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

  return (
    <div className="mx-auto max-w-md px-4">
      {/* Compact Hero */}
      <section className="pt-12 pb-6 text-center">
        <h1 className="text-4xl font-black tracking-tight">
          Toxic<span className="text-red-500">Paw</span>
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Is your pet food safe? Search or scan to find out.
        </p>
      </section>

      {/* Search Bar */}
      <section className="pb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a brand... 搜索品牌"
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
                No brands found for &ldquo;{query}&rdquo;
              </p>
            ) : (
              <ul className="space-y-2">
                {searchResults.map((brand) => {
                  const grade = getGradeForBrand(brand);
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
                            {brand.brandCn} {brand.productCn} · {brand.petType === "cat" ? "🐱" : "🐶"}
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
          📸 Scan Your Label
        </button>
        <button
          onClick={onViewHistory}
          className="mt-3 block w-full text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-300"
          type="button"
          data-testid="history-button"
        >
          View Scan History
        </button>
      </section>

      {/* Worst-Rated Brands (fear hook — shown first) */}
      <section className="pb-8" data-testid="worst-brands">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-100">
            ⚠️ Worst Rated
          </h2>
          <Link
            href="/ranking"
            className="text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-300"
            data-testid="view-full-ranking"
          >
            View full ranking →
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
          🏆 Top Rated
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
          {trustItems.map((t) => (
            <div
              key={t.label}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-center"
            >
              <p className="text-2xl font-bold text-red-400">{t.stat}</p>
              <p className="mt-1.5 text-xs font-medium text-neutral-500">
                {t.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Ready to Scan?</h2>
        <p className="mt-3 text-sm text-neutral-500">
          Find out what&apos;s really in your pet&apos;s food.
        </p>
        <button
          onClick={onStartScan}
          className="mt-8 rounded-full bg-red-500 px-12 py-4 text-lg font-bold text-white shadow-xl shadow-red-500/25 transition-all hover:bg-red-400 active:scale-[0.97]"
          type="button"
          data-testid="bottom-scan-button"
        >
          Scan Label Now
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800/50 py-10 text-center text-xs text-neutral-600">
        <p className="font-medium">
          ToxicPaw — Open source pet food safety scanner
        </p>
        <p className="mt-1.5">
          Not a substitute for veterinary advice.
        </p>
      </footer>
    </div>
  );
}
