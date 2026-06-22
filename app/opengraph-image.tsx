import { ImageResponse } from "next/og";

export const alt =
  "Galata — a design system for agents that take consequential actions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0b0f1a",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 5,
              width: 44,
              height: 44,
              backgroundColor: "#5663f5",
              borderRadius: 10,
              padding: 11,
              boxSizing: "border-box",
            }}
          >
            <div style={{ width: 5, height: 8, backgroundColor: "rgba(255,255,255,0.6)", borderRadius: 3 }} />
            <div style={{ width: 5, height: 14, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 3 }} />
            <div style={{ width: 5, height: 20, backgroundColor: "#ffffff", borderRadius: 3 }} />
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: "#e9ecf2",
              letterSpacing: "-0.01em",
            }}
          >
            Galata
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 66,
              fontWeight: 600,
              color: "#f5f8fc",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              maxWidth: 940,
            }}
          >
            Design for agents that take consequential actions.
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#9aa2ff" }}>
            Consequence is a visual property.
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, fontSize: 22, color: "#828b9e" }}>
          <span>Quiet</span>
          <span>·</span>
          <span>Medium</span>
          <span>·</span>
          <span>Loud</span>
          <span>·</span>
          <span style={{ color: "#e9ecf2" }}>Interrupt</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
