import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldCheck, UserPlus, Trash2, Loader2, ArrowLeft, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/useAuth';

interface AdminEntry {
  id: string;
  email: string;
  role: 'admin' | 'superadmin';
  added_by: string | null;
  created_at: string;
}

export default function AdminUsers() {
  const { user, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const [admins, setAdmins] = useState<AdminEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'superadmin'>('admin');
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSuperAdmin) {
      navigate('/');
      return;
    }
    loadAdmins();
  }, [isSuperAdmin]);

  const loadAdmins = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: true });
    if (data) setAdmins(data);
    setLoading(false);
  };

  const addAdmin = async () => {
    if (!newEmail.trim()) return;
    setError(null);
    setAdding(true);
    const { error } = await supabase.from('admins').insert({
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      added_by: user?.email,
    });
    if (error) {
      setError(error.message.includes('duplicate') ? 'Ese email ya es admin.' : error.message);
    } else {
      setNewEmail('');
      await loadAdmins();
    }
    setAdding(false);
  };

  const removeAdmin = async (entry: AdminEntry) => {
    if (entry.email === user?.email) return;
    setRemovingId(entry.id);
    await supabase.from('admins').delete().eq('id', entry.id);
    setAdmins(prev => prev.filter(a => a.id !== entry.id));
    setRemovingId(null);
  };

  const toggleRole = async (entry: AdminEntry) => {
    if (entry.email === user?.email) return;
    const nextRole = entry.role === 'admin' ? 'superadmin' : 'admin';
    await supabase.from('admins').update({ role: nextRole }).eq('id', entry.id);
    setAdmins(prev => prev.map(a => a.id === entry.id ? { ...a, role: nextRole } : a));
  };

  if (!isSuperAdmin) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0c] pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto pt-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          Volver
        </button>

        <div className="flex items-center gap-3 mb-8">
          <Crown className="text-yellow-400" size={28} />
          <h1 className="text-2xl font-bold text-white">Gestionar Admins</h1>
        </div>

        {/* Añadir nuevo admin */}
        <div className="bg-[#121214] border border-white/10 rounded-xl p-5 mb-6">
          <h2 className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-4">Añadir admin</h2>
          <div className="flex gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addAdmin()}
              placeholder="email@ejemplo.com"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/50"
            />
            <select
              value={newRole}
              onChange={e => setNewRole(e.target.value as 'admin' | 'superadmin')}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary/50"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
            <button
              onClick={addAdmin}
              disabled={adding || !newEmail.trim()}
              className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {adding ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              Añadir
            </button>
          </div>
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>

        {/* Lista de admins */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-2">
            {admins.map(entry => {
              const isMe = entry.email === user?.email;
              return (
                <div
                  key={entry.id}
                  className={`bg-[#121214] border rounded-xl px-5 py-4 flex items-center justify-between gap-4 ${
                    entry.role === 'superadmin' ? 'border-yellow-400/20' : 'border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {entry.role === 'superadmin'
                      ? <Crown size={16} className="text-yellow-400 shrink-0" />
                      : <Shield size={16} className="text-primary shrink-0" />
                    }
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {entry.email}
                        {isMe && <span className="text-white/40 text-xs ml-2">(tú)</span>}
                      </p>
                      {entry.added_by && (
                        <p className="text-white/30 text-xs">añadido por {entry.added_by}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleRole(entry)}
                      disabled={isMe}
                      title={entry.role === 'admin' ? 'Promover a superadmin' : 'Degradar a admin'}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ShieldCheck size={16} className={entry.role === 'superadmin' ? 'text-yellow-400' : 'text-white/40'} />
                    </button>
                    <button
                      onClick={() => removeAdmin(entry)}
                      disabled={isMe || removingId === entry.id}
                      title="Eliminar admin"
                      className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      {removingId === entry.id
                        ? <Loader2 size={16} className="animate-spin" />
                        : <Trash2 size={16} />
                      }
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
