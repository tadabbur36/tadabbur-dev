"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { getDailyReassurance } from "@/data/reassurance";
import ThemePicker from "@/components/ThemePicker";
import {
  topicsIndex,
  emotionsIndex,
  questionsIndex,
  dhikrIndex,
  surahsIndex,
} from "@/data";

export default function Home() {
  const { isPro, textSize, setTextSize } = useTheme();
  const [streak, setStreak] = useState(0);
  const [search, setSearch] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setStreak(parseInt(localStorage.getItem("tadabbur-streak") || "0"));
  }, []);

  const dailyReassurance = getDailyReassurance();

  const sizes = {
    sm: { hero: "2rem", arabic: "1.5rem", cardTitle: "1rem", cardDesc: "0.8125rem", section: "0.75rem", body: "0.875rem" },
    md: { hero: "2.5rem", arabic: "2rem", cardTitle: "1.125rem", cardDesc: "0.9375rem", section: "0.8125rem", body: "1rem" },
    lg: { hero: "3rem", arabic: "2.5rem", cardTitle: "1.25rem", cardDesc: "1.0625rem", section: "0.875rem", body: "1.125rem" },
    xl: { hero: "3.75rem", arabic: "3rem", cardTitle: "1.375rem", cardDesc: "1.1875rem", section: "1rem", body: "1.25rem" },
  }[textSize];

  const q = search.toLowerCase().trim();

  const filteredTopics = q
    ? topicsIndex.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      )
    : [];

  const filteredEmotions = q
    ? emotionsIndex.filter((e) => e.label.toLowerCase().includes(q))
    : [];

  const filteredQuestions = q
    ? questionsIndex.filter(
        (qq) =>
          qq.question.toLowerCase().includes(q) ||
          (qq.short_answer || "").toLowerCase().includes(q)
      )
    : [];

  const filteredDhikr = q
    ? dhikrIndex.filter(
        (d) =>
          d.transliteration.toLowerCase().includes(q) ||
          d.meaning_en.toLowerCase().includes(q)
      )
    : [];

  const filteredSurahs = q
    ? surahsIndex.filter(
        (s) =>
          s.name_transliteration.toLowerCase().includes(q) ||
          s.meaning_en.toLowerCase().includes(q)
      )
    : [];

  const isSearching = q.length > 0;

  const hasResults =
    filteredTopics.length > 0 ||
    filteredEmotions.length > 0 ||
    filteredQuestions.length > 0 ||
    filteredDhikr.length > 0 ||
    filteredSurahs.length > 0;

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1
              className="font-bold tracking-tight mb-2"
              style={{ fontSize: sizes.hero }}
            >
              Tadabbur
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: sizes.body }}>
              Reflection, rooted in Quran.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {isPro && streak > 0 && (
              <span
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: "var(--accent)", color: "var(--accent-text)" }}
              >
                {streak} day streak
              </span>
            )}
            {isPro && (
              <span
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: "var(--accent)", color: "var(--accent-text)" }}
              >
                PRO
              </span>
            )}
            <Link
              href="/disclaimer"
              className="text-sm px-3 py-1.5 rounded-full transition hover:opacity-80"
              style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
            >
              Disclaimer
            </Link>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-sm px-3 py-1.5 rounded-full transition hover:opacity-80"
              style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div
            className="rounded-2xl p-6 mb-8"
            style={{ background: "var(--bg-card)" }}
          >
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              Theme
            </p>
            <div className="mb-6">
              <ThemePicker />
            </div>

            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              Text Size
            </p>
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

            <div
              className="pt-4 mt-6"
              style={{ borderTop: "1px solid var(--bg-border)" }}
            >
              {!isPro && (
                <>
                  <a
                    href="https://www.patreon.com/tadabbur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 rounded-xl font-medium transition text-center mb-3 text-sm"
                    style={{
                      background: "var(--bg-card-hover)",
                      color: "var(--text-primary)",
                    }}
                  >
                    Support the Developer
                  </a>
                  <a
                    href="https://www.patreon.com/tadabbur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 rounded-xl font-medium transition text-center text-sm"
                    style={{
                      background: "var(--accent)",
                      color: "var(--accent-text)",
                    }}
                  >
                    Get Premium
                  </a>
                </>
              )}
              {isPro && (
                <div
                  className="w-full py-3 rounded-xl font-medium text-center text-sm"
                  style={{
                    background: "var(--bg-card-hover)",
                    color: "var(--text-primary)",
                  }}
                >
                  Pro Active
                </div>
              )}
            </div>
          </div>
        )}

        {/* Daily Reassurance */}
        <div
          className="rounded-2xl p-6 mb-8 text-center"
          style={{ background: "var(--bg-card)" }}
        >
          <p
            className="arabic mb-3"
            style={{ fontSize: sizes.arabic, color: "var(--accent)" }}
          >
            {dailyReassurance.arabic}
          </p>
          <p
            className="leading-relaxed mb-2"
            style={{ color: "var(--text-secondary)", fontSize: sizes.body }}
          >
            {dailyReassurance.translation_en}
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: sizes.section }}>
            {dailyReassurance.verse_ref}
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search a topic, feeling, question, dhikr, surah..."
          className="w-full p-5 rounded-3xl outline-none transition mb-8"
          style={{
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            border: "none",
            fontSize: sizes.body,
          }}
        />

        {/* SEARCH MODE */}
        {isSearching && (
          <div className="space-y-12">
            <p style={{ color: "var(--text-muted)", fontSize: sizes.body }}>
              {hasResults ? "Results" : "No results"} for "{search}"
            </p>

            {filteredSurahs.length > 0 && (
              <div>
                <p className="mb-4 uppercase tracking-wider" style={{ color: "var(--text-muted)", fontSize: sizes.section }}>
                  Surahs
                </p>
                <div className="space-y-2">
                  {filteredSurahs.map((s) => (
                    <Link
                      key={s.surah}
                      href={`/quran/${s.surah}`}
                      className="group flex items-center justify-between p-5 rounded-2xl transition hover:scale-[1.01]"
                      style={{ background: "var(--bg-card)" }}
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-medium w-8 text-center" style={{ color: "var(--accent)", fontSize: sizes.section }}>
                          {s.surah}
                        </span>
                        <div>
                          <p className="font-medium" style={{ fontSize: sizes.cardTitle }}>
                            {s.name_transliteration}
                          </p>
                          <p style={{ color: "var(--text-muted)", fontSize: sizes.cardDesc }}>
                            {s.meaning_en} · {s.total_ayahs} ayahs
                          </p>
                        </div>
                      </div>
                      <span className="transition group-hover:translate-x-1" style={{ color: "var(--text-muted)" }}>
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filteredEmotions.length > 0 && (
              <div>
                <p className="mb-4 uppercase tracking-wider" style={{ color: "var(--text-muted)", fontSize: sizes.section }}>
                  Feelings
                </p>
                <div className="flex flex-wrap gap-2">
                  {filteredEmotions.map((e) => (
                    <Link
                      key={e.slug}
                      href={`/emotion/${e.slug}`}
                      className="px-5 py-3 rounded-2xl font-medium transition hover:scale-[1.02]"
                      style={{ background: "var(--bg-card)", fontSize: sizes.body }}
                    >
                      {e.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filteredTopics.length > 0 && (
              <div>
                <p className="mb-4 uppercase tracking-wider" style={{ color: "var(--text-muted)", fontSize: sizes.section }}>
                  Topics
                </p>
                <div className="space-y-2">
                  {filteredTopics.map((topic) => (
                    <Link
                      key={topic.slug}
                      href={`/topic/${topic.slug}`}
                      className="group flex items-center justify-between p-5 rounded-2xl transition hover:scale-[1.01]"
                      style={{ background: "var(--bg-card)" }}
                    >
                      <div>
                        <span className="font-medium block mb-1" style={{ fontSize: sizes.cardTitle }}>
                          {topic.title}
                        </span>
                        <span style={{ color: "var(--text-muted)", fontSize: sizes.cardDesc }}>
                          {topic.verse_count} verses
                        </span>
                      </div>
                      <span className="transition group-hover:translate-x-1" style={{ color: "var(--text-muted)" }}>
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filteredQuestions.length > 0 && (
              <div>
                <p className="mb-4 uppercase tracking-wider" style={{ color: "var(--text-muted)", fontSize: sizes.section }}>
                  Questions
                </p>
                <div className="space-y-2">
                  {filteredQuestions.map((qq) => (
                    <Link
                      key={qq.slug}
                      href={`/questions/${qq.slug}`}
                      className="group flex items-start justify-between p-5 rounded-2xl transition hover:scale-[1.01]"
                      style={{ background: "var(--bg-card)" }}
                    >
                      <span className="font-medium leading-snug pr-4" style={{ fontSize: sizes.cardTitle }}>
                        {qq.question}
                      </span>
                      <span className="transition group-hover:translate-x-1 flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filteredDhikr.length > 0 && (
              <div>
                <p className="mb-4 uppercase tracking-wider" style={{ color: "var(--text-muted)", fontSize: sizes.section }}>
                  Dhikr
                </p>
                <div className="space-y-2">
                  {filteredDhikr.map((d) => (
                    <Link
                      key={d.slug}
                      href={`/dhikr/${d.slug}`}
                      className="group flex items-center justify-between p-5 rounded-2xl transition hover:scale-[1.01]"
                      style={{ background: "var(--bg-card)" }}
                    >
                      <div>
                        <span className="font-medium block mb-1" style={{ fontSize: sizes.cardTitle }}>
                          {d.transliteration}
                        </span>
                        <span style={{ color: "var(--text-muted)", fontSize: sizes.cardDesc }}>
                          {d.meaning_en}
                        </span>
                      </div>
                      <p className="arabic" style={{ fontSize: sizes.arabic, color: "var(--accent)" }}>
                        {d.phrase_arabic}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!hasResults && (
              <p className="text-center py-16" style={{ color: "var(--text-muted)", fontSize: sizes.body }}>
                No results for "{search}"
              </p>
            )}
          </div>
        )}

        {/* DEFAULT MODE */}
        {!isSearching && (
          <div className="space-y-4">
            {isPro && (
              <Link
                href="/saved"
                className="group flex items-center justify-between p-5 rounded-3xl transition hover:scale-[1.01]"
                style={{ background: "var(--bg-card)" }}
              >
                <div className="flex items-center gap-4">
                  <span style={{ color: "var(--accent)", fontSize: sizes.body }}>★</span>
                  <div>
                    <span className="font-medium block mb-0.5" style={{ fontSize: sizes.cardTitle }}>
                      Saved
                    </span>
                    <span style={{ color: "var(--text-muted)", fontSize: sizes.cardDesc }}>
                      Your verses and names
                    </span>
                  </div>
                </div>
                <span className="transition group-hover:translate-x-1" style={{ color: "var(--text-muted)" }}>
                  →
                </span>
              </Link>
            )}

            <Link
              href="/quran"
              className="group flex items-center justify-between p-6 rounded-3xl transition hover:scale-[1.01]"
              style={{ background: "var(--bg-card)" }}
            >
              <div>
                <span className="font-medium block mb-1" style={{ fontSize: sizes.cardTitle }}>
                  Quran
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: sizes.cardDesc }}>
                  "And We have sent down to you the Book as clarification for all things." (16:89)
                </span>
              </div>
              <span className="transition group-hover:translate-x-1" style={{ color: "var(--text-muted)" }}>
                →
              </span>
            </Link>

            <Link
              href="/dhikr"
              className="group flex items-center justify-between p-6 rounded-3xl transition hover:scale-[1.01]"
              style={{ background: "var(--bg-card)" }}
            >
              <div>
                <span className="font-medium block mb-1" style={{ fontSize: sizes.cardTitle }}>
                  Dhikr
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: sizes.cardDesc }}>
                  "Unquestionably, by the remembrance of Allah hearts find peace." (13:28)
                </span>
              </div>
              <span className="transition group-hover:translate-x-1" style={{ color: "var(--text-muted)" }}>
                →
              </span>
            </Link>

            <Link
              href="/qasas"
              className="group flex items-center justify-between p-6 rounded-3xl transition hover:scale-[1.01]"
              style={{ background: "var(--bg-card)" }}
            >
              <div>
                <span className="font-medium block mb-1" style={{ fontSize: sizes.cardTitle }}>
                  Qasas
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: sizes.cardDesc }}>
                  "We relate to you the best of stories through what We have revealed to you of this Quran." (12:3)
                </span>
              </div>
              <span className="transition group-hover:translate-x-1" style={{ color: "var(--text-muted)" }}>
                →
              </span>
            </Link>

            <div className="pt-6">
              <p className="mb-4 uppercase tracking-wider" style={{ color: "var(--text-muted)", fontSize: sizes.section }}>
                How are you feeling?
              </p>
              <div className="flex flex-wrap gap-2">
                {emotionsIndex.map((e) => (
                  <Link
                    key={e.slug}
                    href={`/emotion/${e.slug}`}
                    className="px-5 py-3 rounded-2xl font-medium transition hover:scale-[1.02]"
                    style={{ background: "var(--bg-card)", fontSize: sizes.body }}
                  >
                    {e.label}
                  </Link>
                ))}
              </div>
            </div>

            {topicsIndex.length > 0 && (
              <div className="pt-6">
                <p className="mb-4 uppercase tracking-wider" style={{ color: "var(--text-muted)", fontSize: sizes.section }}>
                  Topics
                </p>
                <div className="space-y-2">
                  {topicsIndex.map((topic) => (
                    <Link
                      key={topic.slug}
                      href={`/topic/${topic.slug}`}
                      className="group flex items-center justify-between p-5 rounded-3xl transition hover:scale-[1.01]"
                      style={{ background: "var(--bg-card)" }}
                    >
                      <div>
                        <span className="font-medium block mb-1" style={{ fontSize: sizes.cardTitle }}>
                          {topic.title}
                        </span>
                        <span style={{ color: "var(--text-muted)", fontSize: sizes.cardDesc }}>
                          {topic.verse_count} verses
                        </span>
                      </div>
                      <span className="transition group-hover:translate-x-1" style={{ color: "var(--text-muted)" }}>
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {questionsIndex.length > 0 && (
              <div className="pt-6">
                <p className="mb-4 uppercase tracking-wider" style={{ color: "var(--text-muted)", fontSize: sizes.section }}>
                  Questions
                </p>
                <div className="space-y-2">
                  {questionsIndex.map((qq) => (
                    <Link
                      key={qq.slug}
                      href={`/questions/${qq.slug}`}
                      className="group flex items-start justify-between p-5 rounded-3xl transition hover:scale-[1.01]"
                      style={{ background: "var(--bg-card)" }}
                    >
                      <div className="flex-1 pr-4">
                        <span className="font-medium block mb-2 leading-snug" style={{ fontSize: sizes.cardTitle }}>
                          {qq.question}
                        </span>
                        {qq.short_answer && (
                          <span className="block leading-relaxed" style={{ color: "var(--text-secondary)", fontSize: sizes.cardDesc }}>
                            {qq.short_answer}
                          </span>
                        )}
                      </div>
                      <span className="transition group-hover:translate-x-1 flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}