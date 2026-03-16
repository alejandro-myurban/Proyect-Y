import { createContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User, AuthResponse, AuthTokenResponsePassword } from '@supabase/supabase-js';

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    avatarUrl: string | null;
    adminRole: 'admin' | 'superadmin' | null;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    setAvatarUrl: (url: string | null) => void;
    signUp: (data: any) => Promise<AuthResponse>;
    signIn: (data: any) => Promise<AuthTokenResponsePassword>;
    signInWithGoogle: () => Promise<any>;
    signOut: () => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [adminRole, setAdminRole] = useState<'admin' | 'superadmin' | null>(null);

    const loadAvatar = async (userId: string) => {
        const { data } = await supabase
            .from('user_characters')
            .select('avatar_url')
            .eq('user_id', userId)
            .single();
        setAvatarUrl(data?.avatar_url ?? null);
    };

    const loadAdminRole = async (email: string) => {
        if (!email) { setAdminRole(null); return; }
        const { data } = await supabase
            .from('admins')
            .select('role')
            .eq('email', email)
            .single();
        setAdminRole((data?.role as 'admin' | 'superadmin') ?? null);
    };

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) {
                await Promise.all([
                    loadAvatar(session.user.id),
                    loadAdminRole(session.user.email ?? ''),
                ]);
            }
            setLoading(false);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                loadAvatar(session.user.id);
                loadAdminRole(session.user.email ?? '');
            } else {
                setAvatarUrl(null);
                setAdminRole(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const isAdmin = adminRole !== null;
    const isSuperAdmin = adminRole === 'superadmin';

    const signUp = (data: any): Promise<AuthResponse> => supabase.auth.signUp(data);
    const signIn = (data: any): Promise<AuthTokenResponsePassword> => supabase.auth.signInWithPassword(data);
    const signInWithGoogle = () => supabase.auth.signInWithOAuth({ provider: 'google' });
    const signOut = () => supabase.auth.signOut();

    return (
        <AuthContext.Provider value={{ user, loading, avatarUrl, adminRole, isAdmin, isSuperAdmin, setAvatarUrl, signUp, signIn, signInWithGoogle, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
