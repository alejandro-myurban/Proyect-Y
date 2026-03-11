import React, { useState } from 'react';
import { Trophy, X } from 'lucide-react';
import { slugClass } from './constants';
import type { Signup } from '../../types/calendar';

interface LootEntryModalProps {
  item: any;
  roster: Signup[];
  onConfirm: (entry: any) => void;
  onBack: () => void;
  onClose: () => void;
}

export function LootEntryModal({ item, roster, onConfirm, onBack, onClose }: LootEntryModalProps) {
  const [winner, setWinner] = useState(roster[0]?.name ?? '');
  const [customWinner, setCustomWinner] = useState('');
  const [useCustom, setUseCustom] = useState(roster.length === 0);

  const resolvedWinner = useCustom ? customWinner : winner;

  const handleConfirm = () => {
    if (!resolvedWinner.trim()) {
      alert('Introduce el nombre del ganador.');
      return;
    }
    onConfirm({
      itemId: item.id,
      itemName: item.name,
      quality: item.quality,
      slot: item.slot,
      boss: item.boss,
      icon: item.icon,
      winner: resolvedWinner.trim(),
    });
  };

  return (
    <div className="item-selector-overlay" onClick={onClose}>
      <div
        className="bg-[#1a1a2e] border border-[rgba(163,53,238,0.3)] rounded-[12px] w-full max-w-[480px] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.8)] [animation:modalSlideIn_0.2s_cubic-bezier(0.34,1.56,0.64,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(163,53,238,0.08)]">
          <div className="flex items-center gap-2">
            <Trophy size={18} color="#a335ee" />
            <h2 className="text-base font-semibold text-[#e2c5f0] tracking-[0.02em] m-0">
              Confirmar Drop
            </h2>
          </div>
          <button
            className="bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.1)] rounded-[6px] text-[#aaa] cursor-pointer p-[0.35rem] flex items-center transition-all hover:bg-[rgba(255,60,60,0.2)] hover:text-[#ff6b6b]"
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
            onError={(e: any) => {
              e.target.src = 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
            }}
          />
          <div>
            <p className={`quality-text-${item.quality} font-bold text-base m-0 mb-1`}>
              {item.name}
            </p>
            <p className="text-[0.78rem] text-[#666] m-0">
              {item.slot} · {item.boss}
            </p>
          </div>
        </div>

        {/* Winner selector */}
        <div className="px-5 py-5 border-b border-[rgba(255,255,255,0.06)]">
          <label className="block text-[0.8rem] font-semibold text-[#aaa] uppercase tracking-[0.08em] mb-3">
            ¿Quién se lo lleva?
          </label>

          {roster.length > 0 && (
            <div className="flex gap-[0.4rem] mb-3">
              {['Del Roster', 'Manual'].map((label, i) => (
                <button
                  key={label}
                  onClick={() => setUseCustom(i === 1)}
                  className={`px-3 py-[0.35rem] rounded-[6px] border text-[0.75rem] cursor-pointer transition-all duration-150
                    ${
                      i === 0 ? !useCustom : useCustom
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
            <div className="flex flex-col gap-[0.3rem] max-h-[220px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[rgba(163,53,238,0.3)]">
              {roster.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setWinner(p.name)}
                  className={`flex items-center gap-[0.6rem] border rounded-[6px] cursor-pointer px-3 py-2 text-left transition-all duration-[0.12s] w-full
                    ${
                      winner === p.name
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
            <input
              type="text"
              className="input-field"
              placeholder="Nombre del jugador..."
              value={customWinner}
              onChange={(e) => setCustomWinner(e.target.value)}
              autoFocus
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-3 px-5 py-4">
          <button className="btn" onClick={onBack}>
            ← Cambiar item
          </button>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={!resolvedWinner.trim()}
          >
            Confirmar Drop
          </button>
        </div>
      </div>
    </div>
  );
}
