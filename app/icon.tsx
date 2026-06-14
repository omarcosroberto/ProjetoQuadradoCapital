import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Satori (next/og) não suporta <svg> nem <circle>/<line>.
// Lupa construída com divs + CSS puro.
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
      {/* container da lupa */}
      <div style={{ position: "relative", width: 20, height: 20, display: "flex" }}>
        {/* círculo da lupa */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 13,
            height: 13,
            borderRadius: "50%",
            border: "2.5px solid white",
          }}
        />
        {/* cabo da lupa — retângulo diagonal */}
        <div
          style={{
            position: "absolute",
            top: 11,
            left: 11,
            width: 2.5,
            height: 9,
            background: "white",
            borderRadius: 2,
            transform: "rotate(45deg)",
          }}
        />
      </div>
    </div>,
    { ...size },
  );
}
