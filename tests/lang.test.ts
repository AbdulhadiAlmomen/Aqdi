import { describe, expect, it } from "vitest";
import { browserLang } from "@/lib/lang";

// First visit, no choice saved yet: the browser's language list decides.
describe("language from the browser", () => {
  it("opens Arabic for Arabic browsers", () => {
    expect(browserLang(["ar-SA"])).toBe("ar");
    expect(browserLang(["ar", "en-US"])).toBe("ar");
  });
  it("opens English for English browsers, even with Arabic further down the list", () => {
    expect(browserLang(["en-US"])).toBe("en");
    expect(browserLang(["en-GB", "ar-SA"])).toBe("en");
  });
  it("opens English for other languages, unless Arabic comes before English", () => {
    expect(browserLang(["fr-FR"])).toBe("en");
    expect(browserLang(["ur-PK", "hi-IN"])).toBe("en");
    expect(browserLang(["fr-FR", "ar"])).toBe("ar");
  });
  it("falls back to Arabic when the browser gives no languages", () => {
    expect(browserLang([])).toBe("ar");
    expect(browserLang([undefined])).toBe("ar");
  });
});
