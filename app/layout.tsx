import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { InkNav } from "./ink-nav";
import { siteDescription, siteName, siteUrl } from "./site";
import "./globals.css";

// A black-and-white spec-sheet site with some Japanese.

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Subset to just the characters the site uses; regenerate with `node scripts/subset-jp-font.mjs`.
const notoSansJP = localFont({
  src: [
    { path: "./_fonts/noto-sans-jp-400.woff2", weight: "400" },
    { path: "./_fonts/noto-sans-jp-700.woff2", weight: "700" },
  ],
  display: "swap",
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

// Runs before the page paints so nobody sees the wrong theme flash. Their stored choice wins, otherwise the OS setting.
const themeScript = `try{var t=localStorage.getItem("ink-theme")}catch(e){}document.documentElement.dataset.inkTheme=t==="dark"?"dark":"light"`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Lets feed readers find the feed from any page's URL. */}
        <link rel="alternate" type="application/rss+xml" title={siteName} href="/rss.xml" />
      </head>
      <body className={`${inter.variable} ${notoSansJP.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <div className="ink">
          <InkNav />
          <main className="ink-main">{children}</main>
        </div>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} strategy="lazyOnload" />
        <Script id="analytics" strategy="lazyOnload">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${analyticsId}");`}
        </Script>
      </body>
    </html>
  );
}
