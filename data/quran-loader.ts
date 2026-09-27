import alFatihaData from "./quran/001-al-fatiha.json";
import alIkhlasData from "./quran/112-al-ikhlas.json";
import alFalaqData from "./quran/113-al-falaq.json";
import anNasData from "./quran/114-an-nas.json";
import alKawtharData from "./quran/108-al-kawthar.json";
import quranIndexData from "./quran-index.json";

export type QuranWord = {
  arabic: string;
  root: string;
  meaning_en: string;
};

export type QuranAyah = {
  ayah: number;
  arabic: string;
  translation_en: string;
  word_by_word: QuranWord[];
};

export type Surah = {
  surah: number;
  name_en: string;
  name_ar: string;
  name_transliteration: string;
  meaning_en: string;
  revelation_type: string;
  total_ayahs: number;
  ayahs: QuranAyah[];
};

export type SurahIndexItem = {
  surah: number;
  name_en: string;
  name_ar: string;
  name_transliteration: string;
  meaning_en: string;
  revelation_type: string;
  total_ayahs: number;
};

export const surahs: Record<number, Surah> = {
  1: alFatihaData as Surah,
  108: alKawtharData as Surah,
  112: alIkhlasData as Surah,
  113: alFalaqData as Surah,
  114: anNasData as Surah,
};

export const surahsIndex: SurahIndexItem[] = quranIndexData.surahs;

export function getSurah(number: number): Surah | undefined {
  return surahs[number];
}

export function getAllSurahs(): SurahIndexItem[] {
  return surahsIndex;
}

export function findAyahsByRoot(root: string) {
  const results: Array<{
    ref: string;
    surah_name: string;
    arabic: string;
    translation: string;
  }> = [];

  Object.values(surahs).forEach((surah) => {
    surah.ayahs.forEach((ayah) => {
      ayah.word_by_word.forEach((word) => {
        if (word.root === root) {
          results.push({
            ref: `${surah.surah}:${ayah.ayah}`,
            surah_name: surah.name_transliteration,
            arabic: ayah.arabic,
            translation: ayah.translation_en,
          });
        }
      });
    });
  });

  return results;
}