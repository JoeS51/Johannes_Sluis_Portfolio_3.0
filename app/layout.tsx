import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { InkNav } from "./ink-nav";
import { siteDescription, siteName, siteUrl } from "./site";
import "./globals.css";

// A black-and-white spec-sheet site with some Japanese.

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "700"],
  preload: false,
  variable: "--font-noto-jp",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: `%s | ${siteName}` },
  description: siteDescription,
  authors: [{ name: siteName, url: siteUrl }],
  openGraph: { type: "website", siteName, title: siteName, description: siteDescription, url: "/", locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

const analyticsId = "G-FFSPXWGQ2K";

// Runs before the page paints so a dark reader never sees a white flash: a stored choice wins, otherwise the system setting.
const themeScript = `try{var t=localStorage.getItem("ink-theme")}catch(e){}document.documentElement.dataset.inkTheme=t==="dark"||t==="light"?t:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansJP.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <div className="ink">
          <InkNav />
          <main className="ink-main">{children}</main>
        </div>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} strategy="afterInteractive" />
        <Script id="analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${analyticsId}");`}
        </Script>
      </body>
    </html>
  );
}
