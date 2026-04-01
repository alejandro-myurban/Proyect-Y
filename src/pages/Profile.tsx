import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Edit2, Check, Shield, Heart, Swords, CalendarDays, Package, LogOut, UserCircle2, Settings2, Camera } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/useAuth';
import {
  CLASSES,
  getAvailableRoles,
  slugClass,
  getClassIcon,
  CLASS_COLORS,
  type CharRole,
} from '../components/calendar/constants';
import { sileo } from 'sileo';
import { AvatarPickerModal } from '../components/profile/AvatarPickerModal';
import { CLASS_BANNERS } from '../components/profile/classBanners';
import { BisPanel } from '../components/profile/BisPanel';
import { getAllSpecsForClass } from '../data/specBuffs';
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
  const { user, signOut, isAdmin, isSuperAdmin, setAvatarUrl: setGlobalAvatarUrl } = useAuth();
  const navigate = useNavigate();

  const [characters, setCharacters] = useState<UserCharacter[]>([]);
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [charName, setCharName] = useState('');
  const [charClass, setCharClass] = useState<string>(CLASSES[0]);
  const [charRole, setCharRole] = useState<CharRole>('DPS');
  const [saving, setSaving] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [detectedSpec, setDetectedSpec] = useState<string | null>(null);

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
      await Promise.all([loadCharacters(), loadSignups()]);
    } finally {
      setLoading(false);
    }
  };

  const loadCharacters = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_characters')
      .select('*')
      .eq('user_id', user.id);
    if (data) {
      setCharacters(data);
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
      const payload: any = {
        user_id: user.id,
        char_name: charName.trim(),
        char_class: charClass,
        char_role: charRole
      };
      
      if (editingId !== 'new') {
        payload.id = editingId;
      }

      const { data, error } = await supabase
        .from('user_characters')
        .upsert(payload)
        .select()
        .single();
        
      if (error) throw error;
      
      if (editingId === 'new') {
         setCharacters([...characters, data]);
      } else {
         setCharacters(characters.map(c => c.id === data.id ? data : c));
      }
      setEditingId(null);
      
      sileo.success({
        title: 'Personaje guardado',
        description: `El personaje ${charName} ha sido guardado.`,
        fill: "black",
        styles: { title: "text-white!", description: "text-white/75!" }
      });

      await loadSignups();
    } catch (err: any) {
      sileo.error({
        title: 'Error al guardar',
        description: err.message,
        fill: "black"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (c: UserCharacter) => {
    setCharName(c.char_name);
    setCharClass(c.char_class);
    setCharRole(c.char_role as CharRole);
    setEditingId(c.id);
  };

  const handleCreateNew = () => {
    setCharName('');
    setCharClass(CLASSES[0]);
    setCharRole('DPS');
    setEditingId('new');
  };

  const handleSelectSpec = async (specKey: string, charId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('user_characters')
      .update({ char_spec: specKey })
      .eq('id', charId);
    if (error) {
      sileo.error({ title: 'Error al guardar spec', description: error.message, fill: 'black', styles: { title: 'text-white!', description: 'text-white/75!' } });
    } else {
      setCharacters((prev) => prev.map(c => c.id === charId ? { ...c, char_spec: specKey } : c));
      sileo.success({ title: 'Especialización guardada', fill: 'black', styles: { title: 'text-white!', description: 'text-white/75!' } });
    }
  };

  const handleSelectAvatar = async (url: string) => {
    if (!user || characters.length === 0) return;
    const mainChar = characters[0];
    const { error } = await supabase
      .from('user_characters')
      .update({ avatar_url: url })
      .eq('id', mainChar.id);
    if (error) {
      sileo.error({ title: 'Error al guardar avatar', description: error.message, fill: 'black', styles: { title: 'text-white!', description: 'text-white/75!' } });
      return;
    }
    setCharacters((prev) => prev.map(c => c.id === mainChar.id ? { ...c, avatar_url: url } : c));
    setGlobalAvatarUrl(url);
    setShowAvatarPicker(false);
    sileo.success({ title: 'Avatar actualizado', fill: 'black', styles: { title: 'text-white!', description: 'text-white/75!' } });
  };

  const userInitial = user?.email?.charAt(0).toUpperCase() ?? '?';
  const upcomingSignups = mySignups.filter((s) => (s.raid as any)?.status !== 'closed');
  const pastSignups = mySignups.filter((s) => (s.raid as any)?.status === 'closed');

  if (!user) return null;

  const mainCharacter = characters.length > 0 ? characters[0] : null;
  const classColor = mainCharacter ? (CLASS_COLORS[mainCharacter.char_class] ?? '#86b518') : '#86b518';

  return (
    <div className="pb-16 pt-20">
      {/* ── Banner ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: '260px' }}
      >
        {/* Class artwork background */}
        {mainCharacter?.char_class && CLASS_BANNERS[mainCharacter.char_class] && (
          <img
            src={CLASS_BANNERS[mainCharacter.char_class]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            onError={(e: any) => { e.target.style.display = 'none'; }}
          />
        )}
        {/* Color gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, #0a0a0d 0%, ${classColor}18 50%, #0a0a0d 100%)`,
          }}
        />
        {/* Atmospheric grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow orb */}
        <div
          className="absolute top-[-60px] left-[15%] w-[340px] h-[340px] rounded-full blur-[90px] opacity-20 pointer-events-none"
          style={{ background: classColor }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{ background: 'linear-gradient(to bottom, transparent, #0d0d10)' }}
        />
        {/* Content */}
        <div className="absolute inset-0 flex items-end px-8 pb-6 max-w-[900px] mx-auto left-0 right-0">
          <div className="flex items-end gap-5">
            {/* Avatar */}
            <button
              onClick={() => setShowAvatarPicker(true)}
              className="relative group flex-shrink-0 w-20 h-20 rounded-full overflow-hidden border-2 transition-all duration-200"
              style={{ borderColor: classColor, boxShadow: `0 0 18px ${classColor}55` }}
              title="Cambiar avatar"
            >
              {mainCharacter?.avatar_url ? (
                <img src={mainCharacter.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: `${classColor}18` }}>
                  <span className="font-['Changa_One'] text-[2rem]" style={{ color: classColor }}>{userInitial}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <Camera size={18} className="text-white" />
              </div>
            </button>
            {/* Name + email */}
            <div className="mb-1">
              <h1 className="text-[1.6rem] text-white font-['Changa_One'] uppercase leading-none mb-1">
                {mainCharacter?.char_name ?? <span className="text-[#8b8b99] text-[1.2rem]">Sin personaje</span>}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[0.8rem] text-[#8b8b99]">{user.email}</p>
              </div>
              {mainCharacter && (() => {
                const specs = getAllSpecsForClass(mainCharacter.char_class);
                if (specs.length === 0) return null;
                return (
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {specs.map(({ specKey, specLabel }) => (
                      <button
                        key={specKey}
                        onClick={() => handleSelectSpec(specKey, mainCharacter.id)}
                        className="text-[0.68rem] font-['Changa_One'] uppercase px-2 py-0.5 rounded-[3px] transition-all duration-100"
                        style={
                          mainCharacter.char_spec === specKey
                            ? { background: `${classColor}33`, color: classColor, border: `1px solid ${classColor}77` }
                            : { background: 'rgba(255,255,255,0.05)', color: '#8b8b99', border: '1px solid rgba(255,255,255,0.1)' }
                        }
                      >
                        {specLabel}
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
          {/* Actions top-right */}
          <div className="ml-auto flex items-center gap-2 mb-1">
            {isAdmin && (
              <button
                onClick={() => navigate('/admin/voces')}
                className="btn btn-sm flex items-center gap-2 text-[0.8rem]"
                style={{ background: '#f0a500', borderColor: '#f0a500', color: '#000' }}
              >
                <Settings2 size={13} /> Voces
              </button>
            )}
            {isSuperAdmin && (
              <button
                onClick={() => navigate('/admin/usuarios')}
                className="btn btn-sm flex items-center gap-2 text-[0.8rem]"
                style={{ background: '#7c3aed', borderColor: '#7c3aed', color: '#fff' }}
              >
                <Shield size={13} /> Admins
              </button>
            )}
            <button
              onClick={() => { signOut(); navigate('/'); }}
              className="btn btn-sm flex items-center gap-2 text-[0.8rem] text-[#8b8b99]"
            >
              <LogOut size={13} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-6 mt-4">

      <div className="grid grid-cols-[1fr_1fr] gap-6 max-[700px]:grid-cols-1">
        {/* ── Character card ── */}
        <div className="glass-panel p-6 flex flex-col gap-4">
          <h3 className="flex items-center gap-2 text-white text-[1rem] border-b border-[#2a2a33] pb-3 mb-4">
            <UserCircle2 size={16} className="text-[#86b518]" /> Tus Personajes
          </h3>

          {!editingId ? (
            <div className="flex flex-col gap-3">
              {characters.length === 0 ? (
                <p className="text-[0.8rem] text-[#8b8b99]">No tienes personajes guardados.</p>
              ) : (
                characters.map((c) => (
                  <div
                    key={c.id}
                    className={`flex items-center gap-3 p-4 rounded-[4px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] class-${slugClass(c.char_class)}`}
                  >
                    <img 
                      src={getClassIcon(c.char_class)} 
                      alt={c.char_class}
                      className="w-8 h-8 rounded-[4px] border border-[rgba(0,0,0,0.3)] shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-['Changa_One'] text-[1.1rem] text-white leading-none">{c.char_name}</p>
                      <p className="text-[0.78rem] text-[#8b8b99] mt-1">{c.char_class}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 text-[0.8rem] text-[#8b8b99]">
                        {ROLE_ICONS[c.char_role as CharRole]}
                        <span>{c.char_role}</span>
                      </div>
                      <button onClick={() => handleEdit(c)} className="text-[0.7rem] hover:text-white flex items-center gap-1 text-[#8b8b99] transition-colors mt-0.5">
                        <Edit2 size={11} /> Editar
                      </button>
                    </div>
                  </div>
                ))
              )}
              <button onClick={handleCreateNew} className="btn w-full flex items-center justify-center gap-2 text-[0.82rem] mt-2">
                <Edit2 size={13} /> Añadir Personaje
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-[0.7rem] text-[#8b8b99] mb-1.5 uppercase tracking-widest">Nombre</label>
                <input type="text" className="input-field max-w-full" placeholder="Ej. Pablito" value={charName} onChange={(e) => setCharName(e.target.value)} />
              </div>
              <div>
                <label className="block text-[0.7rem] text-[#8b8b99] mb-1.5 uppercase tracking-widest">Clase</label>
                <select className="input-field select-field focus:ring-0 max-w-full" value={charClass} onChange={(e) => setCharClass(e.target.value)}>
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
              <div className="flex gap-2 mt-2">
                <button onClick={handleSaveCharacter} disabled={saving || !charName.trim()} className="btn btn-primary flex-1 flex items-center justify-center gap-2">
                  <Check size={14} /> {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <button onClick={() => setEditingId(null)} className="btn px-4">✕</button>
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

      {/* ── BiS List ── */}
      {mainCharacter && (
        <BisPanel
          charClass={mainCharacter.char_class}
          charRole={mainCharacter.char_role as CharRole}
          charName={mainCharacter.char_name}
          classColor={classColor}
          userId={user.id}
          onSpecDetected={setDetectedSpec}
        />
      )}

      </div>{/* closes max-w container */}

      <AnimatePresence>
        {showAvatarPicker && (
          <AvatarPickerModal
            currentUrl={mainCharacter?.avatar_url ?? null}
            onSelect={handleSelectAvatar}
            onClose={() => setShowAvatarPicker(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}


function RaidSignupRow({ signup, past }: { signup: any; past?: boolean }) {
  const raid = signup.raid;
  if (!raid) return null;

  const myGroup = raid.raid_groups?.find((g: any) => g.id === signup.raid_group_id);
  const viewerHref = signup.raid_group_id ? `/raid/${raid.id}/visor/${signup.raid_group_id}` : null;

  const inner = (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-[4px] border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] ${past ? 'opacity-60' : ''} ${viewerHref ? 'hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-pointer' : ''}`}>
      <div className="flex-1 min-w-0">
        <p className="font-['Changa_One'] text-[0.9rem] text-white uppercase tracking-wide">{raid.title}</p>
        <p className="text-[0.72rem] text-[#8b8b99]">{formatDate(raid.date)}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {myGroup && (
          <span className="text-[0.72rem] font-['Changa_One'] uppercase px-2 py-0.5 rounded-[3px] bg-[rgba(134,181,24,0.1)] text-[#86b518]">
            {myGroup.label ?? `Roster ${myGroup.group_number}`}
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

  return viewerHref ? <Link to={viewerHref}>{inner}</Link> : inner;
}
