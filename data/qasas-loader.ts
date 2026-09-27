import yusufData from "./qasas/yusuf.json";
import musaData from "./qasas/musa.json";
import maryamData from "./qasas/maryam.json";
import ibrahimData from "./qasas/ibrahim.json";
import yunusData from "./qasas/yunus.json";
import qasasIndexData from "./qasas-index.json";

export type QasasAyah = {
  verse_ref: string;
  arabic: string;
  translation_en: string;
};

export type QasasSection = {
  heading: string;
  ayahs: QasasAyah[];
};

export type Qasas = {
  id: string;
  title: string;
  subtitle: string;
  surah_refs: number[];
  total_ayahs: number;
  sections: QasasSection[];
};

export type QasasIndexItem = {
  slug: string;
  title: string;
  subtitle: string;
  total_ayahs: number;
};

export const qasas: Record<string, Qasas> = {
  yusuf: yusufData as Qasas,
  musa: musaData as Qasas,
  maryam: maryamData as Qasas,
  ibrahim: ibrahimData as Qasas,
  yunus: yunusData as Qasas,
};

export const qasasIndex: QasasIndexItem[] = qasasIndexData.qasas;

export function getQasas(slug: string): Qasas | undefined {
  return qasas[slug];
}

export function getAllQasas(): QasasIndexItem[] {
  return qasasIndex;
}