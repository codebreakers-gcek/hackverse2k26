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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      "https://hackverse.codebreakersgcek.tech",
  ),
  title: {
    default:
      "HACKVERSE '26 | Flagship 24H State Tech Fest & Hackathon | CodeBreakers GCEK",
    template: "%s | HACKVERSE '26 - CodeBreakers GCEK",
  },
  description:
    "Official State-Level Flagship 24-Hour Hackathon & Tech Fest organized by CODEBREAKERS, Government College of Engineering Kalahandi (GCEK). ₹35,000+ prize pool across AI/ML, Web3, Cyber Security, Cloud, IoT & Open Innovation tracks.",
  keywords: [
    "HACKVERSE 2026",
    "HACKVERSE '26",
    "HACKVERSE 26",
    "HACKVERSE Hackathon",
    "HACKVERSE Hackathon 2026",
    "HACKVERSE GCEK",
    "HACKVERSE GCEK 2026",
    "CodeBreakers GCEK",
    "CodeBreakers",
    "CodeBreakers Hackathon",
    "CodeBreakers GCEK Hackathon",
    "GCEK Hackathon",
    "GCEK Kalahandi",
    "Government College of Engineering Kalahandi",
    "Government College of Engineering Kalahandi Hackathon",
    "GCEK Bhawanipatna",
    "Government Engineering College Kalahandi",
    "Engineering College Kalahandi",
    "Kalahandi Engineering College",
    "Bhawanipatna Hackathon",
    "Bhawanipatna Coding Competition",

    "hackathon Odisha",
    "hackathons in Odisha",
    "hackathon in Odisha 2026",
    "best hackathon in Odisha",
    "top hackathon in Odisha",
    "state level hackathon Odisha",
    "state level hackathon 2026",
    "Odisha state level hackathon",
    "Odisha hackathon 2026",
    "student hackathon Odisha",
    "college hackathon Odisha",
    "engineering college hackathon Odisha",
    "technical hackathon Odisha",
    "coding hackathon Odisha",
    "technology hackathon Odisha",
    "innovation hackathon Odisha",
    "24 hour hackathon Odisha",
    "24 hours hackathon",
    "24 hour hackathon 2026",
    "24 hour coding hackathon",
    "student coding hackathon",
    "student hackathon 2026",
    "college hackathon 2026",
    "engineering hackathon 2026",
    "technology competition Odisha",
    "coding competition Odisha",
    "coding competition 2026",
    "programming competition Odisha",
    "programming competition 2026",
    "coding contest Odisha",
    "coding contest 2026",
    "developer competition Odisha",
    "student developer competition",
    "student developer festival",
    "technology fest Odisha",
    "tech fest Odisha",
    "tech fest 2026",
    "college tech fest Odisha",
    "engineering tech fest Odisha",

    "hackathon registration",
    "hackathon registration 2026",
    "Odisha hackathon registration",
    "HACKVERSE registration",
    "HACKVERSE registration 2026",
    "HACKVERSE 2026 registration",
    "HACKVERSE hackathon registration",
    "hackathon registration Odisha",
    "online hackathon registration",
    "state level hackathon registration",
    "college hackathon registration",
    "student hackathon registration",
    "hackathon application 2026",
    "hackathon participation 2026",
    "hackathon team registration",
    "hackathon team size",
    "hackathon for college students",
    "hackathon for engineering students",
    "hackathon for developers",
    "hackathon for students Odisha",

    "AI ML hackathon",
    "AI ML hackathon 2026",
    "AI hackathon Odisha",
    "ML hackathon Odisha",
    "artificial intelligence hackathon",
    "machine learning hackathon",
    "AI competition Odisha",
    "machine learning competition Odisha",
    "AI coding competition",
    "artificial intelligence competition 2026",
    "generative AI hackathon",
    "GenAI hackathon Odisha",
    "AI developer hackathon",
    "AI innovation hackathon",

    "Web3 hackathon",
    "Web3 hackathon 2026",
    "Web3 hackathon Odisha",
    "blockchain hackathon",
    "blockchain hackathon 2026",
    "blockchain hackathon Odisha",
    "Web3 blockchain competition",
    "Web3 coding competition",
    "blockchain coding competition",
    "decentralized application hackathon",
    "Web3 developer competition",
    "blockchain developer hackathon",

    "IoT hackathon",
    "IoT hackathon 2026",
    "IoT hackathon Odisha",
    "Internet of Things hackathon",
    "IoT coding competition",
    "IoT innovation competition",
    "hardware hackathon Odisha",
    "embedded systems hackathon",
    "embedded systems competition",
    "smart technology hackathon",

    "cybersecurity hackathon",
    "cyber security hackathon 2026",
    "cybersecurity hackathon Odisha",
    "cyber security competition",
    "cybersecurity competition Odisha",
    "cybersecurity coding competition",
    "ethical hacking competition Odisha",
    "ethical hacking hackathon",
    "cybersecurity student competition",
    "information security hackathon",

    "software hackathon",
    "software development hackathon",
    "software hackathon 2026",
    "web development hackathon",
    "web development competition",
    "app development hackathon",
    "mobile app hackathon",
    "full stack hackathon",
    "developer hackathon Odisha",
    "programming hackathon",
    "coding hackathon 2026",
    "software development competition",
    "technology innovation competition",
    "innovation competition 2026",

    "hackathon prize pool",
    "₹35000 hackathon",
    "35k prize pool hackathon",
    "hackathon with cash prizes",
    "hackathon prizes 2026",
    "hackathon winners prize",
    "hackathon certificate",
    "hackathon certificate 2026",
    "hackathon mentorship",
    "hackathon networking",
    "hackathon project showcase",
    "hackathon MVP competition",
    "hackathon prototype competition",
    "real world problem hackathon",
    "innovation challenge 2026",

    "Odisha student innovation",
    "Odisha student developers",
    "Odisha coding community",
    "Odisha developer community",
    "Odisha tech community",
    "Odisha programmers",
    "Odisha developers",
    "Odisha engineering students",
    "engineering students Odisha",
    "college students Odisha",
    "student innovators Odisha",
    "young developers Odisha",
    "coding clubs Odisha",
    "technical clubs Odisha",
    "coding community Bhawanipatna",
    "developer community Bhawanipatna",
    "technology community Kalahandi",
    "student innovation Kalahandi",

    "hackathon Bhubaneswar",
    "hackathon Cuttack",
    "hackathon Rourkela",
    "hackathon Sambalpur",
    "hackathon Berhampur",
    "hackathon Balasore",
    "hackathon Bhawanipatna",
    "hackathon Kalahandi",
    "Odisha engineering hackathon",
    "Odisha college coding event",
    "Odisha technology event",
    "Odisha student technology event",
    "Odisha developer event",
    "Odisha innovation event",
    "Odisha coding event 2026",

    "best hackathon for students",
    "hackathon for engineering students",
    "hackathon for college students",
    "hackathon for computer science students",
    "hackathon for CSE students",
    "hackathon for IT students",
    "hackathon for ECE students",
    "hackathon for EEE students",
    "hackathon for technical students",
    "hackathon team competition",
    "buildathon Odisha",
    "student buildathon",
    "coding event for students",
    "technology event for students",
    "student innovation challenge",
    "student project competition",
    "college project competition",
    "engineering project competition",
    "software project competition",
    "technology project competition",
  ],
  authors: [
    {
      name: "CodeBreakers GCEK",
      url: "https://hackverse.codebreakersgcek.tech",
    },
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
    url: "https://hackverse.codebreakersgcek.tech",
    siteName: "HACKVERSE '26 // CodeBreakers GCEK",
    title: "HACKVERSE '26 | Flagship 24H State Tech Fest & Hackathon",
    description:
      "Join Central & Western India's most energetic hackathon at GCEK Kalahandi. 24-Hour sprint, ₹35,000+ prize pool, industry mentorship, free hostel accommodation & swags.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "HACKVERSE '26 - 24H State Hackathon // CodeBreakers GCEK (Minecraft Edition)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@codebreakersgcek",
    creator: "@codebreakersgcek",
    title: "HACKVERSE '26 | Flagship 24H State Tech Fest & Hackathon",
    description:
      "24-Hour Hackathon & Tech Fest at GCEK Kalahandi. ₹35,000+ in prizes. Register your squad now!",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://hackverse.codebreakersgcek.tech",
  },
  verification: {
    google: [
      "ZN8_H21SvxCF7C-nkmtfZoTThcFTcUbgQjuhapzl-FY",
      "googlebd4a646d4549ad60",
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Event",
      "@id": "https://hackverse.codebreakersgcek.tech/#event",
      name: "HACKVERSE '26 - 24-Hour Flagship Hackathon",
      description:
        "Official State-Level Flagship 24-Hour Hackathon & Tech Fest organized by CODEBREAKERS at Government College of Engineering Kalahandi.",
      url: "https://hackverse.codebreakersgcek.tech",
      image: "https://hackverse.codebreakersgcek.tech/og-image.png",
      startDate: "2026-09-18T09:00:00+05:30",
      endDate: "2026-09-20T18:00:00+05:30",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "Government College of Engineering Kalahandi (GCEK)",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Kandho Bandhopala, Bhawanipatna",
          addressLocality: "Bhawanipatna",
          addressRegion: "Odisha",
          postalCode: "766002",
          addressCountry: "IN",
        },
      },
      organizer: {
        "@type": "Organization",
        name: "CodeBreakers GCEK",
        url: "https://hackverse.codebreakersgcek.tech",
        logo: "https://hackverse.codebreakersgcek.tech/cbhack.png",
      },
      offers: {
        "@type": "Offer",
        url: "https://hackverse.codebreakersgcek.tech/register",
        price: "0",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        validFrom: "2026-08-01T00:00:00+05:30",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://hackverse.codebreakersgcek.tech/#organization",
      name: "CodeBreakers GCEK",
      url: "https://hackverse.codebreakersgcek.tech",
      logo: "https://hackverse.codebreakersgcek.tech/cbhack.png",
      sameAs: [
        "https://github.com/codebreakers-gcek",
        "https://www.linkedin.com/company/codebreakers-gcek",
        "https://instagram.com/codebreakers_gcek",
      ],
    },
  ],
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="preload"
          as="image"
          href="/minecraft_loader/bg.webp"
          type="image/webp"
        />
        <link
          rel="preload"
          as="image"
          href="/minecraft_loader/hackverse.webp"
          type="image/webp"
        />
        <link
          rel="preload"
          as="image"
          href="/minecraft/1.webp"
          type="image/webp"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${thuast.variable} bg-neo-bg text-black min-h-screen flex flex-col font-sans selection:bg-neo-secondary selection:text-black relative`}
      >
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
