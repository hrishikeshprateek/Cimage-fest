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

const shareDescription =
  "Bihar's biggest tech, culture & innovation festival — hackathons, robotics, keynote talks and after-dark concerts. March 13–15, 2027.";

export const metadata: Metadata = {
  title: "CIMAGE Fest — Tech, Culture & Innovation Festival",
  description: shareDescription,
  openGraph: {
    title: "CIMAGE Fest",
    description: shareDescription,
    siteName: "CIMAGE Fest",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CIMAGE Fest",
    description: shareDescription,
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
