"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { getAllDhikr } from "@/data";

export default function DhikrPage() {
  const { textSize } = useTheme();
  const dhikrList = getAllDhikr();

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
            Dhikr
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: sizes.body }}>
            "Unquestionably, by the remembrance of Allah hearts find peace." (13:28) 
          </p>
        </div>

        <div className="space-y-4">
          {dhikrList.map((d) => (
            <Link
              key={d.slug}
              href={`/dhikr/${d.slug}`}
              className="group block p-8 rounded-3xl transition hover:scale-[1.01]"
              style={{ background: "var(--bg-card)" }}
            >
              <p
                className="arabic text-right mb-4"
                style={{ fontSize: sizes.main, color: "var(--accent)" }}
              >
                {d.phrase_arabic}
              </p>
              <p className="text-xl font-medium mb-1">{d.transliteration}</p>
              <p style={{ color: "var(--text-muted)", fontSize: sizes.context }}>
                {d.meaning_en}
              </p>
            </Link>
          ))}
        </div>

        <p
          className="text-center mt-16"
          style={{ color: "var(--text-muted)", fontSize: sizes.context }}
        >
          More dhikr coming soon
        </p>
      </div>
    </main>
  );
}