import React, { useState, useEffect } from 'react';
import { UserPlus, Edit2, Check, Shield, Heart, Swords } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import {
  CLASSES,
  getAvailableRoles,
  slugClass,
  getClassIcon,
  type CharRole,
} from './constants';
import type { UserCharacter } from '../../types/calendar';

interface CharacterPanelProps {
  onCharacterChange: (char: UserCharacter | null) => void;
}

const ROLE_ICONS: Record<CharRole, React.ReactNode> = {
  Tanque: <Shield size={14} className="text-[#5bc0de]" />,
  Sanador: <Heart size={14} className="text-[#5cb85c]" />,
  DPS: <Swords size={14} className="text-[#d9534f]" />,
};

export function CharacterPanel({ onCharacterChange }: CharacterPanelProps) {
  const { user } = useAuth();
  const [character, setCharacter] = useState<UserCharacter | null>(null);
  const [editing, setEditing] = useState(false);
  const [charName, setCharName] = useState('');
  const [charClass, setCharClass] = useState<string>(CLASSES[0]);
  const [charRole, setCharRole] = useState<CharRole>('DPS');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) loadCharacter();
  }, [user]);

  // When class changes, reset role to first available
  useEffect(() => {
    const available = getAvailableRoles(charClass);
    if (!available.includes(charRole)) setCharRole(available[0]);
  }, [charClass]);

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
      onCharacterChange(data);
    } else {
      setEditing(true);
    }
  };

  const handleSave = async () => {
    if (!user || !charName.trim()) return;
    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        char_name: charName.trim(),
        char_class: charClass,
        char_role: charRole,
      };

      const { data, error } = await supabase
        .from('user_characters')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;
      setCharacter(data);
      onCharacterChange(data);
      setEditing(false);
    } catch (err: any) {
      alert('Error guardando personaje: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="glass-panel p-6">
        <h3 className="flex items-center gap-3 border-b border-[#2a2a33] pb-3 mb-5 text-white text-[1.1rem]">
          <UserPlus size={18} className="text-[#86b518]" /> Tu Personaje
        </h3>
        <p className="text-[0.85rem] text-[#8b8b99] mb-5">
          Inicia sesión para apuntarte a raids y guardar tu personaje.
        </p>
        <Link to="/login" className="btn btn-primary w-full text-center">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6">
      <h3 className="flex items-center gap-3 border-b border-[#2a2a33] pb-3 mb-5 text-white text-[1.1rem]">
        <UserPlus size={18} className="text-[#86b518]" /> Tu Personaje
      </h3>

      {!editing && character ? (
        <div>
          {/* Character card */}
          <div
            className={`flex items-center gap-3 p-3 rounded-[4px] border border-[#2a2a33] bg-[rgba(255,255,255,0.02)] mb-4 class-${slugClass(character.char_class)}`}
          >
            <img
              src={getClassIcon(character.char_class)}
              alt={character.char_class}
              className="w-8 h-8 rounded-[3px] border border-[rgba(0,0,0,0.3)]"
            />
            <div className="flex-1 min-w-0">
              <p className="font-['Changa_One'] text-[1rem] text-white truncate">
                {character.char_name}
              </p>
              <p className="text-[0.75rem] text-[#8b8b99]">{character.char_class}</p>
            </div>
            <div className="flex items-center gap-1.5 text-[0.75rem] text-[#8b8b99]">
              {ROLE_ICONS[character.char_role as CharRole]}
              <span>{character.char_role}</span>
            </div>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="btn w-full flex items-center justify-center gap-2 text-[0.8rem]"
          >
            <Edit2 size={13} /> Cambiar Personaje
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block text-[0.72rem] text-[#8b8b99] mb-1.5 uppercase tracking-widest">
              Nombre
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Ej. Pablito"
              value={charName}
              onChange={(e) => setCharName(e.target.value)}
            />
          </div>

          {/* Class */}
          <div>
            <label className="block text-[0.72rem] text-[#8b8b99] mb-1.5 uppercase tracking-widest">
              Clase
            </label>
            <select
              className="input-field select-field"
              value={charClass}
              onChange={(e) => setCharClass(e.target.value)}
            >
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Role — filtered by class */}
          <div>
            <label className="block text-[0.72rem] text-[#8b8b99] mb-1.5 uppercase tracking-widest">
              Rol
            </label>
            <div className="flex flex-col gap-1.5">
              {getAvailableRoles(charClass).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setCharRole(role)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[4px] border cursor-pointer transition-all duration-150 text-[0.85rem] font-['Changa_One'] uppercase tracking-wide
                    ${
                      charRole === role
                        ? 'bg-[rgba(134,181,24,0.1)] border-[#86b518] text-[#86b518]'
                        : 'bg-transparent border-[#2a2a33] text-[#8b8b99] hover:border-[rgba(255,255,255,0.15)] hover:text-white'
                    }`}
                >
                  {ROLE_ICONS[role]}
                  {role}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !charName.trim()}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <Check size={14} />
            {saving ? 'Guardando...' : 'Guardar Personaje'}
          </button>

          {character && (
            <button
              onClick={() => setEditing(false)}
              className="text-[0.75rem] text-[#8b8b99] hover:text-white transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
