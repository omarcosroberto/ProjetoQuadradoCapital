import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 6,
        background: "#2d8659",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: "white",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1,
        }}
      >
        Q
      </span>
    </div>,
    { ...size },
  );
}
