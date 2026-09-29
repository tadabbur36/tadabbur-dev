"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import ProActivateModal from "./ProActivateModal";

const themeList: Array<{
  id: any;
  label: string;
  preview: string;
  pro?: boolean;
}> = [
  // Free themes (9)
  { id: "dark", label: "Midnight", preview: "#22d3ee" },
  { id: "light", label: "Paper", preview: "#b45309" },
  { id: "sepia", label: "Manuscript", preview: "#92400e" },
  { id: "amoled", label: "OLED", preview: "#10b981" },
  { id: "rose", label: "Rose", preview: "#fb7185" },
  { id: "forest", label: "Forest", preview: "#34d399" },
  { id: "slate", label: "Slate", preview: "#94a3b8" },
  { id: "blush", label: "Blush", preview: "#db6a8a" },
  { id: "sakura", label: "Sakura", preview: "#fbb6ce" },
  // Pro themes (10)
  { id: "desert", label: "Desert", preview: "#e8a05c", pro: true },
  { id: "ember", label: "Ember", preview: "#f97316", pro: true },
  { id: "obsidian", label: "Obsidian", preview: "#a78bfa", pro: true },
  { id: "mint", label: "Mint", preview: "#5eead4", pro: true },
  { id: "ocean", label: "Ocean", preview: "#60a5fa", pro: true },
  { id: "lavender", label: "Lavender", preview: "#c4b5fd", pro: true },
  { id: "gold", label: "Gold", preview: "#d4a574", pro: true },
  { id: "crimson", label: "Crimson", preview: "#f43f5e", pro: true },
  { id: "cobalt", label: "Cobalt", preview: "#3b82f6", pro: true },
  { id: "coral", label: "Coral", preview: "#fb923c", pro: true },
];

export default function ThemePicker() {
  const { theme, setTheme, isPro } = useTheme();
  const [showProModal, setShowProModal] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {themeList.map((t) => {
          const locked = t.pro && !isPro;
          return (
            <button
              key={t.id}
              onClick={() => {
                if (locked) {
                  setShowProModal(true);
                } else {
                  setTheme(t.id);
                }
              }}
              className="flex items-center gap-3 p-3 rounded-xl text-xs transition text-left relative"
              style={{
                background:
                  theme === t.id ? "var(--accent)" : "var(--bg-card-hover)",
                color:
                  theme === t.id ? "var(--accent-text)" : "var(--text-primary)",
                opacity: locked ? 0.6 : 1,
              }}
            >
              <span
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{
                  background: t.preview,
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              />
              <span className="truncate">{t.label}</span>
              {locked && (
                <span
                  className="absolute top-1 right-1 text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{
                    background: "var(--accent)",
                    color: "var(--accent-text)",
                  }}
                >
                  PRO
                </span>
              )}
            </button>
          );
        })}
      </div>

      {showProModal && (
        <ProActivateModal
          onClose={() => setShowProModal(false)}
          onActivated={() => {
            console.log("Pro activated");
          }}
        />
      )}
    </>
  );
}