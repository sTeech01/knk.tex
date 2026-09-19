import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
     * Next 16 по умолчанию разрешает единственное качество - 75, а любое
     * другое значение prop `quality` молча приводит к ближайшему из списка.
     * Для фотографий тканей 75 заметно смазывает переплетение, поэтому
     * 88 добавлено в список явно - иначе prop не имел бы никакого эффекта.
     */
    qualities: [75, 88],
  },
};

export default nextConfig;
