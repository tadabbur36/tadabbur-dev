"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

export default function DisclaimerPage() {
  const { textSize } = useTheme();

  const sizes = {
    sm: { body: "1rem", context: "0.875rem", heading: "2rem" },
    md: { body: "1.125rem", context: "0.9375rem", heading: "2.5rem" },
    lg: { body: "1.25rem", context: "1.0625rem", heading: "2.75rem" },
    xl: { body: "1.375rem", context: "1.1875rem", heading: "3rem" },
  }[textSize];

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <Link
          href="/"
          className="text-sm hover:opacity-80 transition inline-block mb-12"
          style={{ color: "var(--text-muted)" }}
        >
          ← Back
        </Link>

        <h1
          className="font-bold tracking-tight mb-10"
          style={{ fontSize: sizes.heading }}
        >
          Disclaimer
        </h1>

        <div className="space-y-6">
          <p
            className="leading-relaxed"
            style={{ color: "var(--text-secondary)", fontSize: sizes.body }}
          >
            The contextual notes in this app are provided only to help you
            understand the background of a verse. They are not tafsir, and
            they are not presented as interpretation or personal opinion.
          </p>

          <p
            className="leading-relaxed"
            style={{ color: "var(--text-secondary)", fontSize: sizes.body }}
          >
            The Quran itself remains the source. This app is only a means of
            making it easier to read, explore, and reflect on its verses.
            Allah says:
          </p>

          <div
            className="rounded-2xl p-5 text-center"
            style={{ background: "var(--bg-card)" }}
          >
            <p
              className="arabic mb-3"
              style={{ fontSize: sizes.heading, color: "var(--accent)" }}
            >
              وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ
            </p>
            <p
              className="leading-relaxed mb-2"
              style={{ color: "var(--text-secondary)", fontSize: sizes.body }}
            >
              "And We have certainly made the Quran easy for remembrance, so
              is there any who will remember?"
            </p>
            <p
              style={{ color: "var(--text-muted)", fontSize: sizes.context }}
            >
              Al-Qamar 54:17
            </p>
          </div>

          <p
            className="leading-relaxed"
            style={{ color: "var(--text-secondary)", fontSize: sizes.body }}
          >
            Guidance ultimately comes from Allah.
          </p>

          <div
            className="pt-6 mt-6"
            style={{ borderTop: "1px solid var(--bg-border)" }}
          >
            <p
              className="leading-relaxed"
              style={{ color: "var(--text-secondary)", fontSize: sizes.body }}
            >
              Every contextual note has been carefully reviewed, but human
              error is always possible. If you find an error, please report it
              with supporting evidence so it can be reviewed. Reports without
              supporting evidence will not be considered. Confirmed errors
              will be corrected in a future update.
            </p>
          </div>

          <div
            className="rounded-2xl p-5 mt-6"
            style={{ background: "var(--bg-card)" }}
          >
            <p
              className="mb-2"
              style={{ color: "var(--text-muted)", fontSize: sizes.context }}
            >
              For evidence-based corrections, please contact us at:
            </p>
            <p
              style={{ color: "var(--accent)", fontSize: sizes.body }}
            >
              tadabbur.to@gmail.com
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}