import ar from "@/messages/ar.json";
import en from "@/messages/en.json";

export type MessageKey = keyof typeof ar;

// Fails the type check if English is missing a key that Arabic has.
const english: Record<MessageKey, string> = en;

export const messages = { ar, en: english };

// Renders a message in both languages; CSS shows the one matching <html lang>.
export function T({ k }: { k: MessageKey }) {
  return (
    <>
      <span lang="ar">{ar[k]}</span>
      <span lang="en">{english[k]}</span>
    </>
  );
}
