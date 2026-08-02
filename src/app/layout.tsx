import type { Metadata } from "next";
import {
  Bebas_Neue,
  DM_Serif_Display,
  Geist,
  Geist_Mono,
} from "next/font/google";
import { CommandPalette } from "@/components/shell/command-palette";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = DM_Serif_Display({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const monument = Bebas_Neue({
  variable: "--font-monument",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Living UI — One Visit. One Mutation.",
    template: "%s · Living UI",
  },
  description:
    "A collective-evolution frontend showcase. Cast curated spells. Shape the Head of Main.",
  metadataBase: new URL("https://living-ui.vercel.app"),
  openGraph: {
    title: "Living UI",
    description: "One Visit. One Mutation. Many Visits. One Head.",
    type: "website",
    images: [{ url: "/og", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Living UI",
    description: "One Visit. One Mutation. Many Visits. One Head.",
    images: ["/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${monument.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        {children}
        <CommandPalette />
      </body>
    </html>
  );
}
