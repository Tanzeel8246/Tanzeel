import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import FloatingTanzeelAI from '@/components/FloatingTanzeelAI';

export const metadata: Metadata = {
  title: {
    template: "%s | CodeHubb Tools",
    default: "CodeHubb Tools - Free Developer & AI Tools",
  },
  description: "CodeHubb Tools provides a comprehensive suite of free, client-side tools for developers, creators, and students. Includes AI Assistants, PDF tools, Image background removal, and more.",
  keywords: ["developer tools", "ai assistants", "urdu translator", "background remover", "free tools", "codehubb"],
  authors: [{ name: "CodeHubb" }],
  creator: "CodeHubb",
  publisher: "CodeHubb",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://tanzeel.work'),
  openGraph: {
    type: "website",
    locale: "ur_PK",
    url: "/",
    title: "CodeHubb Tools - Free Developer & AI Tools",
    description: "CodeHubb Tools provides a comprehensive suite of free, client-side tools for developers, creators, and students. Experience AI, PDF, and Image tools.",
    siteName: "CodeHubb Tools",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CodeHubb Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeHubb Tools - Free Developer & AI Tools",
    description: "CodeHubb Tools provides a comprehensive suite of free, client-side tools for developers, creators, and students. Experience AI, PDF, and Image tools.",
    images: ["/og-image.jpg"],
    creator: "@CodeHubb",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: './',
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 relative z-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "CodeHubb Tools",
              "url": "https://tools.codehubb.com",
              "description": "A comprehensive suite of free, client-side tools for developers and creators.",
              "publisher": {
                "@type": "Organization",
                "name": "CodeHubb"
              }
            })
          }}
        />
        {/* Subtle Dark Mode Glow */}
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] hidden dark:block pointer-events-none -z-10" />
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <FloatingTanzeelAI />
        </Providers>
      </body>
    </html>
  );
}
