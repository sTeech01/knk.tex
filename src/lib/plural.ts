/**
 * Русское склонение по числу: plural(2, ["вид", "вида", "видов"]) - «вида».
 * Формы: для 1, для 2-4, для 5-20 и нуля.
 */
export function plural(
  count: number,
  [one, few, many]: [string, string, string]
): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
