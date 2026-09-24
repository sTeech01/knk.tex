/**
 * Презентационные фотографии для первого экрана главной страницы.
 * Меняются по очереди. Чтобы добавить слайд, достаточно положить WebP
 * в public/images/hero и дописать строку сюда.
 */
export const heroSlides = [
  {
    image: "/images/hero/kanvas.webp",
    alt: "Портьерный канвас Camilla — фактурное полотно для штор",
  },
  {
    image: "/images/hero/kanvas-ali.webp",
    alt: "Портьерный канвас Rosabella — плотная ткань для штор",
  },
  {
    image: "/images/hero/satin.webp",
    alt: "Портьерный сатин Camilla — гладкое полотно с мягким блеском",
  },
  {
    image: "/images/hero/satin-ali.webp",
    alt: "Портьерный сатин Rosabella — ткань для штор с мягкой драпировкой",
  },
  {
    image: "/images/hero/barhat-glamour.webp",
    alt: "Портьерный бархат Glamour — плотный матовый ворс для тяжёлых штор",
  },
  {
    image: "/images/hero/dvuhstoronniy-blekaut.webp",
    alt: "Двухсторонний блэкаут — плотное полотно для полного затемнения",
  },
] as const;
