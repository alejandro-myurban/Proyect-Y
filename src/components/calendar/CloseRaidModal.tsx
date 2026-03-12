import React, { useState } from 'react';
import { Lock, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import type { Raid } from '../../types/calendar';
import { RAID_CONFIG } from './constants';

interface CloseRaidModalProps {
  open: boolean;
  onClose: () => void;
  raid: Raid;
  onConfirm: (warcraftLogsUrl: string) => Promise<void>;
}

export function CloseRaidModal({ open, onClose, raid, onConfirm }: CloseRaidModalProps) {
  const [logsUrl, setLogsUrl] = useState(raid.warcraft_logs_url ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = raid.raid_type ? RAID_CONFIG[raid.raid_type] : null;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm(logsUrl.trim());
      onClose();
    } catch (err: any) {
      setError(err.message ?? 'Error al cerrar la raid. ¿Se ha ejecutado la migración SQL?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#121215] border border-[#2a2a33] max-w-[420px] p-0 overflow-hidden">
        <div
          className="px-6 pt-6 pb-4"
          style={{ background: config?.bgGradient ?? 'transparent' }}
        >
          <DialogHeader>
            <DialogTitle className="font-['Changa_One'] text-[1.1rem] uppercase tracking-widest text-[#e2e2e2]">
              Cerrar Evento
            </DialogTitle>
          </DialogHeader>
          <p className="text-[0.8rem] text-[#8b8b99] mt-1">{raid.title}</p>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-5">
          {/* Warning */}
          <div className="bg-[rgba(255,180,0,0.06)] border border-[rgba(255,180,0,0.2)] rounded-[4px] p-3">
            <p className="text-[0.8rem] text-[#f0c060]">
              Cerrar el evento lo moverá al historial. Esta acción no se puede deshacer.
            </p>
          </div>

          {/* Stats summary */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[rgba(255,255,255,0.02)] border border-[#2a2a33] rounded-[4px] p-3 text-center">
              <p className="font-['Changa_One'] text-[1.4rem] text-white">{raid.signups.length}</p>
              <p className="text-[0.7rem] text-[#8b8b99] uppercase tracking-wide">Apuntados</p>
            </div>
            <div className="bg-[rgba(255,255,255,0.02)] border border-[#2a2a33] rounded-[4px] p-3 text-center">
              <p className="font-['Changa_One'] text-[1.4rem] text-white">{raid.loot.length}</p>
              <p className="text-[0.7rem] text-[#8b8b99] uppercase tracking-wide">Drops</p>
            </div>
          </div>

          {/* Warcraft Logs URL */}
          <div>
            <label className="block text-[0.72rem] text-[#8b8b99] mb-2 uppercase tracking-widest">
              <ExternalLink size={10} className="inline mr-1.5" />
              Warcraft Logs URL (opcional)
            </label>
            <input
              type="url"
              className="input-field"
              placeholder="https://www.warcraftlogs.com/reports/..."
              value={logsUrl}
              onChange={(e) => setLogsUrl(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-[rgba(220,50,50,0.08)] border border-[rgba(220,50,50,0.3)] rounded-[4px] p-3">
              <p className="text-[0.8rem] text-[#f07070]">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onClose} className="btn flex-1">
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              style={{ background: '#c0392b', borderColor: '#c0392b' }}
            >
              <Lock size={14} />
              {loading ? 'Cerrando...' : 'Cerrar Raid'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
