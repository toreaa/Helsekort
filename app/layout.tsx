import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Helsekort",
  description: "Helsekort applikasjon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  );
}
