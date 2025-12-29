import SessionProvider from "@/components/providers/SessionProvider";
import { META_THEME_COLORS, SITE_INFO } from "@/config/site";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  adjustFontFallback: false
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  adjustFontFallback: false
});



export const metadata: Metadata = {
  title: {
    default: `${SITE_INFO.name}`,
    template: `%s · ${SITE_INFO.name}`,
  },
  description: SITE_INFO.description,
  applicationName: SITE_INFO.name,
  keywords: SITE_INFO.keywords,
  creator: SITE_INFO.name,
  authors: [{ name: SITE_INFO.name, url: SITE_INFO.url }],
  publisher: SITE_INFO.name,
  metadataBase: new URL(SITE_INFO.url),
  alternates: {
    canonical: SITE_INFO.url,
  },
  openGraph: {
    title: SITE_INFO.name,
    description: SITE_INFO.description,
    url: SITE_INFO.url,
    siteName: SITE_INFO.name,
    type: "website",
    images: [{ url: SITE_INFO.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_INFO.name,
    description: SITE_INFO.description,
    images: [SITE_INFO.ogImage],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
  themeColor: [{ media: "(prefers-color-scheme: light)", color: META_THEME_COLORS.light }, { media: "(prefers-color-scheme: dark)", color: META_THEME_COLORS.dark }],
};




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
