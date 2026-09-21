import type { Metadata } from "next";
import { getUsdToRubRate } from "@/lib/currency";
import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedFabrics } from "@/components/home/featured-fabrics";
import { Advantages } from "@/components/home/advantages";
import { HowToOrder } from "@/components/home/how-to-order";
import { DeliveryStrip } from "@/components/home/delivery-strip";
import { ContactSection } from "@/components/home/contact-section";
import { homeCopy } from "@/data/copy";

export const metadata: Metadata = {
  title: homeCopy.metaTitleHome,
  description: homeCopy.metaDescriptionHome,
  alternates: { canonical: "/" },
};

/**
 * Порядок блоков повторяет логику решения оптового покупателя:
 * предложение → что продаём → как выглядит товар → почему у нас →
 * как купить, если корзины нет → как привезут → заявка.
 */
export default async function HomePage() {
  const rateUsdToRub = await getUsdToRubRate();

  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedFabrics rateUsdToRub={rateUsdToRub} />
      <Advantages />
      <HowToOrder />
      <DeliveryStrip />
      <ContactSection />
    </>
  );
}
