import ar from "@/messages/ar.json";
import en from "@/messages/en.json";

export type MessageKey = keyof typeof ar;

// Fails the type check if English is missing a key that Arabic has.
const english: Record<MessageKey, string> = en;

export const messages = { ar, en: english };

function fill(text: string, vars?: Record<string, string>) {
  return vars ? text.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? "") : text;
}

// Renders a message in both languages; CSS shows the one matching <html lang>.
// `vars` fills placeholders like {name}; React escapes them like any text.
export function T({ k, vars }: { k: MessageKey; vars?: Record<string, string> }) {
  return (
    <>
      <span lang="ar">{fill(ar[k], vars)}</span>
      <span lang="en">{fill(english[k], vars)}</span>
    </>
  );
}
