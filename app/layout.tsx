import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://noisemediagroup.github.io/steph-indian-amends/"),
  title: "Results, then commentary. | Noise Client Reporting",
  description:
    "A client performance report that walks overall results, each channel, each campaign, winning creatives and next steps — in that order.",
  openGraph: {
    title: "Results, then commentary.",
    description:
      "Overall results, channel by channel, campaign, creatives, learnings, next phase.",
    images: [
      {
        url: "og.png",
        width: 1730,
        height: 909,
        alt: "Performance, explained — Noise × Indian Motorcycle, July 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Results, then commentary.",
    description:
      "Overall results, channel by channel, campaign, creatives, learnings, next phase.",
    images: ["og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${barlowCondensed.variable}`}>
        {children}
      </body>
    </html>
  );
}
