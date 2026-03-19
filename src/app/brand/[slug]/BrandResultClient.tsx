"use client";

import Link from "next/link";
import type { AnalyzedBrand } from "@/lib/brands/types";
import { GradeBadge } from "@/components/grade";
import { IngredientList } from "@/components/analysis/IngredientList";
import { SummaryBar } from "@/components/analysis/SummaryBar";
import { ShareButton } from "@/components/sharing";

interface BrandResultClientProps {
  brand: AnalyzedBrand;
}

export function BrandResultClient({ brand }: BrandResultClientProps) {
  const { analysis } = brand;
  const displayName = `${brand.brand} ${brand.product}`;
  const displayNameCn = `${brand.brandCn} ${brand.productCn}`;

  return (
    <main className="min-h-dvh">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-10">
        {/* Back link */}
        <Link
          href="/"
          className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-200"
          data-testid="back-link"
        >
          &larr; Back to Home
        </Link>

        {/* Brand Header */}
        <div className="text-center" data-testid="brand-header">
          <h1 className="text-xl font-bold text-neutral-100">{displayName}</h1>
          <p className="mt-1 text-sm text-neutral-400">{displayNameCn}</p>
          <p className="mt-1 text-xs text-neutral-600">
            {brand.petType === "cat" ? "🐱 Cat Food" : "🐶 Dog Food"}
          </p>
        </div>

        {/* Grade Badge */}
        <GradeBadge grade={analysis.grade} score={analysis.score} />

        {/* Verdict */}
        <p
          className="text-center text-base leading-relaxed text-neutral-300"
          data-testid="verdict"
        >
          {analysis.verdict}
        </p>

        {/* Summary Stats */}
        <SummaryBar summary={analysis.summary} />

        {/* Ingredient List */}
        <IngredientList ingredients={analysis.ingredients} />

        {/* Share */}
        <ShareButton result={analysis} foodName={displayName} />

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="block w-full rounded-full bg-red-500 px-8 py-3.5 text-center font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-400 hover:shadow-red-500/30 active:scale-[0.98]"
            data-testid="scan-own-cta"
          >
            Scan Your Own Food
          </Link>
          <Link
            href="/ranking"
            className="block w-full rounded-full border border-neutral-700 bg-neutral-800 px-8 py-3.5 text-center font-semibold text-neutral-200 transition-colors hover:bg-neutral-700 active:scale-[0.98]"
            data-testid="ranking-link"
          >
            View All Rankings
          </Link>
        </div>
      </div>
    </main>
  );
}
