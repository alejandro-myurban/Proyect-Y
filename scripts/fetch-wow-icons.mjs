/**
 * fetch-wow-icons.mjs
 *
 * Searches Wowhead TBC by item NAME and updates ALL derived fields:
 *   id, icon, boss, raid
 *
 * The Wowhead search response includes:
 *   - item.id        → correct item ID
 *   - item.icon      → correct icon texture
 *   - item.sourcemore[0].n  → boss / source name
 *   - item.sourcemore[0].z  → zone ID → maps to Karazhan / Gruul / Magtheridon
 *
 * Usage:
 *   node scripts/fetch-wow-icons.mjs
 *
 * Requirements: Node 18+
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, '../src/data/tbcRaidItems.js');

const DELAY_MS = 350;
const SEARCH_URL = 'https://www.wowhead.com/tbc/search?q=';

// Wowhead zone ID → our raid constant name (as written in the JS file)
const ZONE_TO_RAID = {
  3457: 'KZ',   // Karazhan
  3923: 'GR',   // Gruul's Lair
  3836: 'MG',   // Magtheridon's Lair
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function parseWowheadResponse(text) {
  try {
    // eslint-disable-next-line no-new-func
    return new Function(`return ${text}`)();
  } catch { return null; }
}

async function searchItem(name) {
  const url = SEARCH_URL + encodeURIComponent(name) + '&json=1';
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' }
    });
    if (!res.ok) { console.warn(`HTTP ${res.status}`); return null; }

    const data = parseWowheadResponse(await res.text());
    if (!Array.isArray(data) || !data[1]?.items?.length) return null;

    const nameLower = name.toLowerCase();
    const match =
      data[1].items.find(i => i.name?.toLowerCase() === nameLower) ??
      data[1].items[0];

    if (!match?.id || !match?.icon) return null;

    // Extract boss + zone from sourcemore (first entry)
    const src = match.sourcemore?.[0];
    const zoneId  = src?.z ?? null;
    const bossName = src?.n ?? null;
    const raidConst = zoneId ? ZONE_TO_RAID[zoneId] ?? null : null;

    return {
      id:        match.id,
      icon:      match.icon,
      foundName: match.name,
      bossName,
      raidConst,
      zoneId,
    };
  } catch (err) {
    console.warn(`fetch error: ${err.message}`);
    return null;
  }
}

// ── Line parser ────────────────────────────────────────────────────────────────
// Parses every item line from the JS file into a structured object.
// Handles both single and double quoted name fields.
function parseItems(source) {
  const items = [];
  for (const [lineIdx, line] of source.split('\n').entries()) {
    const m = line.match(
      /\{\s*id:\s*(\d+),\s*name:\s*(['"])((?:(?!\2)[^\\]|\\.)*)\2.*?boss:\s*'([^']*)'.*?raid:\s*(\w+).*?icon:\s*'([^']+)'/
    );
    if (!m) continue;
    items.push({
      lineIdx,
      id:          parseInt(m[1]),
      nameQuote:   m[2],
      name:        m[3].replace(/\\'/g, "'").replace(/\\"/g, '"'),
      currentBoss: m[4],
      currentRaid: m[5],
      currentIcon: m[6],
    });
  }
  return items;
}

// ── Source patcher ─────────────────────────────────────────────────────────────
// Replaces id, boss, raid, icon in a single item line.
function patchLine(line, oldItem, newValues) {
  let result = line;

  if (newValues.id !== oldItem.id) {
    result = result.replace(
      new RegExp(`(\\{\\s*id:\\s*)${oldItem.id}(,)`),
      `$1${newValues.id}$2`
    );
  }
  if (newValues.icon && newValues.icon !== oldItem.currentIcon) {
    result = result.replace(
      new RegExp(`(icon:\\s*')${escRx(oldItem.currentIcon)}(')`),
      `$1${newValues.icon}$2`
    );
  }
  if (newValues.boss && newValues.boss !== oldItem.currentBoss) {
    result = result.replace(
      new RegExp(`(boss:\\s*')${escRx(oldItem.currentBoss)}(')`),
      `$1${newValues.boss}$2`
    );
  }
  if (newValues.raidConst && newValues.raidConst !== oldItem.currentRaid) {
    result = result.replace(
      new RegExp(`(raid:\\s*)${oldItem.currentRaid}(,|\\s)`),
      `$1${newValues.raidConst}$2`
    );
  }
  return result;
}

function escRx(str) { return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Reading tbcRaidItems.js…\n');
  const source = readFileSync(DATA_FILE, 'utf-8');
  const lines  = source.split('\n');
  const items  = parseItems(source);

  console.log(`Found ${items.length} items. Fetching from Wowhead by name…\n`);

  const stats = { id: 0, icon: 0, boss: 0, raid: 0, skip: 0, ok: 0 };

  for (const item of items) {
    process.stdout.write(`  [${String(item.id).padEnd(6)}] "${item.name}" … `);

    const r = await searchItem(item.name);

    if (!r) {
      console.log('SKIP (no result)');
      stats.skip++;
      await sleep(DELAY_MS);
      continue;
    }
    if (r.foundName.toLowerCase() !== item.name.toLowerCase()) {
      console.log(`SKIP (mismatch: "${r.foundName}")`);
      stats.skip++;
      await sleep(DELAY_MS);
      continue;
    }
    // Only apply boss/raid if Wowhead says it belongs to one of our 3 raids
    const newBoss      = r.raidConst ? r.bossName  : null;
    const newRaidConst = r.raidConst ?? null;

    const changes = {
      id:        r.id,
      icon:      r.icon,
      boss:      newBoss,
      raidConst: newRaidConst,
    };

    const diff = [];
    if (r.id    !== item.id)          diff.push(`id: ${item.id}→${r.id}`);
    if (r.icon  !== item.currentIcon) diff.push(`icon: …→${r.icon}`);
    if (newBoss && newBoss !== item.currentBoss)
      diff.push(`boss: "${item.currentBoss}"→"${newBoss}"`);
    if (newRaidConst && newRaidConst !== item.currentRaid)
      diff.push(`raid: ${item.currentRaid}→${newRaidConst}`);

    if (diff.length === 0) {
      console.log('OK');
      stats.ok++;
    } else {
      const patched = patchLine(lines[item.lineIdx], item, changes);
      if (patched === lines[item.lineIdx]) {
        console.log(`SKIP (patch failed) [${diff.join(', ')}]`);
        stats.skip++;
      } else {
        lines[item.lineIdx] = patched;
        console.log(diff.join(' | '));
        if (r.id    !== item.id)          stats.id++;
        if (r.icon  !== item.currentIcon) stats.icon++;
        if (newBoss && newBoss !== item.currentBoss)  stats.boss++;
        if (newRaidConst && newRaidConst !== item.currentRaid) stats.raid++;
      }
    }

    await sleep(DELAY_MS);
  }

  const changed = stats.id + stats.icon + stats.boss + stats.raid;
  if (changed > 0) {
    writeFileSync(DATA_FILE, lines.join('\n'), 'utf-8');
    console.log('\n✅ Guardado.');
  } else {
    console.log('\n✅ Todo ya estaba correcto.');
  }

  console.log(`   IDs:    ${stats.id}  |  Iconos: ${stats.icon}  |  Boss: ${stats.boss}  |  Raid: ${stats.raid}`);
  console.log(`   Sin cambios: ${stats.ok}  |  Saltados: ${stats.skip}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
