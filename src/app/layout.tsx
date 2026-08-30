import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ReservationProvider } from "@/context/reservation-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Piero Beach Resort – Luxury Beachfront Resort | Zambales",
    template: "%s | Piero Beach Resort",
  },
  description: "Experience beachfront luxury, private dipping tubs, jacuzzi suites, and oceanfront dining at Piero Beach Resort in Zambales.",
  metadataBase: new URL("https://www.pierobeachresort.com"),
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Piero Beach Resort – Luxury Beachfront Resort | Zambales",
    description: "Experience beachfront luxury, private dipping tubs, jacuzzi suites, and oceanfront dining at Piero Beach Resort in Zambales.",
    url: "https://www.pierobeachresort.com",
    siteName: "Piero Beach Resort",
    locale: "en_PH",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Piero Beach Resort – Luxury Beachfront Resort in Zambales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Piero Beach Resort – Luxury Beachfront Resort | Zambales",
    description: "Experience beachfront luxury, private dipping tubs, jacuzzi suites, and oceanfront dining at Piero Beach Resort in Zambales.",
    images: ["/og-image.jpg"],
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
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans overflow-x-hidden">
        <ReservationProvider>
          {children}
        </ReservationProvider>
      </body>
    </html>
  );
}
