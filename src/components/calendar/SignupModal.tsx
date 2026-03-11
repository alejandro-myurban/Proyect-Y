import React from 'react';
import { CheckCircle, Shield, Heart, Swords } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { slugClass, type CharRole, RAID_CONFIG, type RaidType } from './constants';
import type { UserCharacter, Raid } from '../../types/calendar';

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
  raid: Raid;
  character: UserCharacter | null;
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
  character,
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

  const config = raid.raid_type ? RAID_CONFIG[raid.raid_type] : null;
  const displayName = character?.char_name ?? charName;
  const displayClass = character?.char_class ?? charClass;
  const displayRole = (character?.char_role ?? charRole) as CharRole;

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
          {character ? (
            /* User has saved character — show it */
            <div
              className={`flex items-center gap-3 p-3 rounded-[4px] border bg-[rgba(255,255,255,0.02)] mb-5 class-${slugClass(character.char_class)}`}
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <span className={`class-dot class-${slugClass(character.char_class)}`} />
              <div className="flex-1">
                <p className="font-['Changa_One'] text-[0.95rem] text-white">
                  {character.char_name}
                </p>
                <p className="text-[0.72rem] text-[#8b8b99]">{character.char_class}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[0.75rem] text-[#8b8b99]">
                {ROLE_ICONS[character.char_role as CharRole]}
                <span>{character.char_role}</span>
              </div>
            </div>
          ) : (
            /* No saved character — show inline form */
            <div className="flex flex-col gap-3 mb-5">
              <div>
                <label className="block text-[0.7rem] text-[#8b8b99] mb-1.5 uppercase tracking-widest">
                  Nombre del Personaje
                </label>
                <input
                  type="text"
                  className="input-field"
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
                  className="input-field select-field"
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
