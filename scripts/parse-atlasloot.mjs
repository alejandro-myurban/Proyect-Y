/**
 * parse-atlasloot.mjs
 *
 * 1. Parsea data-tbc.lua (AtlasLoot Enhanced TBC) extrayendo
 *    boss → itemIDs para Karazhan, Gruul's Lair y Magtheridon.
 * 2. Consulta el tooltip API de Wowhead TBC por cada item ID
 *    para obtener: nombre, quality, slot, icon.
 * 3. Genera src/data/tbcRaidItems.js desde cero.
 *
 * Uso: node scripts/parse-atlasloot.mjs
 * Requisitos: Node 18+
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LUA_FILE  = join(__dirname, '../data-tbc.lua');
const OUT_FILE  = join(__dirname, '../src/data/tbcRaidItems.js');

const DELAY_MS = 400;

// ── Configuración de raids ────────────────────────────────────────────────────

const RAID_CONFIG = {
  'Karazhan':         { const: 'KZ', display: 'Karazhan' },
  'GruulsLair':       { const: 'GR', display: "Gruul's Lair" },
  'MagtheridonsLair': { const: 'MG', display: 'Guarida de Magtheridon' },
};

const QUALITY_NAMES = ['poor', 'common', 'uncommon', 'rare', 'epic', 'legendary'];


// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Parser del Lua ────────────────────────────────────────────────────────────
//
// Devuelve:
//   { raidKey: [{ boss: string, items: [{ id: number, luaName: string }] }] }

function parseLua(source) {
  const lines = source.split('\n');
  const result = {};

  let globalDepth  = 0;
  let currentRaid  = null;
  let raidDepth    = 0;
  let inItems      = false;
  let itemsDepth   = 0;
  let currentBoss  = null;
  let bossDepth    = 0;
  let isExtraList  = false;
  let inNormDiff   = false;
  let normDiffDepth = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // ── Contar llaves ignorando strings y comentarios --
    let opens = 0, closes = 0;
    let inStr = false, strChar = '';
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      // Saltar comentarios --
      if (!inStr && c === '-' && line[i + 1] === '-') break;
      // Strings
      if (!inStr && (c === '"' || c === "'")) { inStr = true; strChar = c; continue; }
      if (inStr && c === strChar) { inStr = false; continue; }
      if (!inStr) {
        if (c === '{') opens++;
        else if (c === '}') closes++;
      }
    }

    globalDepth += opens - closes;

    // ── Detección de bloque de raid ──────────────────────────────────────────
    if (!currentRaid) {
      const m = trimmed.match(/^data\["(Karazhan|GruulsLair|MagtheridonsLair)"\]\s*=/);
      if (m) {
        currentRaid = m[1];
        raidDepth   = globalDepth;
        result[currentRaid] = [];
      }
      continue;
    }

    // Saliendo del bloque de raid
    if (globalDepth < raidDepth) {
      currentRaid = null; inItems = false; currentBoss = null; inNormDiff = false;
      continue;
    }

    // ── Detección de items = { ───────────────────────────────────────────────
    if (!inItems && trimmed.match(/^items\s*=\s*\{/)) {
      inItems    = true;
      itemsDepth = globalDepth;
      continue;
    }

    if (!inItems) continue;

    // Saliendo del array items
    if (globalDepth < itemsDepth) { inItems = false; continue; }

    // ── Detección de boss ────────────────────────────────────────────────────
    if (!currentBoss) {
      // Solo los hijos directos del array items (depth == itemsDepth + 1)
      if (globalDepth === itemsDepth + 1) {
        const nameMatch = trimmed.match(/name\s*=\s*AL\["([^"]+)"\]/);
        if (nameMatch) {
          currentBoss  = nameMatch[1];
          bossDepth    = itemsDepth + 1;
          isExtraList  = false;
          inNormDiff   = false;
          result[currentRaid].push({ boss: currentBoss, items: [] });
        }
      }
      continue;
    }

    // ── Dentro del bloque de boss ────────────────────────────────────────────

    // ExtraList → ignorar este boss (trash, T4 overview, etc.)
    if (trimmed.match(/ExtraList\s*=\s*true/)) {
      isExtraList = true;
      result[currentRaid].pop();
    }

    // Saliendo del bloque de boss
    if (globalDepth < bossDepth) {
      currentBoss = null; inNormDiff = false;
      continue;
    }

    // ── Detección de [NORMAL_DIFF] = { ──────────────────────────────────────
    if (!inNormDiff && trimmed.match(/^\[NORMAL_DIFF\]\s*=\s*\{/)) {
      inNormDiff    = true;
      normDiffDepth = globalDepth;
      continue;
    }

    if (!inNormDiff) continue;

    // Saliendo de NORMAL_DIFF
    if (globalDepth < normDiffDepth) { inNormDiff = false; continue; }

    // ── Extracción de item IDs ───────────────────────────────────────────────
    if (!isExtraList) {
      // Patrón: { posición, itemID }, -- Nombre del item
      // El ID debe ser >= 4 dígitos para descartar posiciones (1-30)
      const m = trimmed.match(/^\{\s*\d+,\s*(\d{4,})\s*\}.*?(?:--\s*(.+))?$/);
      if (m) {
        const id      = parseInt(m[1]);
        const luaName = m[2]?.trim() ?? '';
        const boss    = result[currentRaid].at(-1);
        if (boss && !boss.items.some(i => i.id === id)) {
          boss.items.push({ id, luaName });
        }
      }
    }
  }

  return result;
}

// ── Wowhead TBC Tooltip API ───────────────────────────────────────────────────

// El slot viene embebido en el HTML del tooltip; mapeamos nombres ingleses → español
const EN_SLOT_TO_ES = {
  'Head':              'Cabeza',
  'Neck':              'Cuello',
  'Shoulder':          'Hombros',
  'Back':              'Capa',
  'Chest':             'Pecho',
  'Wrist':             'Muñecas',
  'Hands':             'Manos',
  'Waist':             'Cintura',
  'Legs':              'Piernas',
  'Feet':              'Pies',
  'Finger':            'Anillo',
  'Trinket':           'Reliquia',
  'One-Hand':          'Arma (1 mano)',
  'Main Hand':         'Arma principal',
  'Off Hand':          'Mano izq.',
  'Held In Off-Hand':  'Mano izq.',
  'Two-Hand':          'Dos manos',
  'Ranged':            'A distancia',
  'Thrown':            'A distancia',
  'Shirt':             'Cuerpo',
  'Tabard':            'Tabardo',
  'Bag':               'Bolsa',
  'Projectile':        'Munición',
  'Relic':             'Reliquia',
  'Quest':             'Misión',
};

function parseSlotFromTooltip(html) {
  if (!html) return null;
  // Busca todos los contenidos de <td>...</td> y devuelve el primero que sea un slot válido
  for (const m of html.matchAll(/<td>([^<]+)<\/td>/g)) {
    const candidate = m[1].trim();
    if (EN_SLOT_TO_ES[candidate]) return EN_SLOT_TO_ES[candidate];
  }
  return null;
}

async function fetchItem(id) {
  const url = `https://nether.wowhead.com/tbc/tooltip/item/${id}?locale=en_US`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
    });
    if (!res.ok) { console.warn(`    HTTP ${res.status}`); return null; }
    const data = await res.json();
    if (!data?.name) return null;

    const quality = QUALITY_NAMES[data.quality] ?? 'common';
    const slot    = parseSlotFromTooltip(data.tooltip) ?? 'Miscelánea';
    const icon    = (data.icon ?? 'inv_misc_questionmark').toLowerCase();

    return { name: data.name, quality, slot, icon };
  } catch (err) {
    console.warn(`    Error: ${err.message}`);
    return null;
  }
}

// ── Generador de tbcRaidItems.js ──────────────────────────────────────────────

function escape(str) {
  // Usa comillas dobles si el string contiene apóstrofes; simples si no
  if (str.includes("'")) return `"${str}"`;
  return `'${str}'`;
}

function buildOutput(allBosses) {
  const raidSections = [];

  for (const [raidKey, bossList] of Object.entries(allBosses)) {
    const cfg = RAID_CONFIG[raidKey];
    const lines = [`\n  // ─── ${cfg.display.toUpperCase()} ${'─'.repeat(Math.max(0, 60 - cfg.display.length))}`];

    for (const { boss, items: resolvedItems } of bossList) {
      if (resolvedItems.length === 0) continue;
      lines.push(`\n  // ${boss}`);
      for (const item of resolvedItems) {
        const namePart = escape(item.name);
        lines.push(
          `  { id: ${String(item.id).padEnd(5)}, name: ${namePart.padEnd(45)}, quality: ${escape(item.quality).padEnd(12)}, slot: ${escape(item.slot).padEnd(22)}, boss: ${escape(boss).padEnd(38)}, raid: ${cfg.const}, icon: '${item.icon}' },`
        );
      }
    }

    raidSections.push(lines.join('\n'));
  }

  return `// TBC Classic Raid Item Database — generado por parse-atlasloot.mjs
// Fuente: AtlasLoot Enhanced (data-tbc.lua) + Wowhead TBC tooltip API
// Icons: https://wow.zamimg.com/images/wow/icons/medium/{icon}.jpg

export const TBC_RAIDS = ['Karazhan', "Gruul's Lair", 'Guarida de Magtheridon'];

export const QUALITY_COLORS = {
  uncommon: '#1eff00',
  rare:     '#0070dd',
  epic:     '#a335ee',
  legendary:'#ff8000',
};

const KZ = 'Karazhan';
const GR = "Gruul's Lair";
const MG = 'Guarida de Magtheridon';

export const TBC_RAID_ITEMS = [${raidSections.join('')}
];

// Helper: todos los bosses de una raid
export function getBossesForRaid(raidName) {
  return [...new Set(
    TBC_RAID_ITEMS
      .filter(i => i.raid === raidName)
      .map(i => i.boss)
  )];
}

// Helper: items filtrados
export function getItems({ raid = null, boss = null, search = '' } = {}) {
  return TBC_RAID_ITEMS.filter(item => {
    if (raid   && item.raid !== raid)   return false;
    if (boss   && item.boss !== boss)   return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
}
`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('── Leyendo data-tbc.lua…\n');
  const source = readFileSync(LUA_FILE, 'utf-8');
  const parsed = parseLua(source);

  // Mostrar resumen del parser
  let totalItems = 0;
  for (const [raidKey, bossList] of Object.entries(parsed)) {
    console.log(`${RAID_CONFIG[raidKey].display}: ${bossList.length} bosses`);
    for (const b of bossList) {
      console.log(`  · ${b.boss}: ${b.items.length} items`);
      totalItems += b.items.length;
    }
  }
  console.log(`\nTotal: ${totalItems} items a consultar en Wowhead\n`);

  // Colección de todos los IDs únicos para no repetir peticiones
  const itemCache = new Map(); // id → { name, quality, slot, icon }

  const allBosses = {}; // raidKey → [{ boss, items: resolvedItems }]

  for (const [raidKey, bossList] of Object.entries(parsed)) {
    allBosses[raidKey] = [];

    for (const { boss, items } of bossList) {
      const resolved = [];
      console.log(`[${RAID_CONFIG[raidKey].const}] ${boss}`);

      for (const { id, luaName } of items) {
        process.stdout.write(`  ${String(id).padEnd(6)} `);

        let details;
        if (itemCache.has(id)) {
          details = itemCache.get(id);
          process.stdout.write(`(caché) ${details?.name ?? 'null'}\n`);
        } else {
          details = await fetchItem(id);
          itemCache.set(id, details);
          if (details) {
            process.stdout.write(`${details.name} [${details.quality}] ${details.slot}\n`);
          } else {
            // Fallback al nombre del comentario Lua
            process.stdout.write(`SKIP — sin datos${luaName ? ` (Lua: ${luaName})` : ''}\n`);
          }
          await sleep(DELAY_MS);
        }

        if (details) {
          resolved.push({ id, ...details });
        }
      }

      allBosses[raidKey].push({ boss, items: resolved });
      console.log('');
    }
  }

  const output = buildOutput(allBosses);
  writeFileSync(OUT_FILE, output, 'utf-8');

  console.log('✅ tbcRaidItems.js generado correctamente.');
  console.log(`   Items escritos: ${[...itemCache.values()].filter(Boolean).length} de ${totalItems}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
