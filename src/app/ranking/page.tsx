import type { Metadata } from "next";
import { getAllAnalyzedBrands } from "@/lib/brands";
import { RankingClient } from "./RankingClient";

export const metadata: Metadata = {
  title: "Pet Food Safety Rankings | ToxicPaw",
  description:
    "Complete pet food safety rankings — compare 75+ cat and dog food brands by ingredient quality. 宠物粮安全排行榜",
  openGraph: {
    title: "Pet Food Safety Rankings | ToxicPaw",
    description:
      "Compare 75+ cat and dog food brands ranked by ingredient safety. Find the safest food for your pet.",
    siteName: "ToxicPaw",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pet Food Safety Rankings | ToxicPaw",
    description:
      "Compare 75+ cat and dog food brands ranked by ingredient safety.",
  },
  alternates: {
    languages: {
      'en': '/ranking',
      'zh-CN': '/ranking',
    },
  },
};

export default function RankingPage() {
  const brands = getAllAnalyzedBrands();
  return <RankingClient brands={brands} />;
}
