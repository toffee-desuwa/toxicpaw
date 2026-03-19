"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { AnalyzedBrand } from "@/lib/brands/types";
import { GRADE_COLORS, GRADE_ORDER } from "@/lib/grade";
import { useTranslation } from "@/lib/i18n";

type PetFilter = "all" | "cat" | "dog";

interface RankingClientProps {
  brands: AnalyzedBrand[];
}

export function RankingClient({ brands }: RankingClientProps) {
  const [filter, setFilter] = useState<PetFilter>("all");
  const { t: tc } = useTranslation("common");
  const { t } = useTranslation("ranking");

  const filtered = useMemo(() => {
    const list =
      filter === "all"
        ? brands
        : brands.filter((b) => b.petType === filter);

    return [...list].sort((a, b) => {
      const gradeA = GRADE_ORDER[a.analysis.grade];
      const gradeB = GRADE_ORDER[b.analysis.grade];
      if (gradeA !== gradeB) return gradeA - gradeB;
      return b.analysis.score - a.analysis.score;
    });
  }, [brands, filter]);

  const tabs: { key: PetFilter; labelKey: string }[] = [
    { key: "all", labelKey: "all" },
    { key: "dog", labelKey: "dog" },
    { key: "cat", labelKey: "cat" },
  ];

  return (
    <main className="min-h-dvh">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-10">
        {/* Back link */}
        <Link
          href="/"
          className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-200"
          data-testid="back-link"
        >
          {tc("backToHome")}
        </Link>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-black text-neutral-100">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            {t("subtitle")}
          </p>
          <p className="mt-2 text-xs text-neutral-500">
            {t("productsRanked", { count: filtered.length })}
          </p>
        </div>

        {/* Pet Type Tabs */}
        <div className="flex gap-2" data-testid="pet-filter-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                filter === tab.key
                  ? "bg-neutral-100 text-neutral-900 shadow-md"
                  : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200"
              }`}
              data-testid={`filter-${tab.key}`}
              aria-pressed={filter === tab.key}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        {/* Ranking List */}
        <div className="flex flex-col gap-3" data-testid="ranking-list">
          {filtered.map((brand, index) => (
            <Link
              key={brand.slug}
              href={`/brand/${brand.slug}`}
              className="flex items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 transition-all hover:border-neutral-600 hover:bg-neutral-800 active:scale-[0.99]"
              data-testid={`ranking-item-${brand.slug}`}
            >
              {/* Rank Number */}
              <span className="w-6 text-center text-sm font-bold text-neutral-500">
                {index + 1}
              </span>

              {/* Grade Badge (small) */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${GRADE_COLORS[brand.analysis.grade]} text-sm font-black text-white`}
                aria-label={t("gradeAriaLabel", { grade: brand.analysis.grade })}
              >
                {brand.analysis.grade}
              </div>

              {/* Brand Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-neutral-100">
                  {brand.brand} {brand.product}
                </p>
                <p className="truncate text-xs text-neutral-500">
                  {brand.brandCn} {brand.productCn}
                </p>
              </div>

              {/* Score */}
              <div className="text-right">
                <p className="text-sm font-bold text-neutral-200">
                  {brand.analysis.score}
                </p>
                <p className="text-xs text-neutral-500">{t("scoreDenominator")}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col gap-3 pt-4">
          <Link
            href="/"
            className="block w-full rounded-full bg-red-500 px-8 py-3.5 text-center font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-400 hover:shadow-red-500/30 active:scale-[0.98]"
            data-testid="scan-cta"
          >
            {tc("scanYourFood")}
          </Link>
        </div>
      </div>
    </main>
  );
}
