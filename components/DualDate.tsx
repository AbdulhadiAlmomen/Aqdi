import { formatDual } from "@/lib/dates";

// A date in both calendars, Hijri first, in both languages (CSS shows the page's language).
export function DualDate({ iso }: { iso: string }) {
  return (
    <>
      <span lang="ar">{formatDual(iso, "ar")}</span>
      <span lang="en">{formatDual(iso, "en")}</span>
    </>
  );
}
