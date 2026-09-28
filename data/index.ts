// Topics
export {
  topics,
  topicsIndex,
  getTopic,
  getAllTopics,
  type Topic,
  type TopicIndexItem,
  type Verse,
  type WordByWord,
  type Evidence,
  type SocraticDropdown,
} from "./topics-loader";

// Emotions
export {
  emotions,
  emotionsIndex,
  getEmotion,
  getAllEmotions,
  getEmotionsByCategory,
  type Emotion,
  type EmotionIndexItem,
  type EmotionVerse,
  type NameOfAllah,
  type EvidenceVerse,
} from "./emotions-loader";

// Questions
export {
  questions,
  questionsIndex,
  getQuestion,
  getAllQuestions,
  getQuestionsByTopic,
  type Question,
  type QuestionIndexItem,
  type QuestionSection,
  type QuestionEvidence,
} from "./questions-loader";

// Dhikr
export {
  dhikr,
  dhikrIndex,
  getDhikr,
  getAllDhikr,
  type Dhikr,
  type DhikrIndexItem,
  type DhikrVerse,
  type DhikrMoment,
} from "./dhikr-loader";

// Qasas
export {
  qasas,
  qasasIndex,
  getQasas,
  getAllQasas,
  type Qasas,
  type QasasIndexItem,
  type QasasSection,
  type QasasAyah,
} from "./qasas-loader";

// Share
export {
  shareStyles,
  shareSizes,
  type ShareStyle,
  type ShareSize,
} from "./share-styles";

// Quran
export {
  surahs,
  surahsIndex,
  getSurah,
  getAllSurahs,
  findAyahsByRoot,
  type Surah,
  type SurahIndexItem,
  type QuranAyah,
  type QuranWord,
} from "./quran-loader";

// ═══════════════════════════════════════════════════════════════
//  GLOBAL ROOT SEARCH — searches EVERYWHERE
//  Quran surahs + Topics + Emotions + Dhikr + Qasas + Questions
// ═══════════════════════════════════════════════════════════════

import { topics } from "./topics-loader";
import { surahs } from "./quran-loader";

export type RootMatch = {
  ref: string;
  surah_name: string;
  arabic: string;
  translation: string;
  source: string;
};

export function findAyahsByRootGlobal(root: string): RootMatch[] {
  const results: RootMatch[] = [];
  const seen = new Set<string>();

  // 1. Quran surahs
  Object.values(surahs).forEach((surah) => {
    surah.ayahs.forEach((ayah) => {
      ayah.word_by_word.forEach((word) => {
        if (word.root === root) {
          const key = `${surah.surah}:${ayah.ayah}-${ayah.arabic}`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push({
              ref: `${surah.surah}:${ayah.ayah}`,
              surah_name: surah.name_transliteration,
              arabic: ayah.arabic,
              translation: ayah.translation_en,
              source: "Quran",
            });
          }
        }
      });
    });
  });

  // 2. Topics
  Object.entries(topics).forEach(([slug, topic]) => {
    topic.verses.forEach((v) => {
      v.word_by_word.forEach((w) => {
        if (w.root === root) {
          const key = `${v.surah}:${v.ayah}-${v.arabic_text}`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push({
              ref: `${v.surah}:${v.ayah}`,
              surah_name: v.surah_name_en,
              arabic: v.arabic_text,
              translation: v.translation_en,
              source: `Topic: ${topic.topic_title}`,
            });
          }
        }
      });
    });
  });

  return results;
}

// ═══════════════════════════════════════════════════════════════
//  OLD FUNCTIONS — kept for backward compatibility
// ═══════════════════════════════════════════════════════════════

export function findVersesByRoot(root: string) {
  const results: Array<{
    ref: string;
    surah_name: string;
    arabic: string;
    translation: string;
    topic_slug: string;
  }> = [];

  Object.entries(topics).forEach(([slug, topic]) => {
    topic.verses.forEach((v) => {
      v.word_by_word.forEach((w) => {
        if (w.root === root) {
          results.push({
            ref: `${v.surah}:${v.ayah}`,
            surah_name: v.surah_name_en,
            arabic: v.arabic_text,
            translation: v.translation_en,
            topic_slug: slug,
          });
        }
      });
    });
  });

  return results;
}

export function searchVerses(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: Array<{
    ref: string;
    surah_name: string;
    arabic: string;
    translation: string;
    topic_slug: string;
  }> = [];

  Object.entries(topics).forEach(([slug, topic]) => {
    topic.verses.forEach((v) => {
      if (
        v.translation_en.toLowerCase().includes(q) ||
        v.surah_name_en.toLowerCase().includes(q) ||
        v.arabic_text.includes(query)
      ) {
        results.push({
          ref: `${v.surah}:${v.ayah}`,
          surah_name: v.surah_name_en,
          arabic: v.arabic_text,
          translation: v.translation_en,
          topic_slug: slug,
        });
      }
    });
  });

  return results;
}