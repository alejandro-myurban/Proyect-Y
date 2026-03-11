import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, UserPlus, Trash2, CheckCircle, Shield, Swords, Heart, History, Package, PlusCircle, X, Trophy } from 'lucide-react';
import ItemSelector from '../components/ItemSelector';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const CLASSES = [
    'Guerrero', 'Paladín', 'Cazador', 'Pícaro', 'Sacerdote', 'Caballero de la Muerte',
    'Chamán', 'Mago', 'Brujo', 'Monje', 'Druida', 'Cazador de Demonios', 'Evocador'
];

function Calendar() {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [raids, setRaids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [groupingMode, setGroupingMode] = useState('role');
    const [charName, setCharName] = useState('');
    const [charClass, setCharClass] = useState(CLASSES[0]);
    const [charRole, setCharRole] = useState('DPS');
    const [newRaidTitle, setNewRaidTitle] = useState('');
    const [newRaidDate, setNewRaidDate] = useState('');

    useEffect(() => {
        fetchRaids();

        // Setup real-time listener
        const subscription = supabase
            .channel('public:raids_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'raids' }, () => fetchRaids())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'signups' }, () => fetchRaids())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'loot_history' }, () => fetchRaids())
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const fetchRaids = async () => {
        try {
            const { data, error } = await supabase
                .from('raids')
                .select('*, signups(*), loot:loot_history(*)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRaids(data || []);
        } catch (err) {
            console.error('Error fetching raids:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRaid = async (e) => {
        e.preventDefault();
        if (!newRaidTitle || !newRaidDate) return;

        try {
            const { error } = await supabase
                .from('raids')
                .insert([{ title: newRaidTitle, date: newRaidDate }]);

            if (error) throw error;
            setNewRaidTitle('');
            setNewRaidDate('');
        } catch (err) {
            alert('Error creando la raid: ' + err.message);
        }
    };

    const handleSignUp = async (raidId) => {
        if (!user) { alert("Debes iniciar sesión para apuntarte a raids."); return; }
        if (!charName) { alert("¡Por favor, introduce el nombre de tu personaje para apuntarte!"); return; }

        try {
            const { error } = await supabase
                .from('signups')
                .insert([{ raid_id: raidId, name: charName, class: charClass, role: charRole }]);

            if (error) {
                if (error.code === '23505') { // Unique constraint violation
                    alert("¡Ya estás apuntado a esta raid!");
                } else {
                    throw error;
                }
            }
        } catch (err) {
            alert('Error al apuntarse: ' + err.message);
        }
    };

    const handleDeleteRaid = async (id) => {
        if (!confirm('¿Seguro que quieres borrar este evento?')) return;
        try {
            const { error } = await supabase.from('raids').delete().eq('id', id);
            if (error) throw error;
        } catch (err) {
            alert('Error eliminando la raid: ' + err.message);
        }
    };

    const handleAddLoot = async (raidId, entry) => {
        try {
            const { error } = await supabase
                .from('loot_history')
                .insert([{
                    raid_id: raidId,
                    item_id: entry.itemId,
                    item_name: entry.itemName,
                    quality: entry.quality,
                    slot: entry.slot,
                    winner: entry.winner,
                    boss: entry.boss,
                    icon: entry.icon
                }]);

            if (error) throw error;
        } catch (err) {
            alert('Error añadiendo drop: ' + err.message);
        }
    };

    const handleRemoveLoot = async (raidId, lootId) => {
        try {
            const { error } = await supabase
                .from('loot_history')
                .delete()
                .eq('id', lootId);

            if (error) throw error;
        } catch (err) {
            alert('Error eliminando drop: ' + err.message);
        }
    };

    const getRoleIcon = (role) => {
        if (role === 'Tanque') return <Shield size={16} className="text-[#86b518]" />;
        if (role === 'Sanador') return <Heart size={16} className="text-[#86b518]" />;
        if (role === 'DPS') return <Swords size={16} color="#ff2a2a" />;
        return null;
    };

    const getGroupedByClass = (signups) => {
        const groups = {};
        signups.forEach(s => { if (!groups[s.class]) groups[s.class] = []; groups[s.class].push(s); });
        return groups;
    };

    const slugClass = (name) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '-');

    return (
        <div className="pt-20 max-w-[1440px] mx-auto px-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="mb-3"><span className="text-[#86b518]">Calendario</span> de Raid</h1>
                <p className="text-[#8b8b99]">Programa, apúntate y conquista.</p>
            </div>

            {/* Debug toggle */}
            <div className="flex justify-center gap-4 mb-8 bg-[#1c1c21] p-4 rounded-[4px] border border-[#2a2a33] relative">
                <p className="text-[#8b8b99] absolute top-1/2 left-4 -translate-y-1/2 text-[0.9rem]">Alternar vista (Debug):</p>
                <button className={`btn ${!isAdmin ? 'btn-primary' : ''}`} onClick={() => setIsAdmin(false)}>Vista Miembro</button>
                <button className={`btn ${isAdmin ? 'btn-primary' : ''}`} onClick={() => setIsAdmin(true)}>Vista Admin</button>
            </div>

            <div className="flex gap-8 mt-8 max-[900px]:flex-col">
                {/* Sidebar */}
                <div className="flex-1 min-w-[300px] max-w-[350px] max-[900px]:max-w-full">
                    {isAdmin ? (
                        <div className="glass-panel p-8">
                            <h3 className="flex items-center border-b border-[#2a2a33] pb-3 mb-6 text-white text-[1.2rem]">
                                <Plus size={20} className="mr-3 text-[#86b518]" /> Crear Evento
                            </h3>
                            <form onSubmit={handleCreateRaid}>
                                <div className="mb-4">
                                    <label className="block text-[0.85rem] text-[#8b8b99] mb-2 uppercase tracking-wide">Título del Evento</label>
                                    <input type="text" className="input-field" placeholder="Ej. Karazhan" value={newRaidTitle} onChange={e => setNewRaidTitle(e.target.value)} />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-[0.85rem] text-[#8b8b99] mb-2 uppercase tracking-wide">Fecha y Hora</label>
                                    <input type="text" className="input-field" placeholder="Ej. Mié, 20:00 ST" value={newRaidDate} onChange={e => setNewRaidDate(e.target.value)} />
                                </div>
                                <button type="submit" className="btn btn-primary w-full">Añadir Raid</button>
                            </form>
                        </div>
                    ) : (
                        <div className="glass-panel p-8">
                            <h3 className="flex items-center border-b border-[#2a2a33] pb-3 mb-6 text-white text-[1.2rem]">
                                <UserPlus size={20} className="mr-3 text-[#86b518]" /> Tu Personaje
                            </h3>
                            {!user ? (
                                <div className="text-center py-4">
                                    <p className="text-[0.9rem] text-[#8b8b99] mb-6">Debes estar registrado para apuntarte a los eventos de la hermandad.</p>
                                    <Link to="/login" className="btn btn-primary w-full">Iniciar Sesión / Registro</Link>
                                </div>
                            ) : (
                                <>
                                    <p className="text-[0.9rem] text-[#8b8b99] mb-6">Conectado como <span className="text-white">{user.email}</span>. Registra tu pj antes de apuntarte.</p>
                                    <div className="mb-4">
                                        <label className="block text-[0.85rem] text-[#8b8b99] mb-2 uppercase tracking-wide">Nombre del Personaje</label>
                                        <input type="text" className="input-field" placeholder="Ej. Pablito" value={charName} onChange={e => setCharName(e.target.value)} />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-[0.85rem] text-[#8b8b99] mb-2 uppercase tracking-wide">Clase</label>
                                        <select className="input-field select-field" value={charClass} onChange={e => setCharClass(e.target.value)}>
                                            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-[0.85rem] text-[#8b8b99] mb-2 uppercase tracking-wide">Rol</label>
                                        <div className="flex flex-col gap-2 mb-6">
                                            {['Tanque', 'Sanador', 'DPS'].map(r => (
                                                <button
                                                    key={r}
                                                    onClick={() => setCharRole(r)}
                                                    className={`
                                                        flex items-center justify-center gap-3 p-4 rounded-[4px] cursor-pointer border
                                                        font-['Changa_One'] text-base transition-all duration-150 relative overflow-hidden
                                                        ${charRole === r
                                                            ? 'bg-[rgba(134,181,24,0.1)] text-[#86b518] border-[#86b518] shadow-[0_0_20px_rgba(134,181,24,0.1)] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#86b518]'
                                                            : 'bg-[#1c1c21] border-[#2a2a33] text-[#8b8b99] hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.2)] hover:text-white'
                                                        }
                                                    `}
                                                >
                                                    {getRoleIcon(r)} {r}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Events list */}
                <div className="flex-[2] flex flex-col gap-6">
                    {loading ? (
                        <div className="glass-panel text-center py-20">
                            <div className="inline-block w-8 h-8 border-4 border-[#86b518] border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-[#8b8b99]">Cargando raids desde la base de datos...</p>
                        </div>
                    ) : raids.length === 0 ? (
                        <div className="glass-panel text-center">
                            <p>No hay raids programadas actualmente. Toca farmear oro.</p>
                        </div>
                    ) : (
                        raids.map(raid => (
                            <RaidCard
                                key={raid.id}
                                raid={raid}
                                isAdmin={isAdmin}
                                handleSignUp={handleSignUp}
                                handleDeleteRaid={handleDeleteRaid}
                                handleAddLoot={handleAddLoot}
                                handleRemoveLoot={handleRemoveLoot}
                                groupingMode={groupingMode}
                                setGroupingMode={setGroupingMode}
                                getGroupedByClass={getGroupedByClass}
                                getRoleIcon={getRoleIcon}
                                slugClass={slugClass}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

/* ══ LootEntryModal ══════════════════════════════════════════════════════════ */
function LootEntryModal({ item, roster, onConfirm, onBack, onClose }) {
    const [winner, setWinner] = useState(roster[0]?.name ?? '');
    const [customWinner, setCustomWinner] = useState('');
    const [useCustom, setUseCustom] = useState(roster.length === 0);

    const resolvedWinner = useCustom ? customWinner : winner;

    const handleConfirm = () => {
        if (!resolvedWinner.trim()) { alert('Introduce el nombre del ganador.'); return; }
        onConfirm({ itemId: item.id, itemName: item.name, quality: item.quality, slot: item.slot, boss: item.boss, icon: item.icon, winner: resolvedWinner.trim() });
    };

    const slugClass = (n) => n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '-');

    return (
        <div className="item-selector-overlay" onClick={onClose}>
            <div
                className="bg-[#1a1a2e] border border-[rgba(163,53,238,0.3)] rounded-[12px] w-full max-w-[480px] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.8)] [animation:modalSlideIn_0.2s_cubic-bezier(0.34,1.56,0.64,1)]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(163,53,238,0.08)] flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Trophy size={18} color="#a335ee" />
                        <h2 className="text-base font-semibold text-[#e2c5f0] tracking-[0.02em] m-0">Confirmar Drop</h2>
                    </div>
                    <button
                        className="bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.1)] rounded-[6px] text-[#aaa] cursor-pointer p-[0.35rem] flex items-center transition-all hover:bg-[rgba(255,60,60,0.2)] hover:text-[#ff6b6b] hover:border-[rgba(255,60,60,0.3)]"
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Item preview */}
                <div className="flex items-center gap-4 px-5 py-5 bg-[rgba(163,53,238,0.07)] border-b border-[rgba(255,255,255,0.06)]">
                    <img
                        className="w-[52px] h-[52px] rounded-[6px] border-2 border-[rgba(163,53,238,0.4)] flex-shrink-0"
                        src={`https://wow.zamimg.com/images/wow/icons/medium/${item.icon}.jpg`}
                        alt={item.name}
                        onError={e => { e.target.src = 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg'; }}
                    />
                    <div>
                        <p className={`quality-text-${item.quality} font-bold text-base m-0 mb-1`}>{item.name}</p>
                        <p className="text-[0.78rem] text-[#666] m-0">{item.slot} · {item.boss}</p>
                    </div>
                </div>

                {/* Winner selector */}
                <div className="px-5 py-5 border-b border-[rgba(255,255,255,0.06)]">
                    <label className="block text-[0.8rem] font-semibold text-[#aaa] uppercase tracking-[0.08em] mb-3">¿Quién se lo lleva?</label>

                    {roster.length > 0 && (
                        <div className="flex gap-[0.4rem] mb-3">
                            {['Del Roster', 'Manual'].map((label, i) => (
                                <button
                                    key={label}
                                    onClick={() => setUseCustom(i === 1)}
                                    className={`px-3 py-[0.35rem] rounded-[6px] border text-[0.75rem] cursor-pointer transition-all duration-150
                                        ${(i === 0 ? !useCustom : useCustom)
                                            ? 'bg-[rgba(163,53,238,0.2)] border-[rgba(163,53,238,0.4)] text-[#c570f5]'
                                            : 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#777]'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    )}

                    {!useCustom && roster.length > 0 ? (
                        <div className="flex flex-col gap-[0.3rem] max-h-[220px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[rgba(163,53,238,0.3)] [&::-webkit-scrollbar-thumb]:rounded-sm">
                            {roster.map(p => (
                                <button
                                    key={p.name}
                                    onClick={() => setWinner(p.name)}
                                    className={`flex items-center gap-[0.6rem] border rounded-[6px] cursor-pointer px-3 py-2 text-left transition-all duration-[0.12s] w-full
                                        ${winner === p.name
                                            ? 'bg-[rgba(163,53,238,0.15)] border-[rgba(163,53,238,0.4)] text-[#e2c5f0]'
                                            : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.06)] text-[#ccc] hover:bg-[rgba(255,255,255,0.07)]'
                                        }`}
                                >
                                    <span className={`class-dot class-${slugClass(p.class)}`} />
                                    <span className="font-medium text-sm flex-1">{p.name}</span>
                                    <span className="text-[0.72rem] text-[#555]">{p.class}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <input type="text" className="input-field" placeholder="Nombre del jugador..." value={customWinner} onChange={e => setCustomWinner(e.target.value)} autoFocus />
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-between gap-3 px-5 py-4">
                    <button className="btn" onClick={onBack}>← Cambiar item</button>
                    <button className="btn btn-primary" onClick={handleConfirm} disabled={!resolvedWinner.trim()}>Confirmar Drop</button>
                </div>
            </div>
        </div>
    );
}

/* ══ RaidCard ════════════════════════════════════════════════════════════════ */
function RaidCard({ raid, isAdmin, handleSignUp, handleDeleteRaid, handleAddLoot, handleRemoveLoot, groupingMode, setGroupingMode, getGroupedByClass, getRoleIcon, slugClass }) {
    const [activeTab, setActiveTab] = useState('roster');
    const [showItemSelector, setShowItemSelector] = useState(false);
    const [pendingItem, setPendingItem] = useState(null);

    const handleItemSelected = (item) => { setShowItemSelector(false); setPendingItem(item); };
    const handleLootConfirmed = (entry) => { handleAddLoot(raid.id, entry); setPendingItem(null); };

    const loot = raid.loot ?? [];

    return (
        <>
            <div className="glass-panel px-8 py-6 border-l-[3px] border-l-[#86b518] transition-transform duration-150 hover:translate-x-[5px]">
                {/* Raid header */}
                <div className="flex justify-between items-center border-b border-[#2a2a33] pb-4 mb-4 max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-4">
                    <div>
                        <h3 className="text-[1.4rem] text-white mb-1">{raid.title}</h3>
                        <p className="text-[#8b8b99] text-[0.95rem]">{raid.date}</p>
                    </div>
                    <div>
                        {!isAdmin ? (
                            <button className="btn btn-primary btn-sm flex items-center gap-2" onClick={() => handleSignUp(raid.id)}>
                                <CheckCircle size={16} /> Apuntarse
                            </button>
                        ) : (
                            <button className="btn btn-danger btn-sm flex items-center gap-2" onClick={() => handleDeleteRaid(raid.id)}>
                                <Trash2 size={16} /> Eliminar
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-[#2a2a33] pb-2">
                    {[
                        { key: 'roster', icon: <UserPlus size={14} />, label: 'Roster' },
                        { key: 'loot', icon: <Package size={14} />, label: 'Botín', badge: loot.length },
                    ].map(({ key, icon, label, badge }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-2 px-4 py-2 cursor-pointer border-none font-['Changa_One'] text-[0.85rem] uppercase transition-all duration-150 relative
                                ${activeTab === key
                                    ? 'text-[#86b518] bg-transparent after:content-[""] after:absolute after:bottom-[-0.5rem] after:left-0 after:w-full after:h-[2px] after:bg-[#86b518] after:shadow-[0_0_10px_rgba(61,181,24,0.4)]'
                                    : 'text-[#8b8b99] bg-transparent hover:text-white'
                                }`}
                        >
                            {icon} {label}
                            {badge > 0 && <span className="bg-[rgba(163,53,238,0.3)] text-[#c570f5] text-[0.65rem] px-[0.4rem] py-[0.05rem] rounded-[10px]">{badge}</span>}
                        </button>
                    ))}
                </div>

                {/* Roster tab */}
                {activeTab === 'roster' && (
                    <div className="mt-6 pt-4 border-t border-[#2a2a33]">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-[0.9rem] text-[#8b8b99] uppercase tracking-[1px]">Roster Actual</h4>
                            <span className="font-['Changa_One'] text-[#86b518] bg-[rgba(134,181,24,0.1)] px-[0.6rem] py-[0.2rem] rounded-[20px] text-[0.8rem]">
                                {raid.signups.length} / 25
                            </span>
                        </div>

                        <div className="flex items-center gap-4 mb-6 px-4 py-2 bg-[rgba(255,255,255,0.02)] rounded-[4px] border border-[rgba(255,255,255,0.05)]">
                            <span className="text-[0.75rem] uppercase text-[#8b8b99] tracking-[0.5px]">Agrupar por:</span>
                            <div className="flex gap-2">
                                {['role', 'class'].map(mode => (
                                    <button
                                        key={mode}
                                        onClick={() => setGroupingMode(mode)}
                                        className={`border px-[0.8rem] py-[0.3rem] rounded-[2px] text-[0.75rem] cursor-pointer uppercase font-['Changa_One'] transition-all duration-150
                                            ${groupingMode === mode
                                                ? 'bg-[#86b518] border-[#86b518] text-white shadow-[0_0_10px_rgba(134,181,24,0.2)]'
                                                : 'bg-transparent border-[#2a2a33] text-[#8b8b99] hover:text-white hover:border-[rgba(255,255,255,0.2)]'
                                            }`}
                                    >
                                        {mode === 'role' ? 'Roles' : 'Clases'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {raid.signups.length === 0 ? (
                            <p className="text-[#8b8b99]">Aún nadie se ha apuntado.</p>
                        ) : (
                            <div className="grid grid-cols-3 gap-6 max-[1200px]:grid-cols-1 max-[1200px]:gap-4">
                                {groupingMode === 'role' ? (
                                    <>
                                        <RoleColumn role="Tanque" icon={<Shield size={14} />} colorClass="text-[#5bc0de]" signups={raid.signups.filter(s => s.role === 'Tanque')} slugClass={slugClass} />
                                        <RoleColumn role="Sanador" icon={<Heart size={14} />} colorClass="text-[#5cb85c]" signups={raid.signups.filter(s => s.role === 'Sanador')} slugClass={slugClass} />
                                        <RoleColumn role="DPS" icon={<Swords size={14} />} colorClass="text-[#d9534f]" signups={raid.signups.filter(s => s.role === 'DPS')} slugClass={slugClass} getRoleIcon={getRoleIcon} />
                                    </>
                                ) : (
                                    Object.entries(getGroupedByClass(raid.signups)).map(([cls, sups], idx) => (
                                        <div key={idx} className="flex flex-col gap-[0.8rem]">
                                            <div className={`flex items-center gap-2 text-[0.8rem] font-['Changa_One'] uppercase pb-2 border-b border-[rgba(255,255,255,0.05)] class-${slugClass(cls)}`}>
                                                <span>{cls}</span>
                                                <span className="ml-auto bg-[rgba(255,255,255,0.05)] px-[0.4rem] py-[0.1rem] rounded-[4px] text-[0.7rem]">{sups.length}</span>
                                            </div>
                                            <div className="flex flex-col gap-[0.4rem]">
                                                {sups.map((su, pIdx) => (
                                                    <div key={pIdx} className={`flex justify-between items-center px-[0.8rem] py-[0.4rem] bg-[rgba(255,255,255,0.02)] border-l-[3px] rounded-[2px] text-[0.9rem] transition-all duration-150 hover:bg-[rgba(255,255,255,0.05)] hover:translate-x-[2px] class-${slugClass(su.class)}`}>
                                                        <span className="font-medium">{su.name}</span>
                                                        <span>{getRoleIcon(su.role)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Loot tab */}
                {activeTab === 'loot' && (
                    <div className="mt-2">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-[0.9rem] text-[#8b8b99] uppercase tracking-[1px]">Registro de Botín</h4>
                            <div className="flex items-center gap-2">
                                {isAdmin && (
                                    <button className="btn btn-primary btn-sm flex items-center gap-1" onClick={() => setShowItemSelector(true)}>
                                        <PlusCircle size={14} /> Añadir Drop
                                    </button>
                                )}
                                <History size={16} className="text-[#8b8b99]" />
                            </div>
                        </div>

                        {loot.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 py-10 px-4 text-[#8b8b99]">
                                <Package size={32} color="#333" />
                                <p>Aún no se ha registrado botín.</p>
                                {isAdmin && (
                                    <button className="btn btn-primary btn-sm flex items-center gap-1" onClick={() => setShowItemSelector(true)}>
                                        <PlusCircle size={14} /> Registrar primer drop
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-[0.4rem]">
                                <div className="grid grid-cols-[1fr_auto_auto] items-center px-4 py-2 text-[0.7rem] uppercase text-[#8b8b99] tracking-[1px]">
                                    <span>Objeto</span><span>Ganador</span>{isAdmin && <span />}
                                </div>
                                {loot.map((entry, idx) => (
                                    <div key={idx} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-[0.75rem] py-[0.6rem] bg-[rgba(255,255,255,0.02)] rounded-[6px] border border-[rgba(255,255,255,0.03)] transition-all duration-150 hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.08)]">
                                        <div className={`item-info-row ${entry.quality} flex items-center gap-[0.6rem] min-w-0`}>
                                            {entry.icon && (
                                                <img className="w-5 h-5 rounded-[3px] border border-[rgba(0,0,0,0.4)] flex-shrink-0 loot-item-icon"
                                                    src={`https://wow.zamimg.com/images/wow/icons/small/${entry.icon}.jpg`}
                                                    alt={entry.itemName}
                                                    onError={e => { e.target.style.display = 'none'; }}
                                                />
                                            )}
                                            <span className="item-dot w-[7px] h-[7px] rounded-full flex-shrink-0" />
                                            <span className="item-name font-medium text-[0.88rem] whitespace-nowrap overflow-hidden text-ellipsis">{entry.item_name}</span>
                                        </div>
                                        <div className="bg-[rgba(255,255,255,0.05)] px-[0.7rem] py-[0.2rem] rounded-[20px] text-[0.8rem] text-[#e2e2e2] whitespace-nowrap">
                                            {entry.winner}
                                        </div>
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleRemoveLoot(raid.id, entry.id)}
                                                className="bg-transparent border-none text-[#444] cursor-pointer p-[3px] flex items-center rounded-[3px] transition-all duration-150 hover:bg-[rgba(255,60,60,0.15)] hover:text-[#ff6b6b]"
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showItemSelector && <ItemSelector onSelect={handleItemSelected} onClose={() => setShowItemSelector(false)} />}
            {pendingItem && (
                <LootEntryModal
                    item={pendingItem}
                    roster={raid.signups}
                    onConfirm={handleLootConfirmed}
                    onBack={() => { setPendingItem(null); setShowItemSelector(true); }}
                    onClose={() => setPendingItem(null)}
                />
            )}
        </>
    );
}

/* ══ RoleColumn ══════════════════════════════════════════════════════════════ */
function RoleColumn({ role, icon, colorClass, signups, slugClass, getRoleIcon }) {
    const label = role === 'Tanque' ? 'Tanques' : role === 'Sanador' ? 'Healers' : 'DPS';
    return (
        <div className="flex flex-col gap-[0.8rem]">
            <div className={`flex items-center gap-2 text-[0.8rem] font-['Changa_One'] uppercase pb-2 border-b border-[rgba(255,255,255,0.05)] ${colorClass}`}>
                {icon} <span>{label}</span>
                <span className="ml-auto bg-[rgba(255,255,255,0.05)] px-[0.4rem] py-[0.1rem] rounded-[4px] text-[0.7rem]">{signups.length}</span>
            </div>
            <div className="flex flex-col gap-[0.4rem]">
                {signups.map((su, idx) => (
                    <div key={idx} className={`flex justify-between items-center px-[0.8rem] py-[0.4rem] bg-[rgba(255,255,255,0.02)] border-l-[3px] rounded-[2px] text-[0.9rem] transition-all duration-150 hover:bg-[rgba(255,255,255,0.05)] hover:translate-x-[2px] class-${slugClass(su.class)}`}>
                        <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">{su.name}</span>
                        <span className="text-[0.7rem] opacity-50 uppercase">{su.class.substring(0, 3)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Calendar;
