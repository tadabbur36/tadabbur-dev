import anxiousData from "./emotions/anxious.json";
import sadData from "./emotions/sad.json";
import lonelyData from "./emotions/lonely.json";
import gratefulData from "./emotions/grateful.json";
import hopefulData from "./emotions/hopeful.json";
import emotionsIndexData from "./emotions-index.json";

export type EmotionVerse = {
  verse_ref: string;
  arabic: string;
  translation_en: string;
  context: string;
};

export type EvidenceVerse = {
  verse_ref: string;
  arabic: string;
  translation_en: string;
};

export type NameOfAllah = {
  arabic: string;
  transliteration: string;
  meaning_en: string;
  explanation: string;
  evidence_verses: EvidenceVerse[];
};

export type Emotion = {
  id: string;
  label: string;
  category: "difficult" | "positive" | "situation" | "spiritual";
  icon: string;
  acknowledgment: string;
  verses: EmotionVerse[];
  names_of_allah: NameOfAllah[];
  personal_question: string;
};

export type EmotionIndexItem = {
  slug: string;
  label: string;
  category: string;
  icon: string;
};

export const emotions: Record<string, Emotion> = {
  anxious: anxiousData as Emotion,
  sad: sadData as Emotion,
  lonely: lonelyData as Emotion,
  grateful: gratefulData as Emotion,
  hopeful: hopefulData as Emotion,
};

export const emotionsIndex: EmotionIndexItem[] = emotionsIndexData.emotions;

export function getEmotion(slug: string): Emotion | undefined {
  return emotions[slug];
}

export function getAllEmotions(): EmotionIndexItem[] {
  return emotionsIndex;
}

export function getEmotionsByCategory(category: string): EmotionIndexItem[] {
  return emotionsIndex.filter((e) => e.category === category);
}