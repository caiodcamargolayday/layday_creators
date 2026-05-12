import type { Metadata } from "next";
import { Montserrat, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { PageTransition } from "@/components/layout/PageTransition";
import { ConditionalShell } from "@/components/layout/ConditionalShell";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "Lay Day Hostels",
  description: "Lay Day embodies the perfect trifecta of party, surf, and relaxation.",
  icons: {
    icon: "/favicon-creators-layday.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://www.google.com" />
      </head>
      <body className={`${montserrat.variable} ${bebas.variable} font-sans antialiased bg-[#EBE6D8] text-[#004A61] flex flex-col min-h-screen`}>
        <ConditionalShell>
          <PageTransition>
            {children}
          </PageTransition>
        </ConditionalShell>
      </body>
    </html>
  );
}
