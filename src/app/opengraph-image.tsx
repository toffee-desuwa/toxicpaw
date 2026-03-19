import { ImageResponse } from "next/og";
import { getAllAnalyzedBrands } from "@/lib/brands";
import { GRADE_HEX, OG_WIDTH, OG_HEIGHT } from "@/lib/og/constants";

export const alt = "ToxicPaw - Pet Food Ingredient Scanner";
export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = "image/png";

export default async function OgImage() {
  const brands = getAllAnalyzedBrands();
  const sorted = [...brands].sort(
    (a, b) => a.analysis.score - b.analysis.score
  );

  const worst = sorted.slice(0, 3);
  const best = sorted.slice(-3).reverse();

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
            fontSize: 56,
            fontWeight: 900,
            color: "#f5f5f5",
            marginBottom: "4px",
          }}
        >
          ToxicPaw
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#a3a3a3",
            marginBottom: "36px",
          }}
        >
          AI-Powered Pet Food Safety Scanner
        </div>

        <div
          style={{
            display: "flex",
            gap: "60px",
            width: "100%",
            maxWidth: "900px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 16,
                color: "#10b981",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "12px",
                fontWeight: 700,
              }}
            >
              Best Rated
            </div>
            {best.map((b) => (
              <div
                key={b.slug}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                  fontSize: 18,
                }}
              >
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
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 16,
                color: "#ef4444",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "12px",
                fontWeight: 700,
              }}
            >
              Worst Rated
            </div>
            {worst.map((b) => (
              <div
                key={b.slug}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                  fontSize: 18,
                }}
              >
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
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "28px",
            fontSize: 20,
            color: "#737373",
          }}
        >
          {`${brands.length} brands \u00b7 500+ ingredients \u00b7 Free & Open Source`}
        </div>
      </div>
    ),
    { ...size }
  );
}
