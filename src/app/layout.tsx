import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Blog Summarizer - AI-Powered Urdu & English Summaries",
  description: "Transform any blog post into concise summaries in both English and Urdu using advanced AI technology. Get instant, accurate summaries from any blog URL.",
  keywords: ["blog summarizer", "urdu", "english", "AI", "summary", "text analysis", "gemini", "translation", "content extraction"],
  authors: [{ name: "Blog Summarizer" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Blog Summarizer - AI-Powered Summaries",
    description: "Transform any blog post into concise summaries in both English and Urdu using AI technology.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Summarizer - AI-Powered Summaries",
    description: "Transform any blog post into concise summaries in both English and Urdu using AI technology.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#3b82f6",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Blog Summarizer" />
        <meta name="application-name" content="Blog Summarizer" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <main className="relative">
            {children}
          </main>
        </div>
        
        {/* Global Loading Indicator */}
        <div id="global-loading" className="hidden fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700 dark:text-gray-300">Processing...</span>
            </div>
          </div>
        </div>
        
        {/* Toast Notification Container */}
        <div id="toast-container" className="fixed top-4 right-4 z-50 space-y-2"></div>
      </body>
    </html>
  );
}