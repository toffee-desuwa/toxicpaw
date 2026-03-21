import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "180px",
          height: "180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          borderRadius: "36px",
        }}
      >
        <svg
          width="130"
          height="130"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Paw pad */}
          <ellipse cx="256" cy="310" rx="70" ry="60" fill="#ef4444" />
          {/* Toes */}
          <ellipse
            cx="170"
            cy="220"
            rx="35"
            ry="42"
            fill="#ef4444"
            transform="rotate(-15 170 220)"
          />
          <ellipse
            cx="230"
            cy="175"
            rx="32"
            ry="40"
            fill="#ef4444"
            transform="rotate(-5 230 175)"
          />
          <ellipse
            cx="282"
            cy="175"
            rx="32"
            ry="40"
            fill="#ef4444"
            transform="rotate(5 282 175)"
          />
          <ellipse
            cx="342"
            cy="220"
            rx="35"
            ry="42"
            fill="#ef4444"
            transform="rotate(15 342 220)"
          />
          {/* Warning triangle on paw pad */}
          <polygon points="256,265 232,320 280,320" fill="#0a0a0a" />
          {/* Exclamation mark */}
          <rect x="252" y="278" width="8" height="24" rx="2" fill="#fbbf24" />
          <circle cx="256" cy="312" r="4" fill="#fbbf24" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
