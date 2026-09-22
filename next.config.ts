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
  experimental: {
    /*
     * Число воркеров сборки можно ограничить переменной NEXT_BUILD_CPUS.
     * На машине разработчика при нехватке памяти 15 параллельных воркеров
     * падали с нарушением доступа. На Vercel переменная не задана - там
     * значение по умолчанию.
     */
    cpus: process.env.NEXT_BUILD_CPUS
      ? Number(process.env.NEXT_BUILD_CPUS)
      : undefined,
  },
};

export default nextConfig;
