"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Theme =
  | "dark"
  | "light"
  | "sepia"
  | "amoled"
  | "forest"
  | "rose"
  | "blossom"
  | "ocean"
  | "lavender";

export type TextSize = "sm" | "md" | "lg" | "xl";

type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  textSize: TextSize;
  setTextSize: (s: TextSize) => void;
  isPro: boolean;
  setIsPro: (v: boolean) => void;
  tryUnlockCode: (code: string) => boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ═══════════════════════════════════════════════════════════════
//  HARDCODED UNLOCK CODES
//  Only used via URL parameter: ?unlock=CODE
//  Never shown in the UI.
//  To revoke a leaked code: remove it from this array and redeploy.
// ═══════════════════════════════════════════════════════════════
const VALID_CODES = [
  "TADABBUR-FAMILY-2026",
  "TADABBUR-FRIENDS-2026",
  "TADABBUR-SPECIAL-001",
];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [textSize, setTextSizeState] = useState<TextSize>("md");
  const [isPro, setIsProState] = useState(false);

  // Initial load: check localStorage + URL param
  useEffect(() => {
    const savedTheme = localStorage.getItem("tadabbur-theme") as Theme;
    const savedSize = localStorage.getItem("tadabbur-text-size") as TextSize;
    const savedPro = localStorage.getItem("tadabbur-is-pro") === "true";
    if (savedTheme) setThemeState(savedTheme);
    if (savedSize) setTextSizeState(savedSize);
    setIsProState(savedPro);

    // Check URL for ?unlock=CODE
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const codeFromUrl = params.get("unlock");
      if (codeFromUrl) {
        const cleaned = codeFromUrl.trim().toUpperCase();
        if (VALID_CODES.includes(cleaned)) {
          setIsProState(true);
          localStorage.setItem("tadabbur-is-pro", "true");
          localStorage.setItem("tadabbur-pro-unlocked-by", cleaned);
        }
        // Remove ?unlock= from URL for cleanliness
        const url = new URL(window.location.href);
        url.searchParams.delete("unlock");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("tadabbur-theme", t);
  };

  const setTextSize = (s: TextSize) => {
    setTextSizeState(s);
    localStorage.setItem("tadabbur-text-size", s);
  };

  const setIsPro = (v: boolean) => {
    setIsProState(v);
    localStorage.setItem("tadabbur-is-pro", String(v));
  };

  const tryUnlockCode = (code: string): boolean => {
    const cleaned = code.trim().toUpperCase();
    if (VALID_CODES.includes(cleaned)) {
      setIsPro(true);
      localStorage.setItem("tadabbur-pro-unlocked-by", cleaned);
      return true;
    }
    return false;
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        textSize,
        setTextSize,
        isPro,
        setIsPro,
        tryUnlockCode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}