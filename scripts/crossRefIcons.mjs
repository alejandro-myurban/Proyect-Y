/**
 * crossRefIcons.mjs
 * Copia los icon names de tbcRaidItems.ts a bisData.ts por item ID.
 * No requiere red ni APIs.
 *
 * Usage: node scripts/crossRefIcons.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAID_FILE = join(__dirname, '../src/data/tbcRaidItems.ts');
const BIS_FILE  = join(__dirname, '../src/data/bisData.ts');

// Extrae { id -> icon } de tbcRaidItems.ts
const raidSrc = readFileSync(RAID_FILE, 'utf8');
const raidMap = new Map();
for (const m of raidSrc.matchAll(/id:\s*(\d+),[^}]*?icon:\s*'([^']+)'/g)) {
  raidMap.set(m[1], m[2]);
}
console.log(`tbcRaidItems: ${raidMap.size} icons cargados`);

// Inyecta en bisData.ts donde icon: "" y el ID coincide
let bisSrc = readFileSync(BIS_FILE, 'utf8');
let filled = 0;
bisSrc = bisSrc.replace(/\{ id: (\d+), icon: "", /g, (match, id) => {
  const icon = raidMap.get(id);
  if (icon) { filled++; return `{ id: ${id}, icon: "${icon}", `; }
  return match;
});

writeFileSync(BIS_FILE, bisSrc, 'utf8');
console.log(`bisData: ${filled} icons copiados de tbcRaidItems`);
console.log(`Quedan vacíos: items de heroics/crafted/reputación que no están en raids.`);
