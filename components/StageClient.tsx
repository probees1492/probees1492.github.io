"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";

const SlideStage = dynamic(() => import("./SlideStage"), { ssr: false });

const LANG_KEY = "seo-journey-lang";

export default function StageClient() {
  const [lang, setLang] = useState<Lang>("ko");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY) as Lang | null;
      if (saved === "ko" || saved === "en") setLang(saved);
    } catch {}
    setReady(true);
  }, []);

  function changeLang(l: Lang) {
    setLang(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {}
  }

  if (!ready) return null;

  return (
    <>
      <SlideStage lang={lang} />
      <LanguageSwitcher lang={lang} onChange={changeLang} />
    </>
  );
}

function LanguageSwitcher({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="lang-switcher" role="group" aria-label="Language">
      <button
        type="button"
        className={lang === "ko" ? "active" : ""}
        onClick={() => onChange("ko")}
      >
        KO
      </button>
      <button
        type="button"
        className={lang === "en" ? "active" : ""}
        onClick={() => onChange("en")}
      >
        EN
      </button>
    </div>
  );
}
