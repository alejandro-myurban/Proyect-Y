import itemNamesRaw from '../../src/data/itemNames.json' assert { type: 'json' };

const WCL_CLIENT_ID = process.env.WARCRAFT_LOGS_CLIENT_ID;
const WCL_CLIENT_SECRET = process.env.WARCRAFT_LOGS_CLIENT_SECRET;
const WCL_BASE = 'https://fresh.warcraftlogs.com';

const itemNames = new Map(Object.entries(itemNamesRaw).map(([k, v]) => [Number(k), v]));

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

async function gql(token, query) {
  const res = await fetch(`${WCL_BASE}/api/v2/client`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  return res.json();
}

export const handler = async (event) => {
  const { realm, name } = event.queryStringParameters ?? {};

  if (!realm || !name) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Faltan parámetros realm y name.' }) };
  }

  try {
    const token = await getToken();

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
    if (!character) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Personaje no encontrado.' }) };
    }

    const report = character.recentReports?.data?.[0];
    let gear = null;
    let combatantInfo = null;

    if (report) {
      const fights = report.fights ?? [];
      const lastFight = fights[fights.length - 1];

      if (lastFight) {
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
          gear = (combatantInfo?.gear ?? []).map(item => ({
            ...item,
            name: itemNames.get(item.id) ?? `Item #${item.id}`,
            enchant: null,
          }));
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

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
