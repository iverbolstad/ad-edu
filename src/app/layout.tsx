import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Storybook Generator — Voksenopplæring",
  description:
    "Generer tilpassede historier for norskopplæring basert på CEFR-nivå",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
