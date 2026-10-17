import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

import SmoothScroll from "@/components/layout/SmoothScroll";

import MuraliLoader from "@/components/ui/MuraliLoader";
import GhostFibersBackground from "@/components/ui/GhostFibersBackground";

export const metadata: Metadata = {
  title: "Murali Resort | Premium Resort & Convention Center",
  description: "A premium destination for weddings, celebrations, corporate events and unforgettable gatherings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-[#FBF9F5] text-stone-900 overflow-x-clip w-full max-w-full relative`}
      >
        <MuraliLoader />
        <GhostFibersBackground />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
