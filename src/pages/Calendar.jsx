import { useState } from 'react';
import { Plus, UserPlus, Trash2, CheckCircle, Shield, Swords, Heart, History, Package } from 'lucide-react';
import './Calendar.css';

const MOCK_RAIDS = [
    {
        id: 1,
        title: 'Amirdrassil Mítico (Farm)',
        date: 'Miércoles, 20:00 ST',
        signups: [
            { name: 'Arthas', class: 'Caballero de la Muerte', role: 'Tanque' },
            { name: 'Uther', class: 'Paladín', role: 'Tanque' },
            { name: 'Anduin', class: 'Sacerdote', role: 'Sanador' },
            { name: 'Tyrande', class: 'Sacerdote', role: 'Sanador' },
            { name: 'Malfurion', class: 'Druida', role: 'Sanador' },
            { name: 'Illidan', class: 'Cazador de Demonios', role: 'DPS' },
            { name: 'Sylvanas', class: 'Cazador', role: 'DPS' },
            { name: 'Jaina', class: 'Mago', role: 'DPS' },
            { name: 'Thrall', class: 'Chamán', role: 'DPS' },
            { name: 'Guldan', class: 'Brujo', role: 'DPS' },
            { name: 'Chen', class: 'Monje', role: 'DPS' },
        ],
        loot: [
            { item: 'Cinturón de Grog el Grotesco', winner: 'Arthas', quality: 'legendary' },
            { item: 'Sello del Forjador de Sueños', winner: 'Jaina', quality: 'epic' },
            { item: 'Hoja del Destino Inevitable', winner: 'Illidan', quality: 'epic' },
            { item: 'Bastón de la Eternidad', winner: 'Anduin', quality: 'epic' },
        ]
    },
    {
        id: 2,
        title: 'Amirdrassil Progresión',
        date: 'Jueves, 20:00 ST',
        signups: [],
        loot: []
    },
    {
        id: 3,
        title: 'Heroico / alters',
        date: 'Domingo, 19:30 ST',
        signups: [
            { name: 'Cenarius', class: 'Druida', role: 'Tanque' },
            { name: 'Maiev', class: 'Pícaro', role: 'DPS' },
        ],
        loot: [
            { item: 'Yelmo del Bosque', winner: 'Cenarius', quality: 'epic' },
        ]
    },
];

const CLASSES = [
    'Guerrero', 'Paladín', 'Cazador', 'Pícaro', 'Sacerdote', 'Caballero de la Muerte',
    'Chamán', 'Mago', 'Brujo', 'Monje', 'Druida', 'Cazador de Demonios', 'Evocador'
];

function Calendar() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [raids, setRaids] = useState(MOCK_RAIDS);
    const [groupingMode, setGroupingMode] = useState('role'); // 'role' or 'class'

    // Registration Form
    const [charName, setCharName] = useState('');
    const [charClass, setCharClass] = useState(CLASSES[0]);
    const [charRole, setCharRole] = useState('DPS');

    // Admin Raid Creation
    const [newRaidTitle, setNewRaidTitle] = useState('');
    const [newRaidDate, setNewRaidDate] = useState('');

    const handleCreateRaid = (e) => {
        e.preventDefault();
        if (!newRaidTitle || !newRaidDate) return;

        setRaids([
            ...raids,
            { id: Date.now(), title: newRaidTitle, date: newRaidDate, signups: [] }
        ]);
        setNewRaidTitle('');
        setNewRaidDate('');
    };

    const handleSignUp = (raidId) => {
        if (!charName) {
            alert("¡Por favor, introduce el nombre de tu personaje para apuntarte!");
            return;
        }

        setRaids(raids.map(raid => {
            if (raid.id === raidId) {
                // Check if already signed up
                if (raid.signups.some(su => su.name === charName)) {
                    alert("¡Ya estás apuntado a esta raid!");
                    return raid;
                }

                return {
                    ...raid,
                    signups: [...raid.signups, { name: charName, class: charClass, role: charRole }]
                };
            }
            return raid;
        }));
    };

    const handleDeleteRaid = (raidId) => {
        setRaids(raids.filter(r => r.id !== raidId));
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'Tanque': return <Shield size={16} className="text-primary" />;
            case 'Sanador': return <Heart size={16} className="text-primary" />;
            case 'DPS': return <Swords size={16} className="text-danger" color="#ff2a2a" />;
            default: return null;
        }
    };

    // Helper to group signups by class
    const getGroupedByClass = (signups) => {
        const groups = {};
        signups.forEach(s => {
            if (!groups[s.class]) groups[s.class] = [];
            groups[s.class].push(s);
        });
        return groups;
    };

    return (
        <div className="calendar-container page-wrapper container">
            <div className="page-header">
                <h1 className="page-title"><span className="text-primary">Calendario</span> de Raid</h1>
                <p className="page-subtitle">Programa, apúntate y conquista.</p>
            </div>

            <div className="role-toggle">
                <p>Alternar vista (Debug):</p>
                <button
                    className={`btn ${!isAdmin ? 'btn-primary' : ''}`}
                    onClick={() => setIsAdmin(false)}
                >
                    Vista Miembro
                </button>
                <button
                    className={`btn ${isAdmin ? 'btn-primary' : ''}`}
                    onClick={() => setIsAdmin(true)}
                >
                    Vista Admin
                </button>
            </div>

            <div className="calendar-layout">
                <div className="calendar-sidebar">
                    {isAdmin ? (
                        <div className="admin-panel glass-panel">
                            <h3 className="section-title"><Plus size={20} className="icon-inline" /> Crear Evento</h3>
                            <form onSubmit={handleCreateRaid}>
                                <div className="input-group">
                                    <label className="input-label">Título del Evento</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Ej. Fyrakk Mítico"
                                        value={newRaidTitle}
                                        onChange={(e) => setNewRaidTitle(e.target.value)}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Fecha y Hora</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Ej. Mié, 20:00 ST"
                                        value={newRaidDate}
                                        onChange={(e) => setNewRaidDate(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Añadir Raid</button>
                            </form>
                        </div>
                    ) : (
                        <div className="registration-panel glass-panel">
                            <h3 className="section-title"><UserPlus size={20} className="icon-inline" /> Tu Personaje</h3>
                            <p className="panel-desc">Registra tus detalles antes de apuntarte a un evento.</p>

                            <div className="input-group">
                                <label className="input-label">Nombre del Personaje</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Ej. Pablito"
                                    value={charName}
                                    onChange={(e) => setCharName(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Clase</label>
                                <select
                                    className="input-field select-field"
                                    value={charClass}
                                    onChange={(e) => setCharClass(e.target.value)}
                                >
                                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Rol</label>
                                <div className="role-selector">
                                    {['Tanque', 'Sanador', 'DPS'].map(r => (
                                        <button
                                            key={r}
                                            className={`role-btn ${charRole === r ? 'active' : ''}`}
                                            onClick={() => setCharRole(r)}
                                        >
                                            {getRoleIcon(r)} {r}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="events-list">
                    {raids.length === 0 ? (
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
                                groupingMode={groupingMode}
                                setGroupingMode={setGroupingMode}
                                getGroupedByClass={getGroupedByClass}
                                getRoleIcon={getRoleIcon}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function RaidCard({ raid, isAdmin, handleSignUp, handleDeleteRaid, groupingMode, setGroupingMode, getGroupedByClass, getRoleIcon }) {
    const [activeTab, setActiveTab] = useState('roster'); // 'roster' or 'loot'

    return (
        <div className="raid-card glass-panel">
            <div className="raid-header">
                <div>
                    <h3 className="raid-title">{raid.title}</h3>
                    <p className="raid-date">{raid.date}</p>
                </div>
                <div className="raid-actions">
                    {!isAdmin ? (
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleSignUp(raid.id)}
                        >
                            <CheckCircle size={16} /> Apuntarse
                        </button>
                    ) : (
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteRaid(raid.id)}
                        >
                            <Trash2 size={16} /> Eliminar
                        </button>
                    )}
                </div>
            </div>

            <div className="raid-tabs">
                <button
                    className={`tab-btn ${activeTab === 'roster' ? 'active' : ''}`}
                    onClick={() => setActiveTab('roster')}
                >
                    <UserPlus size={14} /> Roster
                </button>
                <button
                    className={`tab-btn ${activeTab === 'loot' ? 'active' : ''}`}
                    onClick={() => setActiveTab('loot')}
                >
                    <Package size={14} /> Botín (Backlog)
                </button>
            </div>

            {activeTab === 'roster' ? (
                <div className="raid-roster">
                    <div className="roster-header">
                        <h4 className="roster-title">
                            Roster Actual
                        </h4>
                        <span className="roster-count">{raid.signups.length} / 20</span>
                    </div>

                    <div className="roster-filter">
                        <span className="filter-label">Agrupar por:</span>
                        <div className="filter-options">
                            <button
                                className={`filter-btn ${groupingMode === 'role' ? 'active' : ''}`}
                                onClick={() => setGroupingMode('role')}
                            >
                                Roles
                            </button>
                            <button
                                className={`filter-btn ${groupingMode === 'class' ? 'active' : ''}`}
                                onClick={() => setGroupingMode('class')}
                            >
                                Clases
                            </button>
                        </div>
                    </div>

                    {raid.signups.length === 0 ? (
                        <p className="empty-roster text-muted">Aún nadie se ha apuntado.</p>
                    ) : (
                        <div className="roster-grid">
                            {groupingMode === 'role' ? (
                                <>
                                    {/* Tanks Section */}
                                    <div className="role-column">
                                        <div className="role-column-header tank">
                                            <Shield size={14} /> <span>Tanques</span>
                                            <span className="count-pill">{raid.signups.filter(s => s.role === 'Tanque').length}</span>
                                        </div>
                                        <div className="role-players">
                                            {raid.signups.filter(s => s.role === 'Tanque').map((su, idx) => (
                                                <div key={idx} className={`player-bar class-${su.class.toLowerCase().replace(/ /g, '-').replace('í', 'i').replace('á', 'a').replace('é', 'e').replace('ó', 'o').replace('ú', 'u')}`}>
                                                    <span className="player-name">{su.name}</span>
                                                    <span className="player-class-abbr">{su.class.substring(0, 3)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Healers Section */}
                                    <div className="role-column">
                                        <div className="role-column-header healer">
                                            <Heart size={14} /> <span>Healers</span>
                                            <span className="count-pill">{raid.signups.filter(s => s.role === 'Sanador').length}</span>
                                        </div>
                                        <div className="role-players">
                                            {raid.signups.filter(s => s.role === 'Sanador').map((su, idx) => (
                                                <div key={idx} className={`player-bar class-${su.class.toLowerCase().replace(/ /g, '-').replace('í', 'i').replace('á', 'a').replace('é', 'e').replace('ó', 'o').replace('ú', 'u')}`}>
                                                    <span className="player-name">{su.name}</span>
                                                    <span className="player-class-abbr">{su.class.substring(0, 3)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* DPS Section */}
                                    <div className="role-column">
                                        <div className="role-column-header dps">
                                            <Swords size={14} /> <span>DPS</span>
                                            <span className="count-pill">{raid.signups.filter(s => s.role === 'DPS').length}</span>
                                        </div>
                                        <div className="role-players">
                                            {raid.signups.filter(s => s.role === 'DPS').map((su, idx) => (
                                                <div key={idx} className={`player-bar class-${su.class.toLowerCase().replace(/ /g, '-').replace('í', 'i').replace('á', 'a').replace('é', 'e').replace('ó', 'o').replace('ú', 'u')}`}>
                                                    <span className="player-name">{su.name}</span>
                                                    <span className="player-class-abbr">{su.class.substring(0, 3)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                /* Grouped by Class */
                                Object.entries(getGroupedByClass(raid.signups)).map(([className, signups], idx) => (
                                    <div key={idx} className="role-column">
                                        <div className={`role-column-header class-${className.toLowerCase().replace(/ /g, '-').replace('í', 'i').replace('á', 'a').replace('é', 'e').replace('ó', 'o').replace('ú', 'u')}`}>
                                            <span>{className}</span>
                                            <span className="count-pill">{signups.length}</span>
                                        </div>
                                        <div className="role-players">
                                            {signups.map((su, pIdx) => (
                                                <div key={pIdx} className={`player-bar class-${su.class.toLowerCase().replace(/ /g, '-').replace('í', 'i').replace('á', 'a').replace('é', 'e').replace('ó', 'o').replace('ú', 'u')}`}>
                                                    <span className="player-name">{su.name}</span>
                                                    <span className="player-role-icon">{getRoleIcon(su.role)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="raid-loot">
                    <div className="roster-header">
                        <h4 className="roster-title">Registro de Botín</h4>
                        <History size={16} className="text-muted" />
                    </div>

                    {!raid.loot || raid.loot.length === 0 ? (
                        <p className="empty-roster text-muted">Aún no se ha registrado botín de esta estancia.</p>
                    ) : (
                        <div className="loot-list">
                            <div className="loot-list-header">
                                <span>Objeto</span>
                                <span>Ganador</span>
                            </div>
                            {raid.loot.map((item, idx) => (
                                <div key={idx} className="loot-item">
                                    <div className={`item-info ${item.quality}`}>
                                        <span className="item-dot"></span>
                                        <span className="item-name">{item.item}</span>
                                    </div>
                                    <div className="item-winner">
                                        <span className="winner-name">{item.winner}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Calendar;
