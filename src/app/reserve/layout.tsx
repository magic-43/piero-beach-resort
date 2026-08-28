import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Your Stay - Reservation",
  description: "Reserve your beachfront villa, jacuzzi suite, or family room at Piero Beach Resort.",
};

export default function ReserveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

