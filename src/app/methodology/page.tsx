import type { Metadata } from "next";
import { MethodologyClient } from "./MethodologyClient";

export const metadata: Metadata = {
  title: "Scoring Methodology - ToxicPaw",
  description:
    "How ToxicPaw scores pet food ingredients. Transparent algorithm documentation including data sources, scoring rules, grade thresholds, and limitations.",
};

export default function MethodologyPage() {
  return <MethodologyClient />;
}
