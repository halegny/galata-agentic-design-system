import { ImageResponse } from "next/og";

export const alt =
  "Galata — a design system for agents that take consequential actions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LOGO_SVG = `<svg width="56" height="56" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="5.5" fill="#5663f5"/><g fill="#ffffff"><path d="M12 6 L17.2 10.2 H6.8 Z"/><path fill-rule="evenodd" d="M7.3 10.6 H16.7 V18.5 H7.3 Z M8.4 18.5 V14.5 A1.4 1.4 0 0 1 11.2 14.5 V18.5 Z M12.8 18.5 V14.5 A1.4 1.4 0 0 1 15.6 14.5 V18.5 Z"/></g></svg>`;
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
