"use client";

import { ShareStyle, ShareSize } from "@/data/share-styles";

type Props = {
  arabic: string;
  translation: string;
  reference: string;
  style: ShareStyle;
  size: ShareSize;
  isGift: boolean;
  fromName: string;
  message: string;
  isPro: boolean;
  scale?: number;
};

export default function ShareCard({
  arabic,
  translation,
  reference,
  style,
  size,
  isGift,
  fromName,
  message,
  isPro,
  scale = 1,
}: Props) {
  const baseSize = Math.min(size.width, size.height);
  const arabicSize = Math.round(baseSize * 0.075 * scale);
  const translationSize = Math.round(baseSize * 0.028 * scale);
  const refSize = Math.round(baseSize * 0.022 * scale);
  const watermarkSize = Math.round(baseSize * 0.02 * scale);
  const fromSize = Math.round(baseSize * 0.022 * scale);
  const messageSize = Math.round(baseSize * 0.02 * scale);

  const padding = Math.round(baseSize * 0.08 * scale);

  return (
    <div
      style={{
        width: size.width * scale,
        height: size.height * scale,
        background: style.bg,
        border: style.border || "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding,
        position: "relative",
        fontFamily: "system-ui, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Gift border */}
      {isGift && (
        <div
          style={{
            position: "absolute",
            inset: Math.round(baseSize * 0.03 * scale),
            border: `${Math.max(1, Math.round(baseSize * 0.002 * scale))}px solid #d4a574`,
            borderRadius: Math.round(baseSize * 0.02 * scale),
            pointerEvents: "none",
          }}
        />
      )}

      {/* Arabic */}
      <div
        className="arabic"
        style={{
          fontSize: arabicSize,
          color: style.arabicColor,
          textAlign: "center",
          lineHeight: 1.6,
          marginBottom: Math.round(baseSize * 0.06 * scale),
          fontWeight: 400,
          direction: "rtl",
        }}
      >
        {arabic}
      </div>

      {/* Translation */}
      <div
        style={{
          fontSize: translationSize,
          color: style.translationColor,
          textAlign: "center",
          lineHeight: 1.5,
          maxWidth: "85%",
          marginBottom: Math.round(baseSize * 0.05 * scale),
        }}
      >
        {translation}
      </div>

      {/* Reference */}
      <div
        style={{
          fontSize: refSize,
          color: style.refColor,
          textAlign: "center",
          fontWeight: 500,
        }}
      >
        {reference}
      </div>

      {/* Gift mode: from + message */}
      {isGift && (fromName || message) && (
        <div
          style={{
            marginTop: Math.round(baseSize * 0.05 * scale),
            textAlign: "center",
            maxWidth: "85%",
          }}
        >
          <div
            style={{
              width: Math.round(baseSize * 0.15 * scale),
              height: 1,
              background: "#d4a574",
              margin: "0 auto",
              marginBottom: Math.round(baseSize * 0.03 * scale),
            }}
          />
          {fromName && (
            <div
              style={{
                fontSize: fromSize,
                color: "#d4a574",
                fontWeight: 500,
                marginBottom: message ? Math.round(baseSize * 0.02 * scale) : 0,
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
                lineHeight: 1.4,
              }}
            >
              {message}
            </div>
          )}
        </div>
      )}

      {/* Watermark — free only */}
      {!isPro && (
        <div
          style={{
            position: "absolute",
            bottom: Math.round(baseSize * 0.04 * scale),
            right: Math.round(baseSize * 0.04 * scale),
            fontSize: watermarkSize,
            color: style.refColor,
            opacity: 0.6,
            fontWeight: 500,
          }}
        >
          Tadabbur
        </div>
      )}
    </div>
  );
}