export type ShareStyle = {
  id: string;
  label: string;
  pro: boolean;
  bg: string;
  arabicColor: string;
  translationColor: string;
  refColor: string;
  border?: string;
  isGradient?: boolean;
  isPattern?: boolean;
};

export const shareStyles: ShareStyle[] = [
  {
    id: "minimal",
    label: "Minimal",
    pro: false,
    bg: "#0a0e1a",
    arabicColor: "#d4a574",
    translationColor: "#eef2ff",
    refColor: "#6a7290",
  },
  {
    id: "solid",
    label: "Solid",
    pro: false,
    bg: "#22d3ee",
    arabicColor: "#0a0e1a",
    translationColor: "#0a0e1a",
    refColor: "#0a0e1a",
  },
  {
    id: "rounded",
    label: "Rounded",
    pro: false,
    bg: "#f4ecd8",
    arabicColor: "#3d2f1a",
    translationColor: "#5a4630",
    refColor: "#8a7050",
    border: "2px solid #d4c5a0",
  },
  {
    id: "midnight",
    label: "Midnight",
    pro: true,
    bg: "#0a0e1a",
    arabicColor: "#22d3ee",
    translationColor: "#eef2ff",
    refColor: "#6a7290",
  },
  {
    id: "rose",
    label: "Rose",
    pro: true,
    bg: "#1a0f14",
    arabicColor: "#fb7185",
    translationColor: "#fef2f2",
    refColor: "#8a6878",
  },
  {
    id: "forest",
    label: "Forest",
    pro: true,
    bg: "#0a1410",
    arabicColor: "#34d399",
    translationColor: "#ecfdf5",
    refColor: "#6a8a78",
  },
  {
    id: "blossom",
    label: "Blossom",
    pro: true,
    bg: "#1a1418",
    arabicColor: "#e8a5b8",
    translationColor: "#faf5f8",
    refColor: "#8a7280",
  },
  {
    id: "ocean",
    label: "Ocean",
    pro: true,
    bg: "#0a1220",
    arabicColor: "#60a5fa",
    translationColor: "#eff6ff",
    refColor: "#6a80a0",
  },
  {
    id: "lavender",
    label: "Lavender",
    pro: true,
    bg: "#14101f",
    arabicColor: "#c4b5fd",
    translationColor: "#f5f3ff",
    refColor: "#8078a0",
  },
  {
    id: "gold",
    label: "Gold",
    pro: true,
    bg: "#0a0e1a",
    arabicColor: "#f5e6d3",
    translationColor: "#d4a574",
    refColor: "#8a7050",
    border: "2px solid #d4a574",
  },
];

export type ShareSize = {
  id: string;
  label: string;
  width: number;
  height: number;
};

export const shareSizes: ShareSize[] = [
  { id: "square", label: "Instagram Square", width: 1080, height: 1080 },
  { id: "portrait", label: "Instagram Post", width: 1080, height: 1350 },
  { id: "story", label: "Instagram Story", width: 1080, height: 1920 },
  { id: "whatsapp", label: "WhatsApp Status", width: 1080, height: 1920 },
  { id: "twitter", label: "Twitter / X", width: 1200, height: 675 },
  { id: "facebook", label: "Facebook Post", width: 1200, height: 630 },
  { id: "pinterest", label: "Pinterest", width: 1000, height: 1500 },
  { id: "custom", label: "Custom Size", width: 0, height: 0 },
];