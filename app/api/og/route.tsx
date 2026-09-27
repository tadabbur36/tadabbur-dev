import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const arabic = searchParams.get("arabic") || "";
    const translation = searchParams.get("translation") || "";
    const reference = searchParams.get("reference") || "";
    const styleId = searchParams.get("style") || "minimal";
    const width = parseInt(searchParams.get("width") || "1080");
    const height = parseInt(searchParams.get("height") || "1080");
    const watermark = searchParams.get("watermark") !== "false";
    const isGift = searchParams.get("gift") === "true";
    const fromName = searchParams.get("from") || "";
    const message = searchParams.get("message") || "";

    const styleMap: Record<
      string,
      {
        bg: string;
        arabicColor: string;
        translationColor: string;
        refColor: string;
        border?: string;
      }
    > = {
      minimal: {
        bg: "#0a0e1a",
        arabicColor: "#d4a574",
        translationColor: "#eef2ff",
        refColor: "#6a7290",
      },
      solid: {
        bg: "#22d3ee",
        arabicColor: "#0a0e1a",
        translationColor: "#0a0e1a",
        refColor: "#0a0e1a",
      },
      rounded: {
        bg: "#f4ecd8",
        arabicColor: "#3d2f1a",
        translationColor: "#5a4630",
        refColor: "#8a7050",
        border: "2px solid #d4c5a0",
      },
      midnight: {
        bg: "#0a0e1a",
        arabicColor: "#22d3ee",
        translationColor: "#eef2ff",
        refColor: "#6a7290",
      },
      rose: {
        bg: "#1a0f14",
        arabicColor: "#fb7185",
        translationColor: "#fef2f2",
        refColor: "#8a6878",
      },
      forest: {
        bg: "#0a1410",
        arabicColor: "#34d399",
        translationColor: "#ecfdf5",
        refColor: "#6a8a78",
      },
      blossom: {
        bg: "#1a1418",
        arabicColor: "#e8a5b8",
        translationColor: "#faf5f8",
        refColor: "#8a7280",
      },
      ocean: {
        bg: "#0a1220",
        arabicColor: "#60a5fa",
        translationColor: "#eff6ff",
        refColor: "#6a80a0",
      },
      lavender: {
        bg: "#14101f",
        arabicColor: "#c4b5fd",
        translationColor: "#f5f3ff",
        refColor: "#8078a0",
      },
      gold: {
        bg: "#0a0e1a",
        arabicColor: "#f5e6d3",
        translationColor: "#d4a574",
        refColor: "#8a7050",
        border: "2px solid #d4a574",
      },
    };

    const style = styleMap[styleId] || styleMap.minimal;

    const baseSize = Math.min(width, height);
    const arabicSize = Math.round(baseSize * 0.075);
    const translationSize = Math.round(baseSize * 0.028);
    const refSize = Math.round(baseSize * 0.022);
    const watermarkSize = Math.round(baseSize * 0.02);
    const fromSize = Math.round(baseSize * 0.022);
    const messageSize = Math.round(baseSize * 0.02);
    const padding = Math.round(baseSize * 0.08);

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
            background: style.bg,
            border: style.border || "none",
            padding,
            position: "relative",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {isGift && (
            <div
              style={{
                position: "absolute",
                top: Math.round(baseSize * 0.03),
                left: Math.round(baseSize * 0.03),
                right: Math.round(baseSize * 0.03),
                bottom: Math.round(baseSize * 0.03),
                border: `${Math.max(1, Math.round(baseSize * 0.002))}px solid #d4a574`,
                borderRadius: Math.round(baseSize * 0.02),
                display: "flex",
              }}
            />
          )}

          <div
            style={{
              fontSize: arabicSize,
              color: style.arabicColor,
              textAlign: "center",
              lineHeight: 1.6,
              marginBottom: Math.round(baseSize * 0.06),
              fontWeight: 400,
              display: "flex",
            }}
          >
            {arabic}
          </div>

          <div
            style={{
              fontSize: translationSize,
              color: style.translationColor,
              textAlign: "center",
              lineHeight: 1.5,
              maxWidth: "85%",
              marginBottom: Math.round(baseSize * 0.05),
              display: "flex",
            }}
          >
            {translation}
          </div>

          <div
            style={{
              fontSize: refSize,
              color: style.refColor,
              textAlign: "center",
              fontWeight: 500,
              display: "flex",
            }}
          >
            {reference}
          </div>

          {isGift && (fromName || message) && (
            <div
              style={{
                marginTop: Math.round(baseSize * 0.05),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: "85%",
              }}
            >
              <div
                style={{
                  width: Math.round(baseSize * 0.15),
                  height: 1,
                  background: "#d4a574",
                  marginBottom: Math.round(baseSize * 0.03),
                  display: "flex",
                }}
              />
              {fromName && (
                <div
                  style={{
                    fontSize: fromSize,
                    color: "#d4a574",
                    fontWeight: 500,
                    marginBottom: message ? Math.round(baseSize * 0.02) : 0,
                    display: "flex",
                  }}
                >
                  From {fromName}
                </div>
              )}
              {message && (
                <div
                  style={{
                    fontSize: messageSize,
                    color: "#d4a574",
                    opacity: 0.85,
                    fontStyle: "italic",
                    textAlign: "center",
                    lineHeight: 1.4,
                    display: "flex",
                  }}
                >
                  {message}
                </div>
              )}
            </div>
          )}

          {watermark && (
            <div
              style={{
                position: "absolute",
                bottom: Math.round(baseSize * 0.04),
                right: Math.round(baseSize * 0.04),
                fontSize: watermarkSize,
                color: style.refColor,
                opacity: 0.6,
                fontWeight: 500,
                display: "flex",
              }}
            >
              Tadabbur
            </div>
          )}
        </div>
      ),
      {
        width,
        height,
      }
    );
  } catch (error) {
    return new Response("Failed to generate image", { status: 500 });
  }
}