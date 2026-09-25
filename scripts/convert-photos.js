const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Актуальная съёмка заказчика. Папки не попадают в репозиторий
// (см. .gitignore) - в проект уезжают только сжатые WebP.
const SRC = 'public/images/ткань';
// Презентационные кадры заказчик присылает отдельной папкой и кладёт
// рядом со съёмкой оттенков, а не внутрь неё.
const PRES = 'public/images/Презентационные';
const OUT = 'public/images/fabrics';

// Сопоставление подтверждено точным совпадением количества фото
// с colorsCount в src/data/fabrics.ts.
const MAP = {
  'Канвас camilla':   'kanvas',
  'Канвас Rosabella': 'kanvas-ali',
  'Сатин Camilla':    'satin',
  'Сатин Rosabella':  'satin-ali',
  'Бархат Glamour':   'barhat-glamour',
  'Double blackout':  'dvuhstoronniy-blekaut',
};

// Презентационное фото -> обложка ткани и слайд на главной.
// Пути относительно PRES. Имя файла здесь же задаёт номер оттенка на
// бейдже - он берётся из coverCodes в src/data/fabrics.ts, и при замене
// кадра эти два места надо держать вместе.
const HERO = [
  ['Канвас camilla/6489680577.jpg', 'kanvas'],
  ['канвас rosabella/160.JPG',      'kanvas-ali'],
  ['Сатин Camilla/119.JPG',         'satin'],
  ['Сатин rosabella/144 (1).JPG',   'satin-ali'],
  ['бархат Glamour/23.JPG',         'barhat-glamour'],
  ['Double blackout/IMG_4841.JPG',  'dvuhstoronniy-blekaut'],
];

/**
 * Имя файла = артикул оттенка у поставщика. У части съёмки имена
 * пришли с камеры (DSC02079, IMG_4888, Snapseed) - по таким номер
 * оттенка не определить, и в палитру они не идут: весь заказ у
 * заказчика строится на номерах.
 */
const isShadeCode = (code) => /^\d+$/.test(code) || code === 'без номера';

// ONLY=slug1,slug2 - пересобрать только часть тканей, не трогая остальные.
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const wanted = (slug) => !ONLY || ONLY.includes(slug);

// HERO_ONLY=1 - пересобрать только обложки и слайды, не трогая палитры.
// Заказчик меняет презентационный кадр чаще, чем саму съёмку оттенков,
// и гонять из-за одной обложки полсотни фотографий незачем.
const HERO_ONLY = process.env.HERO_ONLY === '1';

const safe = (code) =>
  code === 'без номера' ? 'bez-nomera'
  : code.replace(/[^A-Za-z0-9._-]/g, '-');

const num = (s) => { const m = s.match(/^\d+/); return m ? +m[0] : Number.MAX_SAFE_INTEGER; };

(async () => {
  const manifest = {};

  for (const [folder, slug] of Object.entries(MAP)) {
    if (HERO_ONLY || !wanted(slug)) continue;
    const dir = path.join(SRC, folder);
    const all = fs.readdirSync(dir).filter(f => /\.(jpe?g|png)$/i.test(f));
    const files = all
      .filter(f => isShadeCode(path.basename(f, path.extname(f))))
      .sort((a, b) => num(a) - num(b) || a.localeCompare(b, 'ru'));
    const skipped = all.length - files.length;
    if (skipped) console.log(slug, '- без номера в имени файла, пропущено:', skipped);

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
  const versions = {};
  for (const [rel, slug] of HERO) {
    if (!wanted(slug)) continue;
    const src = path.join(PRES, rel);
    if (!fs.existsSync(src)) { console.log('НЕТ ФАЙЛА:', rel); continue; }
    const coverFile = path.join(OUT, slug, 'cover.webp');
    await sharp(src).rotate().resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 86, effort: 6 }).toFile(coverFile);
    // Слайд героя разворачивается на всю ширину экрана - нужен запас.
    await sharp(src).rotate().resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 84, effort: 6 }).toFile(path.join('public/images/hero', slug + '.webp'));
    /*
     * Отпечаток содержимого обложки. Имя файла при замене кадра не меняется,
     * а оптимизатор картинок Next кеширует результат по адресу и по своим
     * же правилам инвалидации не имеет: документация прямо советует менять
     * src. Отпечаток уезжает в адрес параметром ?v=, поэтому новый кадр
     * виден сразу, а не через несколько часов.
     */
    versions[slug] = crypto.createHash('md5')
      .update(fs.readFileSync(coverFile)).digest('hex').slice(0, 8);
    heroes.push(slug);
  }
  console.log('обложки и слайды:', heroes.join(', '));

  // Отпечатки, как и манифест, дописываются: при частичной пересборке
  // версии остальных обложек должны остаться на месте.
  const versionsPath = path.join(__dirname, 'cover-versions.json');
  const allVersions = {
    ...(fs.existsSync(versionsPath)
      ? JSON.parse(fs.readFileSync(versionsPath, 'utf8'))
      : {}),
    ...versions,
  };
  fs.writeFileSync(versionsPath, JSON.stringify(allVersions, null, 2), 'utf8');
  fs.writeFileSync('src/data/cover-versions.ts',
    `/**
 * Отпечатки презентационных обложек. Файл сгенерирован
 * scripts/convert-photos.js - руками его править не нужно.
 *
 * Отпечаток подставляется в адрес картинки параметром ?v=. Без него
 * заменённая обложка ещё несколько часов показывалась бы старой:
 * оптимизатор картинок Next кеширует результат по адресу, а адрес при
 * замене кадра не меняется.
 */
export const coverVersions: Record<string, string> = ${
      JSON.stringify(allVersions, null, 2)
    };
`, 'utf8');

  // При частичной пересборке (ONLY=...) дописываем результат в манифест,
  // а не перезаписываем его: иначе палитры остальных тканей пропали бы.
  const manifestPath = path.join(__dirname, 'photo-manifest.json');
  const previous = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    : {};
  fs.writeFileSync(manifestPath,
    JSON.stringify({ ...previous, ...manifest }, null, 2), 'utf8');
  console.log('ГОТОВО');
})();
