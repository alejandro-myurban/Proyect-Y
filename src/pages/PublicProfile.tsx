import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Heart, Swords, CalendarDays, Package, UserCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  slugClass,
  getClassIcon,
  CLASS_COLORS,
  type CharRole,
} from '../components/calendar/constants';
import { CLASS_BANNERS } from '../components/profile/classBanners';
import { BisPanel } from '../components/profile/BisPanel';
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

export default function PublicProfile() {
  const { charName } = useParams<{ charName: string }>();
  const navigate = useNavigate();

  const [character, setCharacter] = useState<UserCharacter | null>(null);
  const [signups, setSignups] = useState<(Signup & { raid: Pick<Raid, 'id' | 'title' | 'date' | 'raid_type' | 'status' | 'raid_groups'> })[]>([]);
  const [loot, setLoot] = useState<(LootEntry & { raid_title: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [detectedSpec, setDetectedSpec] = useState<string | null>(null);

  useEffect(() => {
    if (!charName) { navigate('/'); return; }
    loadAll(charName);
  }, [charName]);

  const loadAll = async (name: string) => {
    setLoading(true);
    try {
      const { data: charData } = await supabase
        .from('user_characters')
        .select('*')
        .ilike('char_name', name)
        .single();

      if (!charData) { setNotFound(true); return; }
      setCharacter(charData);

      const [signupsRes, lootRes] = await Promise.all([
        supabase
          .from('signups')
          .select('*, raid:raids(id, title, date, raid_type, status, raid_groups(*))')
          .eq('user_id', charData.user_id)
          .order('created_at', { ascending: false }),
        supabase
          .from('loot_history')
          .select('*, raid:raids(title)')
          .ilike('winner', name)
          .order('created_at', { ascending: false }),
      ]);

      if (signupsRes.data) setSignups(signupsRes.data as any);
      if (lootRes.data) {
        setLoot(lootRes.data.map((l: any) => ({ ...l, raid_title: l.raid?.title ?? '?' })));
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#8b8b99] text-[0.9rem]">Cargando perfil...</p>
      </div>
    );
  }

  if (notFound || !character) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-white text-[1.2rem] font-['Changa_One'] uppercase">Personaje no encontrado</p>
        <p className="text-[#8b8b99] text-[0.85rem]">No existe ningún perfil para «{charName}».</p>
        <button onClick={() => navigate(-1)} className="btn btn-sm mt-2">Volver</button>
      </div>
    );
  }

  const classColor = CLASS_COLORS[character.char_class] ?? '#86b518';
  const upcomingSignups = signups.filter((s) => (s.raid as any)?.status !== 'closed');
  const pastSignups = signups.filter((s) => (s.raid as any)?.status === 'closed');

  return (
    <div className="pb-16 pt-20">
      {/* ── Banner ── */}
      <div className="relative w-full overflow-hidden" style={{ height: '260px' }}>
        {CLASS_BANNERS[character.char_class] && (
          <img
            src={CLASS_BANNERS[character.char_class]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            onError={(e: any) => { e.target.style.display = 'none'; }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, #0a0a0d 0%, ${classColor}18 50%, #0a0a0d 100%)` }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div
          className="absolute top-[-60px] left-[15%] w-[340px] h-[340px] rounded-full blur-[90px] opacity-20 pointer-events-none"
          style={{ background: classColor }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{ background: 'linear-gradient(to bottom, transparent, #0d0d10)' }}
        />
        <div className="absolute inset-0 flex items-end px-8 pb-6 max-w-[900px] mx-auto left-0 right-0">
          <div className="flex items-end gap-5">
            {/* Avatar (solo lectura) */}
            <div
              className="relative flex-shrink-0 w-20 h-20 rounded-full overflow-hidden border-2"
              style={{ borderColor: classColor, boxShadow: `0 0 18px ${classColor}55` }}
            >
              {character.avatar_url ? (
                <img src={character.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: `${classColor}18` }}>
                  <span className="font-['Changa_One'] text-[2rem]" style={{ color: classColor }}>
                    {character.char_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {/* Nombre */}
            <div className="mb-1">
              <h1 className="text-[1.6rem] text-white font-['Changa_One'] uppercase leading-none mb-1">
                {character.char_name}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[0.8rem] text-[#8b8b99]">{character.char_class} — {character.char_role}</p>
                {detectedSpec && (
                  <span
                    className="text-[0.7rem] font-['Changa_One'] uppercase px-2 py-0.5 rounded-[3px]"
                    style={{ background: `${classColor}22`, color: classColor, border: `1px solid ${classColor}44` }}
                  >
                    {detectedSpec}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-6 mt-4">
        <div className="grid grid-cols-[1fr_1fr] gap-6 max-[700px]:grid-cols-1">
          {/* ── Character card ── */}
          <div className="glass-panel p-6 flex flex-col gap-4">
            <h3 className="flex items-center gap-2 text-white text-[1rem] border-b border-[#2a2a33] pb-3 mb-1">
              <UserCircle2 size={16} className="text-[#86b518]" /> Personaje
            </h3>
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
          </div>

          {/* ── Loot obtenido ── */}
          <div className="glass-panel p-6 flex flex-col gap-3">
            <h3 className="flex items-center gap-2 text-white text-[1rem] border-b border-[#2a2a33] pb-3 mb-1">
              <Package size={16} className="text-[#86b518]" /> Botín Obtenido
              {loot.length > 0 && (
                <span className="ml-auto text-[0.72rem] text-[#8b8b99] bg-[rgba(255,255,255,0.05)] px-2 py-0.5 rounded-[3px]">
                  {loot.length}
                </span>
              )}
            </h3>
            {loading ? (
              <p className="text-[0.82rem] text-[#555]">Cargando...</p>
            ) : loot.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <Package size={28} className="text-[#2a2a33]" />
                <p className="text-[0.82rem] text-[#555]">Sin botín registrado aún.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[320px]">
                {loot.map((entry) => (
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
            <CalendarDays size={16} className="text-[#86b518]" /> Raids
          </h3>
          {signups.length === 0 ? (
            <p className="text-[0.82rem] text-[#555]">Sin raids registradas.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {upcomingSignups.length > 0 && (
                <>
                  <p className="text-[0.7rem] uppercase tracking-widest text-[#8b8b99] font-['Changa_One'] mb-1">Próximas</p>
                  {upcomingSignups.map((s) => <RaidSignupRow key={s.id} signup={s} />)}
                </>
              )}
              {pastSignups.length > 0 && (
                <>
                  <p className="text-[0.7rem] uppercase tracking-widest text-[#8b8b99] font-['Changa_One'] mt-3 mb-1">Historial</p>
                  {pastSignups.map((s) => <RaidSignupRow key={s.id} signup={s} past />)}
                </>
              )}
            </div>
          )}
        </div>

        {/* ── BiS List ── */}
        <BisPanel
          charClass={character.char_class}
          charRole={character.char_role as CharRole}
          charName={character.char_name}
          classColor={classColor}
          onSpecDetected={setDetectedSpec}
        />
      </div>
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
        {past && <span className="text-[0.68rem] text-[#555] uppercase tracking-wide">Cerrada</span>}
      </div>
    </div>
  );

  return viewerHref ? <Link to={viewerHref}>{inner}</Link> : inner;
}
