import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

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

export const metadata = {
  title: "Charan — Portfolio",
  description: "Personal portfolio website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          bg-[#f8f7f4] dark:bg-[#0a0a0a]
          text-gray-900 dark:text-white
          tracking-tight
        `}
      >
        <ThemeProvider>
          {/* Smart auto-hiding navbar */}
          <Navbar />

          {/* Page content */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
