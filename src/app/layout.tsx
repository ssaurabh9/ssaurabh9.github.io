import type { Metadata } from "next";
import { DM_Serif_Display, DM_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Saurabh Sachdev — AI Solutions Architect",
  description:
    "Portfolio of Saurabh Sachdev, AI Solutions Architect. Building AI systems that go to production.",
  keywords: [
    "AI",
    "Machine Learning",
    "Solutions Architect",
    "RAG",
    "LangGraph",
    "LLM",
    "Saurabh Sachdev",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSerif.variable} ${dmMono.variable} ${dmSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
