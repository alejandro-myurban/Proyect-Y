/**
 * fetchBisIcons.mjs
 * Igual que parse-atlasloot.mjs: usa nether.wowhead.com para obtener
 * el icon de cada item por ID e inyectarlo en bisData.ts.
 *
 * Usage: node scripts/fetchBisIcons.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BIS_FILE  = join(__dirname, '../src/data/bisData.ts');
const DELAY_MS  = 400;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchIcon(id) {
  const url = `https://nether.wowhead.com/tbc/tooltip/item/${id}?locale=en_US`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
    });
    if (!res.ok) return '';
    const data = await res.json();
    return (data.icon ?? '').toLowerCase();
  } catch {
    return '';
  }
}

async function main() {
  const content = readFileSync(BIS_FILE, 'utf8');

  const emptyMatches = [...content.matchAll(/\{ id: (\d+), icon: "", /g)];
  const ids = [...new Set(emptyMatches.map(m => parseInt(m[1])))];

  if (ids.length === 0) {
    console.log('Todos los icons ya están poblados.');
    return;
  }

  console.log(`Fetching ${ids.length} icons desde nether.wowhead.com...`);

  const iconMap = new Map();
  let done = 0;

  for (const id of ids) {
    const icon = await fetchIcon(id);
    iconMap.set(id, icon);
    done++;
    if (done % 20 === 0 || done === ids.length) {
      process.stdout.write(`\r  ${done}/${ids.length} — último: ${icon || '(vacío)'}    `);
    }
    await sleep(DELAY_MS);
  }

  const found = [...iconMap.values()].filter(Boolean).length;
  console.log(`\nIconos encontrados: ${found}/${ids.length}`);

  let updated = content;
  for (const [id, icon] of iconMap) {
    if (icon) {
      updated = updated.replaceAll(
        `{ id: ${id}, icon: "", `,
        `{ id: ${id}, icon: "${icon}", `
      );
    }
  }

  writeFileSync(BIS_FILE, updated, 'utf8');
  console.log(`Guardado: ${BIS_FILE}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
