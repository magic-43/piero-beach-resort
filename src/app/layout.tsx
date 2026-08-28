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
  icons: {
    icon: "/icon.svg",
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
