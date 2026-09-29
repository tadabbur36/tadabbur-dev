import yusufData from "./qasas/yusuf.json";
import musaData from "./qasas/musa.json";
import maryamData from "./qasas/maryam.json";
import ibrahimData from "./qasas/ibrahim.json";
import yunusData from "./qasas/yunus.json";
import baniIsraelData from "./qasas/bani-israel.json";
import adamData from "./qasas/adam.json";
import nuhData from "./qasas/nuh.json";
import hudData from "./qasas/hud.json";
import salihData from "./qasas/salih.json";
import lutData from "./qasas/lut.json";
import ayyubData from "./qasas/ayyub.json";
import musaKhidrData from "./qasas/musa-khidr.json";
import dawudJalutData from "./qasas/dawud-jalut.json";
import sulaimanData from "./qasas/sulaiman.json";
import ashabAlKahfData from "./qasas/ashab-al-kahf.json";
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
  "bani-israel": baniIsraelData as Qasas,
  adam: adamData as Qasas,
  nuh: nuhData as Qasas,
  hud: hudData as Qasas,
  salih: salihData as Qasas,
  lut: lutData as Qasas,
  ayyub: ayyubData as Qasas,
  "musa-khidr": musaKhidrData as Qasas,
  "dawud-jalut": dawudJalutData as Qasas,
  sulaiman: sulaimanData as Qasas,
  "ashab-al-kahf": ashabAlKahfData as Qasas,
};

export const qasasIndex: QasasIndexItem[] = qasasIndexData.qasas;

export function getQasas(slug: string): Qasas | undefined {
  return qasas[slug];
}

export function getAllQasas(): QasasIndexItem[] {
  return qasasIndex;
}