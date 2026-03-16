import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Loader2, MessageCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/useAuth';

interface Voice {
  id: string;
  name: string;
  username: string;
  body: string;
  approved: boolean;
  created_at: string;
}

export default function AdminVoices() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      console.log('No es admin, redireccionando...');
      navigate('/');
      return;
    }
    loadVoices();
  }, [isAdmin]);

  const loadVoices = async () => {
    setLoading(true);
    console.log('Cargando voces...');
    const { data, error } = await supabase
      .from('raid_voices')
      .select('*')
      .order('created_at', { ascending: false });
    console.log('Voces cargadas:', data, error);
    if (data) setVoices(data);
    setLoading(false);
  };

  const approveVoice = async (id: string, approved: boolean) => {
    setUpdating(id);
    await supabase.from('raid_voices').update({ approved }).eq('id', id);
    setVoices(voices.map(v => v.id === id ? { ...v, approved } : v));
    setUpdating(null);
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0c] pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto pt-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          Volver
        </button>

        <div className="flex items-center gap-3 mb-8">
          <MessageCircle className="text-primary" size={28} />
          <h1 className="text-2xl font-bold text-white">Gestionar Voces</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : voices.length === 0 ? (
          <p className="text-white/40 text-center py-12">No hay voces pendientes</p>
        ) : (
          <div className="space-y-4">
            {voices.map((voice) => (
              <div
                key={voice.id}
                className={`bg-[#121214] border rounded-xl p-5 ${
                  voice.approved ? 'border-primary/30' : 'border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-white">{voice.name}</span>
                      <span className="text-white/40 text-sm">{voice.username}</span>
                    </div>
                    <p className="text-white/70 text-sm italic">&ldquo;{voice.body}&rdquo;</p>
                    <p className="text-white/30 text-xs mt-2">
                      {new Date(voice.created_at).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {voice.approved ? (
                      <span className="text-primary text-xs px-2 py-1 bg-primary/10 rounded">Aprobado</span>
                    ) : (
                      <span className="text-white/40 text-xs px-2 py-1 bg-white/5 rounded">Pendiente</span>
                    )}
                    {updating === voice.id ? (
                      <Loader2 className="h-5 w-5 animate-spin text-white/40" />
                    ) : (
                      <>
                        <button
                          onClick={() => approveVoice(voice.id, !voice.approved)}
                          className={`p-2 rounded-lg transition-colors ${
                            voice.approved
                              ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                              : 'bg-primary/10 text-primary hover:bg-primary/20'
                          }`}
                          title={voice.approved ? 'Rechazar' : 'Aprobar'}
                        >
                          {voice.approved ? <X size={18} /> : <Check size={18} />}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
