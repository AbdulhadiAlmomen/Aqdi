// The visitor's language choice. Pages render both languages and CSS shows one
// (see html[lang] rules in globals.css), so switching never needs a reload and
// every page can stay statically rendered.

export type Lang = "ar" | "en";

const KEY = "aqdi-lang";
const ONE_YEAR = 60 * 60 * 24 * 365;

// A choice the visitor made with the language switch always wins. Until they make one, the
// browser's preferred languages decide: the first Arabic or English one in the list, and English
// for any other language (someone browsing in French or Urdu is better served by English).
// Arabic only when the browser gives no languages at all.
export function readLang(): Lang {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "ar" || stored === "en") return stored;
  } catch {}
  const cookie = document.cookie.match(/(?:^|; )aqdi-lang=(ar|en)(?:;|$)/);
  if (cookie) return cookie[1] as Lang;
  return browserLang(navigator.languages?.length ? navigator.languages : [navigator.language]);
}

export function browserLang(languages: readonly (string | undefined)[]): Lang {
  const list = languages.filter(Boolean).map((l) => String(l).toLowerCase());
  for (const l of list) {
    if (l === "ar" || l.startsWith("ar-")) return "ar";
    if (l === "en" || l.startsWith("en-")) return "en";
  }
  return list.length ? "en" : "ar";
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
// Same rules as readLang(), inlined because it runs before any bundle loads.
export const BOOT_SCRIPT = `(function(){try{var l=null;try{l=localStorage.getItem("${KEY}")}catch(e){}if(l!=="ar"&&l!=="en"){var c=document.cookie.match(/(?:^|; )${KEY}=(ar|en)(?:;|$)/);l=c?c[1]:null}if(!l){var n=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language],i,x;for(i=0;i<n.length&&!l;i++){x=String(n[i]||"").toLowerCase();if(x==="ar"||x.indexOf("ar-")===0)l="ar";else if(x==="en"||x.indexOf("en-")===0)l="en"}if(!l)l=n.filter(Boolean).length?"en":"ar"}if(l==="en"){var d=document.documentElement;d.lang="en";d.dir="ltr"}}catch(e){}try{if(location.pathname==="/"){history.scrollRestoration="manual";if(location.hash)history.replaceState(history.state,"",location.pathname+location.search)}}catch(e){}})()`;
