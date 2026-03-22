"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

const SECTIONS = [
  { titleKey: "overviewTitle", bodyKey: "overviewBody" },
  { titleKey: "dataSourcesTitle", bodyKey: "dataSourcesBody" },
  { titleKey: "howScoringWorksTitle", bodyKey: "howScoringWorksBody" },
  { titleKey: "ingredientCategoriesTitle", bodyKey: "ingredientCategoriesBody" },
  { titleKey: "scoringRulesTitle", bodyKey: "scoringRulesBody" },
  { titleKey: "gradeThresholdsTitle", bodyKey: "gradeThresholdsBody" },
  { titleKey: "petProfileTitle", bodyKey: "petProfileBody" },
  { titleKey: "whatWeDoNotEvaluateTitle", bodyKey: "whatWeDoNotEvaluateBody" },
  { titleKey: "limitationsTitle", bodyKey: "limitationsBody" },
  { titleKey: "openToFeedbackTitle", bodyKey: "openToFeedbackBody" },
] as const;

export function MethodologyClient() {
  const { t } = useTranslation("methodology");

  return (
    <main className="min-h-dvh bg-neutral-950">
      <div className="mx-auto max-w-md px-4 py-10">
        <Link
          href="/"
          className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-200"
        >
          {t("backToHome")}
        </Link>

        <h1 className="mt-8 text-2xl font-bold tracking-tight text-neutral-100">
          {t("pageTitle")}
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-neutral-500">
          {t("lastUpdated")}
        </p>

        <div className="mt-8 space-y-8">
          {SECTIONS.map(({ titleKey, bodyKey }, idx) => (
            <section key={titleKey}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                {idx + 1}. {t(titleKey)}
              </h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-400">
                {t(bodyKey)}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 border-t border-neutral-800/50 pt-6 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-200"
          >
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
