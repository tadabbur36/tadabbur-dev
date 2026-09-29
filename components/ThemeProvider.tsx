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
  | "slate"
  | "blush"
  | "sakura"
  | "desert"
  | "ember"
  | "obsidian"
  | "mint"
  | "ocean"
  | "lavender"
  | "gold"
  | "crimson"
  | "cobalt"
  | "coral";

export type TextSize = "sm" | "md" | "lg" | "xl";

type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  textSize: TextSize;
  setTextSize: (s: TextSize) => void;
  isPro: boolean;
  setIsPro: (v: boolean) => void;
  tryUnlockCode: (code: string) => boolean;
  checkLicenseKey: () => Promise<boolean>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const VALID_CODES = [
  "TADABBUR-FAMILY-2026",
  "TADABBUR-FRIENDS-2026",
  "TADABBBUR-SPECIAL-001",
];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [textSize, setTextSizeState] = useState<TextSize>("md");
  const [isPro, setIsProState] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("tadabbur-theme") as Theme;
    const savedSize = localStorage.getItem("tadabbur-text-size") as TextSize;
    const savedPro = localStorage.getItem("tadabbur-is-pro") === "true";
    const savedKey = localStorage.getItem("tadabbur-license-key");

    if (savedTheme) setThemeState(savedTheme);
    if (savedSize) setTextSizeState(savedSize);
    if (savedPro || savedKey) setIsProState(true);

    if (savedKey) {
      checkLicenseKey();
    }

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

  const checkLicenseKey = async (): Promise<boolean> => {
    const savedKey = localStorage.getItem("tadabbur-license-key");
    if (!savedKey) return false;

    try {
      const res = await fetch("/api/lemonsqueezy/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: savedKey }),
      });
      const data = await res.json();
      if (data.valid) {
        setIsProState(true);
        return true;
      } else {
        localStorage.removeItem("tadabbur-license-key");
        localStorage.removeItem("tadabbur-is-pro");
        setIsProState(false);
        return false;
      }
    } catch {
      return false;
    }
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
        checkLicenseKey,
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