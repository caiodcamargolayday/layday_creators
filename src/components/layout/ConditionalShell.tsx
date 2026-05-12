"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ReviewsSection } from "@/components/home/ReviewsSection";

const STANDALONE_ROUTES = ["/", "/creatorsweek-gilit"];

export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandalone = STANDALONE_ROUTES.some((r) => pathname.startsWith(r));

  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <ReviewsSection />
      <Footer />
    </>
  );
}
