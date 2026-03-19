import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllBrandSlugs,
  getAnalyzedBrandBySlug,
} from "@/lib/brands";
import { BrandResultClient } from "./BrandResultClient";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getAllBrandSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getAnalyzedBrandBySlug(slug);

  if (!brand) {
    return { title: "Brand Not Found | ToxicPaw" };
  }

  const title = `${brand.brand} ${brand.product} — Grade ${brand.analysis.grade} | ToxicPaw`;
  const description = `${brand.brand} ${brand.product} (${brand.brandCn} ${brand.productCn}) scored ${brand.analysis.score}/100 (Grade ${brand.analysis.grade}). ${brand.analysis.verdict}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "ToxicPaw",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = getAnalyzedBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  return <BrandResultClient brand={brand} />;
}
