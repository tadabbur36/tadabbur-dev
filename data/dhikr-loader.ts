import subhanallahData from "./dhikr/subhanallah.json";
import alhamdulillahData from "./dhikr/alhamdulillah.json";
import allahuAkbarData from "./dhikr/allahu-akbar.json";
import laIlahaIllallahData from "./dhikr/la-ilaha-illallah.json";
import astaghfirullahData from "./dhikr/astaghfirullah.json";
import dhikrIndexData from "./dhikr-index.json";

export type DhikrVerse = {
  verse_ref: string;
  arabic: string;
  translation_en: string;
  context: string;
};

export type DhikrMoment = {
  moment: string;
  verse_ref: string;
  arabic: string;
  translation_en: string;
};

export type Dhikr = {
  id: string;
  phrase_arabic: string;
  transliteration: string;
  meaning_en: string;
  deep_meaning: string;
  root_letters: string;
  why_this_phrase: string;
  verses: DhikrVerse[];
  when_to_say: DhikrMoment[];
};

export type DhikrIndexItem = {
  slug: string;
  transliteration: string;
  phrase_arabic: string;
  meaning_en: string;
};

export const dhikr: Record<string, Dhikr> = {
  subhanallah: subhanallahData as Dhikr,
  alhamdulillah: alhamdulillahData as Dhikr,
  "allahu-akbar": allahuAkbarData as Dhikr,
  "la-ilaha-illallah": laIlahaIllallahData as Dhikr,
  astaghfirullah: astaghfirullahData as Dhikr,
};

export const dhikrIndex: DhikrIndexItem[] = dhikrIndexData.dhikr;

export function getDhikr(slug: string): Dhikr | undefined {
  return dhikr[slug];
}

export function getAllDhikr(): DhikrIndexItem[] {
  return dhikrIndex;
}