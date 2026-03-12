import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BIS_DATA, type BisItem } from '../../data/bisData';
import type { CharRole } from '../calendar/constants';

// ── Slot order (WoW armory style) ────────────────────────────────────────────
const SLOT_ORDER = [
  'Head', 'Neck', 'Shoulder', 'Back', 'Chest', 'Wrist',
  'Hands', 'Waist', 'Legs', 'Feet',
  'Ring', 'Trinket',
  'Main Hand', 'Off Hand', 'Two Hand', 'Ranged/Relic',
];

const SLOT_LABELS: Record<string, string> = {
  'Head': 'Cabeza', 'Neck': 'Cuello', 'Shoulder': 'Hombros', 'Back': 'Espalda',
  'Chest': 'Pecho', 'Wrist': 'Muñecas', 'Hands': 'Manos', 'Waist': 'Cintura',
  'Legs': 'Piernas', 'Feet': 'Pies', 'Ring': 'Anillo', 'Trinket': 'Objeto especial',
  'Main Hand': 'Mano principal', 'Off Hand': 'Mano secundaria',
  'Two Hand': 'Dos manos', 'Ranged/Relic': 'A distancia / Reliquia',
};

const PHASE_LABELS = ['Pre-Raid', 'Fase 1', 'Fase 2', 'Fase 3', 'Fase 4', 'Fase 5'];

// ── Class/Role → spec mapping ─────────────────────────────────────────────────
const CLASS_ROLE_SPECS: Record<string, Partial<Record<CharRole | string, string[]>>> = {
  'Guerrero':            { 'Tanque': ['Warrior/Protection'], 'DPS': ['Warrior/Arms', 'Warrior/Fury'] },
  'Paladín':             { 'Tanque': ['Paladin/Protection'], 'Sanador': ['Paladin/Holy'], 'DPS': ['Paladin/Retribution'] },
  'Cazador':             { 'DPS': ['Hunter/Marksmanship', 'Hunter/Beast Mastery', 'Hunter/Survival'] },
  'Pícaro':              { 'DPS': ['Rogue/Dps'] },
  'Sacerdote':           { 'Sanador': ['Priest/Holy'], 'DPS': ['Priest/Shadow'] },
  'Chamán':              { 'Sanador': ['Shaman/Restoration'], 'DPS': ['Shaman/Elemental', 'Shaman/Enhancement'] },
  'Mago':                { 'DPS': ['Mage/Fire', 'Mage/Arcane', 'Mage/Frost'] },
  'Brujo':               { 'DPS': ['Warlock/Destruction', 'Warlock/Affliction', 'Warlock/Demonology'] },
  'Druida':              { 'Tanque': ['Druid/Bear'], 'Sanador': ['Druid/Restoration'], 'DPS': ['Druid/Cat', 'Druid/Balance'] },
};

const SPEC_LABELS: Record<string, string> = {
  'Warrior/Arms': 'Armas', 'Warrior/Fury': 'Furia', 'Warrior/Protection': 'Protección',
  'Paladin/Holy': 'Sagrado', 'Paladin/Protection': 'Protección', 'Paladin/Retribution': 'Reprensión',
  'Hunter/Marksmanship': 'Puntería', 'Hunter/Beast Mastery': 'Dom. Bestias', 'Hunter/Survival': 'Supervivencia',
  'Rogue/Dps': 'DPS',
  'Priest/Holy': 'Sagrado', 'Priest/Shadow': 'Sombras',
  'Shaman/Restoration': 'Restauración', 'Shaman/Elemental': 'Elemental', 'Shaman/Enhancement': 'Mejora',
  'Mage/Fire': 'Fuego', 'Mage/Arcane': 'Arcano', 'Mage/Frost': 'Escarcha',
  'Warlock/Destruction': 'Destrucción', 'Warlock/Affliction': 'Aflicción', 'Warlock/Demonology': 'Demonología',
  'Druid/Bear': 'Oso', 'Druid/Restoration': 'Restauración', 'Druid/Cat': 'Felino', 'Druid/Balance': 'Equilibrio',
};

// ── Icon cache (module-level, persists across renders) ────────────────────────
const iconCache = new Map<number, string>();

function useItemIcons(ids: number[]) {
  const [icons, setIcons] = useState<Map<number, string>>(new Map(iconCache));
  const pendingRef = useRef(new Set<number>());

  useEffect(() => {
    const missing = ids.filter(id => !iconCache.has(id) && !pendingRef.current.has(id));
    if (missing.length === 0) return;

    missing.forEach(id => pendingRef.current.add(id));

    // Batch: fetch in parallel but throttle to avoid hammering WoWhead
    const chunks: number[][] = [];
    for (let i = 0; i < missing.length; i += 8) chunks.push(missing.slice(i, i + 8));

    let cancelled = false;
    (async () => {
      for (const chunk of chunks) {
        if (cancelled) break;
        await Promise.all(chunk.map(async (id) => {
          try {
            const res = await fetch(`https://www.wowhead.com/tbc/tooltip/item/${id}`);
            const data = await res.json();
            iconCache.set(id, data.icon || '');
          } catch {
            iconCache.set(id, '');
          }
          pendingRef.current.delete(id);
        }));
        if (!cancelled) setIcons(new Map(iconCache));
      }
    })();

    return () => { cancelled = true; };
  }, [ids.join(',')]);

  return icons;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function ItemIcon({ id, icon, size = 28 }: { id: number; icon?: string; size?: number }) {
  if (!icon) {
    return (
      <div
        className="flex-shrink-0 rounded-[3px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <img
      src={`https://wow.zamimg.com/images/wow/icons/small/${icon}.jpg`}
      alt=""
      className="flex-shrink-0 rounded-[3px] border border-[rgba(0,0,0,0.4)]"
      style={{ width: size, height: size }}
      onError={(e: any) => { e.target.style.display = 'none'; }}
    />
  );
}

function BisItemRow({ item, icon, isBis }: { item: BisItem; icon?: string; isBis: boolean }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-[3px] hover:bg-[rgba(255,255,255,0.03)] transition-colors group">
      <ItemIcon id={item.id} icon={icon} size={26} />
      <div className="flex-1 min-w-0">
        <p className={`text-[0.78rem] font-medium truncate ${isBis ? 'quality-text-4' : 'text-[#8b8b99]'}`}>
          {item.name}
        </p>
        {item.source && (
          <p className="text-[0.65rem] text-[#555] truncate">{item.source}</p>
        )}
      </div>
      {isBis && (
        <span className="flex-shrink-0 text-[0.6rem] font-['Changa_One'] uppercase px-1.5 py-0.5 rounded-[2px] bg-[rgba(255,215,0,0.08)] text-[#ffd700] border border-[rgba(255,215,0,0.15)]">
          BiS
        </span>
      )}
      <a
        href={`https://www.wowhead.com/tbc/item=${item.id}`}
        target="_blank"
        rel="noreferrer"
        className="flex-shrink-0 text-[0.6rem] text-[#444] hover:text-[#86b518] opacity-0 group-hover:opacity-100 transition-opacity"
        title="Ver en WoWhead"
        onClick={(e) => e.stopPropagation()}
      >
        ↗
      </a>
    </div>
  );
}

function SlotSection({ slot, items, icons }: { slot: string; items: BisItem[]; icons: Map<number, string> }) {
  const [open, setOpen] = useState(false);
  const bisItems = items.filter(i => i.bis === 'BIS' || i.bis.startsWith('BIS'));
  const altItems = items.filter(i => !i.bis.startsWith('BIS'));

  if (items.length === 0) return null;

  return (
    <div className="border-b border-[rgba(255,255,255,0.04)] last:border-0">
      {/* Slot label */}
      <div className="px-2 pt-2 pb-1">
        <p className="text-[0.62rem] uppercase tracking-widest text-[#555] font-['Changa_One']">
          {SLOT_LABELS[slot] ?? slot}
        </p>
      </div>

      {/* BIS items */}
      {bisItems.map(item => (
        <BisItemRow key={item.id} item={item} icon={icons.get(item.id)} isBis={true} />
      ))}

      {/* Alternativas collapsible */}
      {altItems.length > 0 && (
        <>
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-1 px-2 py-1 text-[0.65rem] text-[#555] hover:text-[#8b8b99] transition-colors w-full"
          >
            {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            {altItems.length} alternativa{altItems.length !== 1 ? 's' : ''}
          </button>
          {open && altItems.map(item => (
            <BisItemRow key={item.id} item={item} icon={icons.get(item.id)} isBis={false} />
          ))}
        </>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface BisPanelProps {
  charClass: string;
  charRole: CharRole;
  classColor?: string;
}

export function BisPanel({ charClass, charRole, classColor = '#86b518' }: BisPanelProps) {
  const specKeys = CLASS_ROLE_SPECS[charClass]?.[charRole] ?? [];
  const [activeSpec, setActiveSpec] = useState(0);
  const [activePhase, setActivePhase] = useState(5);

  // Find matching spec data
  const specKey = specKeys[activeSpec] ?? '';
  const [cls, spec] = specKey.split('/');
  const specData = BIS_DATA.find(s => s.class === cls && s.spec === spec);
  const phaseData = specData?.phases.find(p => p.phase === activePhase);

  // Collect all item IDs for icon fetching
  const allIds = phaseData?.items.map(i => i.id) ?? [];
  const icons = useItemIcons(allIds);

  // Group items by slot in correct order
  const bySlot = new Map<string, BisItem[]>();
  SLOT_ORDER.forEach(s => bySlot.set(s, []));
  phaseData?.items.forEach(item => {
    const arr = bySlot.get(item.slot);
    if (arr) arr.push(item);
  });

  if (specKeys.length === 0) {
    return (
      <div className="glass-panel p-6 mt-6">
        <h3 className="flex items-center gap-2 text-white text-[1rem] border-b border-[#2a2a33] pb-3 mb-4">
          <span style={{ color: classColor }}>⚔</span> BiS List — TBC Classic
        </h3>
        <p className="text-[0.82rem] text-[#555]">No hay datos BiS para esta clase/rol en TBC Classic.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 mt-6">
      <h3 className="flex items-center gap-2 text-white text-[1rem] border-b border-[#2a2a33] pb-3 mb-4">
        <span style={{ color: classColor }}>⚔</span> BiS List — TBC Classic
      </h3>

      <div className="flex flex-col gap-3 mb-4">
        {/* Spec tabs (if multiple) */}
        {specKeys.length > 1 && (
          <div className="flex gap-1.5 flex-wrap">
            {specKeys.map((key, i) => (
              <button
                key={key}
                onClick={() => setActiveSpec(i)}
                className={`px-3 py-1 rounded-[3px] border text-[0.72rem] font-['Changa_One'] uppercase transition-all
                  ${activeSpec === i
                    ? 'text-white border-transparent'
                    : 'border-[#2a2a33] text-[#8b8b99] hover:text-white hover:border-[rgba(255,255,255,0.15)]'
                  }`}
                style={activeSpec === i ? { background: classColor, borderColor: classColor } : {}}
              >
                {SPEC_LABELS[key] ?? key.split('/')[1]}
              </button>
            ))}
          </div>
        )}

        {/* Phase tabs */}
        <div className="flex gap-1 flex-wrap">
          {PHASE_LABELS.map((label, i) => (
            <button
              key={i}
              onClick={() => setActivePhase(i)}
              className={`px-2.5 py-1 rounded-[3px] border text-[0.68rem] font-['Changa_One'] uppercase transition-all
                ${activePhase === i
                  ? 'border-[#86b518] text-[#86b518] bg-[rgba(134,181,24,0.08)]'
                  : 'border-[#2a2a33] text-[#555] hover:text-[#8b8b99] hover:border-[rgba(255,255,255,0.1)]'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      {!phaseData || phaseData.items.length === 0 ? (
        <p className="text-[0.82rem] text-[#555]">Sin datos para esta fase.</p>
      ) : (
        <div className="rounded-[4px] border border-[rgba(255,255,255,0.06)] overflow-hidden">
          {SLOT_ORDER.map(slot => {
            const items = bySlot.get(slot) ?? [];
            return items.length > 0 ? (
              <SlotSection key={slot} slot={slot} items={items} icons={icons} />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
