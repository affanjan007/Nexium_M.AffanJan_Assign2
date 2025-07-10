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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-300">
          <main className="relative">
            {children}
          </main>
        </div>
        
        <div id="modal-root" className="fixed inset-0 z-50 pointer-events-none">
          <div id="success-modal" className="hidden fixed inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto animate-fade-in">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-scale-in">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                    <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Summary Generated Successfully
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Your blog has been summarized in both English and Urdu. The summary has been saved to the database.
                  </p>
                  <button 
                    id="close-modal"
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="notification-container" className="fixed top-4 right-4 z-40 space-y-2 pointer-events-none">
        </div>
        
        <script dangerouslySetInnerHTML={{
          __html: `
            window.showSuccessModal = function() {
              const modal = document.getElementById('success-modal');
              if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('animate-fade-in');
                document.body.style.overflow = 'hidden';
              }
            };
            
            window.hideSuccessModal = function() {
              const modal = document.getElementById('success-modal');
              if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('animate-fade-in');
                document.body.style.overflow = 'auto';
              }
            };
            
            window.showNotification = function(message, type = 'success') {
              const container = document.getElementById('notification-container');
              const notification = document.createElement('div');
              notification.className = \`transform transition-all duration-300 ease-in-out pointer-events-auto min-w-80 max-w-md p-4 rounded-xl shadow-lg border backdrop-blur-sm animate-slide-in-right \${
                type === 'success' 
                  ? 'bg-green-50/90 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-200' 
                  : type === 'error'
                  ? 'bg-red-50/90 border-red-200 text-red-800 dark:bg-red-900/50 dark:border-red-700 dark:text-red-200'
                  : 'bg-blue-50/90 border-blue-200 text-blue-800 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-200'
              }\`;
              
              notification.innerHTML = \`
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    \${type === 'success' ? 
                      '<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' :
                      type === 'error' ?
                      '<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' :
                      '<svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
                    }
                  </div>
                  <div class="ml-3 flex-1">
                    <p class="text-sm font-medium">\${message}</p>
                  </div>
                  <button onclick="this.parentElement.parentElement.remove()" class="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              \`;
              
              container.appendChild(notification);
              
              setTimeout(() => {
                notification.classList.add('animate-fade-out');
                setTimeout(() => {
                  if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                  }
                }, 300);
              }, 4000);
            };
            
            document.addEventListener('DOMContentLoaded', function() {
              const closeButton = document.getElementById('close-modal');
              if (closeButton) {
                closeButton.addEventListener('click', window.hideSuccessModal);
              }
              
              const modal = document.getElementById('success-modal');
              if (modal) {
                modal.addEventListener('click', function(e) {
                  if (e.target === modal) {
                    window.hideSuccessModal();
                  }
                });
              }
            });
          `
        }} />
      </body>
    </html>
  );
}