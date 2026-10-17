#!/usr/bin/env node
// ============================================================
//  Генератор кода для вставки лендинга в Tilda (блок «HTML-код» / T123)
//  Источник правды — index.html в корне репозитория.
//  Запуск:  node .github/scripts/make-tilda-embed.mjs
//  Результат (папка tilda/):
//    embed.html       — весь лендинг одним фрагментом
//    part1-styles.html — только шрифт + стили (если блок Tilda не
//                        принимает весь объём, вставить в первый блок)
//    part2-content.html — разметка + скрипты (во второй блок)
//    preview.html     — автономная страница для локальной проверки
//  Картинки не нужно загружать в Tilda: все ссылки ведут на CDN
//  static.tildacdn.com того же аккаунта.
// ============================================================
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');

// --- 1. Извлекаем части -------------------------------------------------
const style = html.match(/<style>([\s\S]*?)<\/style>/)?.[1];
if (!style) throw new Error('Не найден <style> в index.html');

const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1];
if (!body) throw new Error('Не найден <body> в index.html');

const m = body.match(/<script>([\s\S]*?)<\/script>\s*$/);
if (!m) throw new Error('Не найден финальный <script> в body');
const script = m[1];
const markup = body.slice(0, m.index).trim();

// --- 2. Локальные ассеты -> CDN Tilda (тот же аккаунт) -------------------
const CDN = 'https://static.tildacdn.com';
const assets = {
  'assets/logo.png':          `${CDN}/tild3536-3533-4131-b662-376365393266/__.png`,
  'assets/hero.jpg':          `${CDN}/tild6239-3230-4562-b830-616538323532/CR7A2037.jpg`,
  'assets/doc-talyzina.png':  `${CDN}/tild3538-6535-4835-b236-623532353139/noroot.png`,
  'assets/doc-shurakova.png': `${CDN}/tild3765-3236-4330-b731-303031303831/noroot.png`,
  'assets/doc-sulimov.png':   `${CDN}/tild6164-3163-4962-b034-316665613135/noroot.png`,
  'assets/doc-kremleva.png':  `${CDN}/tild3164-3035-4339-b261-303064663339/noroot.png`,
  'assets/doc-hlyaka.png':    `${CDN}/tild6535-3433-4262-a563-363164313462/noroot.png`,
  'assets/clinic-2.jpg':      `${CDN}/tild3064-3837-4333-a466-613532646533/photo_2021-04-07_15-.jpg`,
  'assets/clinic-3.jpg':      `${CDN}/tild6431-3166-4063-a139-323461323731/photo_2021-04-07_15-.jpg`,
  'assets/review-1.png':      `${CDN}/tild6533-3530-4066-b061-663133623237/1.png`,
  'assets/review-2.png':      `${CDN}/tild3038-3330-4034-a664-386339376439/2.png`,
  'assets/review-3.png':      `${CDN}/tild3235-6335-4866-b165-313661653930/3.png`,
  'assets/review-4.png':      `${CDN}/tild3635-3365-4664-a461-643736623035/4.png`,
  'assets/review-5.png':      `${CDN}/tild6230-6662-4564-b664-323562366235/Group_157.png`,
};

// Ссылка на политику: на Tilda заменить на свою страницу (см. README)
const POLICY_URL = 'https://fedotovfrontalex.github.io/charodey/privacy.html';

function fix(src) {
  let out = src;
  for (const [local, cdn] of Object.entries(assets)) out = out.split(local).join(cdn);
  out = out.split('href="privacy.html"').join(`href="${POLICY_URL}"`);
  return out;
}

// --- 3. Стили: подстраховка от шрифтов/классов Tilda ---------------------
const overrides = `
/* === Переопределения для окружения Tilda === */
body,.t-body{font-family:'Manrope','Segoe UI',system-ui,-apple-system,sans-serif !important;}
h1,h2,h3,h4{font-family:'Manrope','Segoe UI',system-ui,-apple-system,sans-serif !important;}
`;

const fontLink = '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">';

const part1 = `<!-- Лендинг «Чародеи» — ЧАСТЬ 1: шрифт и стили (вставьте в первый блок «HTML-код») -->\n${fontLink}\n<style>${fix(style)}${overrides}</style>`;
const part2 = `<!-- Лендинг «Чародеи» — ЧАСТЬ 2: контент и скрипты (вставьте во второй блок «HTML-код» ниже первого) -->\n${fix(markup)}\n<script>${script}</script>`;
const embed = `<!-- Лендинг «Чародеи» — весь код одним фрагментом для блока Tilda «HTML-код» (T123).
     Если блок не примет объём, используйте part1-styles.html + part2-content.html в двух блоках. -->\n${fontLink}\n<style>${fix(style)}${overrides}</style>\n${fix(markup)}\n<script>${script}</script>`;

const preview = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Превью — лендинг «Чародеи» для Tilda</title>
</head>
<body style="margin:0">
${embed}
</body>
</html>`;

// --- 4. Записываем -------------------------------------------------------
const outDir = join(root, 'tilda');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'embed.html'), embed);
writeFileSync(join(outDir, 'part1-styles.html'), part1);
writeFileSync(join(outDir, 'part2-content.html'), part2);
writeFileSync(join(outDir, 'preview.html'), preview);

const kb = n => (Buffer.byteLength(n, 'utf8') / 1024).toFixed(1) + ' KB';
console.log('Готово. Файлы в tilda/:');
console.log('  embed.html        ', kb(embed), '(один блок T123)');
console.log('  part1-styles.html ', kb(part1), '(блок 1)');
console.log('  part2-content.html', kb(part2), '(блок 2)');
console.log('  preview.html      ', kb(preview), '(локальная проверка в браузере)');

let leftovers = 0;
for (const local of Object.keys(assets)) {
  if (embed.includes(local)) { console.log('ОШИБКА: не заменён', local); leftovers++; }
}
if (leftovers === 0) console.log('Все локальные пути к картинкам заменены на CDN Tilda.');
