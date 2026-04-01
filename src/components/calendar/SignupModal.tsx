import React from 'react';
import { CheckCircle, Shield, Heart, Swords } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { slugClass, type CharRole, RAID_CONFIG, type RaidType, getClassIcon } from './constants';
import type { UserCharacter, Raid } from '../../types/calendar';

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
  raid: Raid;
  characters: UserCharacter[];
  onConfirm: (charName: string, charClass: string, charRole: CharRole) => Promise<void>;
  // For users without saved character
  charName: string;
  setCharName: (v: string) => void;
  charClass: string;
  setCharClass: (v: string) => void;
  charRole: CharRole;
  setCharRole: (v: CharRole) => void;
  availableRoles: CharRole[];
  allClasses: readonly string[];
}

const ROLE_ICONS: Record<CharRole, React.ReactNode> = {
  Tanque: <Shield size={14} />,
  Sanador: <Heart size={14} />,
  DPS: <Swords size={14} />,
};

export function SignupModal({
  open,
  onClose,
  raid,
  characters,
  onConfirm,
  charName,
  setCharName,
  charClass,
  setCharClass,
  charRole,
  setCharRole,
  availableRoles,
  allClasses,
}: SignupModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [selectedCharId, setSelectedCharId] = React.useState<string>('new');

  React.useEffect(() => {
    if (open && characters.length > 0) {
      setSelectedCharId(characters[0].id);
    }
  }, [open, characters]);

  const config = raid.raid_type ? RAID_CONFIG[raid.raid_type] : null;
  const activeChar = characters.find(c => c.id === selectedCharId);

  const displayName = activeChar?.char_name ?? charName;
  const displayClass = activeChar?.char_class ?? charClass;
  const displayRole = (activeChar?.char_role ?? charRole) as CharRole;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(displayName, displayClass, displayRole);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#121215] border border-[#2a2a33] max-w-[420px] p-0 overflow-hidden">
        {/* Atmospheric header */}
        <div
          className="px-6 pt-6 pb-5"
          style={{ background: config?.bgGradient ?? 'transparent' }}
        >
          <DialogHeader>
            <DialogTitle className="font-['Changa_One'] text-[1.1rem] uppercase tracking-widest"
              style={{ color: config?.accentColor ?? '#86b518' }}>
              Apuntarse a la Raid
            </DialogTitle>
          </DialogHeader>
          <p className="text-[0.8rem] text-[#8b8b99] mt-1">{raid.title}</p>
        </div>

        <div className="px-6 pb-6">
          {characters.length > 0 && (
            <div className="mb-4">
              <label className="block text-[0.7rem] text-[#8b8b99] mb-1.5 uppercase tracking-widest">
                Selecciona tu Personaje
              </label>
              <div className="grid grid-cols-1 gap-2">
                {characters.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCharId(c.id)}
                    className={`flex items-center gap-3 p-2 rounded-[4px] border border-[rgba(255,255,255,0.06)] text-left transition-colors
                      ${selectedCharId === c.id ? `bg-[rgba(255,255,255,0.08)] border-[#86b518] class-${slugClass(c.char_class)}` : 'bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)]'}
                    `}
                  >
                    <img 
                      src={getClassIcon(c.char_class)} 
                      alt={c.char_class}
                      className={`w-7 h-7 rounded-[3px] border border-[rgba(0,0,0,0.3)] ${selectedCharId !== c.id ? 'opacity-60' : ''}`}
                    />
                    <div className="flex-1">
                      <p className={`font-['Changa_One'] text-[0.9rem] ${selectedCharId === c.id ? 'text-white' : 'text-[#8b8b99]'}`}>
                        {c.char_name}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1 text-[0.7rem] ${selectedCharId === c.id ? 'text-white' : 'text-[#8b8b99]'}`}>
                      {ROLE_ICONS[c.char_role as CharRole]} {c.char_role}
                    </div>
                  </button>
                ))}
                
                <button
                  onClick={() => setSelectedCharId('new')}
                  className={`flex items-center justify-center p-2 rounded-[4px] border border-[rgba(255,255,255,0.06)] text-[0.8rem] font-['Changa_One'] uppercase transition-colors
                    ${selectedCharId === 'new' ? 'bg-[rgba(134,181,24,0.1)] text-[#86b518] border-[#86b518]' : 'bg-[rgba(255,255,255,0.02)] text-[#8b8b99] hover:bg-[rgba(255,255,255,0.04)] hover:text-white'}
                  `}
                >
                  Otro / Nuevo
                </button>
              </div>
            </div>
          )}

          {(!characters.length || selectedCharId === 'new') && (
            /* Inline form for a new character */
            <div className="flex flex-col gap-3 mb-5 p-3 rounded-[4px] border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)]">
              <div>
                <label className="block text-[0.7rem] text-[#8b8b99] mb-1.5 uppercase tracking-widest">
                  Nombre del Personaje
                </label>
                <input
                  type="text"
                  className="input-field max-w-full"
                  placeholder="Ej. Pablito"
                  value={charName}
                  onChange={(e) => setCharName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[0.7rem] text-[#8b8b99] mb-1.5 uppercase tracking-widest">
                  Clase
                </label>
                <select
                  className="input-field select-field focus:ring-0 max-w-full"
                  value={charClass}
                  onChange={(e) => setCharClass(e.target.value)}
                >
                  {allClasses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[0.7rem] text-[#8b8b99] mb-1.5 uppercase tracking-widest">
                  Rol
                </label>
                <div className="flex gap-2">
                  {availableRoles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setCharRole(role)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[4px] border text-[0.8rem] font-['Changa_One'] uppercase transition-all duration-150
                        ${
                          charRole === role
                            ? 'bg-[rgba(134,181,24,0.1)] border-[#86b518] text-[#86b518]'
                            : 'border-[#2a2a33] text-[#8b8b99] hover:border-[rgba(255,255,255,0.2)] hover:text-white'
                        }`}
                    >
                      {ROLE_ICONS[role]}
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={loading || !displayName.trim()}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
            style={config ? { background: config.accentColor, borderColor: config.accentColor } : {}}
          >
            <CheckCircle size={15} />
            {loading ? 'Apuntando...' : 'Confirmar Inscripción'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
