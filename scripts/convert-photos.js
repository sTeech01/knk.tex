const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = 'public/images/Фото товара';
const OUT = 'public/images/fabrics';

// Сопоставление подтверждено точным совпадением количества фото
// с colorsCount в src/data/fabrics.ts.
const MAP = {
  'Канвас Camilla':   'kanvas',
  'Канвас Rosabella': 'kanvas-ali',
  'Сатин Camilla':    'satin',
  'Сатин Rosabella':  'satin-ali',
};

// Презентационное фото -> обложка ткани и слайд на главной.
const HERO = [
  ['Презентационные/Канвас camilla/114.JPG',    'kanvas'],
  ['Презентационные/канвас Rosabella/44.JPG',   'kanvas-ali'],
  ['Презентационные/Сатин Camilla/389.JPG',     'satin'],
  ['Презентационные/Сатин  Rosabella_/119.JPG', 'satin-ali'],
];

const safe = (code) =>
  code === 'без номера' ? 'bez-nomera'
  : code.replace(/[^A-Za-z0-9._-]/g, '-');

const num = (s) => { const m = s.match(/^\d+/); return m ? +m[0] : Number.MAX_SAFE_INTEGER; };

(async () => {
  const manifest = {};

  for (const [folder, slug] of Object.entries(MAP)) {
    const dir = path.join(SRC, folder);
    const files = fs.readdirSync(dir)
      .filter(f => /\.(jpe?g|png)$/i.test(f))
      .sort((a, b) => num(a) - num(b) || a.localeCompare(b, 'ru'));

    fs.mkdirSync(path.join(OUT, slug, 'thumb'), { recursive: true });
    manifest[slug] = [];

    for (const f of files) {
      const code = path.basename(f, path.extname(f));
      const id = safe(code);
      const src = path.join(dir, f);

      // 1200px: слот показа ~584px, на retina-экранах это 1168px.
      // effort 6 - максимальное усилие кодировщика: на переплетении ткани
      // даёт заметно больше детали при том же качестве.
      await sharp(src).rotate().resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 86, effort: 6 }).toFile(path.join(OUT, slug, id + '.webp'));
      // Миниатюра в сетке палитры показывается размером ~80px, поэтому
      // 176px хватает с запасом на retina. Раньше было 320px - сетка
      // канваса Rosabella весила 2,1 МБ и тормозила карточку.
      await sharp(src).rotate().resize({ width: 176, withoutEnlargement: true })
        .webp({ quality: 80, effort: 6 }).toFile(path.join(OUT, slug, 'thumb', id + '.webp'));

      manifest[slug].push({ code: code === 'без номера' ? 'б/н' : code, id });
    }
    console.log(slug, '->', files.length, 'оттенков');
  }

  // Презентационные: обложка ткани + слайд героя (шире, для полноэкранного фона).
  fs.mkdirSync('public/images/hero', { recursive: true });
  const heroes = [];
  for (const [rel, slug] of HERO) {
    const src = path.join(SRC, rel);
    if (!fs.existsSync(src)) { console.log('НЕТ ФАЙЛА:', rel); continue; }
    await sharp(src).rotate().resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 86, effort: 6 }).toFile(path.join(OUT, slug, 'cover.webp'));
    // Слайд героя разворачивается на всю ширину экрана - нужен запас.
    await sharp(src).rotate().resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 84, effort: 6 }).toFile(path.join('public/images/hero', slug + '.webp'));
    heroes.push(slug);
  }
  console.log('обложки и слайды:', heroes.join(', '));

  fs.writeFileSync(path.join(__dirname, 'photo-manifest.json'),
    JSON.stringify(manifest, null, 2), 'utf8');
  console.log('ГОТОВО');
})();
