import type { Metadata } from "next";
import { DM_Serif_Display, Montserrat } from "next/font/google";
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

export const metadata: Metadata = {
  title: "DeepRoots Foundation | Food Security & Community Upliftment in Vidarbha",
  description: "DeepRoots Foundation works to strengthen food security, dignity, education and community opportunities for underserved communities in Vidarbha, Maharashtra.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${dmSerifDisplay.variable} scroll-smooth antialiased`}>
      <body className="min-h-screen flex flex-col bg-ivory text-charcoal font-sans">
        {children}
      </body>
    </html>
  );
}
