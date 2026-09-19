const fs = require('fs');
const MANIFEST = require('path').join(__dirname, 'photo-manifest.json');
const m = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));

let out = `import type { FabricColor } from "@/lib/types";

/**
 * Отснятые палитры оттенков. Файл сгенерирован из фотографий заказчика:
 * имя исходного файла - это артикул оттенка у поставщика, он же показывается
 * на карточке и по нему клиент называет цвет при заказе.
 *
 * Чтобы добавить оттенки, положите фотографии в папку ткани и перегенерируйте
 * этот файл - вручную править его не нужно.
 */
export const fabricColors: Record<string, FabricColor[]> = {
`;

for (const [slug, colors] of Object.entries(m)) {
  out += `  "${slug}": [\n`;
  for (const c of colors) {
    out += `    { code: ${JSON.stringify(c.code)}, image: "/images/fabrics/${slug}/${c.id}.webp", thumb: "/images/fabrics/${slug}/thumb/${c.id}.webp" },\n`;
  }
  out += `  ],\n`;
}
out += `};\n`;

fs.writeFileSync('src/data/fabric-colors.ts', out, 'utf8');
console.log('src/data/fabric-colors.ts:', Object.entries(m).map(([k,v])=>k+'='+v.length).join(', '));
