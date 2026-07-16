import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SideNav from "@/components/landing/SideNav";
import UtmCapture from "@/components/landing/UtmCapture";

// Google Tag Manager container + Google Ads (gtag.js). Same IDs as the main
// CIMAGE site. GTM_ID drives both the head loader and the <body> noscript.
const GTM_ID = "GTM-WCHC69L6";
const GOOGLE_ADS_ID = "AW-10885034048";
// Microsoft Clarity project (session recording / heatmaps).
const CLARITY_ID = "xnadpjcpiy";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CIMAGE Fest — Coming Soon",
  description: "Something big is on the way. CIMAGE Fest. Coming soon.",
  openGraph: {
    title: "CIMAGE Fest",
    description: "Something big is on the way. CIMAGE Fest. Coming soon.",
    siteName: "CIMAGE Fest",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CIMAGE Fest",
    description: "Something big is on the way. CIMAGE Fest. Coming soon.",
  },
};

export const viewport: Viewport = {
  themeColor: "#05010f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Google Tag Manager (noscript) — immediately after <body> */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Google Tag Manager — loaded as early as possible into <head> */}
        <Script id="gtm-base" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>

        {/* Google Ads global site tag (gtag.js) */}
        <Script
          id="gtag-ads-src"
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="beforeInteractive"
        />
        <Script id="gtag-ads-init" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GOOGLE_ADS_ID}');`}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="ms-clarity" strategy="beforeInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${CLARITY_ID}");`}
        </Script>

        {/* Capture UTM params from the landing URL for registration attribution */}
        <UtmCapture />

        {children}
        {/* Global left rail (desktop) / bottom nav (mobile) — present on every route */}
        <SideNav />
      </body>
    </html>
  );
}
