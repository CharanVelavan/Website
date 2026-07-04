import Navbar from "@/components/Navbar";
import MobileTabBar from "@/components/MobileTabBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SITE_URL } from "@/lib/site-config";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Charan Velavan — Portfolio",
    template: "%s | Charan Velavan",
  },
  alternates: { canonical: "./" },
  description:
    "Portfolio of Charan Velavan — AI/ML systems engineer, 5G networks researcher, and UAV systems developer based in Chennai.",
  keywords: [
    "Charan Velavan",
    "Portfolio",
    "AI",
    "5G",
    "UAV",
    "Embedded Systems",
    "Machine Learning",
    "Edge AI",
  ],
  authors: [{ name: "Charan Velavan", url: "https://www.linkedin.com/in/charan-velavan/" }],
  creator: "Charan Velavan",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Charan Velavan — Portfolio",
    description:
      "AI/ML systems engineer, 5G networks researcher, and UAV systems developer. View projects, achievements, and research.",
    siteName: "Charan Velavan Portfolio",
    images: [{ url: "/profile.jpg", width: 800, height: 800, alt: "Charan Velavan" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Charan Velavan — Portfolio",
    description:
      "AI/ML systems engineer, 5G networks researcher, and UAV systems developer.",
    images: ["/profile.jpg"],
  },
  verification: {
    google: "aIhJxGy3N1L0rXQEaRRkv11wS61WEvDuu7UKT_gWVjk",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Charan Velavan",
    statusBarStyle: "black-translucent",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#f8f7f4" },
  ],
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
          <MobileTabBar />

          {/* Page content */}
          {children}
        </ThemeProvider>

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": `${SITE_URL}/#person`,
                  name: "Charan Velavan",
                  givenName: "Charan",
                  familyName: "Velavan",
                  url: SITE_URL,
                  image: `${SITE_URL}/profile.jpg`,
                  jobTitle: "AI/ML Systems Engineer",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Chennai",
                    addressCountry: "IN",
                  },
                  alumniOf: {
                    "@type": "CollegeOrUniversity",
                    name: "SSN College of Engineering",
                  },
                  knowsAbout: [
                    "Artificial Intelligence",
                    "Machine Learning",
                    "5G Networks",
                    "UAV Systems",
                    "Embedded Systems",
                    "Edge AI",
                  ],
                  sameAs: [
                    "https://www.linkedin.com/in/charan-velavan/",
                    "https://github.com/charanvelavan",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: "Charan Velavan Portfolio",
                  publisher: { "@id": `${SITE_URL}/#person` },
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
