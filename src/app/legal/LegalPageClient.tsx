"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

const SECTIONS = [
  { titleKey: "natureOfServiceTitle", bodyKey: "natureOfServiceBody" },
  { titleKey: "notVetAdviceTitle", bodyKey: "notVetAdviceBody" },
  { titleKey: "analysisLimitationsTitle", bodyKey: "analysisLimitationsBody" },
  { titleKey: "brandRatingsTitle", bodyKey: "brandRatingsBody" },
  { titleKey: "noLiabilityTitle", bodyKey: "noLiabilityBody" },
  { titleKey: "disputeProcessTitle", bodyKey: "disputeProcessBody" },
] as const;

export function LegalPageClient() {
  const { t } = useTranslation("legal");

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

        <div className="mt-8 space-y-8">
          {SECTIONS.map(({ titleKey, bodyKey }, idx) => (
            <section key={titleKey}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                {idx + 1}. {t(titleKey)}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
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
