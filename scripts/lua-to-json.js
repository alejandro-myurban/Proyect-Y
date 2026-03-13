import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const lua = readFileSync(join(root, 'src/data/ItemNames.lua'), 'utf8');
const result = {};

for (const match of lua.matchAll(/\[(\d+)\]\s*=\s*"([^"]+)"/g)) {
  result[Number(match[1])] = match[2];
}

const outPath = join(root, 'src/data/itemNames.json');
writeFileSync(outPath, JSON.stringify(result));

console.log(`Done — ${Object.keys(result).length} items → src/data/itemNames.json`);
