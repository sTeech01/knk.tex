"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { heroSlides } from "@/data/hero-slides";

const NOISE_URI =
  "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='120'%20height='120'%3E%3Cfilter%20id='n'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.9'%20numOctaves='2'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='100%25'%20height='100%25'%20filter='url(%23n)'/%3E%3C/svg%3E";

const SLIDE_DURATION_MS = 6500;

export function HeroBackground() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (heroSlides.length < 2) return;

    // Автолистание - это движение без запроса пользователя, поэтому при
    // включённом «уменьшить движение» слайдер замирает на первом кадре.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % heroSlides.length),
      SLIDE_DURATION_MS
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0">
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.06 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.4, ease: "easeInOut" },
            scale: { duration: SLIDE_DURATION_MS / 1000 + 2, ease: "linear" },
          }}
        >
          <Image
            src={heroSlides[index].image}
            alt={heroSlides[index].alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover brightness-[0.42] saturate-[0.7]"
          />
        </motion.div>
      </AnimatePresence>

      {/* Синий тон поверх фотографии - фирменная гамма каталога KNK TEX. */}
      <div className="absolute inset-0 bg-navy/55 mix-blend-multiply" />
      <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(19,49,78,0.85)_0%,rgba(30,72,110,0.55)_45%,rgba(19,49,78,0.9)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(9,26,43,0.72)_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url("${NOISE_URI}")` }}
      />

      {heroSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {heroSlides.map((slide, slideIndex) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => setIndex(slideIndex)}
              aria-label={`Показать фотографию ${slideIndex + 1} из ${heroSlides.length}`}
              aria-current={slideIndex === index}
              className={`h-1 rounded-full transition-all ${
                slideIndex === index
                  ? "w-8 bg-gold"
                  : "w-4 bg-white/35 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
