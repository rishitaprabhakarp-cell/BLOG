import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/content";

export const alt = "Rishita Prabhakar — Full-stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const profile = await getProfile();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0a0a0a",
          color: "#ededed",
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -260,
            left: "50%",
            transform: "translateX(-50%)",
            width: 900,
            height: 600,
            background:
              "radial-gradient(closest-side, rgba(0, 212, 255, 0.28), rgba(0, 153, 255, 0.10) 50%, transparent 75%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -180,
            right: -120,
            width: 520,
            height: 420,
            background:
              "radial-gradient(closest-side, rgba(0, 153, 255, 0.20), transparent 70%)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#00d4ff",
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "0.05em",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "9999px",
              background: "#00d4ff",
              boxShadow: "0 0 24px #00d4ff",
              display: "flex",
            }}
          />
          {profile.location}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            <span style={{ color: "#ededed" }}>Hey, I&apos;m&nbsp;</span>
            <span style={{ color: "#00d4ff" }}>{profile.name}</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: "#a1a1aa",
              maxWidth: 960,
              lineHeight: 1.3,
            }}
          >
            {profile.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#71717a",
            fontSize: 22,
          }}
        >
          <div style={{ display: "flex", gap: 32 }}>
            <span>{profile.email}</span>
          </div>
          <div style={{ display: "flex", color: "#a1a1aa", fontWeight: 600 }}>
            {profile.fullName}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
