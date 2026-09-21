export function formatRub(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("ru-RU").format(amount);
}
