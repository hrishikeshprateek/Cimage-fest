import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
