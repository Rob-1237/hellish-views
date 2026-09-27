import { Big_Shoulders, Cinzel_Decorative } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { site } from "@/data/site";

// Stand-in for HAL Gap until it is licensed. See --font-display in tokens.css.
const standin = Big_Shoulders({ subsets: ["latin"], variable: "--font-standin", display: "swap" });
// Headings, on trial (2026-09-27). Not variable, so the weights are listed.
const cinzel = Cinzel_Decorative({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-cinzel", display: "swap" });

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_GB",
    url: "/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB" data-scroll-behavior="smooth" className={`${standin.variable} ${cinzel.variable}`}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
