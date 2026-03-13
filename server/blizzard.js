import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { readFileSync } from 'fs';
import { ENCHANT_MAP } from './enchantMap.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parsear ItemNames.lua una sola vez al arrancar
const itemNames = new Map();
try {
  const lua = readFileSync(join(__dirname, '../src/data/ItemNames.lua'), 'utf8');
  for (const match of lua.matchAll(/\[(\d+)\]\s*=\s*"([^"]+)"/g)) {
    itemNames.set(Number(match[1]), match[2]);
  }
  console.log(`ItemNames cargados: ${itemNames.size} items`);
} catch (e) {
  console.warn('No se pudo cargar ItemNames.lua:', e.message);
}

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));

const WCL_CLIENT_ID = process.env.WARCRAFT_LOGS_CLIENT_ID;
const WCL_CLIENT_SECRET = process.env.WARCRAFT_LOGS_CLIENT_SECRET;
const WCL_BASE = 'https://fresh.warcraftlogs.com';

let cachedToken = null;
let tokenExpiry = 0;

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  const credentials = Buffer.from(`${WCL_CLIENT_ID}:${WCL_CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${WCL_BASE}/oauth/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error(`Token error: ${res.status}`);
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

const enchantCache = new Map();
async function getEnchantInfo(wclEnchantId) {
  if (enchantCache.has(wclEnchantId)) return enchantCache.get(wclEnchantId);
  const wowheadSpellId = ENCHANT_MAP[wclEnchantId];
  if (!wowheadSpellId) return null;
  try {
    const res = await fetch(`https://nether.wowhead.com/tooltip/spell/${wowheadSpellId}?dataEnv=4&locale=0`);
    const data = await res.json();
    const result = { name: data?.name ?? null, spellId: wowheadSpellId };
    enchantCache.set(wclEnchantId, result);
    return result;
  } catch {
    return { name: null, spellId: wowheadSpellId };
  }
}

async function gql(token, query) {
  const res = await fetch(`${WCL_BASE}/api/v2/client`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  return res.json();
}

// GET /api/character?realm=x&name=y
app.get('/api/character', async (req, res) => {
  try {
    const { realm, name } = req.query;
    if (!realm || !name) return res.status(400).json({ error: 'Faltan parámetros realm y name.' });
    const token = await getToken();

    // 1. Datos básicos + último report
    const profileData = await gql(token, `{
      characterData {
        character(name: "${name}", serverSlug: "${realm}", serverRegion: "EU") {
          name classID level
          faction { name }
          recentReports(limit: 1) {
            data { code fights(killType: Kills) { id } }
          }
          zoneRankings
        }
      }
    }`);

    const character = profileData.data?.characterData?.character;
    if (!character) return res.status(404).json({ error: 'Personaje no encontrado.' });

    const report = character.recentReports?.data?.[0];
    let gear = null;
    let combatantInfo = null;

    if (report) {
      const fights = report.fights ?? [];
      const lastFight = fights[fights.length - 1];

      if (lastFight) {
        // 2. Gear desde el último fight del último report
        const gearData = await gql(token, `{
          reportData {
            report(code: "${report.code}") {
              masterData { actors { id name } }
              events(fightIDs: [${lastFight.id}], dataType: CombatantInfo) { data }
            }
          }
        }`);

        const actors = gearData.data?.reportData?.report?.masterData?.actors ?? [];
        const events = gearData.data?.reportData?.report?.events?.data ?? [];
        const actor = actors.find(a => a.name.toLowerCase() === name.toLowerCase());

        if (actor) {
          combatantInfo = events.find(e => e.sourceID === actor.id) ?? null;
          const rawGear = combatantInfo?.gear ?? [];
          gear = await Promise.all(rawGear.map(async item => ({
            ...item,
            name: itemNames.get(item.id) ?? `Item #${item.id}`,
            enchant: null,
          })));
        }
      }
    }

    const result = {
      name: character.name,
      classID: character.classID,
      level: character.level,
      faction: character.faction?.name,
      rankings: character.zoneRankings,
      gear,
      stats: combatantInfo ? {
        strength: combatantInfo.strength,
        agility: combatantInfo.agility,
        stamina: combatantInfo.stamina,
        intellect: combatantInfo.intellect,
        spirit: combatantInfo.spirit,
        armor: combatantInfo.armor,
        critMelee: combatantInfo.critMelee,
        hitMelee: combatantInfo.hitMelee,
        expertise: combatantInfo.expertise,
        hasteMelee: combatantInfo.hasteMelee,
      } : null,
      auras: combatantInfo?.auras ?? null,
    };
    console.log(JSON.stringify(result, null, 2));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.BLIZZARD_PORT || 3001;
app.listen(PORT, () => console.log(`Proxy WCL en http://localhost:${PORT}`));
