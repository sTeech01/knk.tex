"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides } from "@/data/hero-slides";
import { cn } from "@/lib/utils";

const NOISE_URI =
  "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='120'%20height='120'%3E%3Cfilter%20id='n'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.9'%20numOctaves='2'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='100%25'%20height='100%25'%20filter='url(%23n)'/%3E%3C/svg%3E";

const SLIDE_DURATION_MS = 6500;
/** Минимальный сдвиг пальца, после которого жест считается свайпом. */
const SWIPE_THRESHOLD_PX = 45;

/**
 * Слайдер первого экрана.
 *
 * Все слайды смонтированы сразу и лежат стопкой, меняется только
 * прозрачность. Раньше при каждой смене старый кадр удалялся, а новый
 * загружался с нуля — отсюда была задержка, на которую жаловался
 * заказчик. Теперь картинки подгружаются заранее и переключение
 * мгновенное.
 *
 * Свайп работает на всём первом экране, а не только на фоне: иначе
 * текст по центру перехватывал бы жест.
 */
export function HeroSlider({ children }: { children: React.ReactNode }) {
  const count = heroSlides.length;
  const [index, setIndex] = useState(0);
  // Меняется при ручном переключении — перезапускает таймер автолистания,
  // чтобы слайд не сменился сам сразу после свайпа.
  const [resetKey, setResetKey] = useState(0);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  // Остальные слайды подгружаются чуть позже первого: иначе все четыре
  // качаются одновременно и отнимают канал у первого экрана. К моменту
  // автосмены (6,5 с) они уже загружены.
  const [warm, setWarm] = useState(false);

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count);
      setResetKey((key) => key + 1);
    },
    [count]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setWarm(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (count < 2) return;
    // Автолистание — движение без запроса пользователя, поэтому при
    // включённом «уменьшить движение» слайдер замирает.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % count),
      SLIDE_DURATION_MS
    );
    return () => window.clearInterval(timer);
  }, [count, resetKey]);

  return (
    <section
      className="relative flex touch-pan-y items-center justify-center overflow-hidden bg-navy"
      onPointerDown={(event) => {
        pointer.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={(event) => {
        const start = pointer.current;
        pointer.current = null;
        if (!start || count < 2) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        // Горизонтальный жест — листаем; вертикальный остаётся прокруткой.
        if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy)) return;
        goTo(dx < 0 ? index + 1 : index - 1);
      }}
      onPointerCancel={() => {
        pointer.current = null;
      }}
    >
      <div className="absolute inset-0">
        {heroSlides.map((slide, slideIndex) => {
          // Слайд, на который пользователь перешёл сам, грузим сразу.
          if (!warm && slideIndex !== 0 && slideIndex !== index) return null;
          return (
            <div
              key={slide.image}
              aria-hidden={slideIndex !== index}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out",
                slideIndex === index ? "opacity-100" : "opacity-0"
              )}
            >
              <Image
                src={slide.image}
                alt={slideIndex === index ? slide.alt : ""}
                fill
                preload={slideIndex === 0}
                quality={88}
                sizes="100vw"
                className={cn(
                  "object-cover brightness-[0.75] transition-transform duration-[8000ms] ease-linear motion-reduce:transition-none",
                  slideIndex === index ? "scale-[1.06] motion-reduce:scale-100" : "scale-100"
                )}
              />
            </div>
          );
        })}

        {/* Затемнение намеренно нейтральное, без синего тона: цветной
            оверлей перекрашивал ткань, а первый экран должен показывать
            её настоящий цвет. Только гашение яркости — ровно столько,
            чтобы белый заголовок читался на светлых полотнах. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.3)_55%,rgba(0,0,0,0.48)_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: `url("${NOISE_URI}")` }}
        />
      </div>

      {children}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Предыдущая фотография"
            className="absolute left-3 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/45 md:flex"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Следующая фотография"
            className="absolute right-3 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/45 md:flex"
          >
            <ChevronRight className="size-5" />
          </button>

          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-1">
            {heroSlides.map((slide, slideIndex) => (
              // Кнопка крупнее видимой полоски: в тонкую полоску 4px
              // пальцем на телефоне не попасть.
              <button
                key={slide.image}
                type="button"
                onClick={() => goTo(slideIndex)}
                aria-label={`Показать фотографию ${slideIndex + 1} из ${count}`}
                aria-current={slideIndex === index}
                className="flex h-8 items-center px-1.5"
              >
                <span
                  className={cn(
                    "block h-1 rounded-full transition-all",
                    slideIndex === index ? "w-8 bg-gold" : "w-4 bg-white/40"
                  )}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
