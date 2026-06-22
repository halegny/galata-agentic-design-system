import { ImageResponse } from "next/og";

export const alt =
  "Galata — a design system for agents that take consequential actions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LOGO_SVG = `<svg width="56" height="56" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="5.5" fill="#5663f5"/><g fill="#ffffff"><circle cx="12" cy="2.4" r="0.85"/><path d="M12 3.3 L16.8 8.9 H7.2 Z"/><path fill-rule="evenodd" d="M8 8.9 H16 V19.6 H8 Z M8.9 15 V11.9 A0.8 0.8 0 0 1 10.5 11.9 V15 Z M11.2 15 V11.9 A0.8 0.8 0 0 1 12.8 11.9 V15 Z M13.5 15 V11.9 A0.8 0.8 0 0 1 15.1 11.9 V15 Z"/><rect x="6.6" y="19.4" width="10.8" height="2.4" rx="0.6"/></g></svg>`;
const LOGO_SRC = `data:image/svg+xml;utf8,${encodeURIComponent(LOGO_SVG)}`;

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
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <img width={56} height={56} src={LOGO_SRC} alt="" />
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
