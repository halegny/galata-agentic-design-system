import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "Galata — a design system for agents that take consequential actions",
  description:
    "Consequence is a visual property. Galata sorts every agent output into four registers — quiet, medium, loud, interrupt — so a person always knows how much attention something demands.",
};

// Runs before hydration to set the theme from saved preference (default: dark,
// the hero theme). Prevents a flash of the wrong theme on load.
const themeScript = `(function(){try{var t=localStorage.getItem('galata-theme');var dark=t?t==='dark':true;document.documentElement.classList.toggle('dark',dark);}catch(e){document.documentElement.classList.add('dark');}})();`;

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
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script id="galata-theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
