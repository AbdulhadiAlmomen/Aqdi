// Dates are kept as plain "YYYY-MM-DD" (Gregorian) strings and always formatted in UTC,
// so a date never shifts by a day between the server and the browser.
// Hijri is the Umm al-Qura calendar, the one Ejar uses.

const HIJRI_EN = ["Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", "Jumada al-Ula", "Jumada al-Akhirah",
  "Rajab", "Shaban", "Ramadan", "Shawwal", "Dhu al-Qadah", "Dhu al-Hijjah"];

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

export function toUtcDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`);
}

export function isValidIsoDate(iso: string | null | undefined): iso is string {
  if (!iso || !ISO.test(iso)) return false;
  const d = toUtcDate(iso);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === iso;
}

function parts(iso: string, locale: string, options: Intl.DateTimeFormatOptions) {
  const list = new Intl.DateTimeFormat(locale, { timeZone: "UTC", ...options }).formatToParts(toUtcDate(iso));
  return (type: string) => list.find((p) => p.type === type)?.value ?? "";
}

// The Umm al-Qura date for a Gregorian day, as "YYYY-MM-DD" with Western digits.
export function hijriIso(iso: string) {
  const get = parts(iso, "en-u-ca-islamic-umalqura-nu-latn", { day: "2-digit", month: "2-digit", year: "numeric" });
  return `${get("year").replace(/\D/g, "")}-${get("month")}-${get("day")}`;
}

// Accepts a Hijri date as printed ("١٩/٠٣/١٤٤٨", "19/3/1448", "1448-03-19") and returns "YYYY-MM-DD".
export function normalizeHijri(text: string | null | undefined) {
  if (!text) return null;
  const western = text.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
  const nums = western.match(/\d+/g);
  if (!nums || nums.length < 3) return null;
  const [a, b, c] = nums.map(Number);
  const [y, m, d] = a > 1000 ? [a, b, c] : [c, b, a];
  if (m < 1 || m > 12 || d < 1 || d > 30) return null;
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

// "١ رجب ١٤٤٨هـ · 10 ديسمبر 2026م" / "1 Rajab 1448 · 10 Dec 2026" (CLAUDE.md date rule).
export function formatDual(iso: string, lang: "ar" | "en") {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  if (lang === "ar") {
    const h = parts(iso, "ar-SA-u-ca-islamic-umalqura-nu-arab", opts);
    const g = parts(iso, "ar-SA-u-ca-gregory-nu-latn", opts);
    return `${h("day")} ${h("month")} ${h("year").replace(/\s*هـ$/, "")}هـ · ${g("day")} ${g("month")} ${g("year")}م`;
  }
  const h = parts(iso, "en-u-ca-islamic-umalqura-nu-latn", { day: "numeric", month: "numeric", year: "numeric" });
  const g = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" })
    .format(toUtcDate(iso))
    .replace("Sept", "Sep");
  return `${h("day")} ${HIJRI_EN[Number(h("month")) - 1]} ${h("year").replace(/\D/g, "")} · ${g}`;
}

// Whole and part months from start to end inclusive (a 15 Mar – 14 Mar lease is 12 months).
export function leaseMonths(startIso: string, endIso: string) {
  const start = toUtcDate(startIso);
  const end = toUtcDate(endIso);
  end.setUTCDate(end.getUTCDate() + 1);
  const months = (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + (end.getUTCMonth() - start.getUTCMonth());
  return months + (end.getUTCDate() - start.getUTCDate()) / 30;
}
