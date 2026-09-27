"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { getAllQuestions } from "@/data";

export default function QuestionsPage() {
  const { textSize } = useTheme();
  const questionsList = getAllQuestions();

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
            Questions
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: sizes.body }}>
            Real questions. Quranic answers.
          </p>
        </div>

        <div className="space-y-3">
          {questionsList.map((q) => (
            <Link
              key={q.slug}
              href={`/questions/${q.slug}`}
              className="group flex items-start justify-between p-6 rounded-3xl transition hover:scale-[1.01]"
              style={{ background: "var(--bg-card)" }}
            >
              <div className="flex-1 pr-4">
                <span
                  className="font-medium block mb-2 leading-snug"
                  style={{ fontSize: sizes.body }}
                >
                  {q.question}
                </span>
                <span
                  className="block leading-relaxed"
                  style={{ color: "var(--text-secondary)", fontSize: sizes.context }}
                >
                  {q.short_answer}
                </span>
              </div>
              <span
                className="transition group-hover:translate-x-1 flex-shrink-0"
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
          More questions coming soon
        </p>
      </div>
    </main>
  );
}