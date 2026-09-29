"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";

type Props = {
  onClose: () => void;
  onActivated: () => void;
};

export default function ProActivateModal({ onClose, onActivated }: Props) {
  const { setIsPro } = useTheme();
  const [licenseKey, setLicenseKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleActivate = async () => {
    setError("");
    if (!licenseKey.trim()) {
      setError("Please enter your license key.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/lemonsqueezy/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: licenseKey.trim() }),
      });

      const data = await res.json();

      if (data.activated) {
        localStorage.setItem("tadabbur-license-key", licenseKey.trim());
        localStorage.setItem("tadabbur-is-pro", "true");
        setIsPro(true);
        onActivated();
        onClose();
      } else {
        setError(data.error || "Invalid license key. Please check and try again.");
      }
    } catch (err) {
      console.error("Activation error:", err);
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const checkoutUrl = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL || "";

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="rounded-3xl p-6 max-w-md w-full my-8"
        style={{ background: "var(--bg-card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-lg font-medium">Activate Pro</p>
          <button
            onClick={onClose}
            className="text-sm transition hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            ✕
          </button>
        </div>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          Pro unlocks unlimited bookmarks, journal, folders, more themes,
          and removes the Tadabbur watermark from shared images.
        </p>

        {/* License key input */}
        <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
          Already have a license key?
        </p>
        <input
          type="text"
          value={licenseKey}
          onChange={(e) => setLicenseKey(e.target.value)}
          placeholder="Enter your license key"
          className="w-full p-3 rounded-xl outline-none text-sm mb-3"
          style={{
            background: "var(--bg-card-hover)",
            color: "var(--text-primary)",
            border: "none",
          }}
        />

        {error && (
          <p className="text-xs mb-3" style={{ color: "#fb7185" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleActivate}
          disabled={loading}
          className="w-full py-3 rounded-2xl font-medium transition disabled:opacity-50 mb-6"
          style={{
            background: "var(--accent)",
            color: "var(--accent-text)",
          }}
        >
          {loading ? "Activating..." : "Activate"}
        </button>

        {/* Divider */}
        <div
          className="flex items-center gap-3 mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          <div
            className="flex-1"
            style={{ height: 1, background: "var(--bg-border)" }}
          />
          <span className="text-xs">OR</span>
          <div
            className="flex-1"
            style={{ height: 1, background: "var(--bg-border)" }}
          />
        </div>

        {/* Checkout button */}
        {checkoutUrl && !checkoutUrl.startsWith("placeholder") ? (
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 rounded-2xl font-medium text-center transition"
            style={{
              background: "var(--bg-card-hover)",
              color: "var(--text-primary)",
            }}
          >
            Get a license key
          </a>
        ) : (
          <p
            className="text-xs text-center"
            style={{ color: "var(--text-muted)" }}
          >
            Checkout will be available soon.
          </p>
        )}
      </div>
    </div>
  );
}