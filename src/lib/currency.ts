const CBR_DAILY_URL = "https://www.cbr.ru/scripts/XML_daily.asp";

// Используется только если ЦБ РФ недоступен (сеть, таймаут и т.п.).
const FALLBACK_USD_RUB_RATE = 80;

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
export async function getUsdRateInfo(): Promise<UsdRateInfo> {
  try {
    const response = await fetch(CBR_DAILY_URL, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      return { rate: FALLBACK_USD_RUB_RATE, date: null, fromCbr: false };
    }

    const buffer = await response.arrayBuffer();
    const xml = new TextDecoder("windows-1251").decode(buffer);
    const rate = parseUsdRateFromCbrXml(xml);
    if (rate === null) {
      return { rate: FALLBACK_USD_RUB_RATE, date: null, fromCbr: false };
    }

    return { rate, date: parseRateDateFromCbrXml(xml), fromCbr: true };
  } catch {
    return { rate: FALLBACK_USD_RUB_RATE, date: null, fromCbr: false };
  }
}

/** Только курс — для мест, где подпись о его источнике не показывается. */
export async function getUsdToRubRate(): Promise<number> {
  return (await getUsdRateInfo()).rate;
}

export function convertUsdToRub(amountUsd: number, rate: number): number {
  return amountUsd * rate;
}
