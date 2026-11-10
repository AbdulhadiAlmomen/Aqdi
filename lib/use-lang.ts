"use client";

import { useSyncExternalStore } from "react";
import type { Lang } from "./lang";

// The page's current language, for the few places that can't hold two <span>s
// (a <select>'s options, input placeholders). Follows the language switch live.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  return () => observer.disconnect();
}

export function useLang(): Lang {
  return useSyncExternalStore(
    subscribe,
    () => (document.documentElement.lang === "en" ? "en" : "ar"),
    () => "ar",
  );
}
