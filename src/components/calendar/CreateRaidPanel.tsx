import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { RAID_CONFIG, type RaidType } from './constants';

interface CreateRaidPanelProps {
  onCreate: (raidType: RaidType, date: string) => Promise<void>;
}

export function CreateRaidPanel({ onCreate }: CreateRaidPanelProps) {
  const [selectedType, setSelectedType] = useState<RaidType>('karazhan');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    setLoading(true);
    try {
      await onCreate(selectedType, date);
      setDate('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6">
      <h3 className="flex items-center gap-3 border-b border-[#2a2a33] pb-3 mb-5 text-white text-[1.1rem]">
        <Plus size={18} className="text-[#86b518]" /> Crear Evento
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Raid type selector */}
        <div className="mb-5">
          <label className="block text-[0.75rem] text-[#8b8b99] mb-3 uppercase tracking-widest">
            Instancia
          </label>
          <div className="flex flex-col gap-2">
            {(Object.entries(RAID_CONFIG) as [RaidType, typeof RAID_CONFIG[RaidType]][]).map(
              ([type, config]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className="relative flex items-center gap-3 p-3 rounded-[4px] border cursor-pointer transition-all duration-150 overflow-hidden text-left"
                  style={
                    selectedType === type
                      ? {
                          borderColor: config.borderColor,
                          background: config.bgGradient,
                          boxShadow: `0 0 16px ${config.glowColor}`,
                        }
                      : {
                          borderColor: '#2a2a33',
                          background: 'rgba(255,255,255,0.02)',
                        }
                  }
                >
                  <span
                    className="w-[3px] absolute left-0 top-0 bottom-0 rounded-l-[4px]"
                    style={{ background: selectedType === type ? config.accentColor : 'transparent' }}
                  />
                  <span className="pl-2 flex flex-col">
                    <span
                      className="font-['Changa_One'] text-[0.95rem] uppercase tracking-wide"
                      style={{ color: selectedType === type ? config.accentColor : '#e2e2e2' }}
                    >
                      {config.label}
                    </span>
                    <span className="text-[0.72rem] text-[#8b8b99] mt-0.5">{config.description}</span>
                  </span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Date/time */}
        <div className="mb-5">
          <label className="block text-[0.75rem] text-[#8b8b99] mb-2 uppercase tracking-widest">
            <Calendar size={11} className="inline mr-1.5 mb-0.5" />
            Fecha y Hora
          </label>
          <input
            type="datetime-local"
            className="input-field"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !date}
          className="btn btn-primary w-full"
          style={
            selectedType
              ? {
                  background: RAID_CONFIG[selectedType].accentColor,
                  borderColor: RAID_CONFIG[selectedType].accentColor,
                }
              : {}
          }
        >
          {loading ? 'Creando...' : `Programar ${RAID_CONFIG[selectedType].label}`}
        </button>
      </form>
    </div>
  );
}
