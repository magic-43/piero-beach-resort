import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin Portal - Multi-Property Management",
    template: "%s | Admin Portal",
  },
  description: "Unified admin management system for Piero Beach Resort and Cielo Alto Place.",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

