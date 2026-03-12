import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User, AuthResponse, AuthTokenResponsePassword } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    avatarUrl: string | null;
    setAvatarUrl: (url: string | null) => void;
    signUp: (data: any) => Promise<AuthResponse>;
    signIn: (data: any) => Promise<AuthTokenResponsePassword>;
    signInWithGoogle: () => Promise<any>;
    signOut: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) loadAvatar(session.user.id);
            setLoading(false);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) loadAvatar(session.user.id);
            else setAvatarUrl(null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const loadAvatar = async (userId: string) => {
        const { data } = await supabase
            .from('user_characters')
            .select('avatar_url')
            .eq('user_id', userId)
            .single();
        setAvatarUrl(data?.avatar_url ?? null);
    };

    const signUp = (data: any) => supabase.auth.signUp(data);
    const signIn = (data: any) => supabase.auth.signInWithPassword(data);
    const signInWithGoogle = () => supabase.auth.signInWithOAuth({ provider: 'google' });
    const signOut = () => supabase.auth.signOut();

    return (
        <AuthContext.Provider value={{ user, loading, avatarUrl, setAvatarUrl, signUp, signIn, signInWithGoogle, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
