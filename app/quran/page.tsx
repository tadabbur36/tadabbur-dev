"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { getAllSurahs } from "@/data";

export default function QuranPage() {
  const { textSize } = useTheme();
  const surahs = getAllSurahs();

  const sizes = {
    sm: { main: "1.75rem", body: "1rem", context: "0.875rem" },
    md: { main: "2.25rem", body: "1.125rem", context: "0.9375rem" },
    lg: { main: "2.75rem", body: "1.25rem", context: "1.0625rem" },
    xl: { main: "3.5rem", body: "1.375rem", context: "1.1875rem" },
  }[textSize];

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <Link
          href="/"
          className="text-sm hover:opacity-80 transition inline-block mb-12"
          style={{ color: "var(--text-muted)" }}
        >
          ← Back
        </Link>

        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            Quran
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: sizes.body }}>
            "And We have sent down to you the Book as clarification for all things." (16.89)
          </p>
        </div>

        <div className="space-y-3">
          {surahs.map((s) => (
            <Link
              key={s.surah}
              href={`/quran/${s.surah}`}
              className="group flex items-center justify-between p-6 rounded-3xl transition hover:scale-[1.01]"
              style={{ background: "var(--bg-card)" }}
            >
              <div className="flex items-center gap-5">
                <span
                  className="text-sm font-medium w-10 text-center"
                  style={{ color: "var(--accent)", fontSize: sizes.context }}
                >
                  {s.surah}
                </span>
                <div>
                  <p
                    className="font-medium mb-1"
                    style={{ fontSize: sizes.body }}
                  >
                    {s.name_transliteration}
                  </p>
                  <p
                    style={{ color: "var(--text-muted)", fontSize: sizes.context }}
                  >
                    {s.meaning_en} · {s.total_ayahs} ayahs · {s.revelation_type}
                  </p>
                </div>
              </div>
              <p
                className="arabic"
                style={{ fontSize: sizes.main, color: "var(--accent)" }}
              >
                {s.name_ar}
              </p>
            </Link>
          ))}
        </div>

        <p
          className="text-center mt-16"
          style={{ color: "var(--text-muted)", fontSize: sizes.context }}
        >
          More surahs coming soon
        </p>
      </div>
    </main>
  );
}