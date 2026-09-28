"use client";

import { getTopic, findAyahsByRootGlobal, getQuestionsByTopic } from "@/data";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { useTheme } from "@/components/ThemeProvider";
import ShareModal from "@/components/ShareModal";

type WordInfo = {
  arabic: string;
  root: string;
  meaning_en: string;
};

const sizeMap = {
  sm: { main: "1.75rem", body: "0.875rem", word: "1rem", evidence: "0.9375rem", context: "0.8125rem", reference: "0.8125rem" },
  md: { main: "2.25rem", body: "1rem", word: "1.125rem", evidence: "1.0625rem", context: "0.9375rem", reference: "0.9375rem" },
  lg: { main: "2.75rem", body: "1.125rem", word: "1.25rem", evidence: "1.1875rem", context: "1.0625rem", reference: "1.0625rem" },
  xl: { main: "3.5rem", body: "1.25rem", word: "1.375rem", evidence: "1.3125rem", context: "1.1875rem", reference: "1.1875rem" },
};

export default function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const topic = getTopic(slug);
  const { theme, setTheme, textSize, setTextSize, isPro, setIsPro } = useTheme();

  const [selectedWord, setSelectedWord] = useState<WordInfo | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showRootGraph, setShowRootGraph] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [journal, setJournal] = useState<Record<string, string>>({});
  const [activeJournal, setActiveJournal] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [shareData, setShareData] = useState<{
    arabic: string;
    translation: string;
    reference: string;
  } | null>(null);

  useEffect(() => {
    const savedBookmarks = JSON.parse(
      localStorage.getItem("tadabbur-bookmarks") || "[]"
    );
    const savedJournal = JSON.parse(
      localStorage.getItem("tadabbur-journal") || "{}"
    );
    setBookmarks(savedBookmarks);
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

  if (!topic) return null;

  const sizes = sizeMap[textSize];

  const toggleBookmark = (ref: string) => {
    const updated = bookmarks.includes(ref)
      ? bookmarks.filter((b) => b !== ref)
      : [...bookmarks, ref];
    setBookmarks(updated);
    localStorage.setItem("tadabbur-bookmarks", JSON.stringify(updated));
  };

  const saveJournal = (ref: string, text: string) => {
    const updated = { ...journal, [ref]: text };
    setJournal(updated);
    localStorage.setItem("tadabbur-journal", JSON.stringify(updated));
  };

  const relatedQuestions = getQuestionsByTopic(slug);

  const themeList: Array<{ id: any; label: string; preview: string }> = [
    { id: "dark", label: "Midnight", preview: "#22d3ee" },
    { id: "light", label: "Paper", preview: "#b45309" },
    { id: "sepia", label: "Manuscript", preview: "#92400e" },
    { id: "amoled", label: "OLED", preview: "#000000" },
    { id: "forest", label: "Forest", preview: "#34d399" },
    { id: "rose", label: "Rose", preview: "#fb7185" },
    { id: "blossom", label: "Blossom", preview: "#e8a5b8" },
    { id: "ocean", label: "Ocean", preview: "#60a5fa" },
    { id: "lavender", label: "Lavender", preview: "#c4b5fd" },
  ];

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 flex-wrap gap-3">
          <Link
            href="/"
            className="text-sm hover:opacity-80 transition"
            style={{ color: "var(--text-muted)" }}
          >
            ← Back
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            {isPro && (
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

        {/* Settings Panel */}
        {showSettings && (
          <div
            className="rounded-2xl p-6 mb-12"
            style={{ background: "var(--bg-card)" }}
          >
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              Theme
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {themeList.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className="flex items-center gap-3 p-3 rounded-xl text-xs transition text-left"
                  style={{
                    background: theme === t.id ? "var(--accent)" : "var(--bg-card-hover)",
                    color: theme === t.id ? "var(--accent-text)" : "var(--text-primary)",
                  }}
                >
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{
                      background: t.preview,
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  />
                  <span className="truncate">{t.label}</span>
                </button>
              ))}
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
              className="pt-4 mt-4"
              style={{ borderTop: "1px solid var(--bg-border)" }}
            >
              <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                Pro Preview
              </p>
              <button
                onClick={() => setIsPro(!isPro)}
                className="w-full py-3 rounded-xl font-medium transition text-sm"
                style={{
                  background: isPro ? "var(--accent)" : "var(--bg-card-hover)",
                  color: isPro ? "var(--accent-text)" : "var(--text-primary)",
                }}
              >
                {isPro ? "Pro Active" : "Activate Pro"}
              </button>
            </div>
          </div>
        )}

        {/* Title */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            {topic.topic_title}
          </h1>
          <p className="text-base" style={{ color: "var(--text-muted)" }}>
            {topic.verses.length} verse{topic.verses.length > 1 ? "s" : ""} from
            the Quran
          </p>

          {topic.disclaimer && (
            <div
              className="rounded-2xl p-5 mt-6"
              style={{ background: "var(--bg-card)" }}
            >
              <p
                className="text-xs uppercase tracking-wider mb-2"
                style={{ color: "var(--accent)", fontSize: sizes.context }}
              >
                Note
              </p>
              <p
                className="leading-relaxed"
                style={{ color: "var(--text-muted)", fontSize: sizes.context }}
              >
                {topic.disclaimer}
              </p>
            </div>
          )}
        </div>

        {/* Verses */}
        <div className="space-y-16">
          {topic.verses.map((verse, verseIndex) => {
            const ref = `${verse.surah}:${verse.ayah}`;
            const isBookmarked = bookmarks.includes(ref);
            const journalText = journal[ref] || "";

            return (
              <article key={ref}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-baseline gap-3">
                    <span
                      className="font-medium"
                      style={{ color: "var(--accent)", fontSize: sizes.reference }}
                    >
                      {verse.surah_name_en}
                    </span>
                    <span
                      style={{ color: "var(--text-muted)", fontSize: sizes.reference }}
                    >
                      {verse.surah}:{verse.ayah}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setShareData({
                          arabic: verse.arabic_text,
                          translation: verse.translation_en,
                          reference: ref,
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
                    {isPro && (
                      <button
                        onClick={() => toggleBookmark(ref)}
                        className="text-xs px-3 py-1.5 rounded-full transition"
                        style={{
                          background: isBookmarked ? "var(--accent)" : "var(--bg-card)",
                          color: isBookmarked ? "var(--accent-text)" : "var(--text-muted)",
                        }}
                      >
                        {isBookmarked ? "Saved" : "Save"}
                      </button>
                    )}
                  </div>
                </div>

                <p
                  className="arabic text-right mb-8"
                  style={{ fontSize: sizes.main, color: "var(--text-primary)" }}
                >
                  {verse.arabic_text}
                </p>

                <p
                  className="leading-relaxed mb-10"
                  style={{ color: "var(--text-secondary)", fontSize: sizes.body }}
                >
                  {verse.translation_en}
                </p>

                <div className="mb-10">
                   {verseIndex === 0 && (
                    <p
                      className="mb-4"
                      style={{ color: "var(--text-muted)", fontSize: sizes.context }}
                    >
                      Word by word — tap any word
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {verse.word_by_word.map((word, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedWord(word)}
                        className="rounded-2xl px-4 py-2.5 transition hover:scale-[1.03] text-left"
                        style={{ background: "var(--bg-card)" }}
                      >
                        <span
                          className="arabic block mb-0.5"
                          style={{ fontSize: sizes.word }}
                        >
                          {word.arabic}
                        </span>
                        <span
                          className="block"
                          style={{ color: "var(--text-muted)", fontSize: sizes.context }}
                        >
                          {word.meaning_en}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  {verse.socratic_dropdowns.map((dropdown, i) => (
                    <details
                      key={i}
                      className="group rounded-2xl overflow-hidden transition mb-3"
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--bg-border)",
                      }}
                    >
                      <summary
                        className="cursor-pointer p-5 font-medium flex items-center justify-between transition hover:opacity-90"
                        style={{ fontSize: sizes.body }}
                      >
                        <span>{dropdown.question}</span>
                        <span
                          className="chevron transition"
                          style={{ color: "var(--text-muted)", fontSize: sizes.context }}
                        >
                          ▸
                        </span>
                      </summary>
                      <div
                        className="px-5 pb-5 pt-4"
                        style={{ borderTop: "1px solid var(--bg-border)" }}
                      >
                        <p
                          className="leading-relaxed mb-5"
                          style={{ color: "var(--text-secondary)", fontSize: sizes.body }}
                        >
                          {dropdown.answer}
                        </p>

                        <div className="space-y-3">
                          {dropdown.evidence.map((ev, j) => (
                            <div
                              key={j}
                              className="rounded-xl p-4"
                              style={{
                                background: "var(--bg-card-hover)",
                                border: "1px solid var(--bg-border)",
                              }}
                            >
                              <div
                                className="font-medium mb-3"
                                style={{ color: "var(--accent)", fontSize: sizes.reference }}
                              >
                                {ev.verse_ref}
                              </div>
                              <p
                                className="arabic text-right mb-3"
                                style={{ fontSize: sizes.evidence }}
                              >
                                {ev.arabic}
                              </p>
                              <p
                                className="mb-3 leading-relaxed"
                                style={{ color: "var(--text-primary)", fontSize: sizes.body }}
                              >
                                {ev.translation_en}
                              </p>
                              <p
                                className="italic leading-relaxed"
                                style={{ color: "var(--text-muted)", fontSize: sizes.context }}
                              >
                                {ev.why_cited}
                              </p>
                            </div>
                          ))}
                        </div>

                        {dropdown.sub_dropdowns?.map((sub, k) => (
                          <NestedDropdown key={k} dropdown={sub} depth={1} sizes={sizes} />
                        ))}
                      </div>
                    </details>
                  ))}
                </div>

                {isPro && (
                  <div className="mt-6">
                    <button
                      onClick={() =>
                        setActiveJournal(activeJournal === ref ? null : ref)
                      }
                      className="transition hover:opacity-80"
                      style={{ color: "var(--text-muted)", fontSize: sizes.context }}
                    >
                      {activeJournal === ref ? "Close journal" : "Write in journal"}
                      {journalText && " • saved"}
                    </button>
                    {activeJournal === ref && (
                      <div className="mt-3">
                        <textarea
                          value={journalText}
                          onChange={(e) => saveJournal(ref, e.target.value)}
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
                      </div>
                    )}
                  </div>
                )}

                {verseIndex < topic.verses.length - 1 && (
                  <div
                    className="mt-16 mb-16"
                    style={{ height: "1px", background: "var(--bg-border)" }}
                  />
                )}
              </article>
            );
          })}
        </div>

        {relatedQuestions.length > 0 && (
          <div className="mt-20">
            <p
              className="mb-6 uppercase tracking-wider"
              style={{ color: "var(--text-muted)", fontSize: sizes.context }}
            >
              Related questions
            </p>
            <div className="space-y-3">
              {relatedQuestions.map((q) => (
                <Link
                  key={q.slug}
                  href={`/questions/${q.slug}`}
                  className="group flex items-start justify-between p-5 rounded-2xl transition hover:scale-[1.01]"
                  style={{ background: "var(--bg-card)" }}
                >
                  <span className="font-medium leading-snug pr-4" style={{ fontSize: sizes.body }}>
                    {q.question}
                  </span>
                  <span
                    className="transition group-hover:translate-x-1 flex-shrink-0"
                    style={{ color: "var(--text-muted)" }}
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div
          className="rounded-3xl p-8 mt-20 text-center"
          style={{ background: "var(--bg-card)" }}
        >
          <p className="mb-4" style={{ color: "var(--accent)", fontSize: sizes.context }}>
            Reassurance
          </p>
          <p
            className="leading-relaxed mb-3"
            style={{ color: "var(--text-primary)", fontSize: sizes.body }}
          >
            {topic.reassurance_anchor.text_en}
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: sizes.context }}>
            {topic.reassurance_anchor.verse_ref}
          </p>
        </div>
      </div>

      {/* Word Modal */}
      {selectedWord && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => {
            setSelectedWord(null);
            setShowRootGraph(null);
          }}
        >
          <div
            className="rounded-3xl p-8 max-w-md w-full max-h-[85vh] overflow-y-auto"
            style={{ background: "var(--bg-card)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {!showRootGraph ? (
              <>
                <p className="arabic text-6xl text-center mb-8">
                  {selectedWord.arabic}
                </p>
                <div className="text-center mb-6">
                  <p className="mb-2" style={{ color: "var(--text-muted)", fontSize: sizes.context }}>
                    Root letters
                  </p>
                  <p className="arabic text-2xl" style={{ color: "var(--accent)" }}>
                    {selectedWord.root}
                  </p>
                </div>
                <div className="text-center mb-8">
                  <p className="mb-2" style={{ color: "var(--text-muted)", fontSize: sizes.context }}>
                    Meaning
                  </p>
                  <p style={{ color: "var(--text-primary)", fontSize: sizes.body }}>
                    {selectedWord.meaning_en}
                  </p>
                </div>

                <button
                  onClick={() => setShowRootGraph(selectedWord.root)}
                  className="w-full py-3 rounded-2xl font-medium transition mb-3"
                  style={{
                    background: "var(--accent)",
                    color: "var(--accent-text)",
                    fontSize: sizes.body,
                  }}
                >
                  Show all verses with this root
                </button>

                <button
                  onClick={() => setSelectedWord(null)}
                  className="w-full py-3 rounded-2xl font-medium transition"
                  style={{
                    background: "var(--bg-card-hover)",
                    color: "var(--text-primary)",
                    fontSize: sizes.body,
                  }}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowRootGraph(null)}
                  className="mb-6 transition"
                  style={{ color: "var(--text-muted)", fontSize: sizes.context }}
                >
                  ← Back
                </button>
                <div className="text-center mb-8">
                  <p className="mb-2" style={{ color: "var(--text-muted)", fontSize: sizes.context }}>
                    Root
                  </p>
                  <p className="arabic text-3xl" style={{ color: "var(--accent)" }}>
                    {showRootGraph}
                  </p>
                </div>
                {findAyahsByRootGlobal(showRootGraph).length > 0 ? (
                  <div className="space-y-3">
                    {findAyahsByRootGlobal(showRootGraph).map((v, i) => (
                      <div
                        key={i}
                        className="rounded-xl p-4"
                        style={{ background: "var(--bg-card-hover)" }}
                      >
                        <div className="flex items-baseline justify-between mb-2">
                          <p style={{ color: "var(--accent)", fontSize: sizes.context }}>
                            {v.surah_name} {v.ref}
                          </p>
                          <p style={{ color: "var(--text-muted)", fontSize: sizes.context }}>
                            {v.source}
                          </p>
                        </div>
                        <p className="arabic text-lg mb-2 text-right">{v.arabic}</p>
                        <p style={{ color: "var(--text-secondary)", fontSize: sizes.context }}>
                          {v.translation}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center" style={{ color: "var(--text-muted)", fontSize: sizes.context }}>
                    No other verses in current data use this root yet.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

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

function NestedDropdown({
  dropdown,
  depth,
  sizes,
}: {
  dropdown: any;
  depth: number;
  sizes: any;
}) {
  return (
    <details
      className="group mt-3 rounded-xl overflow-hidden"
      style={{
        background: "var(--bg-card-hover)",
        border: "1px solid var(--bg-border)",
        marginLeft: `${depth * 8}px`,
      }}
    >
      <summary
        className="cursor-pointer p-4 font-medium flex items-center justify-between"
        style={{ color: "var(--text-primary)", fontSize: sizes.body }}
      >
        <span>{dropdown.question}</span>
        <span
          className="chevron transition"
          style={{ color: "var(--text-muted)", fontSize: sizes.context }}
        >
          ▸
        </span>
      </summary>
      <div
        className="px-4 pb-4 pt-4"
        style={{ borderTop: "1px solid var(--bg-border)" }}
      >
        <p
          className="mb-4 leading-relaxed"
          style={{ color: "var(--text-secondary)", fontSize: sizes.body }}
        >
          {dropdown.answer}
        </p>
        <div className="space-y-3">
          {dropdown.evidence?.map((ev: any, l: number) => (
            <div
              key={l}
              className="rounded-xl p-4"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--bg-border)",
              }}
            >
              <div
                className="font-medium mb-3"
                style={{ color: "var(--accent)", fontSize: sizes.reference }}
              >
                {ev.verse_ref}
              </div>
              <p
                className="arabic text-right mb-3"
                style={{ fontSize: sizes.evidence }}
              >
                {ev.arabic}
              </p>
              <p
                className="mb-3 leading-relaxed"
                style={{ color: "var(--text-primary)", fontSize: sizes.body }}
              >
                {ev.translation_en}
              </p>
              <p
                className="italic leading-relaxed"
                style={{ color: "var(--text-muted)", fontSize: sizes.context }}
              >
                {ev.why_cited}
              </p>
            </div>
          ))}
        </div>
        {dropdown.sub_dropdowns?.map((sub: any, k: number) => (
          <NestedDropdown key={k} dropdown={sub} depth={depth + 1} sizes={sizes} />
        ))}
      </div>
    </details>
  );
}