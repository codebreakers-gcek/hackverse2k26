import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgressCircle } from "@/components/layout/ScrollProgressCircle";
import { AmbientCodeShapes } from "@/components/layout/AmbientCodeShapes";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { GsapLoader } from "@/components/ui/GsapLoader";

const thuast = localFont({
  src: "../public/font/Thuast-Demo.otf",
  variable: "--font-thuast",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FFD93D",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "HACKVERSE '26 // Tech Fest & Hackathon | CodeBreakers GCEK",
  description:
    "Official STATE Tech Fest & Hackathon organized by CODEBREAKERS, Government College of Engineering Kalahandi (GCEK). 36-hour sprint, ₹1,50,000+ prize pool, AI, Web, Cyber & IoT arenas.",
  keywords: [
    "CodeBreakers",
    "GCEK",
    "Government College of Engineering Kalahandi",
    "HACKVERSE 2026",
    "Hack Nova",
    "Hackathon Odisha",
    "College Tech Fest",
    "Competitive Programming",
  ],
  authors: [{ name: "CodeBreakers GCEK", url: "https://www.codebreakersgcek.tech" }],
  openGraph: {
    title: "HACKVERSE '26 - CodeBreakers GCEK",
    description: "STATE Tech Fest & Hackathon at Government College of Engineering Kalahandi.",
    url: "https://www.codebreakersgcek.tech",
    siteName: "CodeBreakers GCEK Tech Fest",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${thuast.variable} bg-neo-bg text-black min-h-screen flex flex-col font-sans selection:bg-neo-secondary selection:text-black relative`}>
        <GsapLoader />
        <SmoothScrollProvider>
          <CustomCursor />
          <AmbientCodeShapes />
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
          <ScrollProgressCircle />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
