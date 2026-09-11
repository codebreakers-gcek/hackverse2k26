import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "HACKVERSE '26 - Flagship 24H State Tech Fest & Hackathon | CodeBreakers GCEK";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#FFD93D",
        padding: "44px 52px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
        border: "14px solid #000000",
      }}
    >
      {/* Inner Frame */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          right: 20,
          bottom: 20,
          border: "4px solid #000000",
          pointerEvents: "none",
        }}
      />

      {/* Top Header Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#000000",
            color: "#FFFFFF",
            padding: "8px 20px",
            border: "3px solid #000000",
            boxShadow: "5px 5px 0px #000000",
          }}
        >
          <span
            style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "2px" }}
          >
            CODEBREAKERS // GCEK
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#FF6B6B",
            color: "#000000",
            padding: "8px 18px",
            border: "3px solid #000000",
            boxShadow: "5px 5px 0px #000000",
            fontWeight: 900,
            fontSize: "17px",
          }}
        >
          <span>⚡ 24-HOUR NON-STOP SPRINT</span>
        </div>
      </div>

      {/* Center Hero */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span
            style={{
              fontSize: "86px",
              fontWeight: 900,
              color: "#000000",
              lineHeight: 1,
              letterSpacing: "-3px",
            }}
          >
            HACKVERSE &apos;26
          </span>
        </div>

        <p
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: "#000000",
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          State-Level Flagship Hackathon &amp; Technical Festival • GCEK
          Kalahandi
        </p>
      </div>

      {/* Bottom Tracks & Prize Matrix */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          zIndex: 10,
          borderTop: "4px solid #000000",
          paddingTop: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["AI/ML", "WEB3", "CYBER SEC", "CLOUD & IOT", "OPEN INNOVATION"].map(
            (track) => (
              <span
                key={track}
                style={{
                  background: "#FFFFFF",
                  color: "#000000",
                  padding: "6px 14px",
                  border: "3px solid #000000",
                  fontWeight: 900,
                  fontSize: "15px",
                  boxShadow: "4px 4px 0px #000000",
                }}
              >
                {track}
              </span>
            ),
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#4ECDC4",
            color: "#000000",
            padding: "8px 20px",
            border: "3px solid #000000",
            boxShadow: "5px 5px 0px #000000",
            fontWeight: 900,
            fontSize: "20px",
          }}
        >
          <span>🏆 ₹35K+ POOL</span>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
