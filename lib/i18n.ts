export type Lang = "ko" | "en";

export const LANGS: Lang[] = ["ko", "en"];

export const LABELS: Record<Lang, Record<string, string>> = {
  ko: {
    progress: "진척도",
    goal: "목표",
    components: "구성",
    keyExperience: "주요 경험",
    current: "현재",
    loadingVideo: "▶ loading video…",
  },
  en: {
    progress: "Progress",
    goal: "Goal",
    components: "Components",
    keyExperience: "Key Experience",
    current: "Present",
    loadingVideo: "▶ loading video…",
  },
};

export function t(lang: Lang, key: string): string {
  return LABELS[lang][key] ?? key;
}
