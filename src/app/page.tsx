import type { Metadata } from "next";
import { getUsdToRubRate } from "@/lib/currency";
import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedFabrics } from "@/components/home/featured-fabrics";
import { MinOrderBanner } from "@/components/home/min-order-banner";
import { ContactSection } from "@/components/home/contact-section";
import { homeCopy } from "@/data/copy";

export const metadata: Metadata = {
  title: homeCopy.metaTitleHome,
  description: homeCopy.metaDescriptionHome,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const rateUsdToRub = await getUsdToRubRate();

  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedFabrics rateUsdToRub={rateUsdToRub} />
      <MinOrderBanner />
      <ContactSection />
    </>
  );
}
