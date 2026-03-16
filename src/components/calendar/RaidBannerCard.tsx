import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Trash2,
  Shield,
  Heart,
  Swords,
  Package,
  Users,
  UserCheck,
  Lock,
  ExternalLink,
  Settings2,
  PlusCircle,
  X,
  ChevronDown,
  MessageCircle,
  Send,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { slugClass, RAID_CONFIG, CLASS_COLORS, getClassIcon, type CharRole, getComboConfig, parseRaidCombo, type RaidTypeCombo } from './constants';
import type { Raid, Signup, UserCharacter } from '../../types/calendar';
import ItemSelector from '../ItemSelector';
import { LootEntryModal } from './LootEntryModal';
import { supabase } from '../../lib/supabase';

interface RaidBannerCardProps {
  raid: Raid;
  isAdmin: boolean;
  currentCharacter: UserCharacter | null;
  currentUserId: string | null;
  onSignUp: (raidId: string) => void;
  onDeleteRaid: (raidId: string) => void;
  onAddLoot: (raidId: string, entry: any) => void;
  onRemoveLoot: (raidId: string, lootId: string) => void;
  onOpenGroupOrganizer: (raid: Raid) => void;
  onCloseRaid: (raid: Raid) => void;
  onCancelSignup: (signupId: string) => void;
}

type Tab = 'roster' | 'loot' | 'grupos' | 'chat';

const ROLE_COLORS: Record<CharRole, string> = {
  Tanque: '#5bc0de',
  Sanador: '#5cb85c',
  DPS: '#d9534f',
};

function RoleTag({ role }: { role: CharRole }) {
  const icons = { Tanque: Shield, Sanador: Heart, DPS: Swords };
  const Icon = icons[role];
  return (
    <span
      className="flex items-center gap-1 text-[0.72rem] font-['Changa_One'] uppercase"
      style={{ color: ROLE_COLORS[role] }}
    >
      <Icon size={11} />
      {role}
    </span>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) +
      ' · ' +
      d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) +
      ' ST'
    );
  } catch {
    return dateStr;
  }
}

export function RaidBannerCard({
  raid,
  isAdmin,
  currentCharacter,
  currentUserId,
  onSignUp,
  onDeleteRaid,
  onAddLoot,
  onRemoveLoot,
  onOpenGroupOrganizer,
  onCloseRaid,
  onCancelSignup,
}: RaidBannerCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('roster');
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [pendingItem, setPendingItem] = useState<any>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load chat messages
  useEffect(() => {
    if (activeTab !== 'chat') return;
    
    const loadChat = async () => {
      setLoadingChat(true);
      const { data } = await supabase
        .from('raid_chat')
        .select('*')
        .eq('raid_id', raid.id)
        .order('created_at', { ascending: true })
        .limit(100);
      if (data) setChatMessages(data);
      setLoadingChat(false);
    };
    loadChat();

    // Subscribe to realtime
    const channel = supabase
      .channel(`raid_chat_${raid.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'raid_chat',
        filter: `raid_id=eq.${raid.id}`
      }, (payload) => {
        setChatMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeTab, raid.id]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendMessage = async () => {
    if (!chatInput.trim() || !currentUserId) return;
    const username = currentCharacter?.char_name || 'Unknown';
    
    await supabase.from('raid_chat').insert({
      raid_id: raid.id,
      user_id: currentUserId,
      username,
      message: chatInput.trim(),
    });
    setChatInput('');
  };

  const raidTypeValue = raid.raid_type;
  const isCombo = raidTypeValue?.includes('+') ?? false;
  const comboConfig = isCombo && raidTypeValue ? getComboConfig(raidTypeValue.split('+') as RaidTypeCombo) : null;
  const config = comboConfig ?? (raid.raid_type ? RAID_CONFIG[raid.raid_type as keyof typeof RAID_CONFIG] : null);
  const loot = raid.loot ?? [];
  const signups = raid.signups ?? [];
  const isPast = raid.status === 'closed';

  // Find current user's signup and group
  const mySignup = currentUserId
    ? signups.find((s) => s.user_id === currentUserId)
    : currentCharacter
    ? signups.find((s) => s.name === currentCharacter.char_name)
    : null;

  const myGroup = mySignup?.raid_group_id
    ? raid.raid_groups.find((g) => g.id === mySignup.raid_group_id)
    : null;

  const isSignedUp = !!mySignup;

  const tankCount = signups.filter((s) => s.role === 'Tanque').length;
  const healCount = signups.filter((s) => s.role === 'Sanador').length;
  const dpsCount = signups.filter((s) => s.role === 'DPS').length;
  const capacity = config?.capacity ?? 25;

  const accentColor = config?.accentColor ?? '#86b518';
  const borderColor = config?.borderColor ?? 'rgba(134,181,24,0.6)';

  const tabs: Tab[] = ['roster', 'loot', 'chat', ...(isAdmin ? ['grupos' as Tab] : [])];
  const tabLabels: Record<Tab, { icon: React.ReactNode; label: string; badge?: number }> = {
    roster: { icon: <Users size={13} />, label: 'Apuntados', badge: signups.length },
    loot: { icon: <Package size={13} />, label: 'Botín', badge: loot.length },
    grupos: { icon: <Settings2 size={13} />, label: 'Grupos', badge: raid.raid_groups.length },
    chat: { icon: <MessageCircle size={13} />, label: 'Chat' },
  };

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-[4px] border transition-all duration-200 ${isPast ? 'opacity-70' : ''}`}
        style={{
          borderColor: expanded ? borderColor : 'rgba(42,42,51,0.8)',
          background: '#121215',
          boxShadow: expanded ? `0 0 24px ${config?.glowColor ?? 'transparent'}` : 'none',
        }}
      >
        {/* Atmospheric gradient overlay */}
        {config && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: config.bgGradient, opacity: expanded ? 1 : 0.5, transition: 'opacity 0.3s' }}
          />
        )}

        {/* Left accent line */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ background: accentColor }}
        />

        {/* ── Banner row ── */}
        <div className="relative flex items-center gap-0 min-h-[120px] cursor-pointer" onClick={() => setExpanded((v) => !v)}>
          {/* Raid image(s) */}
          <div
            className="flex-shrink-0 w-[180px] h-[180px] self-stretch hidden sm:block overflow-hidden relative"
            style={{ background: `linear-gradient(135deg, ${accentColor}22, transparent)` }}
          >
            {isCombo && comboConfig ? (
              <>
                <img
                  src={comboConfig.images[0]}
                  alt="Raid 1"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ 
                    filter: 'brightness(0.75) saturate(1.1)',
                    clipPath: 'polygon(0 100%, 100% 0, 100% 100%)',
                  }}
                  onError={(e: any) => { e.target.style.display = 'none'; }}
                />
                <img
                  src={comboConfig.images[1]}
                  alt="Raid 2"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ 
                    filter: 'brightness(0.75) saturate(1.1)',
                    clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                  }}
                  onError={(e: any) => { e.target.style.display = 'none'; }}
                />
              </>
            ) : config?.image && (
              <img
                src={config.image}
                alt={config.label}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'brightness(0.75) saturate(1.1)' }}
                onError={(e: any) => { e.target.style.display = 'none'; }}
              />
            )}
            {/* Gradient overlay so the image fades into the card */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to right, transparent 60%, #121215 100%)' }}
            />
          </div>

          {/* Content */}
          <div className="flex-1 px-5 py-4 flex flex-col gap-2 min-w-0">
            {/* Title row */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {isPast && (
                    <span className="text-[0.62rem] font-['Changa_One'] uppercase tracking-widest px-1.5 py-0.5 rounded-[3px] bg-[rgba(255,255,255,0.06)] text-[#8b8b99]">
                      Cerrada
                    </span>
                  )}
                  <h3
                    className="font-['Changa_One'] text-[1.25rem] uppercase tracking-wide leading-none"
                    style={{ color: '#ffffff' }}
                  >
                    {raid.title}
                  </h3>
                </div>
                <p className="text-[0.8rem] text-[#8b8b99]">{formatDate(raid.date)}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {isAdmin && !isPast && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); onOpenGroupOrganizer(raid); }}
                      className="btn btn-sm flex items-center gap-1.5 text-[0.75rem]"
                      title="Organizar grupos"
                    >
                      <Settings2 size={12} /> Grupos
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onCloseRaid(raid); }}
                      className="btn btn-sm flex items-center gap-1.5 text-[0.75rem]"
                      style={{ borderColor: '#c0392b', color: '#c0392b' }}
                    >
                      <Lock size={12} /> Cerrar
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteRaid(raid.id); }}
                      className="btn btn-danger btn-sm flex items-center gap-1.5 text-[0.75rem]"
                    >
                      <Trash2 size={23} />
                    </button>
                  </>
                )}
                {isSignedUp ? (
                  <div className="flex items-center gap-2">
                    {!isPast && (
                      <button
                        onClick={(e) => { e.stopPropagation(); mySignup && onCancelSignup(mySignup.id); }}
                        className="btn btn-sm flex items-center gap-1 text-[0.72rem]"
                        style={{ borderColor: '#c0392b', color: '#c0392b' }}
                        title="Desapuntarse"
                      >
                        <X size={11} /> Cancelar
                      </button>
                    )}
                    <div className="flex items-center gap-1.5 text-[0.8rem] font-['Changa_One'] uppercase"
                      style={{ color: accentColor }}>
                      <UserCheck size={14} />
                      {myGroup ? `Roster ${myGroup.group_number}` : 'Apuntado'}
                    </div>
                  </div>
                ) : !isPast && currentCharacter ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); onSignUp(raid.id); }}
                    className="btn btn-primary btn-sm flex items-center gap-1.5"
                    style={{ background: accentColor, borderColor: accentColor }}
                  >
                    <CheckCircle size={13} /> Apuntarse
                  </button>
                ) : !isPast ? (
                  <p className="text-[0.75rem] text-[#555]">Crea un personaje para apuntarte</p>
                ) : null}
                {isPast && raid.warcraft_logs_url && (
                  <a
                    href={raid.warcraft_logs_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="btn btn-sm flex items-center gap-1.5 text-[0.75rem]"
                    style={{ borderColor: '#f0a500', color: '#f0a500' }}
                  >
                    <ExternalLink size={12} /> Logs
                  </a>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <RoleTag role="Tanque" />
                <span className="font-['Changa_One'] text-[0.9rem] text-[#5bc0de]">{tankCount}</span>
                <RoleTag role="Sanador" />
                <span className="font-['Changa_One'] text-[0.9rem] text-[#5cb85c]">{healCount}</span>
                <RoleTag role="DPS" />
                <span className="font-['Changa_One'] text-[0.9rem] text-[#d9534f]">{dpsCount}</span>
              </div>
              <div
                className="h-3 w-px bg-[#2a2a33]"
              />
              <span className="text-[0.78rem] text-[#8b8b99]">
                <span className="font-['Changa_One'] text-white">{signups.length}</span>
                {config ? `/${capacity * Math.max(1, raid.raid_groups.length || 1)} apuntados` : ' apuntados'}
              </span>
              {raid.raid_groups.length > 1 && (
                <span className="text-[0.72rem] text-[#8b8b99]">
                  {raid.raid_groups.length} grupos
                </span>
              )}
            </div>
          </div>

          {/* Expand toggle */}
          <button
            className="self-stretch px-4 flex items-center text-[#555] hover:text-[#8b8b99] transition-colors border-l border-[#2a2a33]"
          >
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={16} />
            </motion.div>
          </button>
        </div>

        {/* ── Expanded content ── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-[#2a2a33]"
            >
              {/* Tabs */}
              <div className="flex gap-0 border-b border-[#2a2a33]">
                {tabs.map((tab) => {
                  const { icon, label, badge } = tabLabels[tab];
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-1.5 px-5 py-3 text-[0.78rem] font-['Changa_One'] uppercase tracking-wide transition-all duration-150 border-b-2 relative cursor-pointer
                        ${
                          activeTab === tab
                            ? 'text-white border-b-[var(--accent)] bg-[rgba(255,255,255,0.02)]'
                            : 'text-[#8b8b99] border-b-transparent hover:text-white hover:bg-[rgba(255,255,255,0.02)]'
                        }`}
                      style={
                        activeTab === tab
                          ? ({ '--accent': accentColor, borderBottomColor: accentColor } as React.CSSProperties)
                          : {}
                      }
                    >
                      {icon}
                      {label}
                      {badge !== undefined && badge > 0 && (
                        <span className="text-[0.62rem] px-1 py-0.5 rounded-[3px] bg-[rgba(255,255,255,0.08)] text-[#8b8b99]">
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab content */}
              <div className="p-5">
                {activeTab === 'roster' && (
                  <RosterTab signups={signups} raidGroups={raid.raid_groups} isAdmin={isAdmin} onCancelSignup={onCancelSignup} />
                )}
                {activeTab === 'loot' && (
                  <LootTab
                    loot={loot}
                    isAdmin={isAdmin}
                    onAddDrop={() => setShowItemSelector(true)}
                    onRemoveDrop={(lootId) => onRemoveLoot(raid.id, lootId)}
                  />
                )}
                {activeTab === 'chat' && (
                  <div className="flex flex-col h-[320px]">
                    <div className="flex-1 overflow-y-auto space-y-2 mb-3 pr-2">
                      {loadingChat ? (
                        <p className="text-[0.8rem] text-[#555] text-center py-4">Cargando...</p>
                      ) : chatMessages.length === 0 ? (
                        <p className="text-[0.8rem] text-[#555] text-center py-4">No hay mensajes. ¡Sé el primero!</p>
                      ) : (
                        chatMessages.map((msg) => {
                          const isMe = msg.user_id === currentUserId;
                          // Buscar clase del personaje en los signups del raid
                          const signup = signups.find(s => s.name === msg.username);
                          const charClass = signup?.class;
                          const classColor = charClass ? CLASS_COLORS[charClass as CharRole] : '#8b8b99';
                          
                          return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] px-3 py-2 rounded-[4px] text-[0.8rem] ${
                                isMe 
                                  ? 'bg-[rgba(134,181,24,0.2)] border border-[rgba(134,181,24,0.3)]' 
                                  : 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]'
                              }`}>
                                <p className="text-[#8b8b99] text-[0.7rem] mb-0.5 flex items-center gap-1.5">
                                  {charClass && (
                                    <img 
                                      src={getClassIcon(charClass)} 
                                      alt={charClass}
                                      className="w-4 h-4 rounded-[2px]"
                                    />
                                  )}
                                  <span style={{ color: classColor }}>{msg.username}</span>
                                </p>
                                <p className="text-white">{msg.message}</p>
                                <p className="text-[#444] text-[0.6rem] mt-1">
                                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={chatEndRef} />
                    </div>
                    {currentUserId ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Escribe un mensaje..."
                          className="input-field flex-1 text-[0.85rem]"
                          maxLength={500}
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!chatInput.trim()}
                          className="btn btn-primary px-3"
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    ) : (
                      <p className="text-[0.75rem] text-[#555] text-center">Inicia sesión para chatear</p>
                    )}
                  </div>
                )}
                {activeTab === 'grupos' && isAdmin && (
                  <GruposTab
                    raid={raid}
                    onOrganize={() => onOpenGroupOrganizer(raid)}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showItemSelector && (
        <ItemSelector
          onSelect={(item: any) => {
            setShowItemSelector(false);
            setPendingItem(item);
          }}
          onClose={() => setShowItemSelector(false)}
        />
      )}
      {pendingItem && (
        <LootEntryModal
          item={pendingItem}
          roster={signups}
          onConfirm={(entry: any) => {
            onAddLoot(raid.id, entry);
            setPendingItem(null);
          }}
          onBack={() => {
            setPendingItem(null);
            setShowItemSelector(true);
          }}
          onClose={() => setPendingItem(null)}
        />
      )}
    </>
  );
}

/* ── Roster Tab ── */
function RosterTab({ signups, raidGroups, isAdmin, onCancelSignup }: { signups: Signup[]; raidGroups: Raid['raid_groups']; isAdmin?: boolean; onCancelSignup?: (id: string) => void }) {
  const [groupingMode, setGroupingMode] = useState<'role' | 'class' | 'group'>('role');

  const hasGroups = raidGroups.length > 0;

  if (signups.length === 0) {
    return <p className="text-[0.85rem] text-[#555]">Aún nadie se ha apuntado.</p>;
  }

  return (
    <div>
      {/* Grouping selector */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[0.7rem] uppercase text-[#8b8b99] tracking-widest">Agrupar:</span>
        <div className="flex gap-1">
          {([
            ['role', 'Rol'],
            ['class', 'Clase'],
            ...(hasGroups ? [['group', 'Grupos'] as const] : []),
          ] as [string, string][]).map(([mode, label]) => (
            <button
              key={mode}
              onClick={() => setGroupingMode(mode as any)}
              className={`px-3 py-1 rounded-[3px] border text-[0.7rem] font-['Changa_One'] uppercase transition-all duration-100
                ${
                  groupingMode === mode
                    ? 'bg-[#86b518] border-[#86b518] text-white'
                    : 'border-[#2a2a33] text-[#8b8b99] hover:text-white hover:border-[rgba(255,255,255,0.2)]'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-[0.72rem] text-[#8b8b99] font-['Changa_One']">
          {signups.length} inscritos
        </span>
      </div>

      {groupingMode === 'role' && (
        <div className="grid grid-cols-3 gap-4 max-[800px]:grid-cols-1">
          {([
            { role: 'Tanque', icon: <Shield size={13} />, color: '#5bc0de' },
            { role: 'Sanador', icon: <Heart size={13} />, color: '#5cb85c' },
            { role: 'DPS', icon: <Swords size={13} />, color: '#d9534f' },
          ] as { role: CharRole; icon: React.ReactNode; color: string }[]).map(({ role, icon, color }) => {
            const members = signups.filter((s) => s.role === role);
            return (
              <div key={role} className="flex flex-col gap-1.5">
                <div
                  className="flex items-center gap-2 pb-2 border-b border-[rgba(255,255,255,0.05)] text-[0.72rem] font-['Changa_One'] uppercase"
                  style={{ color }}
                >
                  {icon}
                  <span>{role === 'Tanque' ? 'Tanques' : role === 'Sanador' ? 'Healers' : 'DPS'}</span>
                  <span className="ml-auto bg-[rgba(255,255,255,0.05)] px-1.5 py-0.5 rounded-[3px] text-[#8b8b99]">
                    {members.length}
                  </span>
                </div>
                {members.map((s, i) => (
                  <SignupRow key={i} signup={s} isAdmin={isAdmin} onCancel={onCancelSignup} />
                ))}
              </div>
            );
          })}
        </div>
      )}

      {groupingMode === 'class' && (
        <div className="grid grid-cols-3 gap-4 max-[800px]:grid-cols-1">
          {Object.entries(
            signups.reduce<Record<string, Signup[]>>((acc, s) => {
              if (!acc[s.class]) acc[s.class] = [];
              acc[s.class].push(s);
              return acc;
            }, {})
          ).map(([cls, members]) => (
            <div key={cls} className="flex flex-col gap-1.5">
              <div
                className={`flex items-center gap-2 pb-2 border-b border-[rgba(255,255,255,0.05)] text-[0.72rem] font-['Changa_One'] uppercase class-${slugClass(cls)}`}
              >
                <img 
                  src={getClassIcon(cls)} 
                  alt={cls}
                  className="w-4 h-4 rounded-[2px]"
                />
                <span>{cls}</span>
                <span className="ml-auto bg-[rgba(255,255,255,0.05)] px-1.5 py-0.5 rounded-[3px] text-[#8b8b99]">
                  {members.length}
                </span>
              </div>
              {members.map((s, i) => (
                <SignupRow key={i} signup={s} />
              ))}
            </div>
          ))}
        </div>
      )}

      {groupingMode === 'group' && raidGroups.length > 0 && (
        <div className="grid grid-cols-3 gap-4 max-[800px]:grid-cols-1">
          {raidGroups.map((group) => {
            const members = signups.filter((s) => s.raid_group_id === group.id);
            return (
              <div key={group.id} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 pb-2 border-b border-[rgba(255,255,255,0.05)] text-[0.72rem] font-['Changa_One'] uppercase text-[#86b518]">
                  <Users size={12} />
                  <span>{group.label ?? `Roster ${group.group_number}`}</span>
                  <span className="ml-auto bg-[rgba(255,255,255,0.05)] px-1.5 py-0.5 rounded-[3px] text-[#8b8b99]">
                    {members.length}
                  </span>
                </div>
                {members.map((s, i) => (
                  <SignupRow key={i} signup={s} showRole isAdmin={isAdmin} onCancel={onCancelSignup} />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SignupRow({ signup, showRole, isAdmin, onCancel }: { signup: Signup; showRole?: boolean; isAdmin?: boolean; onCancel?: (id: string) => void }) {
  const roleIcons: Record<CharRole, React.ReactNode> = {
    Tanque: <Shield size={11} className="text-[#5bc0de]" />,
    Sanador: <Heart size={11} className="text-[#5cb85c]" />,
    DPS: <Swords size={11} className="text-[#d9534f]" />,
  };
  const classColor = CLASS_COLORS[signup.class] ?? '#8b8b99';
  return (
    <div
      className="flex items-center justify-between pl-0 pr-1.5 py-0 rounded-[3px] overflow-hidden transition-all duration-100 hover:translate-x-[2px]"
      style={{ background: `${classColor}0d`, border: `1px solid ${classColor}28` }}
    >
      <div className="w-[3px] self-stretch flex-shrink-0 mr-2.5" style={{ background: classColor }} />
      <Link
        to={`/perfil/${signup.name}`}
        className="font-medium text-[0.82rem] flex-1 truncate py-1.5 hover:underline"
        style={{ color: classColor }}
        onClick={(e) => e.stopPropagation()}
      >
        {signup.name}
      </Link>
      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
        {showRole && roleIcons[signup.role as CharRole]}
        <img
          src={getClassIcon(signup.class)}
          alt={signup.class}
          className="w-4 h-4 rounded-[1px] border border-[rgba(0,0,0,0.3)] shadow-sm"
        />
        {isAdmin && onCancel && (
          <button
            onClick={(e) => { e.stopPropagation(); onCancel(signup.id); }}
            className="text-[#444] hover:text-[#ff6b6b] transition-colors p-0.5"
            title="Desapuntar"
          >
            <X size={11} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Loot Tab ── */
function LootTab({
  loot,
  isAdmin,
  onAddDrop,
  onRemoveDrop,
}: {
  loot: Raid['loot'];
  isAdmin: boolean;
  onAddDrop: () => void;
  onRemoveDrop: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[0.75rem] uppercase tracking-widest text-[#8b8b99] font-['Changa_One']">
          Registro de Botín
        </h4>
        {isAdmin && (
          <button
            onClick={onAddDrop}
            className="btn btn-primary btn-sm flex items-center gap-1.5 text-[0.75rem]"
          >
            <PlusCircle size={12} /> Añadir Drop
          </button>
        )}
      </div>

      {loot.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8 text-[#555]">
          <Package size={28} />
          <p className="text-[0.82rem]">Sin botín registrado.</p>
          {isAdmin && (
            <button onClick={onAddDrop} className="btn btn-primary btn-sm flex items-center gap-1.5">
              <PlusCircle size={12} /> Registrar primer drop
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {loot.map((entry, idx) => (
            <div
              key={idx}
              className="grid items-center gap-3 px-3 py-2 bg-[rgba(255,255,255,0.02)] rounded-[4px] border border-[rgba(255,255,255,0.04)] transition-all hover:bg-[rgba(255,255,255,0.04)]"
              style={{ gridTemplateColumns: '1fr auto auto' }}
            >
              <div className={`item-info-row ${entry.quality} flex items-center gap-2 min-w-0`}>
                {entry.icon && (
                  <img
                    className="w-5 h-5 rounded-[3px] border border-[rgba(0,0,0,0.4)] flex-shrink-0 loot-item-icon"
                    src={`https://wow.zamimg.com/images/wow/icons/small/${entry.icon}.jpg`}
                    alt={entry.item_name}
                    onError={(e: any) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <span className="item-dot w-[6px] h-[6px] rounded-full flex-shrink-0" />
                <span className="item-name font-medium text-[0.82rem] truncate">{entry.item_name}</span>
              </div>
              <Link
                to={`/perfil/${entry.winner}`}
                className="bg-[rgba(255,255,255,0.05)] px-2.5 py-0.5 rounded-[20px] text-[0.75rem] text-[#e2e2e2] whitespace-nowrap hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {entry.winner}
              </Link>
              {isAdmin && (
                <button
                  onClick={() => onRemoveDrop(entry.id)}
                  className="text-[#444] hover:text-[#ff6b6b] transition-colors p-0.5"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Grupos Tab (admin view within card) ── */
function GruposTab({ raid, onOrganize }: { raid: Raid; onOrganize: () => void }) {
  const navigate = useNavigate();
  const config = raid.raid_type ? RAID_CONFIG[raid.raid_type] : null;
  const capacity = config?.capacity ?? 25;

  console.log('[GruposTab] raid_groups:', raid.raid_groups);
  console.log('[GruposTab] signups:', raid.signups.map(s => ({ id: s.id, name: s.name, raid_group_id: s.raid_group_id })));

  if (raid.raid_groups.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-[#555]">
        <Settings2 size={28} />
        <p className="text-[0.82rem] text-[#8b8b99]">
          {raid.signups.length} personas apuntadas. Organízalos en grupos.
        </p>
        <button onClick={onOrganize} className="btn btn-primary btn-sm flex items-center gap-2">
          <Settings2 size={13} /> Organizar Grupos
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[0.75rem] uppercase tracking-widest text-[#8b8b99] font-['Changa_One']">
          {raid.raid_groups.length} Grupos Configurados
        </h4>
        <button onClick={onOrganize} className="btn btn-sm flex items-center gap-1.5 text-[0.75rem]">
          <Settings2 size={12} /> Reorganizar
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 max-[800px]:grid-cols-1">
        {raid.raid_groups.map((group) => {
          const members = raid.signups.filter((s) => s.raid_group_id === group.id);
          const tanks = members.filter((s) => s.role === 'Tanque').length;
          const heals = members.filter((s) => s.role === 'Sanador').length;
          const dps = members.filter((s) => s.role === 'DPS').length;

          return (
            <div
              key={group.id}
              className="border border-[#2a2a33] rounded-[4px] p-3 bg-[rgba(255,255,255,0.02)] cursor-pointer hover:border-[#86b518] hover:bg-[rgba(134,181,24,0.04)] transition-all duration-150"
              onClick={() => navigate(`/raid/${raid.id}/visor/${group.id}`)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-['Changa_One'] text-[0.82rem] uppercase text-white">
                  {group.label ?? `Roster ${group.group_number}`}
                </span>
                <span className="text-[0.68rem] text-[#8b8b99]">
                  {members.length}/{capacity}
                </span>
              </div>
              <div className="flex gap-2 mb-2">
                <span className="flex items-center gap-1 text-[0.68rem] text-[#5bc0de]">
                  <Shield size={10} /> {tanks}
                </span>
                <span className="flex items-center gap-1 text-[0.68rem] text-[#5cb85c]">
                  <Heart size={10} /> {heals}
                </span>
                <span className="flex items-center gap-1 text-[0.68rem] text-[#d9534f]">
                  <Swords size={10} /> {dps}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {members.slice(0, 8).map((m, i) => (
                  <Link
                    key={i}
                    to={`/perfil/${m.name}`}
                    className={`flex items-center gap-1 text-[0.65rem] px-1.5 py-0.5 rounded-[3px] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] transition-colors class-${slugClass(m.class)}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img src={getClassIcon(m.class)} alt="" className="w-3 h-3 rounded-[1px]" />
                    {m.name}
                  </Link>
                ))}
                {members.length > 8 && (
                  <span className="text-[0.65rem] text-[#555]">+{members.length - 8}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
