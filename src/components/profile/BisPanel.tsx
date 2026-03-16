import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BIS_DATA, type BisItem } from '../../data/bisData';
import type { CharRole } from '../calendar/constants';
import { supabase } from '../../lib/supabase';

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

// WCL gear array index → BiS slot name
const WCL_SLOT_MAP: Record<number, string> = {
  0: 'Head', 1: 'Neck', 2: 'Shoulder', 4: 'Chest', 5: 'Waist',
  6: 'Legs', 7: 'Feet', 8: 'Wrist', 9: 'Hands',
  10: 'Ring', 11: 'Ring', 12: 'Trinket', 13: 'Trinket',
  14: 'Back', 15: 'Main Hand', 16: 'Off Hand', 17: 'Ranged/Relic',
};

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

// ── WCL gear item ─────────────────────────────────────────────────────────────
interface WclGem {
  id: number;
  icon: string;
}

interface WclItem {
  id: number;
  name: string;
  icon: string;
  itemLevel: number;
  quality: number;
  enchant?: { name: string | null; spellId: number } | null;
  gems?: WclGem[];
}

// ── Sub-components ────────────────────────────────────────────────────────────
function BisItemRow({ item, isBis }: { item: BisItem; isBis: boolean }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-[3px] hover:bg-[rgba(255,255,255,0.03)] transition-colors">
      <a
        href={`https://www.wowhead.com/tbc/item=${item.id}`}
        target="_blank"
        rel="noreferrer"
        className="flex-shrink-0 block w-[26px] h-[26px]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={`https://wow.zamimg.com/images/wow/icons/small/${item.icon}.jpg`}
          alt=""
          className="w-[26px] h-[26px] rounded-[3px] border border-[rgba(0,0,0,0.4)]"
          onError={(e: any) => { e.target.style.display = 'none'; }}
        />
      </a>
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
    </div>
  );
}

function CurrentItemRow({ item }: { item: WclItem }) {
  const qualityColors: Record<number, string> = { 0: '#9d9d9d', 1: '#ffffff', 2: '#1eff00', 3: '#0070dd', 4: '#a335ee', 5: '#ff8000' };
  const color = qualityColors[item.quality] ?? '#ffffff';
  const gems = item.gems?.filter(g => g.id !== 0) ?? [];

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-[3px] bg-[rgba(255,255,255,0.02)]">
      <a
        href={`https://www.wowhead.com/tbc/item=${item.id}`}
        target="_blank"
        rel="noreferrer"
        className="flex-shrink-0 block w-[26px] h-[26px]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={`https://wow.zamimg.com/images/wow/icons/small/${item.icon}`}
          alt=""
          className="w-[26px] h-[26px] rounded-[3px] border border-[rgba(0,0,0,0.4)]"
          onError={(e: any) => { e.target.style.display = 'none'; }}
        />
      </a>
      <div className="flex-1 min-w-0">
        <p className="text-[0.78rem] font-medium truncate" style={{ color }}>{item.name}</p>
        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
          <span className="text-[0.65rem] text-[#555]">ilvl {item.itemLevel}</span>
          {gems.map((gem, i) => (
            <a
              key={i}
              href={`https://www.wowhead.com/tbc/item=${gem.id}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`https://wow.zamimg.com/images/wow/icons/small/${gem.icon}`}
                alt=""
                className="w-[14px] h-[14px] rounded-[2px] border border-[rgba(0,0,0,0.4)]"
                onError={(e: any) => { e.target.style.display = 'none'; }}
              />
            </a>
          ))}
        </div>
      </div>
      <span className="flex-shrink-0 text-[0.6rem] font-['Changa_One'] uppercase px-1.5 py-0.5 rounded-[2px] bg-[rgba(255,255,255,0.04)] text-[#8b8b99] border border-[rgba(255,255,255,0.06)]">
        Actual
      </span>
    </div>
  );
}

function SlotSection({ slot, items, currentItem }: { slot: string; items: BisItem[]; currentItem?: WclItem }) {
  const [open, setOpen] = useState(false);
  const bisItems = items.filter(i => i.bis === 'BIS' || i.bis.startsWith('BIS'));
  const altItems = items.filter(i => !i.bis.startsWith('BIS'));

  if (items.length === 0 && !currentItem) return null;

  return (
    <div className="border-b border-[rgba(255,255,255,0.04)] last:border-0">
      {/* Slot label */}
      <div className="px-2 pt-2 pb-1">
        <p className="text-[0.62rem] uppercase tracking-widest text-[#555] font-['Changa_One']">
          {SLOT_LABELS[slot] ?? slot}
        </p>
      </div>

      {/* Item actual */}
      {currentItem && <CurrentItemRow item={currentItem} />}

      {/* Separador si hay item actual y BiS */}
      {currentItem && bisItems.length > 0 && (
        <div className="mx-2 my-1 flex items-center gap-2">
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.04)]" />
          <span className="text-[0.55rem] text-[#444] uppercase tracking-widest">BiS</span>
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.04)]" />
        </div>
      )}

      {/* BIS items */}
      {bisItems.map(item => (
        <BisItemRow key={item.id} item={item} isBis={true} />
      ))}

      {bisItems.length === 0 && altItems.length > 0 && (
        <BisItemRow item={altItems[0]} isBis={false} />
      )}

      {/* Alternativas collapsible */}
      {(() => {
        const hiddenAlts = bisItems.length === 0 ? altItems.slice(1) : altItems;
        return hiddenAlts.length > 0 ? (
          <>
            <button
              onClick={() => setOpen(v => !v)}
              className="flex items-center gap-1 px-2 py-1 text-[0.65rem] text-[#555] hover:text-[#8b8b99] transition-colors w-full"
            >
              {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              {hiddenAlts.length} alternativa{hiddenAlts.length !== 1 ? 's' : ''}
            </button>
            {open && hiddenAlts.map(item => (
              <BisItemRow key={item.id} item={item} isBis={false} />
            ))}
          </>
        ) : null;
      })()}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface BisPanelProps {
  charClass: string;
  charRole: CharRole;
  charName: string;
  classColor?: string;
  userId?: string;
  onSpecDetected?: (spec: string) => void;
}

export function BisPanel({ charClass, charRole, charName, classColor = '#86b518', userId, onSpecDetected }: BisPanelProps) {
  const specKeys = CLASS_ROLE_SPECS[charClass]?.[charRole] ?? [];
  const [activeSpec, setActiveSpec] = useState(0);
  const [activePhase, setActivePhase] = useState(1);
  const panelRef = useRef<HTMLDivElement>(null);

  const realm = 'spineshatter';
  const [gear, setGear] = useState<WclItem[] | null>(null);
  const [gearLoading, setGearLoading] = useState(false);

  useEffect(() => {
    (window as any).$WowheadPower?.refreshLinks?.();
  });

  useEffect(() => {
    if (!realm || !charName) return;
    setGearLoading(true);
    const base = import.meta.env.DEV ? 'http://localhost:3001/api/character' : '/api/character';
    fetch(`${base}?realm=${realm}&name=${charName}`)
      .then(r => r.json())
      .then(data => {
        if (data.gear) setGear(data.gear);
        const wclSpec: string | undefined = data.rankings?.allStars?.[0]?.spec;
        if (wclSpec) {
          const idx = specKeys.findIndex(k => k.split('/')[1].toLowerCase() === wclSpec.toLowerCase());
          if (idx !== -1) {
            setActiveSpec(idx);
            const fullSpecKey = specKeys[idx];
            onSpecDetected?.(wclSpec);
            if (userId) {
              supabase.from('user_characters').update({ char_spec: fullSpecKey }).eq('user_id', userId);
            }
          } else {
            onSpecDetected?.(wclSpec);
          }
        }
      })
      .catch(() => {})
      .finally(() => setGearLoading(false));
  }, [realm, charName]);

  // Gear por slot (múltiples slots como Ring/Trinket se acumulan)
  const gearBySlot = new Map<string, WclItem[]>();
  if (gear) {
    gear.forEach((item, index) => {
      const slot = WCL_SLOT_MAP[index];
      if (!slot) return;
      if (!gearBySlot.has(slot)) gearBySlot.set(slot, []);
      gearBySlot.get(slot)!.push(item);
    });
  }

  const specKey = specKeys[activeSpec] ?? '';
  const [cls, spec] = specKey.split('/');
  const specData = BIS_DATA.find(s => s.class === cls && s.spec === spec);
  const phaseData = specData?.phases.find(p => p.phase === activePhase);

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
    <div ref={panelRef} className="glass-panel p-6 mt-6">
      <h3 className="flex items-center gap-2 text-white text-[1rem] border-b border-[#2a2a33] pb-3 mb-4">
        <span style={{ color: classColor }}>⚔</span> BiS List — TBC Classic
      </h3>

      <div className="flex flex-col gap-3 mb-4">
        {/* Spec tabs */}
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
          {PHASE_LABELS.map((label, i) => {
            const locked = i > 1;
            return (
              <button
                key={i}
                onClick={() => !locked && setActivePhase(i)}
                disabled={locked}
                className={`px-2.5 py-1 rounded-[3px] border text-[0.68rem] font-['Changa_One'] uppercase transition-all
                  ${locked
                    ? 'border-[#1e1e24] text-[#333] cursor-not-allowed opacity-50'
                    : activePhase === i
                      ? 'border-[#86b518] text-[#86b518] bg-[rgba(134,181,24,0.08)]'
                      : 'border-[#2a2a33] text-[#555] hover:text-[#8b8b99] hover:border-[rgba(255,255,255,0.1)]'
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Items */}
      {!phaseData || phaseData.items.length === 0 ? (
        <p className="text-[0.82rem] text-[#555]">Sin datos para esta fase.</p>
      ) : (
        <div className="rounded-[4px] border border-[rgba(255,255,255,0.06)] overflow-hidden">
          {SLOT_ORDER.map(slot => {
            const items = bySlot.get(slot) ?? [];
            const currentItems = gearBySlot.get(slot) ?? [];
            // Para Ring/Trinket hay 2 slots — mostrar primero el que no esté vacío
            const currentItem = currentItems[0];
            return (items.length > 0 || currentItem) ? (
              <SlotSection key={slot} slot={slot} items={items} currentItem={currentItem} />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
