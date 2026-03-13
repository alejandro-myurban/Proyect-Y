import React, { useState, useEffect, useCallback } from 'react';
import { History, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
  CLASSES,
  ADMIN_EMAILS,
  getAvailableRoles,
  type RaidType,
  type RaidTypeCombo,
  type CharRole,
} from '../components/calendar/constants';
import { CreateRaidPanel } from '../components/calendar/CreateRaidPanel';
import { CharacterPanel } from '../components/calendar/CharacterPanel';
import { RaidBannerCard } from '../components/calendar/RaidBannerCard';
import { SignupModal } from '../components/calendar/SignupModal';
import { GroupOrganizerModal, type GroupAssignment, type GroupDef } from '../components/calendar/GroupOrganizerModal';
import { CloseRaidModal } from '../components/calendar/CloseRaidModal';
import { sileo } from 'sileo';
import type { Raid, UserCharacter } from '../types/calendar';

// Re-export types for backwards compatibility
export type { Signup, LootEntry, Raid } from '../types/calendar';

type View = 'upcoming' | 'history';

export default function Calendar() {
  const { user } = useAuth();
  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email ?? '');

  const [raids, setRaids] = useState<Raid[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('upcoming');
  const [currentCharacter, setCurrentCharacter] = useState<UserCharacter | null>(null);

  // Cargar personaje del usuario al iniciar
  useEffect(() => {
    const loadCharacter = async () => {
      if (!user) {
        setCurrentCharacter(null);
        return;
      }
      const { data } = await supabase
        .from('user_characters')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (data) setCurrentCharacter(data);
    };
    loadCharacter();
  }, [user]);

  // Signup modal state — kept in sync with latest raids data
  const [signupRaid, setSignupRaid] = useState<Raid | null>(null);

  // Keep signupRaid fresh when raids updates
  useEffect(() => {
    if (signupRaid) {
      const fresh = raids.find((r) => r.id === signupRaid.id);
      if (fresh) setSignupRaid(fresh);
    }
  }, [raids]);
  const [charName, setCharName] = useState('');
  const [charClass, setCharClass] = useState<string>(CLASSES[0]);
  const [charRole, setCharRole] = useState<CharRole>('DPS');

  // Admin modal state
  const [groupOrganizerRaid, setGroupOrganizerRaid] = useState<Raid | null>(null);
  const [closeRaidTarget, setCloseRaidTarget] = useState<Raid | null>(null);

  const fetchRaids = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('raids')
        .select('*, signups(*), loot:loot_history(*), raid_groups(*)')
        .order('date', { ascending: true });

      if (error) throw error;
      const fresh = (data as Raid[]) ?? [];
      setRaids(fresh);
      return fresh;
    } catch (err: any) {
      console.error('Error fetching raids:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRaids();

    const channel = supabase
      .channel('calendar_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'raids' }, fetchRaids)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'signups' }, fetchRaids)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'loot_history' }, fetchRaids)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'raid_groups' }, fetchRaids)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_characters' }, fetchRaids)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRaids]);

  // ── Raid CRUD ──────────────────────────────────────────────────────────────

  const handleCreateRaid = async (raidType: RaidType | RaidTypeCombo, date: string, title: string) => {
    const raidTypeValue = Array.isArray(raidType) ? raidType.join('+') : raidType;
    const { error } = await supabase.from('raids').insert([{
      title,
      date,
      raid_type: raidTypeValue,
      status: 'active',
    }]);
    if (error) {
      sileo.error({
        title: 'Error al crear raid',
        description: error.message,
        fill: "black",
        styles: { title: "text-white!", description: "text-white/75!" }
      });
      throw error;
    }

    sileo.success({
      title: '¡Raid programada!',
      description: `Se ha creado el evento: ${title}`,
      fill: "black",
      styles: { title: "text-white!", description: "text-white/75!" }
    });
    await fetchRaids();
  };

  const handleDeleteRaid = async (id: string) => {
    if (!confirm('¿Seguro que quieres borrar este evento?')) return;
    const { error } = await supabase.from('raids').delete().eq('id', id);
    if (error) {
      sileo.error({
        title: 'Error al eliminar raid',
        description: error.message,
        fill: "black",
        styles: { title: "text-white!", description: "text-white/75!" }
      });
    } else {
      sileo.success({
        title: 'Raid eliminada',
        fill: "black",
        styles: { title: "text-white!", description: "text-white/75!" }
      });
      await fetchRaids();
    }
  };

  const handleCloseRaid = async (warcraftLogsUrl: string) => {
    if (!closeRaidTarget) return;
    const { data, error } = await supabase
      .from('raids')
      .update({ status: 'closed', warcraft_logs_url: warcraftLogsUrl || null })
      .eq('id', closeRaidTarget.id)
      .select();
    if (error) {
      sileo.error({
        title: 'Error al cerrar raid',
        description: error.message,
        fill: "black",
        styles: { title: "text-white!", description: "text-white/75!" }
      });
      throw new Error(error.message);
    }
    if (!data || data.length === 0) {
      const msg = 'El UPDATE no afectó ninguna fila. Revisa las políticas RLS.';
      sileo.error({ title: 'Error', description: msg, fill: "black", styles: { title: "text-white!", description: "text-white/75!" } });
      throw new Error(msg);
    }

    sileo.success({
      title: 'Evento cerrado',
      description: 'La raid se ha movido al historial.',
      fill: "black",
      styles: { title: "text-white!", description: "text-white/75!" }
    });
    await fetchRaids();
    setCloseRaidTarget(null);
  };

  // ── Sign-up ────────────────────────────────────────────────────────────────

  const openSignupModal = (raidId: string) => {
    if (!user) {
      alert('Debes iniciar sesión para apuntarte a raids.');
      return;
    }
    const raid = raids.find((r) => r.id === raidId);
    if (!raid) return;

    // Check if user is already signed up
    const alreadySigned = raid.signups.some(s => s.user_id === user.id);
    if (alreadySigned) {
      sileo.success({
        title: 'Ya estás apuntado',
        description: 'Puedes modificar tu personaje si es necesario (próximamente).',
        fill: "black",
        styles: { title: "text-white!", description: "text-white/75!" }
      });
      return;
    }

    setSignupRaid(raid);
  };

  const handleSignUp = async (name: string, charClassArg: string, charRoleArg: CharRole) => {
    if (!signupRaid) return;
    const { error } = await supabase.from('signups').insert([{
      raid_id: signupRaid.id,
      user_id: user?.id ?? null,
      name,
      class: charClassArg,
      role: charRoleArg,
    }]);
    if (error) {
      if (error.code === '23505') {
        sileo.error({
          title: 'Ya apuntado',
          description: '¡Ya estás apuntado a esta raid!',
          fill: "black",
          styles: { title: "text-white!", description: "text-white/75!" }
        });
        throw new Error('¡Ya estás apuntado a esta raid!');
      }
      sileo.error({
        title: 'Error al apuntarse',
        description: error.message,
        fill: "black",
        styles: { title: "text-white!", description: "text-white/75!" }
      });
      throw error;
    }

    sileo.success({
      title: '¡Te has apuntado!',
      description: `Registrado como ${name} (${charClassArg})`,
      fill: "black",
      styles: { title: "text-white!", description: "text-white/75!" }
    });
    await fetchRaids();
  };

  // ── Loot ──────────────────────────────────────────────────────────────────

  const handleAddLoot = async (raidId: string, entry: any) => {
    const { error } = await supabase.from('loot_history').insert([{
      raid_id: raidId,
      item_id: entry.itemId,
      item_name: entry.itemName,
      quality: entry.quality,
      slot: entry.slot,
      winner: entry.winner,
      boss: entry.boss,
      icon: entry.icon,
    }]);
    if (error) {
      sileo.error({
        title: 'Error al añadir drop',
        description: error.message,
        fill: "black",
        styles: { title: "text-white!", description: "text-white/75!" }
      });
    } else {
      sileo.success({
        title: 'Drop registrado',
        description: `${entry.itemName} para ${entry.winner}`,
        fill: "black",
        styles: { title: "text-white!", description: "text-white/75!" }
      });
      await fetchRaids();
    }
  };

  const handleRemoveLoot = async (raidId: string, lootId: string) => {
    const { error } = await supabase.from('loot_history').delete().eq('id', lootId);
    if (error) {
      sileo.error({
        title: 'Error al eliminar drop',
        description: error.message,
        fill: "black",
        styles: { title: "text-white!", description: "text-white/75!" }
      });
    } else {
      sileo.success({
        title: 'Drop eliminado',
        fill: "black",
        styles: { title: "text-white!", description: "text-white/75!" }
      });
      await fetchRaids();
    }
  };

  const handleCancelSignup = async (signupId: string) => {
    const { error } = await supabase.from('signups').delete().eq('id', signupId);
    if (error) {
      sileo.error({ title: 'Error al desapuntarse', description: error.message, fill: 'black', styles: { title: 'text-white!', description: 'text-white/75!' } });
    } else {
      sileo.success({ title: 'Desapuntado correctamente', fill: 'black', styles: { title: 'text-white!', description: 'text-white/75!' } });
      await fetchRaids();
    }
  };

  // ── Groups ─────────────────────────────────────────────────────────────────

  const handleSaveGroups = async (assignments: GroupAssignment[], groupDefs: GroupDef[]) => {
    if (!groupOrganizerRaid) return;
    const raidId = groupOrganizerRaid.id;

    const hasMultipleGroups = groupDefs.length > 1;

    // First, delete existing groups and recreate (simpler approach)
    await supabase.from('raid_groups').delete().eq('raid_id', raidId);

    const groupInserts = groupDefs.map((g, index) => ({
      raid_id: raidId,
      group_number: index + 1,
      label: hasMultipleGroups ? `Roster ${index + 1}` : `Roster ${index + 1}`,
    }));

    const { data: savedGroups, error: groupError } = await supabase
      .from('raid_groups')
      .insert(groupInserts)
      .select();

    if (groupError) {
      sileo.error({
        title: 'Error al guardar grupos',
        description: groupError.message,
        fill: "black",
        styles: { title: "text-white!", description: "text-white/75!" }
      });
      throw groupError;
    }

    // Build map from group_number → DB id (use g.group_number, not idx)
    const groupIndexToId: Record<number, string> = {};
    (savedGroups ?? []).forEach((g: any) => {
      groupIndexToId[g.group_number] = g.id;
    });
    console.log('[Groups] savedGroups:', savedGroups);
    console.log('[Groups] groupIndexToId:', groupIndexToId);
    console.log('[Groups] assignments to save:', assignments);

    // Update signups with correct group IDs
    try {
      // First, clear all raid_group_id for this raid's signups
      const signupIds = groupOrganizerRaid.signups.map((s: any) => s.id);
      if (signupIds.length > 0) {
        const { error: clearError } = await supabase
          .from('signups')
          .update({ raid_group_id: null })
          .in('id', signupIds);
        console.log('[Groups] clear signups error:', clearError);
      }

      // Then assign to groups
      for (const a of assignments) {
        console.log('[Groups] processing assignment:', a);
        if (a.group_number !== null && a.group_number !== undefined) {
          const groupId = groupIndexToId[a.group_number];
          console.log(`[Groups] signup ${a.signup_id} → group_number ${a.group_number} → groupId ${groupId}`);
          if (groupId) {
            const { error: updateError, data: updateData } = await supabase
              .from('signups')
              .update({ raid_group_id: groupId })
              .eq('id', a.signup_id)
              .select();
            console.log(`[Groups] update result for ${a.signup_id}:`, { updateData, updateError });

            if (updateError) {
              console.error('Error updating signup:', a.signup_id, updateError);
            }
          } else {
            console.warn(`[Groups] No groupId found for group_number ${a.group_number}`);
          }
        }
      }

      sileo.success({
        title: 'Configuración guardada',
        description: 'Se han actualizado los grupos de la raid.',
        fill: "black",
        styles: { title: "text-white!", description: "text-white/75!" }
      });
    } catch (err: any) {
      sileo.error({
        title: 'Error al actualizar asignaciones',
        description: err.message,
        fill: "black",
        styles: { title: "text-white!", description: "text-white/75!" }
      });
    }

    const freshRaids = await fetchRaids();

    // Update the groupOrganizerRaid with fresh data
    const updatedRaid = freshRaids?.find(r => r.id === raidId);
    if (updatedRaid) {
      setGroupOrganizerRaid(updatedRaid);
    }
  };

  // ── Derived data ───────────────────────────────────────────────────────────

  const upcomingRaids = raids.filter((r) => r.status !== 'closed');
  const pastRaids = raids.filter((r) => r.status === 'closed');
  const displayedRaids = view === 'upcoming' ? upcomingRaids : pastRaids;

  const availableRoles = getAvailableRoles(charClass);

  return (
    <div className=" max-w-[1440px] mx-auto px-6 pb-16 pt-40">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="mb-1">
            <span className="text-[#86b518]">Calendario</span> de Raid
          </h1>
          <p className="text-[#8b8b99] text-[0.9rem]">Programa, apúntate y conquista.</p>
        </div>

        {/* View tabs */}
        <div className="flex gap-1 bg-[#1c1c21] border border-[#2a2a33] rounded-[4px] p-1">
          {([
            ['upcoming', <CalendarDays size={14} />, 'Próximas', upcomingRaids.length],
            ['history', <History size={14} />, 'Historial', pastRaids.length],
          ] as [View, React.ReactNode, string, number][]).map(([v, icon, label, count]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-[2px] text-[0.78rem] font-['Changa_One'] uppercase tracking-wide transition-all duration-150
                ${view === v
                  ? 'bg-[#86b518] text-white shadow-[0_0_10px_rgba(134,181,24,0.2)]'
                  : 'text-[#8b8b99] hover:text-white'
                }`}
            >
              {icon}
              {label}
              {count > 0 && (
                <span
                  className={`text-[0.62rem] px-1 rounded-[3px] ${
                    view === v ? 'bg-[rgba(255,255,255,0.2)]' : 'bg-[rgba(255,255,255,0.06)]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6 max-[900px]:flex-col">
        {/* Sidebar */}
        <div className="w-[280px] flex-shrink-0 max-[900px]:w-full">
          {isAdmin ? (
            <CreateRaidPanel onCreate={handleCreateRaid} />
          ) : (
            <CharacterPanel onCharacterChange={setCurrentCharacter} />
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {loading ? (
            <div className="glass-panel text-center py-16">
              <div className="inline-block w-7 h-7 border-[3px] border-[#86b518] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[#8b8b99] text-[0.85rem]">Cargando raids...</p>
            </div>
          ) : displayedRaids.length === 0 ? (
            <div className="glass-panel text-center py-16">
              <p className="text-[#8b8b99]">
                {view === 'upcoming'
                  ? 'No hay raids programadas. Toca farmear oro.'
                  : 'No hay eventos pasados aún.'}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-3"
              >
                {displayedRaids.map((raid, i) => (
                  <motion.div
                    key={raid.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <RaidBannerCard
                      raid={raid}
                      isAdmin={isAdmin}
                      currentCharacter={currentCharacter}
                      currentUserId={user?.id ?? null}
                      onSignUp={openSignupModal}
                      onDeleteRaid={handleDeleteRaid}
                      onAddLoot={handleAddLoot}
                      onRemoveLoot={handleRemoveLoot}
                      onOpenGroupOrganizer={setGroupOrganizerRaid}
                      onCloseRaid={setCloseRaidTarget}
                      onCancelSignup={handleCancelSignup}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Signup Modal */}
      {signupRaid && (
        <SignupModal
          open={!!signupRaid}
          onClose={() => setSignupRaid(null)}
          raid={signupRaid}
          character={currentCharacter}
          onConfirm={async (name, cls, role) => {
            try {
              await handleSignUp(name, cls, role);
            } catch (err: any) {
              alert(err.message);
              throw err;
            }
          }}
          charName={charName}
          setCharName={setCharName}
          charClass={charClass}
          setCharClass={(v) => {
            setCharClass(v);
            const avail = getAvailableRoles(v);
            if (!avail.includes(charRole)) setCharRole(avail[0]);
          }}
          charRole={charRole}
          setCharRole={setCharRole}
          availableRoles={availableRoles}
          allClasses={CLASSES}
        />
      )}

      {/* Group Organizer Modal */}
      {groupOrganizerRaid && (
        <GroupOrganizerModal
          open={!!groupOrganizerRaid}
          onClose={() => setGroupOrganizerRaid(null)}
          raid={raids.find(r => r.id === groupOrganizerRaid.id) || groupOrganizerRaid}
          onSave={handleSaveGroups}
        />
      )}

      {/* Close Raid Modal */}
      {closeRaidTarget && (
        <CloseRaidModal
          open={!!closeRaidTarget}
          onClose={() => setCloseRaidTarget(null)}
          raid={closeRaidTarget}
          onConfirm={handleCloseRaid}
        />
      )}
    </div>
  );
}
