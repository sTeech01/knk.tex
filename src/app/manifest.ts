import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KNK TEX — портьерные ткани оптом",
    short_name: "KNK TEX",
    description: "Каталог портьерных тканей KNK TEX для оптовых заказчиков.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#13314e",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
