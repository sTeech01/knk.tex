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

/**
 * Курс USD/RUB по данным ЦБ РФ. Next.js кэширует результат и обновляет
 * раз в час (revalidate); при недоступности ЦБ используется резервный курс.
 */
export async function getUsdToRubRate(): Promise<number> {
  try {
    const response = await fetch(CBR_DAILY_URL, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return FALLBACK_USD_RUB_RATE;

    const buffer = await response.arrayBuffer();
    const xml = new TextDecoder("windows-1251").decode(buffer);
    const rate = parseUsdRateFromCbrXml(xml);
    return rate ?? FALLBACK_USD_RUB_RATE;
  } catch {
    return FALLBACK_USD_RUB_RATE;
  }
}

export function convertUsdToRub(amountUsd: number, rate: number): number {
  return amountUsd * rate;
}
