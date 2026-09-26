const CBR_DAILY_URL = "https://www.cbr.ru/scripts/XML_daily.asp";

/*
 * Последний известный курс ЦБ на случай, когда сайт не смог получить
 * свежий и в кеше ещё ничего нет (первый запрос после деплоя, а ЦБ в этот
 * момент недоступен).
 *
 * Значение не берётся с потолка: это реальный курс ЦБ на 26.09.2026.
 * Раньше здесь стояло круглое 80, и при недоступности ЦБ цены на сайте
 * разом уезжали процентов на пять - для оптовой партии это заметные
 * деньги. Значение стоит обновлять, когда курс уходит далеко.
 */
const LAST_KNOWN_USD_RUB_RATE = 84.34;

/*
 * Последний курс, реально полученный от ЦБ в этом процессе. Живёт, пока
 * жив сервер, и закрывает короткие перебои: цена останется вчерашней
 * от ЦБ, а не подменится константой.
 */
let lastFetchedRate: number | null = null;

function parseUsdRateFromCbrXml(xml: string): number | null {
  const valuteMatch = xml.match(
    /<Valute ID="R01235">([\s\S]*?)<\/Valute>/
  );
  if (!valuteMatch) return null;

  const block = valuteMatch[1];
  const nominalMatch = block.match(/<Nominal>(\d+)<\/Nominal>/);
  const valueMatch = block.match(/<Value>([\d.,]+)<\/Value>/);
  if (!nominalMatch || !valueMatch) return null;

  const nominal = Number(nominalMatch[1]);
  const value = Number(valueMatch[1].replace(",", "."));
  if (!Number.isFinite(nominal) || !Number.isFinite(value) || nominal === 0) {
    return null;
  }

  return value / nominal;
}

/** Дата, на которую ЦБ установил курс: <ValCurs Date="25.09.2026" ...>. */
function parseRateDateFromCbrXml(xml: string): string | null {
  const match = xml.match(/<ValCurs[^>]*\sDate="(\d{2}\.\d{2}\.\d{4})"/);
  return match ? match[1] : null;
}

export type UsdRateInfo = {
  rate: number;
  /**
   * Дата курса в формате ДД.ММ.ГГГГ — та, что назвал сам ЦБ, а не
   * сегодняшняя дата сервера. Это разные вещи: курс на выходные ЦБ не
   * устанавливает, и в субботу действует пятничный.
   */
  date: string | null;
  /**
   * Курс действительно получен от ЦБ. Если нет, показывать рядом с ценой
   * «по курсу ЦБ» нельзя - это было бы неправдой.
   */
  fromCbr: boolean;
};

/**
 * Курс USD/RUB по данным ЦБ РФ вместе с датой, на которую он установлен.
 * Next.js кэширует результат и обновляет раз в час (revalidate); при
 * недоступности ЦБ используется резервный курс.
 */
/** Один поход к ЦБ. null - не получилось, причина неважна. */
async function fetchCbrRate(
  init: RequestInit & { next?: { revalidate: number } }
): Promise<{ rate: number; date: string | null } | null> {
  try {
    const response = await fetch(CBR_DAILY_URL, init);
    if (!response.ok) return null;

    const buffer = await response.arrayBuffer();
    const xml = new TextDecoder("windows-1251").decode(buffer);
    const rate = parseUsdRateFromCbrXml(xml);
    if (rate === null) return null;

    return { rate, date: parseRateDateFromCbrXml(xml) };
  } catch {
    return null;
  }
}

/**
 * Курс USD/RUB по данным ЦБ РФ вместе с датой, на которую он установлен.
 *
 * Цена на сайте привязана к курсу ЦБ, поэтому подменять его произвольным
 * числом можно только в самом крайнем случае. Порядок такой:
 *
 * 1. свежий курс от ЦБ (обновляется раз в час);
 * 2. если ЦБ не ответил - последний успешный ответ из кеша запросов: это
 *    по-прежнему курс ЦБ, просто вчерашний;
 * 3. если и кеша нет - последний курс, полученный этим процессом;
 * 4. и только если ничего нет - записанное в коде значение. Тогда подпись
 *    «по курсу ЦБ» с цены исчезает: ссылаться на ЦБ было бы неправдой.
 */
export async function getUsdRateInfo(): Promise<UsdRateInfo> {
  const fresh = await fetchCbrRate({ next: { revalidate: 3600 } });
  if (fresh) {
    lastFetchedRate = fresh.rate;
    return { rate: fresh.rate, date: fresh.date, fromCbr: true };
  }

  // Принудительно из кеша: если ЦБ отвечал хотя бы раз, значение там есть.
  const cached = await fetchCbrRate({ cache: "force-cache" });
  if (cached) {
    lastFetchedRate = cached.rate;
    return { rate: cached.rate, date: cached.date, fromCbr: true };
  }

  if (lastFetchedRate !== null) {
    return { rate: lastFetchedRate, date: null, fromCbr: true };
  }

  return { rate: LAST_KNOWN_USD_RUB_RATE, date: null, fromCbr: false };
}

/** Только курс — для мест, где подпись о его источнике не показывается. */
export async function getUsdToRubRate(): Promise<number> {
  return (await getUsdRateInfo()).rate;
}

export function convertUsdToRub(amountUsd: number, rate: number): number {
  return amountUsd * rate;
}
