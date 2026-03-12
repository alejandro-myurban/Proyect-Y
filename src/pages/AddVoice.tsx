import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { sileo } from 'sileo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AddVoice() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingChar, setLoadingChar] = useState(true);
  
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [body, setBody] = useState('');

  // Cargar personaje si está logueado
  useEffect(() => {
    const loadCharacter = async () => {
      if (!user) {
        setLoadingChar(false);
        return;
      }
      const { data } = await supabase
        .from('user_characters')
        .select('char_name')
        .eq('user_id', user.id)
        .single();
      if (data) setName(data.char_name);
      setLoadingChar(false);
    };
    loadCharacter();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !body.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('raid_voices').insert({
        user_id: user?.id || null,
        name: name.trim(),
        username: username.trim().startsWith('@') ? username.trim() : `@${username.trim()}`,
        body: body.trim(),
      });

      if (error) throw error;

      sileo.success({
        title: '¡Voz enviada!',
        description: 'En breve será publicada.',
      });
      navigate('/');
    } catch (err: any) {
      sileo.error({
        title: 'Error',
        description: 'No se pudo enviar tu voz. Inténtalo de nuevo.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingChar) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex flex-col pt-20">
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            Volver
          </button>

          <div className="bg-[#121214] border border-white/10 rounded-xl p-8">
            <h1 className="text-2xl font-bold text-white mb-2">Comparte tu voz</h1>
            <p className="text-white/40 text-sm mb-8">
              Tu opinión será visible en la web una vez aprobada por un administrador.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Nombre</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Usuario de Discord</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="@tu_usuario"
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body" className="text-white">Tu opinión</Label>
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="¿Qué opinas sobre la hermandad? Si te enrollas mucho no se verá todo que lo sepas. "
                  className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 resize-none"
                  maxLength={500}
                  required
                />
                <p className="text-white/30 text-xs text-right">{body.length}/500</p>
              </div>

              <Button
                type="submit"
                disabled={loading || !name.trim() || !username.trim() || !body.trim()}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Enviar voz
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
