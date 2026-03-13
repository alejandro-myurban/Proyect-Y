/**
 * Fetches item icons from WoWhead TBC search API by item ID
 * and injects them into src/data/bisData.ts
 * Run: node scripts/fetchIcons.cjs
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');

const BIS_FILE = path.join(__dirname, '../src/data/bisData.ts');
const DELAY_MS = 120; // ms between requests to avoid rate-limiting

// ── Extract all unique item IDs ───────────────────────────────────────────────
const content = fs.readFileSync(BIS_FILE, 'utf8');
const idMatches = [...content.matchAll(/\bid:\s*(\d+)/g)];
const uniqueIds = [...new Set(idMatches.map(m => parseInt(m[1])))];
console.log(`Found ${uniqueIds.length} unique item IDs`);

// ── WoWhead search API (same method as fetch-wow-icons.mjs) ───────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseWowheadResponse(text) {
  try {
    // WoWhead returns JS array literal — eval it safely
    return new Function(`return ${text}`)();
  } catch { return null; }
}

async function fetchIconById(id) {
  const url = `https://www.wowhead.com/tbc/search?q=${id}&json=1`;
  try {
    const text = await httpsGet(url);
    const data = parseWowheadResponse(text);
    if (!Array.isArray(data) || !data[1]?.items?.length) return '';
    // Find exact ID match
    const match = data[1].items.find(i => i.id === id) ?? data[1].items[0];
    return match?.icon ?? '';
  } catch {
    return '';
  }
}

// ── Fetch all icons ───────────────────────────────────────────────────────────
async function fetchAll(ids) {
  const iconMap = new Map();
  let done = 0;

  for (const id of ids) {
    const icon = await fetchIconById(id);
    iconMap.set(id, icon);
    done++;
    if (done % 50 === 0) process.stdout.write(`\r  ${done}/${ids.length} (last: ${icon || '—'})    `);
    await sleep(DELAY_MS);
  }
  console.log(`\nDone. Icons found: ${[...iconMap.values()].filter(Boolean).length}/${ids.length}`);
  return iconMap;
}

// ── Rebuild bisData.ts ────────────────────────────────────────────────────────
function addIconToType(src) {
  if (src.includes('  icon: string;')) return src; // already added
  return src.replace(
    /(export type BisItem = \{[^}]*?)(};)/s,
    (_, body, close) => `${body}  icon: string;\n${close}`
  );
}

function injectIcons(src, iconMap) {
  // Replace { id: 12345, ... with { id: 12345, icon: "inv_...",
  // Skip if icon field already present
  return src.replace(
    /\{ id: (\d+), (?!icon:)/g,
    (_, idStr) => {
      const icon = iconMap.get(parseInt(idStr)) || '';
      return `{ id: ${idStr}, icon: ${JSON.stringify(icon)}, `;
    }
  );
}

(async () => {
  // Skip items that already have icons
  const alreadyHasIcons = content.includes('icon: "') || content.includes("icon: '");
  let idsToFetch = uniqueIds;

  if (alreadyHasIcons) {
    // Only fetch missing ones
    const existingMatches = [...content.matchAll(/\{ id: (\d+), icon: "([^"]*)"/g)];
    const existingMap = new Map(existingMatches.map(m => [parseInt(m[1]), m[2]]));
    idsToFetch = uniqueIds.filter(id => !existingMap.get(id));
    console.log(`${existingMap.size} icons already present, fetching ${idsToFetch.length} missing...`);
    if (idsToFetch.length === 0) { console.log('All icons already fetched!'); return; }
  }

  const iconMap = await fetchAll(idsToFetch);

  // Merge with existing if partial run
  if (alreadyHasIcons) {
    const existingMatches = [...content.matchAll(/\{ id: (\d+), icon: "([^"]*)"/g)];
    existingMatches.forEach(m => {
      if (!iconMap.has(parseInt(m[1]))) iconMap.set(parseInt(m[1]), m[2]);
    });
  }

  let updated = addIconToType(content);
  updated = injectIcons(updated, iconMap);

  fs.writeFileSync(BIS_FILE, updated, 'utf8');
  console.log(`Saved: ${BIS_FILE}`);
})();
