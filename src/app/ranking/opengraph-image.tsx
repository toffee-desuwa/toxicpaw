import { ImageResponse } from "next/og";
import { getAllAnalyzedBrands } from "@/lib/brands";
import { GRADE_HEX, OG_WIDTH, OG_HEIGHT } from "@/lib/og/constants";
import type { Grade } from "@/lib/analyzer/types";

export const alt = "Pet Food Safety Rankings | ToxicPaw";
export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = "image/png";

export default async function OgImage() {
  const brands = getAllAnalyzedBrands();

  const gradeCount: Record<Grade, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  for (const b of brands) {
    gradeCount[b.analysis.grade]++;
  }

  const topBrands = [...brands]
    .sort((a, b) => b.analysis.score - a.analysis.score)
    .slice(0, 5);

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
            fontSize: 48,
            fontWeight: 900,
            color: "#f5f5f5",
            marginBottom: "8px",
          }}
        >
          Pet Food Safety Rankings
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#a3a3a3",
            marginBottom: "32px",
          }}
        >
          {`${brands.length} brands analyzed by ToxicPaw`}
        </div>

        <div
          style={{
            display: "flex",
            gap: "24px",
            marginBottom: "36px",
          }}
        >
          {(["A", "B", "C", "D", "F"] as Grade[]).map((g) => (
            <div
              key={g}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: GRADE_HEX[g],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: 900,
                  color: "#ffffff",
                }}
              >
                {g}
              </div>
              <span style={{ display: "flex", fontSize: 20, color: "#d4d4d4" }}>
                {String(gradeCount[g])}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            width: "100%",
            maxWidth: "800px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: "#737373",
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: "4px",
            }}
          >
            Top Rated
          </div>
          {topBrands.map((b, i) => (
            <div
              key={b.slug}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: 20,
              }}
            >
              <span style={{ display: "flex", color: "#737373", width: "24px" }}>
                {`${i + 1}.`}
              </span>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: GRADE_HEX[b.analysis.grade],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                {b.analysis.grade}
              </div>
              <span style={{ display: "flex", color: "#e5e5e5" }}>
                {`${b.brand} ${b.product}`}
              </span>
              <span style={{ display: "flex", color: "#737373", marginLeft: "auto" }}>
                {`${b.analysis.score}/100`}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
