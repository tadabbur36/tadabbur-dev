import anxietyData from "./topics/anxiety.json";
import sadnessData from "./topics/sadness.json";
import lonelinessData from "./topics/loneliness.json";
import gratitudeData from "./topics/gratitude.json";
import hopeData from "./topics/hope.json";
import topicsIndexData from "./topics-index.json";

export type WordByWord = {
  arabic: string;
  root: string;
  meaning_en: string;
};

export type Evidence = {
  verse_ref: string;
  arabic: string;
  translation_en: string;
  why_cited: string;
};

export type SocraticDropdown = {
  question: string;
  answer: string;
  evidence: Evidence[];
  sub_dropdowns?: SocraticDropdown[];
};

export type Verse = {
  surah: number;
  ayah: number;
  surah_name_en: string;
  arabic_text: string;
  translation_en: string;
  word_by_word: WordByWord[];
  socratic_dropdowns: SocraticDropdown[];
};

export type Topic = {
  topic_id: string;
  topic_title: string;
  topic_icon?: string;
  topic_description?: string;
  disclaimer?: string;
  reassurance_anchor: { verse_ref: string; text_en: string };
  verses: Verse[];
};

export type TopicIndexItem = {
  slug: string;
  title: string;
  icon: string;
  description: string;
  verse_count: number;
};

export const topics: Record<string, Topic> = {
  anxiety: anxietyData as Topic,
  sadness: sadnessData as Topic,
  loneliness: lonelinessData as Topic,
  gratitude: gratitudeData as Topic,
  hope: hopeData as Topic,
};

export const topicsIndex: TopicIndexItem[] = topicsIndexData.topics;

export function getTopic(slug: string): Topic | undefined {
  return topics[slug];
}

export function getAllTopics(): TopicIndexItem[] {
  return topicsIndex;
}