"use client";

import { useTranslation } from "@/lib/i18n";

export function Disclaimer() {
  const { t } = useTranslation("legal");

  return (
    <p className="mt-4 text-xs leading-relaxed text-neutral-500">
      <span aria-hidden="true">&#x26A0;&#xFE0F; </span>
      {t("disclaimer")}
    </p>
  );
}
