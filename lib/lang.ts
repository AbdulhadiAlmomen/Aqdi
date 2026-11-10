// The visitor's language choice. Pages render both languages and CSS shows one
// (see html[lang] rules in globals.css), so switching never needs a reload and
// every page can stay statically rendered.

export type Lang = "ar" | "en";

const KEY = "aqdi-lang";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function readLang(): Lang {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "ar" || stored === "en") return stored;
  } catch {}
  return /(?:^|; )aqdi-lang=en(?:;|$)/.test(document.cookie) ? "en" : "ar";
}

export function applyLang(lang: Lang) {
  const root = document.documentElement;
  root.lang = lang;
  root.dir = lang === "ar" ? "rtl" : "ltr";
}

// Kept in localStorage (as the original site did) and in a cookie, so the server
// can read it later without the page flashing the other language.
export function saveLang(lang: Lang) {
  try {
    localStorage.setItem(KEY, lang);
  } catch {}
  document.cookie = `${KEY}=${lang}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
}

// Runs in <head> before the first paint, so English visitors never see an Arabic flash.
// On the homepage it also makes every load start at the top: no restored scroll position
// on refresh, and no jump to a leftover #section in the address.
export const BOOT_SCRIPT = `(function(){try{var l=localStorage.getItem("${KEY}");if(l!=="ar"&&l!=="en"){l=/(?:^|; )${KEY}=en(?:;|$)/.test(document.cookie)?"en":"ar"}if(l==="en"){var d=document.documentElement;d.lang="en";d.dir="ltr"}}catch(e){}try{if(location.pathname==="/"){history.scrollRestoration="manual";if(location.hash)history.replaceState(history.state,"",location.pathname+location.search)}}catch(e){}})()`;
