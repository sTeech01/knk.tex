import { company } from "@/data/company";
import type { Fabric } from "@/lib/types";
import { SITE_URL } from "@/lib/site";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description:
      "Оптовый поставщик портьерных тканей для швейных производств, дизайнеров интерьера и салонов штор.",
    telephone: company.phone,
    email: company.email,
    areaServed: "RU",
    sameAs: [company.telegram, company.whatsapp],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function productJsonLd(fabric: Fabric, rateUsdToRub: number) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: fabric.name,
    description: fabric.shortDescription,
    category: fabric.category,
    image: `${SITE_URL}${fabric.image}`,
    countryOfOrigin: fabric.origin,
    // availability намеренно не указывается: по ТЗ сайт не показывает остатки
    // ни в интерфейсе, ни в разметке - иначе поисковики выводят «В наличии».
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: fabric.priceUsd.toFixed(2),
      url: `${SITE_URL}/catalog/${fabric.slug}`,
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        minValue: company.metersPerRoll,
        unitCode: "MTR",
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Ширина полотна",
        value: `${fabric.widthCm} см`,
      },
      {
        "@type": "PropertyValue",
        name: "Плотность",
        value: `${fabric.densityGsm} г/м²`,
      },
      {
        "@type": "PropertyValue",
        name: "Количество цветов",
        value: fabric.colorsCount,
      },
      {
        "@type": "PropertyValue",
        name: "Курс USD/RUB на момент просмотра",
        value: rateUsdToRub.toFixed(2),
      },
    ],
  };
}
