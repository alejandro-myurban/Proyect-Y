import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Check, Shield, Heart, Swords, CalendarDays, Package, LogOut, UserCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
  CLASSES,
  getAvailableRoles,
  slugClass,
  getClassIcon,
  type CharRole,
} from '../components/calendar/constants';
import { sileo } from 'sileo';
import type { UserCharacter, Signup, LootEntry, Raid } from '../types/calendar';

const ROLE_ICONS: Record<CharRole, React.ReactNode> = {
  Tanque: <Shield size={14} className="text-[#5bc0de]" />,
  Sanador: <Heart size={14} className="text-[#5cb85c]" />,
  DPS: <Swords size={14} className="text-[#d9534f]" />,
};

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [character, setCharacter] = useState<UserCharacter | null>(null);
  const [editing, setEditing] = useState(false);
  const [charName, setCharName] = useState('');
  const [charClass, setCharClass] = useState<string>(CLASSES[0]);
  const [charRole, setCharRole] = useState<CharRole>('DPS');
  const [saving, setSaving] = useState(false);

  const [mySignups, setMySignups] = useState<(Signup & { raid: Pick<Raid, 'id' | 'title' | 'date' | 'raid_type' | 'status' | 'raid_groups'> })[]>([]);
  const [myLoot, setMyLoot] = useState<(LootEntry & { raid_title: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadAll();
  }, [user]);

  useEffect(() => {
    const available = getAvailableRoles(charClass);
    if (!available.includes(charRole)) setCharRole(available[0]);
  }, [charClass]);

  const loadAll = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await Promise.all([loadCharacter(), loadSignups()]);
    } finally {
      setLoading(false);
    }
  };

  const loadCharacter = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_characters')
      .select('*')
      .eq('user_id', user.id)
      .single();
    if (data) {
      setCharacter(data);
      setCharName(data.char_name);
      setCharClass(data.char_class);
      setCharRole(data.char_role as CharRole);
    }
  };

  const loadSignups = async () => {
    if (!user) return;
    const { data: signupsData } = await supabase
      .from('signups')
      .select('*, raid:raids(id, title, date, raid_type, status, raid_groups(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!signupsData) return;
    setMySignups(signupsData as any);

    // Loot: load after we know char name
    const charData = await supabase
      .from('user_characters')
      .select('char_name')
      .eq('user_id', user.id)
      .single();

    if (charData.data?.char_name) {
      const { data: lootData } = await supabase
        .from('loot_history')
        .select('*, raid:raids(title)')
        .eq('winner', charData.data.char_name)
        .order('created_at', { ascending: false });

      if (lootData) {
        setMyLoot(lootData.map((l: any) => ({ ...l, raid_title: l.raid?.title ?? '?' })));
      }
    }
  };

  const handleSaveCharacter = async () => {
    if (!user || !charName.trim()) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('user_characters')
        .upsert({ user_id: user.id, char_name: charName.trim(), char_class: charClass, char_role: charRole }, { onConflict: 'user_id' })
        .select()
        .single();
      if (error) throw error;
      setCharacter(data);
      setEditing(false);
      
      sileo.success({
        title: 'Personaje guardado',
        description: `Tu personaje ${charName} ha sido actualizado.`,
        fill: "black",
        styles: { title: "text-white!", description: "text-white/75!" }
      });

      // Reload loot in case name changed
      await loadSignups();
    } catch (err: any) {
      sileo.error({
        title: 'Error al guardar personaje',
        description: err.message,
        fill: "black",
        styles: { title: "text-white!", description: "text-white/75!" }
      });
    } finally {
      setSaving(false);
    }
  };

  const userInitial = user?.email?.charAt(0).toUpperCase() ?? '?';
  const upcomingSignups = mySignups.filter((s) => (s.raid as any)?.status !== 'closed');
  const pastSignups = mySignups.filter((s) => (s.raid as any)?.status === 'closed');

  if (!user) return null;

  return (
    <div className="pt-24 pb-16 max-w-[900px] mx-auto px-6">
      {/* ── Profile header ── */}
      <div className="glass-panel p-8 mb-6 flex items-center gap-6 flex-wrap">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 border border-[#2a2a33]"
          style={{ background: 'rgba(134,181,24,0.1)' }}
        >
          <span className="font-['Changa_One'] text-[1.8rem] text-[#86b518]">{userInitial}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-[1.4rem] text-white mb-0.5">
            {character?.char_name ?? <span className="text-[#8b8b99]">Sin personaje</span>}
          </h1>
          <p className="text-[0.85rem] text-[#8b8b99]">{user.email}</p>
        </div>
        <button
          onClick={() => { signOut(); navigate('/'); }}
          className="btn btn-sm flex items-center gap-2 text-[0.8rem] text-[#8b8b99]"
        >
          <LogOut size={13} /> Cerrar Sesión
        </button>
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-6 max-[700px]:grid-cols-1">
        {/* ── Character card ── */}
        <div className="glass-panel p-6 flex flex-col gap-4">
          <h3 className="flex items-center gap-2 text-white text-[1rem] border-b border-[#2a2a33] pb-3 mb-1">
            <UserCircle2 size={16} className="text-[#86b518]" /> Tu Personaje
          </h3>

          {!editing && character ? (
            <div className="flex flex-col gap-4">
              {/* Character display */}
              <div
                className={`flex items-center gap-3 p-4 rounded-[4px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] class-${slugClass(character.char_class)}`}
              >
                <img 
                  src={getClassIcon(character.char_class)} 
                  alt={character.char_class}
                  className="w-8 h-8 rounded-[4px] border border-[rgba(0,0,0,0.3)] shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-['Changa_One'] text-[1.1rem] text-white">{character.char_name}</p>
                  <p className="text-[0.78rem] text-[#8b8b99]">{character.char_class}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[0.8rem] text-[#8b8b99]">
                  {ROLE_ICONS[character.char_role as CharRole]}
                  <span>{character.char_role}</span>
                </div>
              </div>
              <button onClick={() => setEditing(true)} className="btn w-full flex items-center justify-center gap-2 text-[0.82rem]">
                <Edit2 size={13} /> Editar Personaje
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {!character && (
                <p className="text-[0.8rem] text-[#8b8b99]">Crea tu personaje para apuntarte a raids.</p>
              )}
              <div>
                <label className="block text-[0.7rem] text-[#8b8b99] mb-1.5 uppercase tracking-widest">Nombre</label>
                <input type="text" className="input-field" placeholder="Ej. Pablito" value={charName} onChange={(e) => setCharName(e.target.value)} />
              </div>
              <div>
                <label className="block text-[0.7rem] text-[#8b8b99] mb-1.5 uppercase tracking-widest">Clase</label>
                <select className="input-field select-field" value={charClass} onChange={(e) => setCharClass(e.target.value)}>
                  {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[0.7rem] text-[#8b8b99] mb-1.5 uppercase tracking-widest">Rol</label>
                <div className="flex flex-col gap-1.5">
                  {getAvailableRoles(charClass).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setCharRole(role)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-[4px] border font-['Changa_One'] uppercase text-[0.82rem] transition-all duration-150
                        ${charRole === role
                          ? 'bg-[rgba(134,181,24,0.1)] border-[#86b518] text-[#86b518]'
                          : 'border-[#2a2a33] text-[#8b8b99] hover:border-[rgba(255,255,255,0.15)] hover:text-white'
                        }`}
                    >
                      {ROLE_ICONS[role]} {role}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveCharacter} disabled={saving || !charName.trim()} className="btn btn-primary flex-1 flex items-center justify-center gap-2">
                  <Check size={14} /> {saving ? 'Guardando...' : 'Guardar'}
                </button>
                {character && (
                  <button onClick={() => setEditing(false)} className="btn px-4">✕</button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Loot obtenido ── */}
        <div className="glass-panel p-6 flex flex-col gap-3">
          <h3 className="flex items-center gap-2 text-white text-[1rem] border-b border-[#2a2a33] pb-3 mb-1">
            <Package size={16} className="text-[#86b518]" /> Botín Obtenido
            {myLoot.length > 0 && (
              <span className="ml-auto text-[0.72rem] text-[#8b8b99] bg-[rgba(255,255,255,0.05)] px-2 py-0.5 rounded-[3px]">
                {myLoot.length}
              </span>
            )}
          </h3>

          {loading ? (
            <p className="text-[0.82rem] text-[#555]">Cargando...</p>
          ) : myLoot.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <Package size={28} className="text-[#2a2a33]" />
              <p className="text-[0.82rem] text-[#555]">Sin botín registrado aún.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[320px]">
              {myLoot.map((entry) => (
                <div key={entry.id} className="flex items-center gap-2.5 px-3 py-2 bg-[rgba(255,255,255,0.02)] rounded-[4px] border border-[rgba(255,255,255,0.04)]">
                  {entry.icon && (
                    <img
                      className="w-7 h-7 rounded-[4px] border border-[rgba(0,0,0,0.4)] flex-shrink-0"
                      src={`https://wow.zamimg.com/images/wow/icons/small/${entry.icon}.jpg`}
                      alt={entry.item_name}
                      onError={(e: any) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`quality-text-${entry.quality} text-[0.82rem] font-medium truncate`}>{entry.item_name}</p>
                    <p className="text-[0.68rem] text-[#555] truncate">{entry.raid_title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Raids ── */}
      <div className="glass-panel p-6 mt-6">
        <h3 className="flex items-center gap-2 text-white text-[1rem] border-b border-[#2a2a33] pb-3 mb-4">
          <CalendarDays size={16} className="text-[#86b518]" /> Tus Raids
        </h3>

        {loading ? (
          <p className="text-[0.82rem] text-[#555]">Cargando...</p>
        ) : mySignups.length === 0 ? (
          <p className="text-[0.82rem] text-[#555]">Aún no te has apuntado a ninguna raid.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {/* Upcoming */}
            {upcomingSignups.length > 0 && (
              <>
                <p className="text-[0.7rem] uppercase tracking-widest text-[#8b8b99] font-['Changa_One'] mb-1">Próximas</p>
                {upcomingSignups.map((s) => (
                  <RaidSignupRow key={s.id} signup={s} />
                ))}
              </>
            )}
            {/* Past */}
            {pastSignups.length > 0 && (
              <>
                <p className="text-[0.7rem] uppercase tracking-widest text-[#8b8b99] font-['Changa_One'] mt-3 mb-1">Historial</p>
                {pastSignups.map((s) => (
                  <RaidSignupRow key={s.id} signup={s} past />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RaidSignupRow({ signup, past }: { signup: any; past?: boolean }) {
  const raid = signup.raid;
  if (!raid) return null;

  const myGroup = raid.raid_groups?.find((g: any) => g.id === signup.raid_group_id);

  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-[4px] border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] ${past ? 'opacity-60' : ''}`}>
      <div className="flex-1 min-w-0">
        <p className="font-['Changa_One'] text-[0.9rem] text-white uppercase tracking-wide">{raid.title}</p>
        <p className="text-[0.72rem] text-[#8b8b99]">{formatDate(raid.date)}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {myGroup && (
          <span className="text-[0.72rem] font-['Changa_One'] uppercase px-2 py-0.5 rounded-[3px] bg-[rgba(134,181,24,0.1)] text-[#86b518]">
            {myGroup.label ?? `Grupo ${myGroup.group_number}`}
          </span>
        )}
        <span className={`flex items-center gap-1 text-[0.72rem] px-2 py-0.5 rounded-[3px] font-['Changa_One'] uppercase
          ${signup.role === 'Tanque' ? 'bg-[rgba(91,192,222,0.1)] text-[#5bc0de]'
          : signup.role === 'Sanador' ? 'bg-[rgba(92,184,92,0.1)] text-[#5cb85c]'
          : 'bg-[rgba(217,83,79,0.1)] text-[#d9534f]'}`}
        >
          {signup.role === 'Tanque' ? <Shield size={10} /> : signup.role === 'Sanador' ? <Heart size={10} /> : <Swords size={10} />}
          {signup.role}
        </span>
        {past && (
          <span className="text-[0.68rem] text-[#555] uppercase tracking-wide">Cerrada</span>
        )}
      </div>
    </div>
  );
}
