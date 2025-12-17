import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lead Gen Machine",
  description: "Personalized messaging template builder for sales teams",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
