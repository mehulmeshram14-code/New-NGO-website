import type { Metadata } from "next";
import { DM_Serif_Display, Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  subsets: ["latin"],
  weight: "400",
});

// Self-hosted so the brand wordmark does not depend on a render-blocking third-party stylesheet.
const samarkan = localFont({
  src: "./fonts/Samarkan.woff",
  variable: "--font-samarkan-local",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://deeprootsfoundation.org"),
  title: "DeepRoots Foundation | Food Security & Community Upliftment in Vidarbha",
  description: "DeepRoots Foundation works to strengthen food security, dignity, education and community opportunities for underserved communities in Vidarbha, Maharashtra.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${dmSerifDisplay.variable} ${samarkan.variable} scroll-smooth antialiased`}>
      <body className="min-h-screen flex flex-col bg-ivory text-charcoal font-sans">
        {children}
      </body>
    </html>
  );
}
