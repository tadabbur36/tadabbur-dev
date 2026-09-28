"use client";

import { getDhikr } from "@/data";
import Link from "next/link";
import { use, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import ShareModal from "@/components/ShareModal";

export default function DhikrDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const dhikr = getDhikr(slug);
  const { textSize } = useTheme();

  const [shareData, setShareData] = useState<{
    arabic: string;
    translation: string;
    reference: string;
  } | null>(null);

  const sizes = {
    sm: { main: "1.75rem", body: "1rem", context: "0.875rem" },
    md: { main: "2.25rem", body: "1.125rem", context: "0.9375rem" },
    lg: { main: "2.75rem", body: "1.25rem", context: "1.0625rem" },
    xl: { main: "3.5rem", body: "1.375rem", context: "1.1875rem" },
  }[textSize];

  if (!dhikr) return null;

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <Link
          href="/dhikr"
          className="text-sm hover:opacity-80 transition inline-block mb-12"
          style={{ color: "var(--text-muted)" }}
        >
          ← All dhikr
        </Link>

        {/* Phrase */}
        <div className="text-center mb-16">
          <p
            className="arabic mb-4"
            style={{ fontSize: sizes.main, color: "var(--accent)" }}
          >
            {dhikr.phrase_arabic}
          </p>
          <p className="text-2xl font-bold mb-2">{dhikr.transliteration}</p>
          <p style={{ color: "var(--text-muted)", fontSize: sizes.body }}>
            {dhikr.meaning_en}
          </p>

          {/* Share button */}
          <div className="mt-6">
            <button
              onClick={() =>
                setShareData({
                  arabic: dhikr.phrase_arabic,
                  translation: dhikr.meaning_en,
                  reference: dhikr.transliteration,
                })
              }
              className="text-xs px-4 py-2 rounded-full transition"
              style={{
                background: "var(--bg-card)",
                color: "var(--text-muted)",
              }}
            >
              Share
            </button>
          </div>
        </div>

        {/* Deep Meaning */}
        <div
          className="rounded-3xl p-8 mb-8"
          style={{ background: "var(--bg-card)" }}
        >
          <p
            className="mb-4 uppercase tracking-wider"
            style={{ color: "var(--accent)", fontSize: sizes.context }}
          >
            What it actually means
          </p>
          <p
            className="leading-relaxed mb-6"
            style={{ color: "var(--text-secondary)", fontSize: sizes.body }}
          >
            {dhikr.deep_meaning}
          </p>
          <div
            className="pt-4"
            style={{ borderTop: "1px solid var(--bg-border)" }}
          >
            <p
              className="mb-2"
              style={{ color: "var(--text-muted)", fontSize: sizes.context }}
            >
              Root letters
            </p>
            <p className="arabic text-2xl" style={{ color: "var(--accent)" }}>
              {dhikr.root_letters}
            </p>
          </div>
        </div>

        {/* Why This Phrase */}
        <div
          className="rounded-3xl p-8 mb-16"
          style={{ background: "var(--bg-card)" }}
        >
          <p
            className="mb-4 uppercase tracking-wider"
            style={{ color: "var(--accent)", fontSize: sizes.context }}
          >
            Why this phrase
          </p>
          <p
            className="leading-relaxed"
            style={{ color: "var(--text-secondary)", fontSize: sizes.body }}
          >
            {dhikr.why_this_phrase}
          </p>
        </div>

        {/* Verses */}
        <div className="mb-16">
          <p
            className="mb-8 uppercase tracking-wider"
            style={{ color: "var(--text-muted)", fontSize: sizes.context }}
          >
            In the Quran
          </p>
          <div className="space-y-14">
            {dhikr.verses.map((verse, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-4">
                  <p style={{ color: "var(--accent)", fontSize: sizes.context }}>
                    {verse.verse_ref}
                  </p>
                  <button
                    onClick={() =>
                      setShareData({
                        arabic: verse.arabic,
                        translation: verse.translation_en,
                        reference: verse.verse_ref,
                      })
                    }
                    className="text-xs px-3 py-1.5 rounded-full transition"
                    style={{
                      background: "var(--bg-card)",
                      color: "var(--text-muted)",
                    }}
                  >
                    Share
                  </button>
                </div>
                <p
                  className="arabic text-right mb-5"
                  style={{ fontSize: sizes.main }}
                >
                  {verse.arabic}
                </p>
                <p
                  className="leading-relaxed mb-3"
                  style={{ color: "var(--text-secondary)", fontSize: sizes.body }}
                >
                  {verse.translation_en}
                </p>
                <p
                  className="leading-relaxed"
                  style={{ color: "var(--text-muted)", fontSize: sizes.context }}
                >
                  {verse.context}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* When to Say */}
        <div>
          <p
            className="mb-8 uppercase tracking-wider"
            style={{ color: "var(--text-muted)", fontSize: sizes.context }}
          >
            When to say it
          </p>
          <div className="space-y-6">
            {dhikr.when_to_say.map((w, i) => (
              <div
                key={i}
                className="rounded-3xl p-8"
                style={{ background: "var(--bg-card)" }}
              >
                <p
                  className="mb-5"
                  style={{ color: "var(--text-primary)", fontSize: sizes.body }}
                >
                  {w.moment}
                </p>
                <p
                  className="arabic text-right mb-4"
                  style={{ fontSize: sizes.main, color: "var(--accent)" }}
                >
                  {w.arabic}
                </p>
                <p
                  className="leading-relaxed mb-2"
                  style={{ color: "var(--text-secondary)", fontSize: sizes.body }}
                >
                  {w.translation_en}
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: sizes.context }}>
                  {w.verse_ref}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {shareData && (
        <ShareModal
          arabic={shareData.arabic}
          translation={shareData.translation}
          reference={shareData.reference}
          onClose={() => setShareData(null)}
        />
      )}
    </main>
  );
}