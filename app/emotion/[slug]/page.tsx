"use client";

import { getEmotion } from "@/data";
import Link from "next/link";
import { use, useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";

type Bookmark = {
  ref: string;
  folder: string;
  arabic: string;
  translation: string;
  surah_name: string;
  saved_at: number;
  type?: "verse" | "name";
};

const sizeMap = {
  sm: {
    main: "1.75rem",
    body: "0.875rem",
    evidence: "0.9375rem",
    context: "0.8125rem",
    reference: "0.8125rem",
  },
  md: {
    main: "2.25rem",
    body: "1rem",
    evidence: "1.0625rem",
    context: "0.9375rem",
    reference: "0.9375rem",
  },
  lg: {
    main: "2.75rem",
    body: "1.125rem",
    evidence: "1.1875rem",
    context: "1.0625rem",
    reference: "1.0625rem",
  },
  xl: {
    main: "3.5rem",
    body: "1.25rem",
    evidence: "1.3125rem",
    context: "1.1875rem",
    reference: "1.1875rem",
  },
};

export default function EmotionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const emotion = getEmotion(slug);
  const { theme, setTheme, textSize, setTextSize, isPro, setIsPro } = useTheme();

  const [showSettings, setShowSettings] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [folders, setFolders] = useState<Array<{ id: string; name: string }>>([]);
  const [showFolderPicker, setShowFolderPicker] = useState<{
    ref: string;
    arabic: string;
    translation: string;
    surah_name: string;
    type: "verse" | "name";
  } | null>(null);
  const [journal, setJournal] = useState<Record<string, string>>({});
  const [activeJournal, setActiveJournal] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const savedBookmarks = JSON.parse(
      localStorage.getItem("tadabbur-bookmarks") || "[]"
    );
    const savedFolders = JSON.parse(
      localStorage.getItem("tadabbur-folders") || "[]"
    );
    const savedJournal = JSON.parse(
      localStorage.getItem("tadabbur-journal") || "{}"
    );
    setBookmarks(savedBookmarks);
    setFolders(savedFolders);
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

  if (!emotion) return null;

  const sizes = sizeMap[textSize];

  const isBookmarked = (ref: string) => bookmarks.some((b) => b.ref === ref);

  const removeBookmark = (ref: string) => {
    const updated = bookmarks.filter((b) => b.ref !== ref);
    setBookmarks(updated);
    localStorage.setItem("tadabbur-bookmarks", JSON.stringify(updated));
  };

  const saveBookmark = (folder: string) => {
    if (!showFolderPicker) return;
    const existing = bookmarks.filter((b) => b.ref !== showFolderPicker.ref);
    const newBookmark: Bookmark = {
      ref: showFolderPicker.ref,
      folder,
      arabic: showFolderPicker.arabic,
      translation: showFolderPicker.translation,
      surah_name: showFolderPicker.surah_name,
      saved_at: Date.now(),
      type: showFolderPicker.type,
    };
    const updated = [...existing, newBookmark];
    setBookmarks(updated);
    localStorage.setItem("tadabbur-bookmarks", JSON.stringify(updated));
    setShowFolderPicker(null);
  };

  const saveJournal = (ref: string, text: string) => {
    const updated = { ...journal, [ref]: text };
    setJournal(updated);
    localStorage.setItem("tadabbur-journal", JSON.stringify(updated));
  };

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
              style={{
                background: "var(--bg-card)",
                color: "var(--text-secondary)",
              }}
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
                    background:
                      theme === t.id ? "var(--accent)" : "var(--bg-card-hover)",
                    color:
                      theme === t.id
                        ? "var(--accent-text)"
                        : "var(--text-primary)",
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
                    background:
                      textSize === s ? "var(--accent)" : "var(--bg-card-hover)",
                    color:
                      textSize === s
                        ? "var(--accent-text)"
                        : "var(--text-primary)",
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

        {/* Emotion header */}
        <div className="mb-14">
          <p
            className="mb-3"
            style={{ color: "var(--text-muted)", fontSize: sizes.context }}
          >
            You said you feel
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {emotion.label}
          </h1>
          <p
            className="leading-relaxed"
            style={{ color: "var(--text-secondary)", fontSize: sizes.body }}
          >
            {emotion.acknowledgment}
          </p>
        </div>

        {/* Verses */}
        <div className="space-y-14">
          {emotion.verses.map((verse, i) => {
            const marked = isBookmarked(verse.verse_ref);
            const journalText = journal[verse.verse_ref] || "";

            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="font-medium"
                    style={{ color: "var(--accent)", fontSize: sizes.reference }}
                  >
                    {verse.verse_ref}
                  </span>
                  <button
                    onClick={() => {
                      if (marked) {
                        removeBookmark(verse.verse_ref);
                      } else {
                        setShowFolderPicker({
                          ref: verse.verse_ref,
                          arabic: verse.arabic,
                          translation: verse.translation_en,
                          surah_name: "Quran",
                          type: "verse",
                        });
                      }
                    }}
                    className="text-xs px-3 py-1.5 rounded-full transition"
                    style={{
                      background: marked
                        ? "var(--accent)"
                        : "var(--bg-card)",
                      color: marked ? "var(--accent-text)" : "var(--text-muted)",
                    }}
                  >
                    {marked ? "Saved" : "Save"}
                  </button>
                </div>

                <p
                  className="arabic text-right mb-5"
                  style={{ fontSize: sizes.main, color: "var(--text-primary)" }}
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
                  className="leading-relaxed mb-6"
                  style={{ color: "var(--text-muted)", fontSize: sizes.context }}
                >
                  {verse.context}
                </p>

                {/* Journal */}
                <button
                  onClick={() =>
                    setActiveJournal(
                      activeJournal === verse.verse_ref ? null : verse.verse_ref
                    )
                  }
                  className="transition hover:opacity-80 mb-3"
                  style={{ color: "var(--text-muted)", fontSize: sizes.context }}
                >
                  {activeJournal === verse.verse_ref
                    ? "Close journal"
                    : "Write in journal"}
                  {journalText && " • saved"}
                </button>
                {activeJournal === verse.verse_ref && (
                  <textarea
                    value={journalText}
                    onChange={(e) =>
                      saveJournal(verse.verse_ref, e.target.value)
                    }
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

                {i < emotion.verses.length - 1 && (
                  <div
                    className="mt-14"
                    style={{ height: "1px", background: "var(--bg-border)" }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Names of Allah */}
        <div className="mt-20">
          <p
            className="mb-8 uppercase tracking-wider"
            style={{ color: "var(--text-muted)", fontSize: sizes.context }}
          >
            Names that meet you here
          </p>

          <div className="space-y-12">
            {emotion.names_of_allah.map((name, i) => {
              const nameRef = `name-${name.transliteration}`;
              const marked = isBookmarked(nameRef);
              const journalText = journal[nameRef] || "";

              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="font-medium"
                      style={{ color: "var(--accent)", fontSize: sizes.reference }}
                    >
                      {name.transliteration}
                    </span>
                    <button
                      onClick={() => {
                        if (marked) {
                          removeBookmark(nameRef);
                        } else {
                          setShowFolderPicker({
                            ref: nameRef,
                            arabic: name.arabic,
                            translation: name.meaning_en,
                            surah_name: "Name of Allah",
                            type: "name",
                          });
                        }
                      }}
                      className="text-xs px-3 py-1.5 rounded-full transition"
                      style={{
                        background: marked
                          ? "var(--accent)"
                          : "var(--bg-card)",
                        color: marked
                          ? "var(--accent-text)"
                          : "var(--text-muted)",
                      }}
                    >
                      {marked ? "Saved" : "Save"}
                    </button>
                  </div>

                  <p
                    className="arabic text-center mb-3"
                    style={{ fontSize: sizes.main, color: "var(--accent)" }}
                  >
                    {name.arabic}
                  </p>
                  <p className="text-xl font-medium text-center mb-1">
                    {name.transliteration}
                  </p>
                  <p
                    className="text-center mb-5"
                    style={{ color: "var(--text-muted)", fontSize: sizes.context }}
                  >
                    {name.meaning_en}
                  </p>
                  <p
                    className="leading-relaxed mb-6 max-w-xl mx-auto text-center"
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: sizes.body,
                    }}
                  >
                    {name.explanation}
                  </p>

                  <div className="space-y-3 mb-6">
                    {name.evidence_verses.map((ev, j) => (
                      <div
                        key={j}
                        className="rounded-2xl p-5"
                        style={{ background: "var(--bg-card)" }}
                      >
                        <p
                          className="mb-3"
                          style={{
                            color: "var(--accent)",
                            fontSize: sizes.reference,
                          }}
                        >
                          {ev.verse_ref}
                        </p>
                        <p
                          className="arabic text-right mb-3"
                          style={{ fontSize: sizes.evidence }}
                        >
                          {ev.arabic}
                        </p>
                        <p
                          className="leading-relaxed"
                          style={{
                            color: "var(--text-secondary)",
                            fontSize: sizes.body,
                          }}
                        >
                          {ev.translation_en}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Journal for name */}
                  <button
                    onClick={() =>
                      setActiveJournal(activeJournal === nameRef ? null : nameRef)
                    }
                    className="transition hover:opacity-80 mb-3"
                    style={{ color: "var(--text-muted)", fontSize: sizes.context }}
                  >
                    {activeJournal === nameRef ? "Close journal" : "Write in journal"}
                    {journalText && " • saved"}
                  </button>
                  {activeJournal === nameRef && (
                    <textarea
                      value={journalText}
                      onChange={(e) => saveJournal(nameRef, e.target.value)}
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

                  {i < emotion.names_of_allah.length - 1 && (
                    <div
                      className="mt-12"
                      style={{ height: "1px", background: "var(--bg-border)" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Personal Question */}
        <div className="mt-20">
          <div
            className="rounded-3xl p-8"
            style={{ background: "var(--bg-card)" }}
          >
            <p
              className="mb-4 uppercase tracking-wider"
              style={{ color: "var(--accent)", fontSize: sizes.context }}
            >
              Ask yourself
            </p>
            <p
              className="leading-relaxed"
              style={{ color: "var(--text-primary)", fontSize: sizes.body }}
            >
              {emotion.personal_question}
            </p>
          </div>
        </div>
      </div>

      {/* Folder Picker Modal */}
      {showFolderPicker && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowFolderPicker(null)}
        >
          <div
            className="rounded-3xl p-6 max-w-md w-full"
            style={{ background: "var(--bg-card)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-medium mb-6">Save to folder</p>

            <div className="space-y-2 mb-4">
              <button
                onClick={() => saveBookmark("all")}
                className="w-full text-left p-4 rounded-2xl transition hover:opacity-90"
                style={{ background: "var(--bg-card-hover)", fontSize: sizes.body }}
              >
                All Saved
              </button>

              {folders.map((f) => (
                <button
                  key={f.id}
                  onClick={() => saveBookmark(f.id)}
                  className="w-full text-left p-4 rounded-2xl transition hover:opacity-90"
                  style={{ background: "var(--bg-card-hover)", fontSize: sizes.body }}
                >
                  {f.name}
                </button>
              ))}

              {folders.length === 0 && (
                <p
                  className="text-center p-4"
                  style={{ color: "var(--text-muted)", fontSize: sizes.context }}
                >
                  No folders yet. Create one on the Saved page.
                </p>
              )}
            </div>

            <button
              onClick={() => setShowFolderPicker(null)}
              className="w-full py-3 rounded-2xl font-medium transition"
              style={{
                background: "var(--bg-card-hover)",
                color: "var(--text-primary)",
                fontSize: sizes.body,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}