import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgressCircle } from "@/components/layout/ScrollProgressCircle";
import { AmbientCodeShapes } from "@/components/layout/AmbientCodeShapes";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { GsapLoader } from "@/components/ui/GsapLoader";
import { MinecraftAudioPlayer } from "@/components/ui/MinecraftAudioPlayer";
import { MinecraftSoundEffects } from "@/components/ui/MinecraftSoundEffects";

const thuast = localFont({
  src: "../public/font/Thuast-Demo.otf",
  variable: "--font-thuast",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FFD93D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.codebreakersgcek.tech"),
  title: {
    default: "HACKVERSE '26 // Flagship 24H State Tech Fest & Hackathon | CodeBreakers GCEK",
    template: "%s | HACKVERSE '26 - CodeBreakers GCEK",
  },
  description:
    "Official State-Level Flagship 24-Hour Hackathon & Tech Fest organized by CODEBREAKERS, Government College of Engineering Kalahandi (GCEK). ₹1,50,000+ prize pool across AI/ML, Web3, Cyber Security, Cloud, IoT & Open Innovation tracks.",
  keywords: [
    "HACKVERSE 2026",
    "HACKVERSE '26",
    "CodeBreakers GCEK",
    "CodeBreakers",
    "GCEK Kalahandi",
    "Government College of Engineering Kalahandi",
    "Hackathon Odisha",
    "National Hackathon 2026",
    "Tech Fest 2026",
    "Coding Competition",
    "AI ML Hackathon",
    "Web3 Blockchain Hackathon",
    "IoT Hackathon",
    "Cyber Security Competition",
    "Student Developer Festival",
    "Bhawanipatna Tech Fest",
  ],
  authors: [
    { name: "CodeBreakers GCEK", url: "https://www.codebreakersgcek.tech" },
    { name: "GCEK Bhawanipatna", url: "https://gcekbpatna.ac.in" },
  ],
  creator: "CodeBreakers Technical Society",
  publisher: "Government College of Engineering Kalahandi",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/cbhack.png", type: "image/png" },
      { url: "/cbhack.png", sizes: "192x192", type: "image/png" },
      { url: "/cbhack.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/cbhack.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/cbhack.png"],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.codebreakersgcek.tech",
    siteName: "HACKVERSE '26 // CodeBreakers GCEK",
    title: "HACKVERSE '26 | Flagship 24H State Tech Fest & Hackathon",
    description:
      "Join Central & Eastern India's most energetic hackathon at GCEK Kalahandi. 24-Hour sprint, ₹1,50,000+ prize pool, industry mentorship, free hostel accommodation & swags.",
    images: [
      {
        url: "/cbhack.png",
        width: 1200,
        height: 630,
        alt: "HACKVERSE '26 Official Logo - CodeBreakers GCEK",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@codebreakersgcek",
    creator: "@codebreakersgcek",
    title: "HACKVERSE '26 | Flagship 24H State Tech Fest & Hackathon",
    description:
      "24-Hour Hackathon & Tech Fest at GCEK Kalahandi. ₹1,50,000+ in prizes. Register your squad now!",
    images: ["/cbhack.png"],
  },
  alternates: {
    canonical: "https://www.codebreakersgcek.tech",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Event",
      "@id": "https://www.codebreakersgcek.tech/#event",
      "name": "HACKVERSE '26 - 24-Hour Flagship Hackathon",
      "description": "Official State-Level Flagship 24-Hour Hackathon & Tech Fest organized by CODEBREAKERS at Government College of Engineering Kalahandi.",
      "url": "https://www.codebreakersgcek.tech",
      "image": "https://www.codebreakersgcek.tech/cbhack.png",
      "startDate": "2026-09-18T09:00:00+05:30",
      "endDate": "2026-09-20T18:00:00+05:30",
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": "Government College of Engineering Kalahandi (GCEK)",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Bandhopala, Bhawanipatna",
          "addressLocality": "Bhawanipatna",
          "addressRegion": "Odisha",
          "postalCode": "766002",
          "addressCountry": "IN"
        }
      },
      "organizer": {
        "@type": "Organization",
        "name": "CodeBreakers GCEK",
        "url": "https://www.codebreakersgcek.tech",
        "logo": "https://www.codebreakersgcek.tech/cbhack.png"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://www.codebreakersgcek.tech/register",
        "price": "0",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "validFrom": "2026-08-01T00:00:00+05:30"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://www.codebreakersgcek.tech/#organization",
      "name": "CodeBreakers GCEK",
      "url": "https://www.codebreakersgcek.tech",
      "logo": "https://www.codebreakersgcek.tech/cbhack.png",
      "sameAs": [
        "https://github.com/codebreakers-gcek",
        "https://www.linkedin.com/company/codebreakers-gcek",
        "https://instagram.com/codebreakers_gcek"
      ]
    }
  ]
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${thuast.variable} bg-neo-bg text-black min-h-screen flex flex-col font-sans selection:bg-neo-secondary selection:text-black relative`}>
        <GsapLoader />
        <MinecraftSoundEffects />
        <SmoothScrollProvider>
          <AmbientCodeShapes />
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
          <ScrollProgressCircle />
          <MinecraftAudioPlayer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}


