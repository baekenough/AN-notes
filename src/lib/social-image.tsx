import { ImageResponse } from "next/og";
import { siteName } from "@/lib/seo";

export const socialImageSize = {
  width: 1200,
  height: 630,
};

type SocialImageOptions = {
  eyebrow: string;
  title: string;
  description: string;
  accentFrom: string;
  accentTo: string;
  tags: string[];
};

export function createSocialImageResponse({
  eyebrow,
  title,
  description,
  accentFrom,
  accentTo,
  tags,
}: SocialImageOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#0f172a",
          color: "#f8fafc",
          padding: "56px",
          position: "relative",
          fontFamily: "sans-serif",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at top left, ${accentFrom}33, transparent 40%), radial-gradient(circle at bottom right, ${accentTo}44, transparent 42%)`,
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              fontSize: 28,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#cbd5e1",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 20,
                height: 20,
                borderRadius: 999,
                background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
              }}
            />
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 18px",
              borderRadius: 999,
              border: "1px solid rgba(148, 163, 184, 0.25)",
              background: "rgba(15, 23, 42, 0.55)",
              fontSize: 24,
              color: "#e2e8f0",
            }}
          >
            {siteName}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, position: "relative" }}>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              lineHeight: 1.08,
              fontWeight: 700,
              maxWidth: "86%",
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: "78%",
              fontSize: 30,
              lineHeight: 1.35,
              color: "#cbd5e1",
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            position: "relative",
          }}
        >
          {tags.map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                padding: "12px 18px",
                borderRadius: 999,
                background: "rgba(15, 23, 42, 0.72)",
                border: "1px solid rgba(148, 163, 184, 0.25)",
                color: "#e2e8f0",
                fontSize: 24,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    socialImageSize,
  );
}
