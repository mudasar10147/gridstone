import type { Metadata } from "next";
import { Exo_2, Geist, Rajdhani } from "next/font/google";
import { SITE_NAME } from "@/constants/site";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Headline face: only the heavy italic is used ("WE BUILD WORLDS").
const exo = Exo_2({
  variable: "--font-exo",
  subsets: ["latin"],
  style: "italic",
});

// Labels, buttons, card titles.
const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: SITE_NAME,
  description:
    "Gridstone Productions is a Roblox game studio building worlds that bring people together.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${exo.variable} ${rajdhani.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
