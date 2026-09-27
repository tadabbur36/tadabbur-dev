"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { shareStyles, shareSizes } from "@/data/share-styles";
import ShareCard from "./ShareCard";

type Props = {
  arabic: string;
  translation: string;
  reference: string;
  onClose: () => void;
};

export default function ShareModal({
  arabic,
  translation,
  reference,
  onClose,
}: Props) {
  const { isPro } = useTheme();
  const [selectedStyle, setSelectedStyle] = useState("minimal");
  const [selectedSize, setSelectedSize] = useState("square");
  const [customWidth, setCustomWidth] = useState("1080");
  const [customHeight, setCustomHeight] = useState("1080");
  const [isGift, setIsGift] = useState(false);
  const [fromName, setFromName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const style = shareStyles.find((s) => s.id === selectedStyle) || shareStyles[0];

  const size =
    selectedSize === "custom"
      ? {
          id: "custom",
          label: "Custom",
          width: parseInt(customWidth) || 1080,
          height: parseInt(customHeight) || 1080,
        }
      : shareSizes.find((s) => s.id === selectedSize) || shareSizes[0];

  // Calculate preview scale so it fits nicely in modal
  const maxPreviewSize = 280;
  const previewScale = Math.min(
    maxPreviewSize / size.width,
    maxPreviewSize / size.height
  );

  const buildImageUrl = () => {
    return `/api/og?arabic=${encodeURIComponent(
      arabic
    )}&translation=${encodeURIComponent(
      translation
    )}&reference=${encodeURIComponent(
      reference
    )}&style=${selectedStyle}&width=${size.width}&height=${
      size.height
    }&watermark=${!isPro}&gift=${isGift}&from=${encodeURIComponent(
      fromName
    )}&message=${encodeURIComponent(message)}`;
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(buildImageUrl());
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tadabbur-${reference.replace(":", "-")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download. Please try again.");
    }
    setLoading(false);
  };

  const handleShare = async () => {
    setLoading(true);
    try {
      const response = await fetch(buildImageUrl());
      const blob = await response.blob();
      const file = new File(
        [blob],
        `tadabbur-${reference.replace(":", "-")}.png`,
        { type: "image/png" }
      );

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Tadabbur",
          text: `${translation} — ${reference}`,
        });
      } else {
        handleDownload();
      }
    } catch (err) {
      handleDownload();
    }
    setLoading(false);
  };

  const availableStyles = shareStyles.filter((s) => !s.pro || isPro);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="rounded-3xl p-6 max-w-md w-full my-8"
        style={{ background: "var(--bg-card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-lg font-medium">Share as image</p>
          <button
            onClick={onClose}
            className="text-sm transition hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            ✕
          </button>
        </div>

        {/* Preview */}
        <div className="mb-6 flex justify-center">
          <div className="overflow-hidden rounded-xl">
            <ShareCard
              arabic={arabic}
              translation={translation}
              reference={reference}
              style={style}
              size={size}
              isGift={isGift}
              fromName={fromName}
              message={message}
              isPro={isPro}
              scale={previewScale}
            />
          </div>
        </div>

        {/* Gift Toggle */}
        <div className="flex items-center justify-between mb-4 p-3 rounded-xl" style={{ background: "var(--bg-card-hover)" }}>
          <span className="text-sm">Send as a gift</span>
          <button
            onClick={() => setIsGift(!isGift)}
            className="text-xs px-3 py-1 rounded-full transition"
            style={{
              background: isGift ? "#d4a574" : "var(--bg-card)",
              color: isGift ? "#0a0e1a" : "var(--text-muted)",
            }}
          >
            {isGift ? "On" : "Off"}
          </button>
        </div>

        {/* Gift fields */}
        {isGift && (
          <div className="space-y-2 mb-4">
            <input
              type="text"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              placeholder="From (name, optional)"
              className="w-full p-3 rounded-xl outline-none text-sm"
              style={{
                background: "var(--bg-card-hover)",
                color: "var(--text-primary)",
                border: "none",
              }}
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a short message (optional)"
              rows={2}
              className="w-full p-3 rounded-xl outline-none text-sm resize-none"
              style={{
                background: "var(--bg-card-hover)",
                color: "var(--text-primary)",
                border: "none",
              }}
            />
          </div>
        )}

        {/* Style Picker */}
        <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
          Style
        </p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {shareStyles.map((s) => {
            const locked = s.pro && !isPro;
            return (
              <button
                key={s.id}
                onClick={() => !locked && setSelectedStyle(s.id)}
                className="p-2 rounded-lg text-xs transition text-center relative"
                style={{
                  background:
                    selectedStyle === s.id
                      ? "var(--accent)"
                      : "var(--bg-card-hover)",
                  color:
                    selectedStyle === s.id
                      ? "var(--accent-text)"
                      : "var(--text-primary)",
                  opacity: locked ? 0.5 : 1,
                }}
              >
                <span className="block">{s.label}</span>
                {locked && (
                  <span className="block text-[10px] mt-0.5 opacity-70">
                    Pro
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Size Picker */}
        <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
          Size
        </p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {shareSizes.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSize(s.id)}
              className="p-2 rounded-lg text-xs transition text-left"
              style={{
                background:
                  selectedSize === s.id
                    ? "var(--accent)"
                    : "var(--bg-card-hover)",
                color:
                  selectedSize === s.id
                    ? "var(--accent-text)"
                    : "var(--text-primary)",
              }}
            >
              <span className="block font-medium">{s.label}</span>
              {s.width > 0 && (
                <span className="block text-[10px] opacity-70">
                  {s.width}×{s.height}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Custom Size */}
        {selectedSize === "custom" && (
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              value={customWidth}
              onChange={(e) => setCustomWidth(e.target.value)}
              placeholder="Width"
              className="flex-1 p-2 rounded-lg outline-none text-xs"
              style={{
                background: "var(--bg-card-hover)",
                color: "var(--text-primary)",
                border: "none",
              }}
            />
            <input
              type="number"
              value={customHeight}
              onChange={(e) => setCustomHeight(e.target.value)}
              placeholder="Height"
              className="flex-1 p-2 rounded-lg outline-none text-xs"
              style={{
                background: "var(--bg-card-hover)",
                color: "var(--text-primary)",
                border: "none",
              }}
            />
          </div>
        )}

        {/* Watermark note for free */}
        {!isPro && (
          <p
            className="text-xs text-center mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            Free versions include a Tadabbur watermark.
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl font-medium transition disabled:opacity-50"
            style={{
              background: "var(--bg-card-hover)",
              color: "var(--text-primary)",
            }}
          >
            {loading ? "..." : "Download"}
          </button>
          <button
            onClick={handleShare}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl font-medium transition disabled:opacity-50"
            style={{
              background: "var(--accent)",
              color: "var(--accent-text)",
            }}
          >
            {loading ? "..." : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
}