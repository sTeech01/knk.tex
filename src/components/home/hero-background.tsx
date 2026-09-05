"use client";

import Image from "next/image";
import { motion } from "motion/react";

const NOISE_URI =
  "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='120'%20height='120'%3E%3Cfilter%20id='n'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.9'%20numOctaves='2'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='100%25'%20height='100%25'%20filter='url(%23n)'/%3E%3C/svg%3E";

export function HeroBackground() {
  return (
    <div className="absolute inset-0">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.06 }}
        transition={{
          duration: 26,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <Image
          src="/images/fabrics/placeholder.jpg"
          alt="Рулон портьерной ткани нейтрального оттенка на складе KNK TEX"
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-[0.42] saturate-[0.7]"
        />
      </motion.div>

      {/* Синий тон поверх фотографии - фирменная гамма каталога KNK TEX. */}
      <div className="absolute inset-0 bg-navy/55 mix-blend-multiply" />
      <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(19,49,78,0.85)_0%,rgba(30,72,110,0.55)_45%,rgba(19,49,78,0.9)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(9,26,43,0.72)_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url("${NOISE_URI}")` }}
      />
    </div>
  );
}
