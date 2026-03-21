import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          borderRadius: "6px",
        }}
      >
        {/* Simplified paw icon at small size */}
        <svg
          width="24"
          height="24"
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
        </svg>
      </div>
    ),
    { ...size }
  );
}
