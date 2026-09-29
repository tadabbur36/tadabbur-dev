"use client";

import { getQuestion } from "@/data";
import Link from "next/link";
import { use, useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import ThemePicker from "@/components/ThemePicker";
import ProActivateModal from "@/components/ProActivateModal";

const sizeMap = {
  sm: { main: "1.75rem", body: "0.875rem", context: "0.8125rem", reference: "0.8125rem" },
  md: { main: "2.25rem", body: "1rem", context: "0.9375rem", reference: "0.9375rem" },
  lg: { main: "2.75rem", body: "1.125rem", context: "1.0625rem", reference: "1.0625rem" },
  xl: { main: "3.5rem", body: "1.25rem", context: "1.1875rem", reference: "1.1875rem" },
};

export default function QuestionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const question = getQuestion(slug);
  const { textSize, setTextSize, isPro } = useTheme();

  const [showSettings, setShowSettings] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [journal, setJournal] = useState<Record<string, string>>({});
  const [activeJournal, setActiveJournal] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const savedJournal = JSON.parse(localStorage.getItem("tadabbur-journal") || "{}");
    setJournal(savedJournal);

    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem("tadabbur-last-visit");
    const savedStreak = parseInt(localStorage.getItem("tadabbur-streak") || "0");

    if (lastVisit === today) {
      setStreak(savedStreak);
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newStreak = lastVisit === yesterday ? savedStreak + 1 : 1;
      localStorage.setItem("tadabbur-streak", String(newStreak));
      localStorage.setItem("tadabbur-last-visit", today);
      setStreak(newStreak);
    }
  }, []);

  if (!question) return null;

  const sizes = sizeMap[textSize];

  const saveJournal = (ref: string, text: string) => {
    const updated = { ...journal, [ref]: text };
    setJournal(updated);
    localStorage.setItem("tadabbur-journal", JSON.stringify(updated));
  };

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <div className="flex items-center justify-between mb-12 flex-wrap gap-3">
          <Link
            href="/"
            className="text-sm hover:opacity-80 transition"
            style={{ color: "var(--text-muted)" }}
          >
            ← Back
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            {isPro && streak > 0 && (
              <>
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: "var(--accent)", color: "var(--accent-text)" }}
                >
                  {streak} day streak
                </span>
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: "var(--accent)", color: "var(--accent-text)" }}
                >
                  PRO
                </span>
              </>
            )}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-sm px-3 py-1.5 rounded-full transition hover:opacity-80"
              style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
            >
              Settings
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="rounded-2xl p-6 mb-12" style={{ background: "var(--bg-card)" }}>
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Theme</p>
            <div className="mb-6">
              <ThemePicker />
            </div>

            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Text Size</p>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {(["sm", "md", "lg", "xl"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setTextSize(s)}
                  className="p-3 rounded-xl text-xs uppercase transition"
                  style={{
                    background: textSize === s ? "var(--accent)" : "var(--bg-card-hover)",
                    color: textSize === s ? "var(--accent-text)" : "var(--text-primary)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="pt-4 mt-4" style={{ borderTop: "1px solid var(--bg-border)" }}>
              <button
                onClick={() => setShowProModal(true)}
                className="w-full py-3 rounded-xl font-medium transition text-sm"
                style={{
                  background: isPro ? "var(--bg-card-hover)" : "var(--accent)",
                  color: isPro ? "var(--text-primary)" : "var(--accent-text)",
                }}
              >
                {isPro ? "Pro Active ✓" : "Activate Pro"}
              </button>
            </div>
          </div>
        )}

        <div className="mb-16">
          <p className="mb-4 uppercase tracking-wider" style={{ color: "var(--accent)", fontSize: sizes.context }}>
            Question
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-6">
            {question.question}
          </h1>
          <p className="leading-relaxed" style={{ color: "var(--text-secondary)", fontSize: sizes.body }}>
            {question.short_answer}
          </p>
        </div>

        <div className="space-y-16">
          {question.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl md:text-2xl font-bold mb-4 leading-tight">{section.heading}</h2>
              <p className="leading-relaxed mb-6" style={{ color: "var(--text-secondary)", fontSize: sizes.body }}>
                {section.body}
              </p>

              <div className="space-y-3 mb-8">
                {section.evidence.map((ev, j) => (
                  <div
                    key={j}
                    className="rounded-2xl p-5"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--bg-border)" }}
                  >
                    <div className="font-medium mb-4" style={{ color: "var(--accent)", fontSize: sizes.reference }}>
                      {ev.verse_ref}
                    </div>
                    <p className="arabic text-right mb-4" style={{ fontSize: sizes.main }}>
                      {ev.arabic}
                    </p>
                    <p className="mb-3 leading-relaxed" style={{ color: "var(--text-primary)", fontSize: sizes.body }}>
                      {ev.translation_en}
                    </p>
                    <p className="italic leading-relaxed" style={{ color: "var(--text-muted)", fontSize: sizes.context }}>
                      {ev.why_cited}
                    </p>
                  </div>
                ))}
              </div>

              {section.sub_sections?.map((sub, k) => (
                <div
                  key={k}
                  className="rounded-2xl p-6 mb-4"
                  style={{ background: "var(--bg-card-hover)", border: "1px solid var(--bg-border)" }}
                >
                  <h3 className="text-lg font-semibold mb-3 leading-tight">{sub.heading}</h3>
                  <p className="leading-relaxed mb-5" style={{ color: "var(--text-secondary)", fontSize: sizes.body }}>
                    {sub.body}
                  </p>
                  <div className="space-y-3">
                    {sub.evidence.map((ev, l) => (
                      <div
                        key={l}
                        className="rounded-xl p-4"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--bg-border)" }}
                      >
                        <div className="font-medium mb-3" style={{ color: "var(--accent)", fontSize: sizes.reference }}>
                          {ev.verse_ref}
                        </div>
                        <p className="arabic text-right mb-3" style={{ fontSize: sizes.main }}>
                          {ev.arabic}
                        </p>
                        <p className="mb-2 leading-relaxed" style={{ color: "var(--text-primary)", fontSize: sizes.body }}>
                          {ev.translation_en}
                        </p>
                        <p className="italic leading-relaxed" style={{ color: "var(--text-muted)", fontSize: sizes.context }}>
                          {ev.why_cited}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {isPro && (
                <>
                  <button
                    onClick={() =>
                      setActiveJournal(activeJournal === section.heading ? null : section.heading)
                    }
                    className="transition hover:opacity-80 mb-3"
                    style={{ color: "var(--text-muted)", fontSize: sizes.context }}
                  >
                    {activeJournal === section.heading ? "Close journal" : "Write in journal"}
                    {journal[section.heading] && " • saved"}
                  </button>
                  {activeJournal === section.heading && (
                    <textarea
                      value={journal[section.heading] || ""}
                      onChange={(e) => saveJournal(section.heading, e.target.value)}
                      placeholder="Your reflection..."
                      className="w-full p-4 rounded-2xl resize-none outline-none transition"
                      rows={4}
                      style={{
                        background: "var(--bg-card)",
                        color: "var(--text-primary)",
                        border: "none",
                        fontSize: sizes.body,
                      }}
                    />
                  )}
                </>
              )}
            </section>
          ))}
        </div>

        {question.related_verses && question.related_verses.length > 0 && (
          <div className="mt-20">
            <p className="mb-4 uppercase tracking-wider" style={{ color: "var(--text-muted)", fontSize: sizes.context }}>
              Related verses
            </p>
            <div className="flex flex-wrap gap-2">
              {question.related_verses.map((rv) => (
                <span
                  key={rv}
                  className="text-xs px-3 py-1.5 rounded-full"
                  style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
                >
                  {rv}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {showProModal && (
        <ProActivateModal
          onClose={() => setShowProModal(false)}
          onActivated={() => console.log("Pro activated")}
        />
      )}
    </main>
  );
}