import React, { useState, useMemo } from 'react';
import { Plus, X, Save, Shield, Heart, Swords, Users, ArrowRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { slugClass, RAID_CONFIG, CLASS_COLORS, type CharRole } from './constants';
import type { Raid, Signup } from '../../types/calendar';

interface GroupOrganizerModalProps {
  open: boolean;
  onClose: () => void;
  raid: Raid;
  onSave: (assignments: GroupAssignment[], groups: GroupDef[]) => Promise<void>;
}

export interface GroupDef {
  id: string | null;
  group_number: number;
  label: string | null;
}

export interface GroupAssignment {
  signup_id: string;
  group_number: number | null;
}

const ROLE_ICONS: Record<CharRole, React.ReactNode> = {
  Tanque: <Shield size={13} className="text-[#5bc0de]" />,
  Sanador: <Heart size={13} className="text-[#5cb85c]" />,
  DPS: <Swords size={13} className="text-[#d9534f]" />,
};

const ROLE_COLORS: Record<CharRole, string> = {
  Tanque: '#5bc0de',
  Sanador: '#5cb85c',
  DPS: '#d9534f',
};

function roleCount(signups: Signup[], role: CharRole) {
  return signups.filter((s) => s.role === role).length;
}

/* ── Player row in "Sin Asignar" column ── */
function UnassignedRow({
  signup,
  groups,
  onAssign,
}: {
  signup: Signup;
  groups: GroupDef[];
  onAssign: (num: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const classColor = CLASS_COLORS[signup.class] ?? '#8b8b99';

  return (
    <div className="flex flex-col gap-1">
      <div
        className="flex items-center gap-2.5 pl-0 pr-3 py-0 rounded-[4px] border cursor-pointer transition-all duration-100 overflow-hidden"
        style={{
          borderColor: expanded ? `${classColor}50` : 'rgba(255,255,255,0.06)',
          background: expanded ? `${classColor}12` : 'rgba(255,255,255,0.02)',
        }}
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Class color left stripe */}
        <div className="w-[4px] self-stretch flex-shrink-0" style={{ background: classColor }} />

        <div className="flex items-center gap-2.5 flex-1 min-w-0 py-2.5 pl-2.5">
          {/* Name */}
          <span className="font-['Changa_One'] text-[0.9rem] flex-1 truncate" style={{ color: classColor }}>
            {signup.name}
          </span>

          {/* Class abbrev */}
          <span className="text-[0.65rem] uppercase tracking-wide flex-shrink-0 px-1.5 py-0.5 rounded-[3px]"
            style={{ background: `${classColor}18`, color: `${classColor}cc` }}>
            {signup.class.substring(0, 3)}
          </span>

          {/* Role */}
          <span className="flex items-center gap-1 flex-shrink-0"
            style={{ color: ROLE_COLORS[signup.role as CharRole] }}>
            {ROLE_ICONS[signup.role as CharRole]}
          </span>

          <ArrowRight
            size={12}
            className="flex-shrink-0 transition-transform duration-150"
            style={{ color: '#555', transform: expanded ? 'rotate(90deg)' : 'none' }}
          />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden pl-2"
          >
            <div className="flex flex-wrap gap-1.5 pb-1">
              {groups.map((g) => (
                <button
                  key={g.group_number}
                  onClick={() => { onAssign(g.group_number); setExpanded(false); }}
                  className="px-3 py-1.5 rounded-[3px] border text-[0.75rem] font-['Changa_One'] uppercase transition-all duration-100"
                  style={{
                    borderColor: `${classColor}50`,
                    background: `${classColor}12`,
                    color: classColor,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${classColor}28`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = `${classColor}12`; }}
                >
                  {g.label ?? `G${g.group_number}`}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Player row inside a group column ── */
function GroupMemberRow({
  signup,
  onRemove,
}: {
  signup: Signup;
  onRemove: () => void;
}) {
  const classColor = CLASS_COLORS[signup.class] ?? '#8b8b99';

  return (
    <div
      className="flex items-center gap-0 rounded-[4px] border overflow-hidden group transition-all duration-100"
      style={{ borderColor: `${classColor}30`, background: `${classColor}0a` }}
    >
      {/* Left stripe */}
      <div className="w-[3px] self-stretch flex-shrink-0" style={{ background: classColor }} />

      <div className="flex items-center gap-2 flex-1 min-w-0 px-2.5 py-2">
        <span className="font-['Changa_One'] text-[0.85rem] flex-1 truncate" style={{ color: classColor }}>
          {signup.name}
        </span>
        <span className="flex items-center flex-shrink-0 opacity-70"
          style={{ color: ROLE_COLORS[signup.role as CharRole] }}>
          {ROLE_ICONS[signup.role as CharRole]}
        </span>
        <button
          onClick={onRemove}
          className="flex-shrink-0 transition-colors opacity-0 group-hover:opacity-100 ml-0.5"
          style={{ color: '#444' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#ff6b6b'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#444'; }}
          title="Quitar del grupo"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}

export function GroupOrganizerModal({ open, onClose, raid, onSave }: GroupOrganizerModalProps) {
  const initialGroups: GroupDef[] = useMemo(() => {
    if (raid.raid_groups.length > 0) {
      return raid.raid_groups.map((g) => ({
        id: g.id,
        group_number: g.group_number,
        label: g.label,
      }));
    }
    return [{ id: null, group_number: 1, label: null }];
  }, [raid.raid_groups]);

  const initialAssignments = useMemo(() => {
    const map: Record<string, number | null> = {};
    raid.signups.forEach((s) => {
      const group = raid.raid_groups.find((g) => g.id === s.raid_group_id);
      map[s.id] = group?.group_number ?? null;
    });
    return map;
  }, [raid.signups, raid.raid_groups]);

  const [groups, setGroups] = useState<GroupDef[]>(initialGroups);
  const [assignments, setAssignments] = useState<Record<string, number | null>>(initialAssignments);
  const [saving, setSaving] = useState(false);

  const config = raid.raid_type ? RAID_CONFIG[raid.raid_type] : null;
  const groupCapacity = config?.capacity ?? 25;

  const unassigned = raid.signups.filter((s) => !assignments[s.id]);
  const getGroupSignups = (num: number) => raid.signups.filter((s) => assignments[s.id] === num);

  const addGroup = () => {
    const nextNum = Math.max(0, ...groups.map((g) => g.group_number)) + 1;
    setGroups((prev) => [...prev, { id: null, group_number: nextNum, label: null }]);
  };

  const removeGroup = (num: number) => {
    setAssignments((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => { if (next[id] === num) next[id] = null; });
      return next;
    });
    setGroups((prev) => prev.filter((g) => g.group_number !== num));
  };

  const assign = (signupId: string, groupNum: number) =>
    setAssignments((prev) => ({ ...prev, [signupId]: groupNum }));

  const unassign = (signupId: string) =>
    setAssignments((prev) => ({ ...prev, [signupId]: null }));

  const resetAll = () => {
    const empty: Record<string, number | null> = {};
    raid.signups.forEach((s) => { empty[s.id] = null; });
    setAssignments(empty);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const assignmentList: GroupAssignment[] = raid.signups.map((s) => ({
        signup_id: s.id,
        group_number: assignments[s.id] ?? null,
      }));
      await onSave(assignmentList, groups);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const assignedCount = raid.signups.length - unassigned.length;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="w-full h-full max-w-[1400px] max-h-[92vh] bg-[#0d0d10] border border-[#2a2a33] rounded-[6px] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a33] flex-shrink-0"
          style={{ background: config?.bgGradient ?? 'transparent' }}
        >
          <div>
            <h2
              className="font-['Changa_One'] text-[1.2rem] uppercase tracking-widest m-0"
              style={{ color: config?.accentColor ?? '#86b518' }}
            >
              Organizar Grupos · {raid.title}
            </h2>
            <p className="text-[0.78rem] text-[#8b8b99] mt-0.5">
              {raid.signups.length} apuntados · {assignedCount} asignados · {unassigned.length} sin grupo · Capacidad por grupo: {groupCapacity}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetAll}
              className="btn btn-sm flex items-center gap-1.5 text-[0.78rem] text-[#8b8b99]"
              title="Deshacer todas las asignaciones"
            >
              <RotateCcw size={12} /> Reset
            </button>
            <button onClick={addGroup} className="btn btn-sm flex items-center gap-1.5 text-[0.78rem]">
              <Plus size={12} /> Nuevo Grupo
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary btn-sm flex items-center gap-1.5 text-[0.78rem]"
              style={config ? { background: config.accentColor, borderColor: config.accentColor } : {}}
            >
              <Save size={12} />
              {saving ? 'Guardando...' : 'Guardar Asignaciones'}
            </button>
            <button
              onClick={onClose}
              className="ml-2 text-[#555] hover:text-white transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Columns ── */}
        <div className="flex flex-1 min-h-0 overflow-x-auto">

          {/* Sin Asignar */}
          <div className="flex-shrink-0 w-[280px] border-r border-[#2a2a33] flex flex-col bg-[rgba(0,0,0,0.2)]">
            <div className="px-4 py-3 border-b border-[#2a2a33] flex items-center justify-between flex-shrink-0">
              <span className="text-[0.75rem] font-['Changa_One'] uppercase tracking-widest text-[#8b8b99]">
                Sin Asignar
              </span>
              <span
                className={`font-['Changa_One'] text-[0.8rem] px-2 py-0.5 rounded-[3px]
                  ${unassigned.length > 0
                    ? 'bg-[rgba(255,180,0,0.12)] text-[#f0c060]'
                    : 'bg-[rgba(134,181,24,0.1)] text-[#86b518]'
                  }`}
              >
                {unassigned.length === 0 ? '✓ Todo asignado' : `${unassigned.length} personas`}
              </span>
            </div>

            {/* Role filter summary */}
            <div className="flex gap-3 px-4 py-2 border-b border-[#1a1a1e] bg-[rgba(0,0,0,0.3)]">
              {(['Tanque', 'Sanador', 'DPS'] as CharRole[]).map((role) => (
                <div key={role} className="flex items-center gap-1.5">
                  {ROLE_ICONS[role]}
                  <span className="text-[0.72rem]" style={{ color: ROLE_COLORS[role] }}>
                    {roleCount(unassigned, role)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5">
              {unassigned.length === 0 ? (
                <div className="flex flex-col items-center gap-2 pt-8 text-center">
                  <span className="text-2xl">🎉</span>
                  <p className="text-[0.78rem] text-[#555]">Todos en un grupo</p>
                </div>
              ) : (
                unassigned.map((s) => (
                  <UnassignedRow
                    key={s.id}
                    signup={s}
                    groups={groups}
                    onAssign={(num) => assign(s.id, num)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Group columns */}
          {groups.map((group) => {
            const members = getGroupSignups(group.group_number);
            const overCapacity = members.length > groupCapacity;
            const fillPct = Math.min(100, (members.length / groupCapacity) * 100);

            return (
              <div
                key={group.group_number}
                className="flex-shrink-0 w-[260px] border-r border-[#2a2a33] flex flex-col"
              >
                {/* Group header */}
                <div className="px-4 py-3 border-b border-[#2a2a33] bg-[rgba(255,255,255,0.015)] flex-shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={13} className="text-[#8b8b99] flex-shrink-0" />
                    <span className="text-[0.82rem] font-['Changa_One'] uppercase tracking-wide text-[#e2e2e2] flex-1 truncate">
                      {group.label ?? `Grupo ${group.group_number}`}
                    </span>
                    <span
                      className={`font-['Changa_One'] text-[0.75rem] px-1.5 py-0.5 rounded-[3px] flex-shrink-0
                        ${overCapacity
                          ? 'bg-[rgba(255,60,60,0.15)] text-[#ff6b6b]'
                          : members.length === groupCapacity
                          ? 'bg-[rgba(134,181,24,0.15)] text-[#86b518]'
                          : 'bg-[rgba(255,255,255,0.06)] text-[#8b8b99]'
                        }`}
                    >
                      {members.length}/{groupCapacity}
                    </span>
                    <button
                      onClick={() => removeGroup(group.group_number)}
                      className="text-[#2a2a33] hover:text-[#ff6b6b] transition-colors flex-shrink-0"
                    >
                      <X size={13} />
                    </button>
                  </div>

                  {/* Fill bar */}
                  <div className="h-[3px] bg-[#1a1a1e] rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${fillPct}%`,
                        background: overCapacity ? '#ff6b6b' : members.length === groupCapacity ? '#86b518' : config?.accentColor ?? '#86b518',
                      }}
                    />
                  </div>

                  {/* Role breakdown */}
                  <div className="flex gap-3">
                    {(['Tanque', 'Sanador', 'DPS'] as CharRole[]).map((role) => (
                      <div key={role} className="flex items-center gap-1">
                        {ROLE_ICONS[role]}
                        <span className="text-[0.72rem]" style={{ color: ROLE_COLORS[role] }}>
                          {roleCount(members, role)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Members */}
                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5">
                  {members.length === 0 ? (
                    <div className="flex items-center justify-center pt-8">
                      <p className="text-[0.72rem] text-[#2a2a33] uppercase tracking-widest font-['Changa_One']">
                        Vacío
                      </p>
                    </div>
                  ) : (
                    members.map((s) => (
                      <GroupMemberRow
                        key={s.id}
                        signup={s}
                        onRemove={() => unassign(s.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}

          {/* Add group button column */}
          <div className="flex-shrink-0 w-[180px] flex items-start justify-center pt-12">
            <button
              onClick={addGroup}
              className="flex flex-col items-center gap-3 text-[#2a2a33] hover:text-[#8b8b99] transition-all duration-150 p-6 rounded-[6px] hover:bg-[rgba(255,255,255,0.02)] border border-transparent hover:border-[#2a2a33]"
            >
              <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center">
                <Plus size={16} />
              </div>
              <span className="text-[0.72rem] uppercase tracking-widest font-['Changa_One'] text-center leading-tight">
                Nuevo<br />Grupo
              </span>
            </button>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-3 border-t border-[#1a1a1e] bg-[rgba(0,0,0,0.4)] flex items-center justify-between flex-shrink-0">
          <p className="text-[0.7rem] text-[#444]">
            Click en un jugador → selecciona grupo · Hover en grupo → click ✕ para quitar
          </p>
          <div className="flex items-center gap-4">
            {/* Progress dots */}
            <div className="flex items-center gap-2 text-[0.72rem] text-[#8b8b99]">
              <div className="w-2 h-2 rounded-full bg-[rgba(255,180,0,0.6)]" />
              <span>{unassigned.length} sin asignar</span>
              <div className="w-2 h-2 rounded-full bg-[rgba(134,181,24,0.8)] ml-2" />
              <span>{assignedCount} asignados</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
