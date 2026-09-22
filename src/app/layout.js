import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: { default: "Hellish Views", template: "%s · Hellish Views" },
  description: "Horror films, TV and books, reviewed and scored. Structural pass.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
