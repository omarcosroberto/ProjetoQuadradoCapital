import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: "#2d8659",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Magnifying glass icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circle of the magnifying glass */}
        <circle cx="7.5" cy="7.5" r="5" stroke="white" strokeWidth="2.2" fill="none" />
        {/* Handle */}
        <line x1="11.5" y1="11.5" x2="16" y2="16" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </div>,
    { ...size },
  );
}
