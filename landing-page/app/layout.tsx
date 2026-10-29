import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#173F30",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "DeepRoots Foundation | Support Hunger Relief in Vidarbha",
  description:
    "Support DeepRoots Foundation’s mission towards food security, nutrition, education, and community upliftment across Vidarbha, Maharashtra.",
  keywords: [
    "DeepRoots Foundation",
    "Support Hunger Relief in Vidarbha",
    "NGO in Vidarbha",
    "Food security in Maharashtra",
    "Community nutrition in Vidarbha",
    "Donate a meal Maharashtra",
    "Melghat hunger relief",
    "Amravati NGO",
  ],
  authors: [{ name: "DeepRoots Foundation" }],
  creator: "DeepRoots Foundation",
  publisher: "DeepRoots Foundation",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://deeprootsfoundation.org"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    title: "DeepRoots Foundation | Support Hunger Relief in Vidarbha",
    description:
      "Support DeepRoots Foundation’s mission towards food security, nutrition, education, and community upliftment across Vidarbha, Maharashtra.",
    siteName: "DeepRoots Foundation",
    images: [
      {
        url: "/assets/images/volunteer-serving-full.png",
        width: 1200,
        height: 630,
        alt: "DeepRoots Foundation community meal initiative in Vidarbha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DeepRoots Foundation | Support Hunger Relief in Vidarbha",
    description:
      "Support DeepRoots Foundation’s mission towards food security, nutrition, education, and community upliftment across Vidarbha, Maharashtra.",
    images: ["/assets/images/volunteer-serving-full.png"],
  },
  icons: {
    icon: "/assets/images/logo.png",
    apple: "/assets/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className="font-sans bg-ivory text-earth antialiased selection:bg-saffron selection:text-earth">
        {children}
      </body>
    </html>
  );
}
