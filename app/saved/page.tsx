"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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

type Folder = {
  id: string;
  name: string;
  created_at: number;
};

export default function SavedPage() {
  const { textSize } = useTheme();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [tab, setTab] = useState<"verses" | "names">("verses");

  useEffect(() => {
    const savedBookmarks = JSON.parse(
      localStorage.getItem("tadabbur-bookmarks") || "[]"
    );
    const savedFolders = JSON.parse(
      localStorage.getItem("tadabbur-folders") || "[]"
    );
    setBookmarks(savedBookmarks);
    setFolders(savedFolders);
  }, []);

  const sizes = {
    sm: { main: "1.75rem", body: "1rem", context: "0.875rem" },
    md: { main: "2.25rem", body: "1.125rem", context: "0.9375rem" },
    lg: { main: "2.75rem", body: "1.25rem", context: "1.0625rem" },
    xl: { main: "3.5rem", body: "1.375rem", context: "1.1875rem" },
  }[textSize];

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    const id = newFolderName.toLowerCase().replace(/\s+/g, "-");
    const newFolder: Folder = {
      id,
      name: newFolderName.trim(),
      created_at: Date.now(),
    };
    const updated = [...folders, newFolder];
    setFolders(updated);
    localStorage.setItem("tadabbur-folders", JSON.stringify(updated));
    setNewFolderName("");
    setShowNewFolder(false);
  };

  const deleteFolder = (id: string) => {
    if (!confirm("Delete this folder? Saved items will move to All.")) return;
    const updated = folders.filter((f) => f.id !== id);
    setFolders(updated);
    localStorage.setItem("tadabbur-folders", JSON.stringify(updated));
    const updatedBookmarks = bookmarks.map((b) =>
      b.folder === id ? { ...b, folder: "all" } : b
    );
    setBookmarks(updatedBookmarks);
    localStorage.setItem("tadabbur-bookmarks", JSON.stringify(updatedBookmarks));
    setActiveFolder(null);
  };

  const removeBookmark = (ref: string) => {
    const updated = bookmarks.filter((b) => b.ref !== ref);
    setBookmarks(updated);
    localStorage.setItem("tadabbur-bookmarks", JSON.stringify(updated));
  };

  // Filter by tab + folder
  const itemsInTab = bookmarks.filter((b) => {
    if (tab === "verses") return !b.type || b.type === "verse";
    return b.type === "name";
  });

  const filteredBookmarks =
    activeFolder === null
      ? itemsInTab
      : itemsInTab.filter((b) => b.folder === activeFolder);

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

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Saved
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: sizes.body }}>
            {bookmarks.length} item{bookmarks.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10">
          <button
            onClick={() => setTab("verses")}
            className="px-5 py-2.5 rounded-full transition"
            style={{
              background: tab === "verses" ? "var(--accent)" : "var(--bg-card)",
              color: tab === "verses" ? "var(--accent-text)" : "var(--text-primary)",
              fontSize: sizes.context,
            }}
          >
            Verses
          </button>
          <button
            onClick={() => setTab("names")}
            className="px-5 py-2.5 rounded-full transition"
            style={{
              background: tab === "names" ? "var(--accent)" : "var(--bg-card)",
              color: tab === "names" ? "var(--accent-text)" : "var(--text-primary)",
              fontSize: sizes.context,
            }}
          >
            Names of Allah
          </button>
        </div>

        {/* Folders */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <p
              className="uppercase tracking-wider"
              style={{ color: "var(--text-muted)", fontSize: sizes.context }}
            >
              Folders
            </p>
            <button
              onClick={() => setShowNewFolder(!showNewFolder)}
              className="transition hover:opacity-80"
              style={{ color: "var(--accent)", fontSize: sizes.context }}
            >
              + New folder
            </button>
          </div>

          {showNewFolder && (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createFolder()}
                placeholder="Folder name..."
                className="flex-1 p-3 rounded-xl outline-none"
                style={{
                  background: "var(--bg-card)",
                  color: "var(--text-primary)",
                  border: "none",
                  fontSize: sizes.body,
                }}
              />
              <button
                onClick={createFolder}
                className="px-5 py-3 rounded-xl font-medium transition"
                style={{
                  background: "var(--accent)",
                  color: "var(--accent-text)",
                  fontSize: sizes.body,
                }}
              >
                Create
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFolder(null)}
              className="px-4 py-2 rounded-full transition"
              style={{
                background:
                  activeFolder === null ? "var(--accent)" : "var(--bg-card)",
                color:
                  activeFolder === null
                    ? "var(--accent-text)"
                    : "var(--text-primary)",
                fontSize: sizes.context,
              }}
            >
              All ({itemsInTab.length})
            </button>
            {folders.map((f) => {
              const count = itemsInTab.filter((b) => b.folder === f.id).length;
              return (
                <div key={f.id} className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveFolder(f.id)}
                    className="px-4 py-2 rounded-full transition"
                    style={{
                      background:
                        activeFolder === f.id
                          ? "var(--accent)"
                          : "var(--bg-card)",
                      color:
                        activeFolder === f.id
                          ? "var(--accent-text)"
                          : "var(--text-primary)",
                      fontSize: sizes.context,
                    }}
                  >
                    {f.name} ({count})
                  </button>
                  {activeFolder === f.id && (
                    <button
                      onClick={() => deleteFolder(f.id)}
                      className="transition hover:opacity-80"
                      style={{
                        color: "var(--text-muted)",
                        fontSize: sizes.context,
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bookmarks */}
        {filteredBookmarks.length === 0 ? (
          <div
            className="rounded-3xl p-12 text-center"
            style={{ background: "var(--bg-card)" }}
          >
            <p style={{ color: "var(--text-muted)", fontSize: sizes.body }}>
              {activeFolder === null
                ? tab === "verses"
                  ? "No saved verses yet."
                  : "No saved names yet. Save a Name of Allah from any emotion page."
                : "Nothing in this folder yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookmarks.map((b) => (
              <div
                key={b.ref}
                className="rounded-2xl p-6"
                style={{ background: "var(--bg-card)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="font-medium"
                    style={{ color: "var(--accent)", fontSize: sizes.context }}
                  >
                    {b.surah_name || (b.type === "name" ? "Name of Allah" : "")}{" "}
                    {b.ref}
                  </span>
                  <button
                    onClick={() => removeBookmark(b.ref)}
                    className="transition hover:opacity-80"
                    style={{
                      color: "var(--text-muted)",
                      fontSize: sizes.context,
                    }}
                  >
                    Remove
                  </button>
                </div>
                <p
                  className="arabic text-right mb-4"
                  style={{ fontSize: sizes.main }}
                >
                  {b.arabic}
                </p>
                <p
                  className="leading-relaxed"
                  style={{ color: "var(--text-secondary)", fontSize: sizes.body }}
                >
                  {b.translation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}