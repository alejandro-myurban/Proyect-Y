import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ExternalLink, ChevronDown } from 'lucide-react';
import { TBC_RAIDS, TBC_RAID_ITEMS, getBossesForRaid, getItems, RaidItem } from '../data/tbcRaidItems';

const SLOT_FALLBACK_ICONS = {
  'Cabeza': 'inv_helmet_03', 'Cuello': 'inv_jewelry_necklace_09', 'Hombros': 'inv_shoulder_02',
  'Pecho': 'inv_chest_chain_03', 'Capa': 'inv_misc_cape_18', 'Muñecas': 'inv_bracer_07',
  'Manos': 'inv_gauntlets_06', 'Cintura': 'inv_belt_13', 'Piernas': 'inv_pants_04',
  'Pies': 'inv_boots_05', 'Anillo': 'inv_jewelry_ring_09', 'Reliquia': 'inv_jewelry_talisman_07',
  'Arma principal': 'inv_sword_04', 'Mano izq.': 'inv_misc_orb_02', 'Dos manos': 'inv_axe_09',
  'A distancia': 'inv_weapon_rifle_07', 'Montura': 'inv_misc_foot_centaur', 'default': 'inv_misc_questionmark',
};

function getSlotFallback(slot: string | undefined): string {
  if (!slot) return SLOT_FALLBACK_ICONS.default;
  for (const [key, val] of Object.entries(SLOT_FALLBACK_ICONS)) {
    if (slot.includes(key)) return val;
  }
  return SLOT_FALLBACK_ICONS.default;
}

function WowItemIcon({ item, size = 40 }: { item: RaidItem; size?: number }) {
  const [iconName, setIconName] = useState(item.icon);
  return (
    <img
      style={{ width: size, height: size }}
      className="block rounded-[4px] border border-[rgba(0,0,0,0.5)] [image-rendering:pixelated]"
      src={`https://wow.zamimg.com/images/wow/icons/medium/${iconName}.jpg`}
      alt={item.name}
      onError={() => setIconName(getSlotFallback(item.slot))}
    />
  );
}

export function QualityBadge({ quality }: { quality: RaidItem['quality'] }) {
  const colors: Record<string, string> = { uncommon: '#1eff00', rare: '#0070dd', epic: '#a335ee', legendary: '#ff8000', common: '#fff' };
  return (
    <span
      className="absolute bottom-[-2px] right-[-2px] w-2 h-2 rounded-full border border-[rgba(0,0,0,0.5)]"
      style={{ background: colors[quality] ?? '#888' }}
    />
  );
}

const RAID_TAB_COLORS = {
  active: {
    'all':                   'text-[#e2c5f0] border-t-[rgba(163,53,238,0.5)]',
    'Karazhan':              'text-[#c3a0e8] border-t-[rgba(163,53,238,0.6)]',
    "Gruul's Lair":          'text-[#f0a060] border-t-[rgba(240,100,30,0.6)]',
    'Guarida de Magtheridon':'text-[#f06060] border-t-[rgba(200,40,40,0.6)]',
  }
};

export default function ItemSelector({ onSelect, onClose, raidFilter = null }: { onSelect: (item: RaidItem) => void; onClose: () => void; raidFilter?: string | null }) {
  const [activeRaid, setActiveRaid]   = useState(raidFilter ?? 'all');
  const [activeBoss, setActiveBoss]   = useState('all');
  const [search, setSearch]           = useState('');
  const [hoveredItem, setHoveredItem] = useState<RaidItem | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTimeout(() => searchRef.current?.focus(), 50); }, []);
  useEffect(() => { setActiveBoss('all'); }, [activeRaid]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const bosses = activeRaid === 'all'
    ? [...new Set(TBC_RAID_ITEMS.map(i => i.boss))]
    : getBossesForRaid(activeRaid);

  const filteredItems = getItems({
    raid:   activeRaid === 'all' ? null : activeRaid,
    boss:   activeBoss === 'all' ? null : activeBoss,
    search,
  });

  const qualityAccent: Record<string, string> = { uncommon: '#1eff00', rare: '#0070dd', epic: '#a335ee', legendary: '#ff8000', common: '#fff' };
  const qualityBorder: Record<string, string> = { uncommon: 'rgba(30,255,0,0.25)', rare: 'rgba(0,112,221,0.25)', epic: 'rgba(163,53,238,0.35)', legendary: 'rgba(255,128,0,0.35)', common: 'rgba(255,255,255,0.2)' };
  const qualityText: Record<string, string>   = { uncommon: '#1eff00', rare: '#0070dd', epic: '#c570f5', legendary: '#ff8000', common: '#fff' };

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.75)] backdrop-blur-[4px] z-[1000] flex items-center justify-center p-4 [animation:overlayFadeIn_0.15s_ease]"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a2e] border border-[rgba(163,53,238,0.3)] rounded-[12px] w-full max-w-[860px] max-h-[85vh] flex flex-col overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.8),0_0_40px_rgba(163,53,238,0.15)] [animation:modalSlideIn_0.2s_cubic-bezier(0.34,1.56,0.64,1)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(163,53,238,0.08)] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[1.1rem]">⚔️</span>
            <h2 className="text-base font-semibold text-[#e2c5f0] tracking-[0.02em] m-0">Selector de Botín — TBC Classic</h2>
          </div>
          <button
            className="bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.1)] rounded-[6px] text-[#aaa] cursor-pointer p-[0.35rem] flex items-center transition-all duration-150 hover:bg-[rgba(255,60,60,0.2)] hover:text-[#ff6b6b] hover:border-[rgba(255,60,60,0.3)]"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Raid tabs */}
        <div className="flex gap-1 px-5 pt-3 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0 flex-wrap">
          {[{ key: 'all', label: 'Todos' }, ...TBC_RAIDS.map(r => ({ key: r, label: r }))].map(({ key, label }) => {
            const isActive = activeRaid === key;
            const accentColor = (RAID_TAB_COLORS.active as any)[key];
            return (
              <button
                key={key}
                onClick={() => setActiveRaid(key)}
                className={`border border-b-0 rounded-t-[6px] cursor-pointer text-[0.78rem] font-medium px-[0.9rem] py-[0.45rem] transition-all duration-150 relative bottom-[-1px]
                  ${isActive
                    ? `text-white border-[rgba(255,255,255,0.08)] border-b-[#1a1a2e] bg-[#1a1a2e] ${accentColor}`
                    : 'text-[#888] border-transparent bg-transparent hover:text-[#ccc] hover:bg-[rgba(255,255,255,0.05)]'
                  }`}
                style={isActive ? { borderTopColor: (RAID_TAB_COLORS.active as any)[key] ? '#a335ee' : undefined } as React.CSSProperties : {}}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0 bg-[rgba(0,0,0,0.15)]">
          {/* Search */}
          <div className="relative flex-1 min-w-[140px]">
            <Search size={14} className="absolute left-[0.65rem] top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Buscar item..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] rounded-[6px] text-[#ddd] text-[0.8rem] py-[0.45rem] pl-8 pr-8 transition-colors duration-150 focus:outline-none focus:border-[rgba(163,53,238,0.5)] box-border"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 bg-none border-none text-[#666] cursor-pointer p-[2px] flex items-center hover:text-[#aaa]">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Boss select */}
          <div className="relative flex-shrink-0">
            <select
              value={activeBoss}
              onChange={e => setActiveBoss(e.target.value)}
              className="appearance-none bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] rounded-[6px] text-[#ccc] text-[0.78rem] py-[0.45rem] pl-3 pr-8 cursor-pointer min-w-[170px] focus:outline-none focus:border-[rgba(163,53,238,0.5)] [&>option]:bg-[#1a1a2e] [&>option]:text-[#ddd]"
            >
              <option value="all">Todos los jefes</option>
              {bosses.map(boss => <option key={boss} value={boss}>{boss}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-[0.6rem] top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
          </div>

          <span className="text-[0.72rem] text-[#555] whitespace-nowrap">{filteredItems.length} items</span>
        </div>

        {/* Items grid */}
        <div className="flex-1 overflow-y-auto p-3 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-[0.4rem] content-start [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[rgba(163,53,238,0.3)] [&::-webkit-scrollbar-thumb]:rounded-[3px]">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center text-[#555] py-12 text-[0.85rem]">
              Sin resultados para "{search}"
            </div>
          ) : (
            filteredItems.map(item => {
              const isHovered = hoveredItem?.id === item.id && hoveredItem?.boss === item.boss;
              return (
                <button
                  key={`${item.id}-${item.boss}`}
                  onClick={() => onSelect(item)}
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                  title={`${item.name} — ${item.slot} — ${item.boss}`}
                  className="flex items-center gap-[0.65rem] border rounded-[8px] cursor-pointer px-[0.65rem] py-[0.5rem] text-left transition-all duration-[0.12s] relative overflow-hidden w-full"
                  style={{
                    background: isHovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                    borderColor: isHovered ? qualityBorder[item.quality] : 'rgba(255,255,255,0.06)',
                    transform: isHovered ? 'translateY(-1px)' : 'none',
                  }}
                >
                  {/* Left quality accent */}
                  <span
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[8px]"
                    style={{ background: qualityAccent[item.quality] ?? 'transparent' }}
                  />

                  {/* Icon */}
                  <div className="relative flex-shrink-0">
                    <WowItemIcon item={item} size={40} />
                    <QualityBadge quality={item.quality} />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-[0.2rem] min-w-0 flex-1">
                    <span className="text-[0.78rem] font-semibold whitespace-nowrap overflow-hidden text-ellipsis leading-[1.2]" style={{ color: qualityText[item.quality] ?? '#fff' }}>
                      {item.name}
                    </span>
                    <span className="flex items-center gap-[0.3rem] text-[0.68rem] flex-wrap">
                      <span className="text-[#7a8a9a]">{item.slot}</span>
                      <span className="text-[#444]">·</span>
                      <span className="text-[#667788]">{item.boss}</span>
                      {activeRaid === 'all' && (
                        <><span className="text-[#444]">·</span><span className="text-[#556677]">{item.raid}</span></>
                      )}
                    </span>
                  </div>

                  {/* Wowhead link */}
                  <a
                    href={`https://tbc.wowhead.com/item=${item.id}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    title="Ver en Wowhead"
                    className="text-[#445] flex-shrink-0 flex items-center p-[2px] rounded-[3px] transition-colors duration-150 hover:text-[#8a6fdf]"
                  >
                    <ExternalLink size={12} />
                  </a>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
