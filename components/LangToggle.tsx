"use client";

import { useLayoutEffect } from "react";
import { applyLang, readLang, saveLang, type Lang } from "@/lib/lang";
import { T, messages } from "@/lib/i18n";

function setLang(lang: Lang) {
  applyLang(lang);
  document.title = messages[lang]["meta.title"];
}

export function LangToggle() {
  // In development React resets <html> attributes on its remount; put the choice back. No-op in production.
  useLayoutEffect(() => setLang(readLang()), []);

  function toggle() {
    const next: Lang = document.documentElement.lang === "en" ? "ar" : "en";
    setLang(next);
    saveLang(next);
  }

  return (
    <button className="btn btn-quiet" type="button" onClick={toggle}>
      <T k="lang.switch" />
    </button>
  );
}
