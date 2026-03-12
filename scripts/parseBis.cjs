#!/usr/bin/env node
/**
 * parseBis.js
 * Parses WoW TBC BiS data from Lua files and generates a TypeScript data file.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ITEM_SOURCES_FILE = path.join(ROOT, 'ItemSources.lua');
const GUIDES_DIR = path.join(ROOT, 'guides');
const OUTPUT_FILE = path.join(ROOT, 'src', 'data', 'bisData.ts');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Strip LBIS.L["..."] wrapper(s) from a value string, handling concatenation.
 * Examples:
 *   LBIS.L["Drop"]                              → "Drop"
 *   LBIS.L["Oz"] .. " & " .. LBIS.L["Wolf"]    → "Oz & Wolf"
 *   "plain string"                              → "plain string"
 *   LBIS.L["Oz"]~LBIS.L["Wolf"]                → "Oz~Wolf"  (tilde separator)
 */
function stripLBIS(raw) {
  if (!raw) return '';
  raw = raw.trim();

  // Replace all LBIS.L["..."] occurrences
  let result = raw.replace(/LBIS\.L\["([^"]+)"\]/g, '$1');

  // Remove Lua concat operators and surrounding quotes/spaces
  result = result.replace(/\s*\.\.\s*/g, '');

  // Remove surrounding quotes if the whole thing is a plain quoted string
  result = result.replace(/^"(.*)"$/, '$1');

  return result.trim();
}

/**
 * Escape a string for TypeScript template literal / double-quoted string use.
 */
function escapeTs(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, ' ');
}

// ---------------------------------------------------------------------------
// 1. Parse ItemSources.lua
// ---------------------------------------------------------------------------

function parseItemSources(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const itemMap = {}; // { [itemId: number]: { name, sourceType, source, sourceLocation } }

  // Match each entry: [<id>] = { ... }
  // We process line-by-line since each item is on one line
  const lineRe = /^\s*\[(\d+)\]\s*=\s*\{(.+)\}\s*,?\s*$/;

  for (const line of content.split('\n')) {
    const m = line.match(lineRe);
    if (!m) continue;

    const itemId = parseInt(m[1], 10);
    const body = m[2];

    // Extract fields
    const nameM = body.match(/Name\s*=\s*"([^"]+)"/);
    const sourceTypeM = body.match(/SourceType\s*=\s*([^,]+?)(?=,\s*Source\b)/);
    const sourceM = body.match(/Source\s*=\s*([^,]+?)(?=,\s*SourceNumber\b)/);
    const sourceLoc = extractSourceLocation(body);

    if (!nameM) continue;

    const name = nameM[1];
    const sourceType = sourceTypeM ? stripLBIS(sourceTypeM[1].trim()) : '';
    const source = sourceM ? stripAndClean(sourceM[1].trim()) : '';

    // SourceLocation: if it's a pure numeric string, treat as item ID ref → empty string
    let sourceLocation = sourceLoc ? stripLBIS(sourceLoc) : '';
    if (/^\d+$/.test(sourceLocation)) {
      sourceLocation = '';
    }

    itemMap[itemId] = { name, sourceType, source, sourceLocation };
  }

  return itemMap;
}

/**
 * Extract the SourceLocation value from a body string robustly.
 * SourceLocation can be: a quoted string, LBIS.L["..."], or a plain number string.
 */
function extractSourceLocation(body) {
  // Match SourceLocation = <value> up to , SourceFaction
  const m = body.match(/SourceLocation\s*=\s*(.+?)(?=,\s*SourceFaction\b)/);
  if (!m) return '';
  return m[1].trim();
}

/**
 * Strip LBIS wrappers and handle concatenation producing human-readable string.
 * The tilde (~) separator used in some entries becomes " / ".
 */
function stripAndClean(raw) {
  if (!raw) return '';
  raw = raw.trim();

  // Split on tilde-separated concatenations first
  if (raw.includes('~')) {
    // Each segment separated by ~
    const segments = raw.split(/\s*"~"\s*|\s*~\s*/);
    return segments.map(s => stripLBIS(s.trim())).filter(Boolean).join(' / ');
  }

  // Normal LBIS.L concatenation with " & " literal
  // Replace LBIS.L["X"] .. " & " .. LBIS.L["Y"] → "X & Y"
  let result = raw;

  // Extract all LBIS.L["..."] values and literal strings, then join
  const parts = [];
  const tokenRe = /LBIS\.L\["([^"]+)"\]|"([^"]*)"/g;
  let tok;
  while ((tok = tokenRe.exec(result)) !== null) {
    if (tok[1] !== undefined) parts.push(tok[1]);
    else if (tok[2] !== undefined && tok[2].trim()) parts.push(tok[2]);
  }

  if (parts.length > 0) return parts.join(' ');

  // Fallback: strip as-is
  return stripLBIS(raw);
}

// ---------------------------------------------------------------------------
// 2. Parse guide files
// ---------------------------------------------------------------------------

function parseGuideFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Map: specVarName → { class, spec, phase }
  const specMap = {};
  // Map: specVarName → items[]
  const specItems = {};

  for (const line of lines) {
    // RegisterSpec
    // local spec0 = LBIS:RegisterSpec(LBIS.L["Priest"], LBIS.L["Holy"], "0")
    const regM = line.match(/local\s+(spec\d+)\s*=\s*LBIS:RegisterSpec\(\s*([^,]+?)\s*,\s*([^,]+?)\s*,\s*"(\d+)"\s*\)/);
    if (regM) {
      const varName = regM[1];
      const cls = stripLBIS(regM[2].trim());
      const spec = stripLBIS(regM[3].trim());
      const phase = parseInt(regM[4], 10);
      specMap[varName] = { class: cls, spec, phase };
      if (!specItems[varName]) specItems[varName] = [];
      continue;
    }

    // AddItem
    // LBIS:AddItem(spec0, "32090", LBIS.L["Head"], "BIS") --Cowl of Naaru Blessings
    const addM = line.match(/LBIS:AddItem\(\s*(spec\d+)\s*,\s*"(\d+)"\s*,\s*([^,]+?)\s*,\s*"([^"]+)"\s*\)\s*(?:--(.*))?$/);
    if (addM) {
      const varName = addM[1];
      const itemId = parseInt(addM[2], 10);
      const slot = stripLBIS(addM[3].trim());
      const bis = addM[4].trim();
      const commentName = addM[5] ? addM[5].trim() : '';

      if (!specItems[varName]) specItems[varName] = [];
      specItems[varName].push({ itemId, slot, bis, commentName });
    }
  }

  return { specMap, specItems };
}

// ---------------------------------------------------------------------------
// 3. Sort BisItems: BIS first, then Alt, within each slot (stable)
// ---------------------------------------------------------------------------

function sortItems(items) {
  const bisOrder = (bis) => {
    if (bis.startsWith('BIS')) return 0;
    if (bis.startsWith('Alt')) return 1;
    return 2;
  };

  // Group by slot, preserving slot order of first appearance
  const slotOrder = [];
  const bySlot = {};
  for (const item of items) {
    if (!bySlot[item.slot]) {
      slotOrder.push(item.slot);
      bySlot[item.slot] = [];
    }
    bySlot[item.slot].push(item);
  }

  const result = [];
  for (const slot of slotOrder) {
    const slotItems = bySlot[slot];
    slotItems.sort((a, b) => bisOrder(a.bis) - bisOrder(b.bis));
    result.push(...slotItems);
  }
  return result;
}

// ---------------------------------------------------------------------------
// 4. Build the output structure
// ---------------------------------------------------------------------------

function buildData(itemMap, guideFiles) {
  const specBisMap = {}; // key: "class|spec" → { class, spec, phases: { [phase]: items[] } }

  for (const filePath of guideFiles) {
    const { specMap, specItems } = parseGuideFile(filePath);

    for (const [varName, specInfo] of Object.entries(specMap)) {
      const key = `${specInfo.class}|${specInfo.spec}`;
      if (!specBisMap[key]) {
        specBisMap[key] = { class: specInfo.class, spec: specInfo.spec, phases: {} };
      }

      const rawItems = specItems[varName] || [];
      const bisItems = [];

      for (const raw of rawItems) {
        // Resolve name: comment first, then itemMap
        let name = '';
        let sourceType = '';
        let source = '';
        let sourceLocation = '';

        if (raw.commentName) {
          name = raw.commentName;
        }

        const src = itemMap[raw.itemId];
        if (src) {
          if (!name) name = src.name;
          sourceType = src.sourceType;
          source = src.source || src.sourceLocation || '';
          sourceLocation = src.sourceLocation;
        }

        if (!name) continue; // skip unknown items

        bisItems.push({
          id: raw.itemId,
          name,
          source,
          sourceType,
          slot: raw.slot,
          bis: raw.bis,
        });
      }

      const sortedItems = sortItems(bisItems);
      specBisMap[key].phases[specInfo.phase] = sortedItems;
    }
  }

  // Convert to array
  const result = [];
  for (const [, specData] of Object.entries(specBisMap)) {
    const phases = [];
    for (const [phaseStr, items] of Object.entries(specData.phases)) {
      phases.push({ phase: parseInt(phaseStr, 10), items });
    }
    phases.sort((a, b) => a.phase - b.phase);
    result.push({ class: specData.class, spec: specData.spec, phases });
  }

  // Sort by class then spec
  result.sort((a, b) => {
    const classComp = a.class.localeCompare(b.class);
    if (classComp !== 0) return classComp;
    return a.spec.localeCompare(b.spec);
  });

  return result;
}

// ---------------------------------------------------------------------------
// 5. Generate TypeScript output
// ---------------------------------------------------------------------------

function generateTs(data) {
  const lines = [];

  lines.push(`// AUTO-GENERATED — do not edit manually`);
  lines.push(`// Generated by scripts/parseBis.js on ${new Date().toISOString()}`);
  lines.push(``);
  lines.push(`export type BisItem = {`);
  lines.push(`  id: number;`);
  lines.push(`  name: string;`);
  lines.push(`  source: string;`);
  lines.push(`  sourceType: string;`);
  lines.push(`  slot: string;`);
  lines.push(`  bis: string;`);
  lines.push(`};`);
  lines.push(``);
  lines.push(`export type BisPhaseData = {`);
  lines.push(`  phase: number;`);
  lines.push(`  items: BisItem[];`);
  lines.push(`};`);
  lines.push(``);
  lines.push(`export type SpecBisData = {`);
  lines.push(`  class: string;`);
  lines.push(`  spec: string;`);
  lines.push(`  phases: BisPhaseData[];`);
  lines.push(`};`);
  lines.push(``);
  lines.push(`export const BIS_DATA: SpecBisData[] = [`);

  for (const specData of data) {
    lines.push(`  {`);
    lines.push(`    class: "${escapeTs(specData.class)}",`);
    lines.push(`    spec: "${escapeTs(specData.spec)}",`);
    lines.push(`    phases: [`);

    for (const phaseData of specData.phases) {
      lines.push(`      {`);
      lines.push(`        phase: ${phaseData.phase},`);
      lines.push(`        items: [`);

      for (const item of phaseData.items) {
        lines.push(`          { id: ${item.id}, name: "${escapeTs(item.name)}", source: "${escapeTs(item.source)}", sourceType: "${escapeTs(item.sourceType)}", slot: "${escapeTs(item.slot)}", bis: "${escapeTs(item.bis)}" },`);
      }

      lines.push(`        ],`);
      lines.push(`      },`);
    }

    lines.push(`    ],`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log('Parsing ItemSources.lua...');
  const itemMap = parseItemSources(ITEM_SOURCES_FILE);
  console.log(`  → ${Object.keys(itemMap).length} items loaded`);

  console.log('Parsing guide files...');
  const guideFiles = fs.readdirSync(GUIDES_DIR)
    .filter(f => f.endsWith('.lua'))
    .map(f => path.join(GUIDES_DIR, f));
  console.log(`  → ${guideFiles.length} guide files found`);

  const data = buildData(itemMap, guideFiles);
  console.log(`  → ${data.length} specs generated`);

  let totalItems = 0;
  for (const specData of data) {
    for (const phase of specData.phases) {
      totalItems += phase.items.length;
    }
  }
  console.log(`  → ${totalItems} total item entries across all specs/phases`);

  // Ensure output directory exists
  const outDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const tsContent = generateTs(data);
  fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf8');
  console.log(`\nOutput written to: ${OUTPUT_FILE}`);
  console.log(`File size: ${(Buffer.byteLength(tsContent, 'utf8') / 1024).toFixed(1)} KB`);

  // Validation
  if (data.length < 20) {
    console.error(`WARNING: Only ${data.length} specs generated — expected at least 20!`);
    process.exit(1);
  }

  console.log('\nFirst 50 lines of generated file:');
  console.log('─'.repeat(60));
  console.log(tsContent.split('\n').slice(0, 50).join('\n'));
  console.log('─'.repeat(60));
  console.log(`\nSummary: ${data.length} specs, ${totalItems} total item entries`);
}

main();
