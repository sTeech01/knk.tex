import { readFileSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/*
 * Отпечатки обложек - те же, что подставляются в адрес картинки
 * параметром ?v= (см. src/data/cover-versions.ts). Оптимизатор картинок
 * по умолчанию не пропускает локальные адреса с query, и разрешить их
 * нужно поимённо: если просто опустить search, оптимизировать можно будет
 * любой адрес с любым параметром.
 *
 * Список читается из того же файла, что и данные сайта, поэтому
 * разойтись они не могут.
 */
const coverVersions: Record<string, string> = JSON.parse(
  readFileSync(
    path.join(process.cwd(), "scripts", "cover-versions.json"),
    "utf8"
  )
);

const coverSearchPatterns = [...new Set(Object.values(coverVersions))].map(
  (version) => ({ pathname: "/images/**", search: `?v=${version}` })
);

/*
 * Политика безопасности контента. Задана прямо в конфиге, а не через
 * proxy.ts с nonce: nonce требует, чтобы каждая страница рендерилась на
 * каждый запрос заново, а у нас почти весь сайт - статика, которую отдаёт
 * CDN. Ради директив, которые реально закрывают дыры (frame-ancestors,
 * base-uri, form-action, object-src), терять статику незачем.
 *
 * script-src приходится оставить с 'unsafe-inline': Next вставляет в
 * страницу собственные inline-скрипты гидрации. Строгий вариант возможен
 * только с nonce или с экспериментальным SRI - оба варианта сейчас дороже
 * выигрыша, потому что своих скриптов на сайте нет и внедрять XSS некуда.
 *
 * 'unsafe-eval' нужен только в разработке: React через eval восстанавливает
 * стек серверных ошибок. В продакшене ни React, ни Next eval не используют.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Инлайновые стили ставит и Next, и motion - анимации пишут opacity и
  // transform прямо в атрибут style.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  // Плагинов и Flash на сайте нет - запрещаем полностью.
  "object-src 'none'",
  // Запрет на подмену <base>: иначе внедрённый тег переписал бы все
  // относительные ссылки на чужой домен.
  "base-uri 'self'",
  // Форма заявки может отправляться только на свой же домен.
  "form-action 'self'",
  // Сайт нельзя встроить в чужой iframe - защита от кликджекинга поверх
  // формы заявки.
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    // Браузер не угадывает тип файла по содержимому: загруженная картинка
    // не сможет исполниться как скрипт.
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Дублирует frame-ancestors для старых браузеров без поддержки CSP.
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // На чужие домены уходит только origin, без пути и параметров.
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Камера, микрофон и геолокация сайту не нужны ни на одной странице.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  /*
   * Заголовок x-powered-by: Next.js не нужен никому, кроме сканеров, которые
   * по нему подбирают известные уязвимости под конкретный стек.
   */
  poweredByHeader: false,
  images: {
    /*
     * Next 16 по умолчанию разрешает единственное качество - 75, а любое
     * другое значение prop `quality` молча приводит к ближайшему из списка.
     * Для фотографий тканей 75 заметно смазывает переплетение, поэтому
     * 88 добавлено в список явно - иначе prop не имел бы никакого эффекта.
     */
    qualities: [75, 88],
    /*
     * Формат задан явно и без AVIF. Уязвимость GHSA-2xp9-vwfh-vxw4
     * (выполнение кода через оптимизатор картинок) срабатывает только на
     * включённом AVIF, и явная строчка не даёт включить его случайно.
     */
    formats: ["image/webp"],
    /*
     * Оптимизировать можно только картинки из public/images: и без query
     * (логотип, заглушка, палитры оттенков), и с отпечатком обложки.
     * Всё остальное оптимизатор отдаст как 400 - это ограничивает то,
     * что через него можно прогнать.
     */
    localPatterns: [{ pathname: "/images/**", search: "" }, ...coverSearchPatterns],
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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
