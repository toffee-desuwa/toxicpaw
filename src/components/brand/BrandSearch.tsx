"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { searchBrands, getAllBrands } from "@/lib/brands";
import type { BrandEntry } from "@/lib/brands/types";
import { analyzeIngredients } from "@/lib/analyzer";
import type { ParsedIngredient } from "@/lib/ocr/types";
import type { Grade } from "@/lib/analyzer/types";

const GRADE_COLORS: Record<Grade, string> = {
  A: "bg-emerald-500",
  B: "bg-lime-500",
  C: "bg-amber-500",
  D: "bg-orange-500",
  F: "bg-red-600",
};

function getGrade(brand: BrandEntry): Grade {
  const parsed: ParsedIngredient[] = brand.ingredients.map((name, i) => ({
    original: name,
    normalized: name.toLowerCase().trim(),
    position: i,
  }));
  return analyzeIngredients(parsed).grade;
}

interface BrandSearchProps {
  onScanOwn?: () => void;
}

export function BrandSearch({ onScanOwn }: BrandSearchProps) {
  const [query, setQuery] = useState("");

  const allBrands = useMemo(() => getAllBrands(), []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchBrands(query);
  }, [query]);

  const showResults = query.trim().length > 0;

  return (
    <div className="w-full" data-testid="brand-search">
      {/* Search Input */}
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

      {/* Results */}
      {showResults && (
        <div className="mt-3" data-testid="brand-search-results">
          {results.length === 0 ? (
            <p className="py-6 text-center text-sm text-neutral-500">
              No brands found for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <ul className="space-y-2">
              {results.map((brand) => {
                const grade = getGrade(brand);
                return (
                  <li key={brand.slug}>
                    <Link
                      href={`/brand/${brand.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-3 transition-colors hover:border-neutral-600 hover:bg-neutral-800/50"
                      data-testid={`brand-result-${brand.slug}`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${GRADE_COLORS[grade]}`}
                      >
                        {grade}
                      </span>
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

      {/* Browse all hint */}
      {!showResults && (
        <p className="mt-3 text-center text-xs text-neutral-600">
          {allBrands.length} brands in database ·{" "}
          {onScanOwn ? (
            <button
              type="button"
              onClick={onScanOwn}
              className="text-red-400 underline-offset-2 hover:underline"
            >
              or scan your own label
            </button>
          ) : (
            <Link href="/" className="text-red-400 underline-offset-2 hover:underline">
              or scan your own label
            </Link>
          )}
        </p>
      )}
    </div>
  );
}
