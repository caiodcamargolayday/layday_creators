import type { Metadata } from "next";
import { Montserrat, Bebas_Neue } from "next/font/google";
import Script from "next/script";
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
        {/* Meta Pixel — generates _fbp cookie for CAPI event matching */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <ConditionalShell>
          <PageTransition>
            {children}
          </PageTransition>
        </ConditionalShell>
      </body>
    </html>
  );
}
