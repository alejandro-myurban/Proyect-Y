import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { RAID_CONFIG, type RaidType, type RaidTypeCombo, getComboConfig } from './constants';
import { DatePickerWithTime, getDateTimeString } from './DatePicker';

interface CreateRaidPanelProps {
  onCreate: (raidType: RaidType | RaidTypeCombo, date: string, title: string) => Promise<void>;
}

export function CreateRaidPanel({ onCreate }: CreateRaidPanelProps) {
  const [selectedType1, setSelectedType1] = useState<RaidType>('karazhan');
  const [selectedType2, setSelectedType2] = useState<RaidType>('gruul');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('20:00:00');
  const [loading, setLoading] = useState(false);
  const [isCombo, setIsCombo] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customImage, setCustomImage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    setLoading(true);
    try {
      const dateTimeStr = getDateTimeString(date, time);
      let t1 = selectedType1 as string;
      if (t1 === 'custom') t1 = `custom:${customImage}`;
      
      let finalTitle = finalTitleFromType(selectedType1);

      if (isCombo && selectedType1 !== selectedType2) {
        let t2 = selectedType2 as string;
        if (t2 === 'custom') t2 = `custom:${customImage}`;
        let finalTitle2 = finalTitleFromType(selectedType2);
        await onCreate([t1, t2] as RaidTypeCombo, dateTimeStr, `${finalTitle} + ${finalTitle2}`);
      } else {
        await onCreate(t1, dateTimeStr, finalTitle);
      }
      setDate(undefined);
      setTime('20:00:00');
      setCustomTitle('');
      setCustomImage('');
    } finally {
      setLoading(false);
    }
  };

  const finalTitleFromType = (type: string) => {
    if (type === 'custom') return customTitle || 'Evento Custom';
    return RAID_CONFIG[type].label;
  };

  const getActiveConfig = () => {
    if (isCombo && selectedType1 !== selectedType2) {
      return getComboConfig([selectedType1, selectedType2]);
    }
    return RAID_CONFIG[selectedType1];
  };

  const activeConfig = getActiveConfig();

  return (
    <div className="glass-panel p-6">
      <h3 className="flex items-center gap-3 border-b border-[#2a2a33] pb-3 mb-5 text-white text-[1.1rem]">
        <Plus size={18} className="text-[#86b518]" /> Crear Evento
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="flex items-center gap-2 text-[0.75rem] text-white font-bold mb-3 uppercase tracking-widest cursor-pointer">
            <input
              type="checkbox"
              checked={isCombo}
              onChange={(e) => setIsCombo(e.target.checked)}
              className="w-4 h-4 text-white accent-[#86b518]"
            />
            Raid Doble
          </label>
        </div>

        <div className="mb-5">
          <label className="block text-[0.75rem] text-[#8b8b99] mb-3 uppercase tracking-widest">
            {isCombo ? 'Raid 1' : 'Instancia'}
          </label>
          <div className="flex flex-col gap-2">
            {(Object.entries(RAID_CONFIG) as [RaidType, typeof RAID_CONFIG[RaidType]][]).map(
              ([type, config]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType1(type)}
                  className="relative flex items-center gap-3 p-3 rounded-[4px] border cursor-pointer transition-all duration-150 overflow-hidden text-left"
                  style={
                    selectedType1 === type
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
                    style={{ background: selectedType1 === type ? config.accentColor : 'transparent' }}
                  />
                  <span className="pl-2 flex flex-col">
                    <span
                      className="font-['Changa_One'] text-[0.95rem] uppercase tracking-wide"
                      style={{ color: selectedType1 === type ? config.accentColor : '#e2e2e2' }}
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

        {isCombo && (
          <div className="mb-5">
            <label className="block text-[0.75rem] text-[#8b8b99] mb-3 uppercase tracking-widest">
              Raid 2
            </label>
            <div className="flex flex-col gap-2">
              {(Object.entries(RAID_CONFIG) as [RaidType, typeof RAID_CONFIG[RaidType]][]).map(
                ([type, config]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType2(type)}
                    disabled={type === selectedType1}
                    className="relative flex items-center gap-3 p-3 rounded-[4px] border cursor-pointer transition-all duration-150 overflow-hidden text-left disabled:opacity-40 disabled:cursor-not-allowed"
                    style={
                      selectedType2 === type
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
                      style={{ background: selectedType2 === type ? config.accentColor : 'transparent' }}
                    />
                    <span className="pl-2 flex flex-col">
                      <span
                        className="font-['Changa_One'] text-[0.95rem] uppercase tracking-wide"
                        style={{ color: selectedType2 === type ? config.accentColor : '#e2e2e2' }}
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
        )}

        {(selectedType1 === 'custom' || (isCombo && selectedType2 === 'custom')) && (
          <div className="mb-5 flex flex-col gap-3 p-3 bg-[rgba(255,255,255,0.02)] rounded-[4px] border border-[rgba(255,255,255,0.05)]">
            <div>
              <label className="block text-[0.7rem] text-[#8b8b99] mb-1.5 uppercase tracking-widest">
                Título del Evento
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
                className="input-field w-full text-[0.8rem]"
                placeholder="Ej: Invasión a la Ciudad"
                required
              />
            </div>
            <div>
              <label className="block text-[0.7rem] text-[#8b8b99] mb-1.5 uppercase tracking-widest">
                URL de Imagen de Fondo
              </label>
              <input
                type="url"
                value={customImage}
                onChange={e => setCustomImage(e.target.value)}
                className="input-field w-full text-[0.8rem]"
                placeholder="https://ejemplo.com/imagen.jpg"
                required
              />
            </div>
          </div>
        )}

        <div className="mb-5">
          <label className="block text-[0.75rem] text-[#8b8b99] mb-2 uppercase tracking-widest">
            <Calendar size={11} className="inline mr-1.5 mb-0.5" />
            Fecha y Hora
          </label>
          <DatePickerWithTime 
            date={date} 
            setDate={setDate} 
            time={time} 
            setTime={setTime}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !date || (isCombo && selectedType1 === selectedType2)}
          className="btn btn-primary w-full"
          style={{
            background: activeConfig.accentColor,
            borderColor: activeConfig.accentColor,
          }}
        >
          {loading ? 'Creando...' : `Programar ${activeConfig.label}`}
        </button>
      </form>
    </div>
  );
}
