"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { getAllQasas } from "@/data";

export default function QasasPage() {
  const { textSize } = useTheme();
  const qasasList = getAllQasas();

  const sizes = {
    sm: { body: "1rem", context: "0.875rem" },
    md: { body: "1.125rem", context: "0.9375rem" },
    lg: { body: "1.25rem", context: "1.0625rem" },
    xl: { body: "1.375rem", context: "1.1875rem" },
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
            Qasas
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: sizes.body }}>
            "We relate to you the best of stories through what We have revealed to you of this Quran." (12:3)
          </p>
        </div>

        <div className="space-y-3">
          {qasasList.map((q) => (
            <Link
              key={q.slug}
              href={`/qasas/${q.slug}`}
              className="group flex items-center justify-between p-6 rounded-3xl transition hover:scale-[1.01]"
              style={{ background: "var(--bg-card)" }}
            >
              <div>
                <span
                  className="font-medium block mb-1"
                  style={{ fontSize: sizes.body }}
                >
                  {q.title}
                </span>
                <span
                  style={{ color: "var(--text-muted)", fontSize: sizes.context }}
                >
                  {q.subtitle} · {q.total_ayahs} verses
                </span>
              </div>
              <span
                className="transition group-hover:translate-x-1"
                style={{ color: "var(--text-muted)" }}
              >
                →
              </span>
            </Link>
          ))}
        </div>

        <p
          className="text-center mt-16"
          style={{ color: "var(--text-muted)", fontSize: sizes.context }}
        >
          More stories coming soon
        </p>
      </div>
    </main>
  );
}