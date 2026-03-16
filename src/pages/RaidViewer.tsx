import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ArrowLeft, Shield, Heart, Swords, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/useAuth';
import {
  CLASS_COLORS,
  getClassIcon,
  RAID_CONFIG,
  type CharRole,
  type RaidType,
} from '../components/calendar/constants';
import type { Signup, RaidGroup } from '../types/calendar';
import { getBuffsForClassRole, SPEC_BUFFS, BUFF_CATEGORY_COLORS, type SpecBuff } from '../data/specBuffs';

const ROLE_COLORS: Record<CharRole, string> = {
  Tanque: '#5bc0de',
  Sanador: '#5cb85c',
  DPS: '#d9534f',
};

const ROLE_ICON_MAP: Record<CharRole, React.ReactNode> = {
  Tanque: <Shield size={10} />,
  Sanador: <Heart size={10} />,
  DPS: <Swords size={10} />,
};

// ── WoW-style unit frame ─────────────────────────────────────────────────────
function UnitFrame({ signup, isDraggable }: { signup: Signup; isDraggable: boolean }) {
  const classColor = CLASS_COLORS[signup.class] ?? '#8b8b99';
  const roleColor = ROLE_COLORS[signup.role as CharRole] ?? '#8b8b99';

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: signup.id,
    disabled: !isDraggable,
  });

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        borderLeftColor: classColor,
        borderTop: `1px solid ${classColor}44`,
        borderRight: `1px solid rgba(0,0,0,0.6)`,
        borderBottom: `1px solid rgba(0,0,0,0.8)`,
        background: `linear-gradient(90deg, ${classColor}28 0%, ${classColor}0a 35%, rgba(8,8,11,0.98) 100%)`,
        opacity: isDragging ? 0.35 : 1,
        cursor: isDraggable ? 'grab' : 'default',
        zIndex: isDragging ? 999 : undefined,
      }}
      {...(isDraggable ? listeners : {})}
      {...(isDraggable ? attributes : {})}
      className={`relative border-l-[4px] overflow-hidden select-none
        ${isDraggable ? 'hover:brightness-110 active:cursor-grabbing' : ''}
      `}
    >
      {/* Dark header band with name */}
      <div
        className="flex items-center gap-1.5 px-2 py-[5px]"
        style={{ background: 'rgba(0,0,0,0.45)', borderBottom: `1px solid ${classColor}33` }}
      >
        <span style={{ color: roleColor }} className="flex-shrink-0 leading-none">
          {ROLE_ICON_MAP[signup.role as CharRole]}
        </span>
        <Link
          to={`/perfil/${signup.name}`}
          className="font-['Changa_One'] text-base leading-none truncate flex-1 hover:underline"
          style={{ color: '#e8e8e8' }}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {signup.name}
        </Link>
        <img
          src={getClassIcon(signup.class)}
          alt={signup.class}
          className="w-[16px] h-[16px] flex-shrink-0 opacity-90"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* Health + power bars */}
      <div className="px-1.5 pt-[4px] pb-[3px] flex flex-col gap-[2px]">
        <div className="h-[30px] overflow-hidden" style={{ background: 'rgba(0,0,0,0.6)', outline: '1px solid rgba(0,0,0,0.8)' }}>
          <div className="h-full w-full" style={{ background: `linear-gradient(90deg, ${classColor}ee 0%, ${classColor}88 100%)` }} />
        </div>
      </div>

    </div>
  );
}

// Devuelve los buffs de un signup: usa la spec real si la conocemos, si no los buffs garantizados
function getBuffsForSignup(signup: Signup, specMap: Record<string, string>): SpecBuff[] {
  const knownSpec = signup.user_id ? specMap[signup.user_id] : undefined;
  console.log(`[spec] ${signup.name} | user_id=${signup.user_id} | spec=${knownSpec ?? 'none'}`);
  if (knownSpec && SPEC_BUFFS[knownSpec]) {
    return SPEC_BUFFS[knownSpec];
  }
  // Sin spec conocida: solo buffs presentes en TODAS las specs del rol
  const specGroups = getBuffsForClassRole(signup.class, signup.role);
  if (specGroups.length === 1) return specGroups[0].buffs;
  const allNames = specGroups.map(g => new Set(g.buffs.map(b => b.name)));
  return specGroups[0].buffs.filter(b => allNames.every(s => s.has(b.name)));
}

// ── Raid buffs/debuffs full overview (below grid) ────────────────────────────
function RaidBuffsPanel({ members, specMap }: { members: Signup[]; specMap: Record<string, string> }) {
  // All unique buffs and debuffs from every spec in the game
  const allBuffs = new Map<string, SpecBuff>();
  const allDebuffs = new Map<string, SpecBuff>();
  Object.values(SPEC_BUFFS).forEach((buffs) => {
    buffs.forEach((b) => {
      if (b.category === 'debuff') allDebuffs.set(b.name, b);
      else allBuffs.set(b.name, b);
    });
  });

  // What the current roster actually covers
  const covered = new Set<string>();
  const providers = new Map<string, string[]>();
  members.forEach((s) => {
    getBuffsForSignup(s, specMap).forEach((b) => {
      covered.add(b.name);
      if (!providers.has(b.name)) providers.set(b.name, []);
      if (!providers.get(b.name)!.includes(s.name)) providers.get(b.name)!.push(s.name);
    });
  });

  const sortedBuffs = Array.from(allBuffs.values()).sort((a, b) => a.name.localeCompare(b.name, 'es'));
  const sortedDebuffs = Array.from(allDebuffs.values()).sort((a, b) => a.name.localeCompare(b.name, 'es'));

  const renderEntry = (buff: SpecBuff) => {
    const present = covered.has(buff.name);
    const prov = providers.get(buff.name) ?? [];
    return (
      <div key={buff.name} className="relative group/bentry flex items-center gap-2 py-[3px]">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: present ? '#22c55e' : 'rgba(255,255,255,0.15)' }}
        />
        <img
          src={`https://wow.zamimg.com/images/wow/icons/small/${buff.icon}.jpg`}
          alt=""
          className="w-[18px] h-[18px] rounded-[2px] shrink-0"
          style={{ opacity: present ? 1 : 0.25 }}
          onError={(e: any) => { e.target.style.display = 'none'; }}
        />
        <span
          className="text-[0.78rem] leading-tight"
          style={{ color: present ? '#e8e8e8' : 'rgba(255,255,255,0.3)', fontWeight: present ? 600 : 400 }}
        >
          {buff.name}
        </span>
        {present && prov.length > 0 && (
          <div className="absolute left-0 bottom-full mb-1.5 z-50 hidden group-hover/bentry:block pointer-events-none">
            <div className="bg-[#0d0d10] border border-[rgba(255,255,255,0.15)] rounded-[3px] px-2 py-1.5 shadow-xl min-w-[130px]">
              <p className="text-[0.7rem] text-white font-semibold mb-0.5">{buff.name}</p>
              {buff.description && <p className="text-[0.62rem] text-[#8b8b99] mb-1">{buff.description}</p>}
              {prov.map((p) => <p key={p} className="text-[0.6rem] text-[#c8a84b]">· {p}</p>)}
            </div>
          </div>
        )}
      </div>
    );
  };

  const half = (arr: SpecBuff[]) => {
    const mid = Math.ceil(arr.length / 2);
    return [arr.slice(0, mid), arr.slice(mid)];
  };

  const [buffsL, buffsR] = half(sortedBuffs);
  const [debuffsL, debuffsR] = half(sortedDebuffs);

  return (
    <div className="mt-8 grid grid-cols-2 gap-4">
      {/* Buffs panel */}
      <div className="bg-[#0f0f13] border border-white/10 rounded-xl p-5">
        <p className="font-['Changa_One'] text-[0.75rem] uppercase tracking-widest text-[#86b518] mb-4">Buffs</p>
        <div className="grid grid-cols-2 gap-x-6">
          <div>{buffsL.map(renderEntry)}</div>
          <div>{buffsR.map(renderEntry)}</div>
        </div>
      </div>
      {/* Debuffs panel */}
      <div className="bg-[#0f0f13] border border-white/10 rounded-xl p-5">
        <p className="font-['Changa_One'] text-[0.75rem] uppercase tracking-widest text-[#ba55d3] mb-4">Debuffs</p>
        <div className="grid grid-cols-2 gap-x-6">
          <div>{debuffsL.map(renderEntry)}</div>
          <div>{debuffsR.map(renderEntry)}</div>
        </div>
      </div>
    </div>
  );
}

// ── Visual sub-group column (droppable) ──────────────────────────────────────
function SubGroupColumn({
  colIndex,
  members,
  isAdmin,
  isOver,
  specMap,
}: {
  colIndex: number;
  members: Signup[];
  isAdmin: boolean;
  isOver: boolean;
  specMap: Record<string, string>;
}) {
  const isFull = members.length >= 5;
  const { setNodeRef } = useDroppable({ id: `col-${colIndex}` });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col overflow-hidden transition-colors duration-150"
      style={{
        background: isOver ? 'rgba(134,181,24,0.06)' : 'rgba(20,20,26,0.9)',
        border: isFull
          ? '2px solid rgba(217,83,79,0.4)'
          : isOver ? '2px solid rgba(134,181,24,0.5)' : '2px solid rgba(255,255,255,0.1)',
        outline: isOver ? 'none' : '1px solid rgba(0,0,0,0.8)',
        minHeight: '420px',
      }}
    >
      {/* Column header */}
      <div
        className="px-3 py-1.5 flex items-center justify-between"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(0,0,0,0.3) 100%)',
          borderBottom: '2px solid rgba(0,0,0,0.6)',
        }}
      >
        <p className="font-['Changa_One'] text-[0.75rem] uppercase text-[#c8a84b] tracking-wider">
          Grupo {colIndex + 1}
        </p>
        <p className="text-[0.62rem]" style={{ color: isFull ? '#d9534f' : '#666' }}>
          {members.length}/5{isFull && ' · lleno'}
        </p>
      </div>
      {/* Frames */}
      <div className="flex flex-col gap-[2px] p-[3px] flex-1">
        {members.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[0.6rem] text-[#2a2a33] uppercase tracking-widest">— vacío —</p>
          </div>
        ) : (
          members.map((s) => <UnitFrame key={s.id} signup={s} isDraggable={isAdmin} />)
        )}
      </div>

      {/* Group buffs footer */}
      {(() => {
        const buffMap = new Map<string, { buff: SpecBuff; providers: string[] }>();
        members.forEach((s) => {
          const buffs = getBuffsForSignup(s, specMap);
          buffs
            .filter(b => b.category !== 'debuff' && b.scope !== 'raid')
            .forEach((b) => {
              if (!buffMap.has(b.name)) buffMap.set(b.name, { buff: b, providers: [] });
              const entry = buffMap.get(b.name)!;
              if (!entry.providers.includes(s.name)) entry.providers.push(s.name);
            });
        });
        if (buffMap.size === 0) return null;
        return (
          <div
            className="px-2 py-1.5 flex flex-wrap gap-[3px]"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.3)' }}
          >
            {Array.from(buffMap.values()).map(({ buff, providers }) => (
              <div key={buff.name} className="relative group/gbuff">
                <img
                  src={`https://wow.zamimg.com/images/wow/icons/medium/${buff.icon}.jpg`}
                  alt={buff.name}
                  className="w-[30px] rounded-[2px] object-cover"
                  style={{ outline: `1px solid ${BUFF_CATEGORY_COLORS[buff.category]}88` }}
                  onError={(e: any) => {
                    e.target.style.display = 'none';
                    const fallback = e.target.nextSibling;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div
                  className="items-center justify-center w-[30px] h-[30px] rounded-[2px] text-[0.5rem] text-center leading-tight px-0.5"
                  style={{ display: 'none', background: `${BUFF_CATEGORY_COLORS[buff.category]}22`, outline: `1px solid ${BUFF_CATEGORY_COLORS[buff.category]}88`, color: BUFF_CATEGORY_COLORS[buff.category] }}
                >
                  {buff.name.split(' ')[0]}
                </div>
                <div className="absolute bottom-full left-0 mb-1 z-50 hidden group-hover/gbuff:block pointer-events-none">
                  <div className="bg-[#0d0d10] border border-[rgba(255,255,255,0.15)] rounded-[3px] px-2 py-1.5 shadow-xl min-w-[130px]">
                    <p className="text-[0.7rem] text-white font-medium mb-0.5">{buff.name}</p>
                    {buff.description && <p className="text-[0.62rem] text-[#8b8b99] mb-1">{buff.description}</p>}
                    {providers.map((p) => <p key={p} className="text-[0.6rem] text-[#c8a84b]">· {p}</p>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

// ── Visual bench area (droppable) ────────────────────────────────────────────
function BenchColumn({
  members,
  isAdmin,
  isOver,
}: {
  members: Signup[];
  isAdmin: boolean;
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({ id: 'col-bench' });

  return (
    <div
      ref={setNodeRef}
      className="mt-6 flex flex-col overflow-hidden transition-colors duration-150"
      style={{
        background: isOver ? 'rgba(134,181,24,0.06)' : 'rgba(20,20,26,0.9)',
        border: isOver ? '2px solid rgba(134,181,24,0.5)' : '2px dashed rgba(255,255,255,0.2)',
        outline: isOver ? 'none' : '1px solid rgba(0,0,0,0.8)',
        minHeight: '100px',
      }}
    >
      <div
        className="px-3 py-1.5 flex items-center justify-between"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(0,0,0,0.3) 100%)',
          borderBottom: '2px solid rgba(0,0,0,0.6)',
        }}
      >
        <p className="font-['Changa_One'] text-[0.75rem] uppercase text-[#a8a8a8] tracking-wider">
          Banquillo (Bench)
        </p>
        <p className="text-[0.62rem] text-[#666]">{members.length} jugadores</p>
      </div>
      <div className="flex flex-wrap gap-[4px] p-[6px] flex-1 items-start">
        {members.length === 0 ? (
          <div className="w-full flex-1 flex items-center justify-center min-h-[60px]">
            <p className="text-[0.6rem] text-[#2a2a33] uppercase tracking-widest">— vacío —</p>
          </div>
        ) : (
          members.map((s) => (
            <div key={s.id} className="w-[155px] flex-shrink-0">
              <UnitFrame signup={s} isDraggable={isAdmin} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function RaidViewer() {
  const { raidId, groupId } = useParams<{ raidId: string; groupId: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [raidTitle, setRaidTitle] = useState('');
  const [raidType, setRaidType] = useState<RaidType | null>(null);
  const [group, setGroup] = useState<RaidGroup | null>(null);
  const [members, setMembers] = useState<Signup[]>([]);
  const [specMap, setSpecMap] = useState<Record<string, string>>({}); // user_id → specKey
  const [loading, setLoading] = useState(true);
  const [activeOver, setActiveOver] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // colIndex per signupId (admin visual arrangement, local state only)
  const [colAssignment, setColAssignment] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!raidId || !groupId) return;
    load();
  }, [raidId, groupId]);

  const load = async () => {
    setLoading(true);
    try {
      const [groupRes, signupsRes, raidRes] = await Promise.all([
        supabase.from('raid_groups').select('*').eq('id', groupId!).single(),
        supabase.from('signups').select('*').eq('raid_id', raidId!).eq('raid_group_id', groupId!),
        supabase.from('raids').select('title, raid_type').eq('id', raidId!).single(),
      ]);

      if (raidRes.data) {
        setRaidTitle(raidRes.data.title);
        setRaidType(raidRes.data.raid_type as RaidType | null);
      }
      if (groupRes.data) setGroup(groupRes.data);
      if (signupsRes.data) {
        setMembers(signupsRes.data);

        // Fetch specs for all members that have a user_id
        const userIds = signupsRes.data.filter(s => s.user_id).map(s => s.user_id!);
        if (userIds.length > 0) {
          const { data: chars } = await supabase
            .from('user_characters')
            .select('user_id, char_spec')
            .in('user_id', userIds);
          if (chars) {
            const map: Record<string, string> = {};
            chars.forEach((c: any) => { if (c.char_spec) map[c.user_id] = c.char_spec; });
            setSpecMap(map);
          }
        }
        // Default distribution: fill columns of 5 in order, overfill goes to Bench (-1)
        const rType = raidRes.data?.raid_type as RaidType | null;
        const cap = rType ? (RAID_CONFIG[rType]?.capacity ?? 25) : 25;
        const maxGroups = cap / 5;

        const assignment: Record<string, number> = {};
        signupsRes.data.forEach((s, i) => {
          const defaultGroup = Math.floor(i / 5);
          assignment[s.id] = defaultGroup < maxGroups ? defaultGroup : -1;
        });
        setColAssignment(assignment);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveOver(null);
    setActiveId(null);
    if (!over) return;

    const signupId = active.id as string;
    const targetCol = over.id as string; // "col-0", "col-1", ..., "col-bench"
    const colIdx = targetCol === 'col-bench' ? -1 : parseInt(targetCol.replace('col-', ''), 10);

    setColAssignment((prev) => ({ ...prev, [signupId]: colIdx }));
    setSaving(true);
    // Visual-only rearrangement — no DB write needed for sub-group order
    setTimeout(() => setSaving(false), 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#8b8b99] text-[0.9rem]">Cargando visor...</p>
      </div>
    );
  }

  const capacity = raidType ? (RAID_CONFIG[raidType]?.capacity ?? 25) : 25;
  const numCols = capacity / 5;
  // Build columns from colAssignment
  const cols: Signup[][] = Array.from({ length: numCols }, () => []);
  const bench: Signup[] = [];

  members.forEach((s) => {
    const col = colAssignment[s.id] ?? -1;
    if (col >= 0 && col < numCols) {
      cols[col].push(s);
    } else {
      bench.push(s);
    }
  });

  const tanks = members.filter((s) => s.role === 'Tanque').length;
  const heals = members.filter((s) => s.role === 'Sanador').length;
  const dps = members.filter((s) => s.role === 'DPS').length;

  const grid = (
    <>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${numCols}, minmax(155px, 1fr))` }}
      >
        {cols.map((colMembers, i) => (
          <SubGroupColumn
            key={i}
            colIndex={i}
            members={colMembers}
            isAdmin={isAdmin}
            isOver={activeOver === `col-${i}`}
            specMap={specMap}
          />
        ))}
      </div>
      <BenchColumn
        members={bench}
        isAdmin={isAdmin}
        isOver={activeOver === 'col-bench'}
      />
    </>
  );

  return (
    <div className="min-h-screen pb-16 pt-40">
      {/* Header */}
      <div className="max-w-[1100px] mx-auto px-6 mb-6">
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[0.8rem] text-[#8b8b99] hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Volver
          </button>
          <div className="flex-1">
            <p className="text-3xl text-white uppercase  font-['Changa_One'] mb-0.5">
              {raidTitle}
            </p>
            <h1 className="font-['Changa_One'] text-[1.5rem] uppercase text-white leading-none">
              {group?.label ?? `Roster ${group?.group_number}`}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-[0.7rem] text-[#8b8b99]">
                <Users size={11} /> {members.length} jugadores
              </span>
              <span className="flex items-center gap-1 text-[0.7rem] text-[#5bc0de]">
                <Shield size={10} /> {tanks}
              </span>
              <span className="flex items-center gap-1 text-[0.7rem] text-[#5cb85c]">
                <Heart size={10} /> {heals}
              </span>
              <span className="flex items-center gap-1 text-[0.7rem] text-[#d9534f]">
                <Swords size={10} /> {dps}
              </span>
              {isAdmin && (
                <span className="ml-2 text-[0.7rem] text-[#86b518]">
                  {saving ? 'Reorganizando...' : '· Arrastra para reorganizar grupos'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1100px] mx-auto px-6">
        {members.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Users size={36} className="text-[#2a2a33]" />
            <p className="text-[#8b8b99] text-[0.9rem]">Este roster no tiene jugadores asignados.</p>
          </div>
        ) : isAdmin ? (
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => setActiveOver(e.over?.id as string ?? null)}
          >
            {grid}
            <DragOverlay dropAnimation={null}>
              {activeId ? (
                <UnitFrame
                  signup={members.find((m) => m.id === activeId)!}
                  isDraggable={false}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          grid
        )}
      </div>

      {/* Buffs / Debuffs panel */}
      {members.length > 0 && (
        <div className="max-w-[1100px] mx-auto px-6">
          <RaidBuffsPanel members={members} specMap={specMap} />
        </div>
      )}
    </div>
  );
}
