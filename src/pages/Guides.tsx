import { useState } from 'react';
import { Shield, Heart, Swords, AlertTriangle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RAID_CONFIG, type RaidType } from '../components/calendar/constants';

/* ── Types ── */
interface BossTip {
  role: 'tank' | 'healer' | 'dps' | 'all';
  text: string;
}

interface Boss {
  name: string;
  subtitle?: string;
  warning?: string;
  tips: BossTip[];
}

interface RaidGuide {
  raidType: RaidType;
  bosses: Boss[];
}

/* ── Guide data ── */
const GUIDES: RaidGuide[] = [
  {
    raidType: 'karazhan',
    bosses: [
      {
        name: 'Attumen el Cazador',
        subtitle: 'Primer Boss · Establos',
        tips: [
          { role: 'tank', text: 'Tankea a Midnight hasta el 95% de vida — Attumen aparece entonces. Recoge a Attumen al instante para evitar que pegue a healers. A ~25% se fusionan: mantén el aggro del combined.' },
          { role: 'healer', text: 'Cuidado con el debuff Curse of Tongue en los castersheals. Healing moderado, nada extremo. Dispel la maldición si la tienes.' },
          { role: 'dps', text: 'DPS sobre Midnight hasta que Attumen aparezca, luego switcha a Attumen. Al fusionarse, full DPS sobre el combined. Spread ligero para evitar su cleave.' },
        ],
      },
      {
        name: 'Moroes',
        subtitle: 'Segundo Boss · Salón de Banquetes',
        warning: 'Garrote no se puede dispel — los healers con Garrote necesitarán HoTs permanentes durante todo el combate.',
        tips: [
          { role: 'tank', text: 'Tanquea a Moroes alejado de los adds. Necesitas un segundo tank o un CC sólido sobre los adds más peligrosos (especialmente el Paladin y el Warrior add).' },
          { role: 'healer', text: 'Prioridad máxima: mantener vivos a los que tengan Garrote activo. El daño es constante e impredecible. Mínimo 2 healers recomendado.' },
          { role: 'dps', text: 'Orden de kill: elimina primero los adds más peligrosos (Paladin add > Warrior add > resto). CC permanente sobre los que no matéis. No rompáis los CCs.' },
        ],
      },
      {
        name: 'Doncella de la Virtud',
        subtitle: 'Tercer Boss · Capilla',
        warning: 'Durante Repentance NADIE se mueve — cualquier acción cancela el efecto y la raid entera recibe daño masivo.',
        tips: [
          { role: 'tank', text: 'Tank and spank simple. Manten la boss mirando lejos de la raid. Cuando ella castee Repentance estate preparado para parar todo.' },
          { role: 'healer', text: 'El Holy Fire hace daño DoT — dispéalo inmediatamente. Durante Repentance no puedes castear, así que prepara HoTs antes.' },
          { role: 'dps', text: 'Spread suficiente para no encadenar el Holy Ground (el daño en el suelo). Para COMPLETAMENTE durante Repentance, ni autoataques.' },
        ],
      },
      {
        name: 'Evento de la Ópera',
        subtitle: 'Cuarto Boss · Teatro (Aleatorio)',
        warning: 'El encuentro es aleatorio cada semana: El Mago de Oz, Caperucita Roja, o Romeo y Julieta. Preparad las tres estrategias.',
        tips: [
          { role: 'all', text: '🎭 Oz: Mata a los 4 personajes en orden (Roar > Strawman > Tinhead > Dorothee). El Crone final hace tornados — moveos constantemente.' },
          { role: 'all', text: '🐺 Caperucita: DPS full al lobo. Ignorad los Caperucitas que aparecen. Cuando Big Bad Wolf os convierta en Caperucita, corred del boss hasta que pase.' },
          { role: 'all', text: '💔 Romeo y Julieta: Tanques en los dos amantes separados. Cuando Juliette castee Wail of Suicidal Despair, mata a Romeo rápido o deja a un DPS absorberlo.' },
        ],
      },
      {
        name: 'El Curador',
        subtitle: 'Quinto Boss · La Galería',
        warning: 'Si los Flares llegan al Curator recupera maná — los DPS deben matar cada Flare antes de que llegue.',
        tips: [
          { role: 'tank', text: 'Posiciona al Curator en el centro. El daño de Hateful Bolt va al segundo en aggro con más vida — asegúrate de que un tank sin aggro esté segundo en la lista.' },
          { role: 'healer', text: 'Cura agresiva al target del Hateful Bolt. Durante la fase de Evocate (85% y 20% maná) el Curator no ataca — aprovecha para recuperar maná y curar.' },
          { role: 'dps', text: 'Prioridad absoluta: matar cada Arcane Flare antes de que llegue al boss. Durante Evocate, full DPS al Curator — recibe 200% daño extra.' },
        ],
      },
      {
        name: 'Terestian Illhoof',
        subtitle: 'Opcional · Biblioteca',
        warning: 'Cuando Illhoof sacrifique a un jugador, toda la raid debe hacer focus inmediato para romper las cadenas — o muere en segundos.',
        tips: [
          { role: 'tank', text: 'Tankea a Illhoof en el centro. Agarra a Kil\'rek (el demonio pequeño) — cuando muere, Illhoof pierde el 20% de su regen de vida.' },
          { role: 'healer', text: 'Cura masiva al sacrificado. Si tardáis en romper las cadenas necesitarás cooldowns de raid. Kil\'rek aumenta el daño recibido de los healers — cuidado.' },
          { role: 'dps', text: 'Mata Kil\'rek primero. Cuando alguien sea sacrificado, TODOS al objetivo sacrificado para romper las Fiendish Chains. Luego vuelve a Illhoof.' },
        ],
      },
      {
        name: 'Sombra de Aran',
        subtitle: 'Sexto Boss · Torre de Aran',
        warning: '🔥 NUNCA te muevas durante Flame Wreath — si alguien se mueve, la raid entera explota. Es el wipe más clásico de Karazhan.',
        tips: [
          { role: 'tank', text: 'No hay aggro real — Aran ataca al más cercano. Mantente cerca pero no delante. Cuando castee Arcane Explosion, alejate brevemente.' },
          { role: 'healer', text: 'Spread para no encadenar las llamas del suelo. Prepara CDs para la fase de Blizzard + Pyroblast combinada. Dispel el slow de Blizzard si puedes.' },
          { role: 'dps', text: 'Interrumpe Frostbolt siempre que puedas. Durante Flame Wreath: CONGELATE. Cuando aparezca Blizzard muévete, pero si hay Flame Wreath activo quédate quieto.' },
        ],
      },
      {
        name: 'Netherspite',
        subtitle: 'Opcional · El Balcón',
        warning: 'Los beams deben ser interceptados por los roles correctos en todo momento. Un beam sin interceptar borra a la raid.',
        tips: [
          { role: 'tank', text: 'Rojo (Perseverance): Tanques lo interceptan — aumenta enormemente la armadura y vida. Mantén el beam rojo en todo momento. Rotad si el debuff stack es muy alto.' },
          { role: 'healer', text: 'Verde (Serenity): Healers lo interceptan — aumenta el healing pero acumula un debuff. Rotad cada ~8-10 stacks. En fase Banish, Netherspite es immune — recarga maná.' },
          { role: 'dps', text: 'Azul (Dominance): Los DPS lo interceptan — aumenta el daño pero también el daño recibido. Rotad el beam. En fase Banish todos lejos del boss.' },
        ],
      },
      {
        name: 'Evento del Ajedrez',
        subtitle: 'Séptimo Boss · La Sala del Ajedrez',
        tips: [
          { role: 'all', text: 'Cada jugador controla una pieza de ajedrez. El objetivo es matar al Rey enemigo. Distribuíos: tanks en piezas de primera línea, healers en piezas con heal.' },
          { role: 'all', text: 'Cuando Medivh haga trampa (fuego en el tablero), moveos a otra casilla inmediatamente. Las piezas curan entre ellas — curad las piezas dañadas cercanas.' },
          { role: 'all', text: 'El King Piece del lado enemigo es el objetivo final. Ignorad el resto una vez que podáis llegar. Los oficiales pueden controlar piezas en simultáneo para mayor eficiencia.' },
        ],
      },
      {
        name: 'Príncipe Malchezaar',
        subtitle: 'Boss Final · El Pináculo',
        warning: 'Los Infernales caen en posiciones aleatorias — si un Infernal cae sobre alguien lo mata al instante. Mantén el movimiento.',
        tips: [
          { role: 'tank', text: 'Fase 1 y 3: Tank and spank, kítea lejos de los Infernales. Fase 2 (60-30%): Las Hachas Siniestras aparecen y el daño se dispara — cooldowns de supervivencia.' },
          { role: 'healer', text: 'Fase 2 es la más exigente — Malchezaar castea Shadow Word: Pain en multiple targets y el daño al tank se multiplica. Prepara tus cooldowns para ese tramo.' },
          { role: 'dps', text: 'DPS constante en las 3 fases. En fase 2 no matéis las Axes — son invulnerables. Evitad los Infernales en todo momento. Apretad el DPS en fase 3 (30% a 0%).' },
        ],
      },
      {
        name: 'Nocturno',
        subtitle: 'Opcional · La Azotea',
        warning: 'Para invocar a Nightbane necesitas haber completado la quest de la urna. No aparece sin ella.',
        tips: [
          { role: 'tank', text: 'Tierra: Tank and spank lejos del borde. Aire (3 fases a 75%, 50%, 25%): posiciona la raid bajo Nightbane para recibir los huesos — el tanque debe kítear fuera del Charred Earth.' },
          { role: 'healer', text: 'El Fear es frecuente — tener PvP trinket o Fear Ward (Sacerdote) ayuda. Durante las fases aéreas, cura a los que reciban huesos. El daño es muy variable.' },
          { role: 'dps', text: 'En tierra: DPS normal, evitad el Charred Earth (void zones negras). En aire: DPS a distancia continuado. Preparad el burst para cuando aterrize tras cada fase aérea.' },
        ],
      },
    ],
  },
  {
    raidType: 'gruul',
    bosses: [
      {
        name: 'Alto Rey Maulgar y su Consejo',
        subtitle: 'Primer Boss · Antesala',
        warning: 'Necesitáis 5 tanks o jugadores capaces de mantener cada add — si cualquier add queda suelto limpia a los casters de la raid.',
        tips: [
          { role: 'tank', text: 'Asignad un tank a cada add antes del pull: Maulgar (MT), Olm el Summonador, Kiggler el Enloquecido, Blindeye el Vidente, Krosh Firehand. Cada uno requiere positioning específico.' },
          { role: 'healer', text: 'El tank de Krosh recibe mucho daño de su Spellshield (necesita un Mage haciendo Spellsteal). Curad al tank de Maulgar con prioridad cuando empiece el AOE whirlwind.' },
          { role: 'dps', text: 'Orden de kill recomendado: Olm > Blindeye > Kiggler > Krosh > Maulgar. Un Mage debe Spellsteal el escudo de Krosh constantemente o el tank muere.' },
        ],
      },
      {
        name: 'Gruul el Destructor de Dragones',
        subtitle: 'Boss Final · El Antro de Gruul',
        warning: 'Shatter mata a cualquier jugador adyacente a otro cuando se activa — el spread es obligatorio y no negociable.',
        tips: [
          { role: 'tank', text: 'Tankea a Gruul en el centro. Con cada Hurtful Strike el daño aumenta — necesitarás cooldowns de tanque en los stacks altos (8+). Rota con un segundo tank si el daño es inmanejable.' },
          { role: 'healer', text: 'Cave-In hace daño a toda la raid — healing de raid constante. En el momento del Shatter, los healers también necesitan estar spreadeados. Prepara un cooldown de raid para los stacks altos.' },
          { role: 'dps', text: 'Después de cada Stoned/Shatter: SPREAD inmediato — al menos 5 yardas de cualquier otro jugador. Cuando estés Stoned no te muevas. Full DPS entre los ciclos de Shatter.' },
        ],
      },
    ],
  },
  {
    raidType: 'magtheridon',
    bosses: [
      {
        name: 'Magtheridon',
        subtitle: 'Boss Único · El Pozo Negro',
        warning: 'Los 5 cubos deben clickarse simultáneamente cada vez que Magtheridon castee Blast Nova — si falla uno, la raid entera muere.',
        tips: [
          { role: 'tank', text: 'Necesitáis 3 tanks: uno para Magtheridon y dos para los Channelers (3 adds en cada side). Pulled los Channelers primero, matadlos antes de que Magtheridon rompa su prisión (~2 min).' },
          { role: 'healer', text: 'Fase 1 (Channelers vivos): Heala a los tanks de los adds. Fase 2 (Magtheridon libre): El healing de raid es intenso. Cuando alguien sea objetivo de Blaze, alejad del grupo.' },
          { role: 'dps', text: 'Asignad a 5 jugadores a los cubos (uno por cubo). Matad los 5 Channelers antes del enrage. Cuando Magtheridon castee Blast Nova: TODOS a sus cubos y clickad a la vez. El timing es crítico.' },
          { role: 'all', text: '⚠️ Los Quake knockbacks aleatorios — posicionaos lejos de las paredes para no quedaros atrapados. El Blaze deja fuego en el suelo — movedos constantemente para no acumular.' },
        ],
      },
    ],
  },
];

/* ── Role badge component ── */
const ROLE_CONFIG = {
  tank:   { icon: <Shield size={11} />,  label: 'Tank',   color: '#5bc0de', bg: 'rgba(91,192,222,0.12)' },
  healer: { icon: <Heart size={11} />,   label: 'Healer', color: '#5cb85c', bg: 'rgba(92,184,92,0.12)' },
  dps:    { icon: <Swords size={11} />,  label: 'DPS',    color: '#d9534f', bg: 'rgba(217,83,79,0.12)' },
  all:    { icon: <Shield size={11} />,  label: 'Raid',   color: '#86b518', bg: 'rgba(134,181,24,0.10)' },
};

function RoleBadge({ role }: { role: BossTip['role'] }) {
  const cfg = ROLE_CONFIG[role];
  return (
    <span
      className="flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[0.65rem] font-['Changa_One'] uppercase tracking-wide flex-shrink-0 mt-0.5"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.icon} {cfg.label}
    </span>
  );
}

/* ── Single boss accordion item ── */
function BossItem({ boss, defaultOpen = false }: { boss: Boss; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="border border-[#2a2a33] rounded-[4px] overflow-hidden transition-all duration-150"
      style={{ borderColor: open ? 'rgba(134,181,24,0.25)' : undefined }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[rgba(255,255,255,0.02)] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="font-['Changa_One'] text-[0.95rem] text-white uppercase tracking-wide leading-none mb-0.5">
            {boss.name}
          </p>
          {boss.subtitle && (
            <p className="text-[0.72rem] text-[#555]">{boss.subtitle}</p>
          )}
        </div>
        {boss.warning && (
          <AlertTriangle size={14} className="text-[#f0c060] flex-shrink-0" />
        )}
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={16} className="text-[#555]" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 flex flex-col gap-3 border-t border-[#2a2a33]">
              {/* Warning */}
              {boss.warning && (
                <div className="flex items-start gap-2.5 bg-[rgba(240,192,96,0.07)] border border-[rgba(240,192,96,0.2)] rounded-[4px] px-3 py-2.5 mt-3">
                  <AlertTriangle size={14} className="text-[#f0c060] flex-shrink-0 mt-0.5" />
                  <p className="text-[0.82rem] text-[#f0c060] leading-relaxed m-0">{boss.warning}</p>
                </div>
              )}

              {/* Tips */}
              <div className="flex flex-col gap-2 mt-1">
                {boss.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <RoleBadge role={tip.role} />
                    <p className="text-[0.85rem] text-[#8b8b99] leading-relaxed m-0 flex-1">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main page ── */
function Guides() {
  const [activeRaid, setActiveRaid] = useState<RaidType>('karazhan');

  const currentGuide = GUIDES.find((g) => g.raidType === activeRaid)!;
  const config = RAID_CONFIG[activeRaid];

  return (
    <div className="max-w-[1100px] mx-auto px-8 pt-40 pb-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="mb-2">Guías de <span className="text-[#86b518]">Raid</span></h1>
        <p className="text-[#8b8b99]">Estrategias por rol para cada jefe de nuestra progresión TBC.</p>
      </div>

      <div className="flex gap-6 max-[800px]:flex-col">
        {/* Sidebar — raid selector */}
        <div className="flex-shrink-0 w-[220px] max-[800px]:w-full flex flex-col gap-2 max-[800px]:flex-row max-[800px]:flex-wrap">
          {GUIDES.map(({ raidType }) => {
            const cfg = RAID_CONFIG[raidType];
            const active = activeRaid === raidType;
            return (
              <button
                key={raidType}
                onClick={() => setActiveRaid(raidType)}
                className="flex items-start gap-3 px-4 py-3.5 rounded-[4px] border text-left transition-all duration-150 max-[800px]:flex-1"
                style={{
                  borderColor: active ? cfg.borderColor : '#2a2a33',
                  background: active ? cfg.bgGradient : 'rgba(255,255,255,0.01)',
                  boxShadow: active ? `0 0 14px ${cfg.glowColor}` : 'none',
                }}
              >
                <div
                  className="w-[3px] self-stretch rounded-full flex-shrink-0 mt-0.5"
                  style={{ background: active ? cfg.accentColor : '#2a2a33' }}
                />
                <div className="min-w-0">
                  <p
                    className="font-['Changa_One'] text-[0.85rem] uppercase tracking-wide leading-none mb-1"
                    style={{ color: active ? cfg.accentColor : '#e2e2e2' }}
                  >
                    {cfg.label}
                  </p>
                  <p className="text-[0.68rem] text-[#555]">
                    {GUIDES.find((g) => g.raidType === raidType)!.bosses.length} jefes
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Boss accordion */}
        <div className="flex-1 min-w-0">
          {/* Raid header */}
          <div
            className="glass-panel px-6 py-4 mb-4 flex items-center gap-3"
            style={{ borderColor: config.borderColor, background: config.bgGradient }}
          >
            <div
              className="w-1 self-stretch rounded-full flex-shrink-0"
              style={{ background: config.accentColor }}
            />
            <div>
              <h2 className="text-[1.1rem] text-white m-0" style={{ color: config.accentColor }}>
                {config.label}
              </h2>
              <p className="text-[0.75rem] text-[#8b8b99] m-0">{config.description}</p>
            </div>
            <span className="ml-auto font-['Changa_One'] text-[0.72rem] uppercase tracking-widest text-[#8b8b99] bg-[rgba(255,255,255,0.05)] px-2 py-1 rounded-[3px]">
              {currentGuide.bosses.length} jefes
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {currentGuide.bosses.map((boss, i) => (
              <BossItem key={boss.name} boss={boss} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Guides;
