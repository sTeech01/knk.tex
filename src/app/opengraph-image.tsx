import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { homeCopy } from "@/data/copy";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const iconPath = join(process.cwd(), "public/images/logo-icon.png");
  const iconBase64 = readFileSync(iconPath).toString("base64");
  const iconSrc = `data:image/png;base64,${iconBase64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1c1d20",
          padding: 80,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSrc} width={140} height={118} alt="" />
        <div
          style={{
            marginTop: 32,
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: -1,
            color: "#ffffff",
          }}
        >
          KNK TEX
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 30,
            color: "#ab8a45",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          {homeCopy.heroEyebrow}
        </div>
      </div>
    ),
    { ...size }
  );
}
