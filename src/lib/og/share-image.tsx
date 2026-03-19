/**
 * F025 - Shared image builder for server-side share image generation.
 *
 * Renders JSX for both landscape (1200×630 OG) and square (1080×1080 小红书/Instagram)
 * formats. Used by /api/share-image route.
 */

import type { Grade, AnalysisSummary } from "@/lib/analyzer/types";
import { GRADE_HEX } from "./constants";
import type { ShareFormat } from "./constants";

export interface ShareImageData {
  grade: Grade;
  score: number;
  summary: AnalysisSummary;
  verdict: string;
  foodName?: string;
  foodNameCn?: string;
  petType?: "cat" | "dog";
  harmfulNames?: string[];
  safeNames?: string[];
}

function StatDot({ color }: { color: string }) {
  return (
    <div
      style={{
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        backgroundColor: color,
        display: "flex",
        flexShrink: 0,
      }}
    />
  );
}

function buildOgImage(data: ShareImageData) {
  const gradeColor = GRADE_HEX[data.grade];
  const petEmoji = data.petType === "cat" ? "\ud83d\udc31" : data.petType === "dog" ? "\ud83d\udc36" : "\ud83d\udc3e";

  return (
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
          {data.grade}
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
        {`Score: ${data.score} / 100`}
      </div>

      {data.foodName && (
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
          {data.foodName}
        </div>
      )}
      {data.foodNameCn && (
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#a3a3a3",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          {data.foodNameCn}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "32px",
          fontSize: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <StatDot color="#ef4444" />
          <span style={{ display: "flex", color: "#fca5a5" }}>
            {`${data.summary.harmfulCount} harmful`}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <StatDot color="#f59e0b" />
          <span style={{ display: "flex", color: "#fcd34d" }}>
            {`${data.summary.cautionCount} caution`}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <StatDot color="#10b981" />
          <span style={{ display: "flex", color: "#6ee7b7" }}>
            {`${data.summary.safeCount} safe`}
          </span>
        </div>
      </div>
    </div>
  );
}

function buildSquareImage(data: ShareImageData) {
  const gradeColor = GRADE_HEX[data.grade];
  const petEmoji = data.petType === "cat" ? "\ud83d\udc31" : data.petType === "dog" ? "\ud83d\udc36" : "\ud83d\udc3e";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
        padding: "60px",
        fontFamily: "sans-serif",
      }}
    >
      {/* Brand header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <span style={{ display: "flex", fontSize: 32, color: "#a3a3a3" }}>
          {`${petEmoji} ToxicPaw`}
        </span>
      </div>

      {/* Grade circle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          backgroundColor: gradeColor,
          marginBottom: "16px",
          boxShadow: `0 0 80px ${gradeColor}66`,
        }}
      >
        <span
          style={{
            display: "flex",
            fontSize: 128,
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1,
          }}
        >
          {data.grade}
        </span>
      </div>

      {/* Score */}
      <div
        style={{
          display: "flex",
          fontSize: 36,
          color: gradeColor,
          fontWeight: 700,
          marginBottom: "24px",
        }}
      >
        {`Score: ${data.score} / 100`}
      </div>

      {/* Food name */}
      {data.foodName && (
        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 700,
            color: "#f5f5f5",
            textAlign: "center",
            marginBottom: "8px",
            maxWidth: "900px",
          }}
        >
          {data.foodName}
        </div>
      )}
      {data.foodNameCn && (
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#a3a3a3",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          {data.foodNameCn}
        </div>
      )}

      {/* Verdict */}
      <div
        style={{
          display: "flex",
          fontSize: 22,
          color: "#d4d4d4",
          textAlign: "center",
          marginBottom: "32px",
          maxWidth: "800px",
          lineHeight: 1.5,
        }}
      >
        {data.verdict}
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: "40px",
          fontSize: 22,
          marginBottom: "32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <StatDot color="#ef4444" />
          <span style={{ display: "flex", color: "#fca5a5" }}>
            {`${data.summary.harmfulCount} harmful`}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <StatDot color="#f59e0b" />
          <span style={{ display: "flex", color: "#fcd34d" }}>
            {`${data.summary.cautionCount} caution`}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <StatDot color="#10b981" />
          <span style={{ display: "flex", color: "#6ee7b7" }}>
            {`${data.summary.safeCount} safe`}
          </span>
        </div>
      </div>

      {/* Harmful ingredients highlight */}
      {data.harmfulNames && data.harmfulNames.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <span style={{ display: "flex", fontSize: 16, color: "#ef4444", fontWeight: 600 }}>
            {"\u26a0 Harmful Ingredients Found"}
          </span>
          <span style={{ display: "flex", fontSize: 18, color: "#fca5a5", textAlign: "center" }}>
            {data.harmfulNames.slice(0, 5).join(", ")}
          </span>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: "30px",
          fontSize: 16,
          color: "#525252",
        }}
      >
        {"toxicpaw.com \u00b7 AI-Powered Pet Food Safety"}
      </div>
    </div>
  );
}

export function buildShareImage(data: ShareImageData, format: ShareFormat) {
  return format === "square" ? buildSquareImage(data) : buildOgImage(data);
}
