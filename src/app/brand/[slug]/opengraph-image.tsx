import { ImageResponse } from "next/og";
import { getAnalyzedBrandBySlug, getAllBrandSlugs } from "@/lib/brands";
import { GRADE_HEX, OG_WIDTH, OG_HEIGHT } from "@/lib/og/constants";

export const alt = "ToxicPaw Brand Safety Grade";
export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = "image/png";

export function generateStaticParams(): { slug: string }[] {
  return getAllBrandSlugs().map((slug) => ({ slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = getAnalyzedBrandBySlug(slug);

  if (!brand) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            color: "#ffffff",
            fontSize: 48,
          }}
        >
          Brand Not Found
        </div>
      ),
      { ...size }
    );
  }

  const { grade, score, summary } = brand.analysis;
  const gradeColor = GRADE_HEX[grade];
  const petEmoji = brand.petType === "cat" ? "\ud83d\udc31" : "\ud83d\udc36";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          padding: "40px 60px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <span style={{ display: "flex", fontSize: 28, color: "#a3a3a3" }}>
            {`${petEmoji} ToxicPaw`}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            backgroundColor: gradeColor,
            marginBottom: "12px",
            boxShadow: `0 0 60px ${gradeColor}66`,
          }}
        >
          <span
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1,
            }}
          >
            {grade}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: gradeColor,
            fontWeight: 700,
            marginBottom: "20px",
          }}
        >
          {`Score: ${score} / 100`}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 36,
            fontWeight: 700,
            color: "#f5f5f5",
            textAlign: "center",
            marginBottom: "4px",
          }}
        >
          {`${brand.brand} ${brand.product}`}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#a3a3a3",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          {`${brand.brandCn} ${brand.productCn}`}
        </div>

        <div
          style={{
            display: "flex",
            gap: "32px",
            fontSize: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#ef4444",
                display: "flex",
              }}
            />
            <span style={{ display: "flex", color: "#fca5a5" }}>
              {`${summary.harmfulCount} harmful`}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#f59e0b",
                display: "flex",
              }}
            />
            <span style={{ display: "flex", color: "#fcd34d" }}>
              {`${summary.cautionCount} caution`}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                display: "flex",
              }}
            />
            <span style={{ display: "flex", color: "#6ee7b7" }}>
              {`${summary.safeCount} safe`}
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
