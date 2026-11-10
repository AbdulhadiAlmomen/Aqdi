import type { Metadata, Viewport } from "next";
import { LANG_BOOT_SCRIPT } from "@/lib/lang";
import { messages } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: messages.ar["meta.title"],
  description:
    "عقدي منصة تجمع مكاتب العقار ومستأجريها في مكان واحد: العقود والإيجار والصيانة والتواصل. Aqdi brings Saudi real estate offices and their tenants together in one place.",
};

export const viewport: Viewport = {
  colorScheme: "light",
};

// Arabic and right-to-left by default. The boot script switches to English before
// the first paint for visitors who chose it, so every page can stay static.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LANG_BOOT_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Same Google Fonts request as the original site, so the type renders identically.
            The rule below targets the old pages/ router; in the App Router the root layout covers every page. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=El+Messiri:wght@500;600;700&family=Tajawal:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
